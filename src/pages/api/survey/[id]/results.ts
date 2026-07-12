import { NextApiRequest, NextApiResponse } from "next";
import { connectToMongoDB } from "@/lib/db";
import Survey from "../../../../../models/surveyModel";
import SurveyResult from "../../../../../models/surveyResultModel";
import SurveyAnalytics, { ISurveyAnalytics, FilterCondition } from "../../../../../models/surveyAnalytics";
import { ISurveyDocument, IQuestion } from "../../../../../models/surveyModel";
import { SurveyResultDocument } from "../../../../../types/survey";
import { processResults } from "../../../../lib/processresults";
import { Types } from "mongoose";
import mongoose from "mongoose";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

interface AnalyticsQuery {
  surveyId: mongoose.Types.ObjectId;
  filters?: FilterCondition[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ISurveyAnalytics | { message: string }>
) {
  await connectToMongoDB();
  const session = await getServerSession(req, res, authOptions);
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      try {
        const objectId = new Types.ObjectId(String(id));
        
        const survey: ISurveyDocument | null = await Survey.findById(objectId);
        if (!survey) {
          return res.status(404).json({ message: "Pesquisa não encontrada" });
        }

        const userId = session?.user?._id;
        const isAuthor = userId && survey.author.toString() === userId.toString();
        const isShared = userId && survey.sharedWith?.some((uid: any) => uid.toString() === userId.toString());
        const isStaff = isAuthor || isShared;

        const filterQuestionParam = req.query.filterQuestion || req.query['filterQuestion[]'];
        const filterAnswerParam = req.query.filterAnswer || req.query['filterAnswer[]'];
        const filterRowParam = req.query.filterRow || req.query['filterRow[]'];
        let filters: FilterCondition[] | undefined = undefined;

        if (filterQuestionParam && filterAnswerParam) {
          if (Array.isArray(filterQuestionParam) && Array.isArray(filterAnswerParam)) {
            if (filterQuestionParam.length !== filterAnswerParam.length) {
              return res.status(400).json({ message: "Quantidade de filtros inconsistentes" });
            }
            filters = filterQuestionParam.map((q, index) => {
              const filter: FilterCondition = {
                questionName: q,
                answer: filterAnswerParam[index] as string,
              };
              // Se o parâmetro filterRow estiver presente, adiciona a propriedade "row"
              if (filterRowParam) {
                if (Array.isArray(filterRowParam)) {
                  filter.row = filterRowParam[index];
                } else if (typeof filterRowParam === "string") {
                  filter.row = filterRowParam;
                }
              }
              return filter;
            });
          } else if (typeof filterQuestionParam === "string" && typeof filterAnswerParam === "string") {
            const filter: FilterCondition = { questionName: filterQuestionParam, answer: filterAnswerParam };
            if (filterRowParam && typeof filterRowParam === "string") {
              filter.row = filterRowParam;
            }
            filters = [filter];
          }
        }

        if (filters) {
          const questionNotFound = filters.find(filter =>
            !survey.pages.some(page =>
              page.questions.some((q: IQuestion) => q.name === filter.questionName)
            )
          );
          if (questionNotFound) {
            return res.status(400).json({ message: `Questão de filtro não encontrada: ${questionNotFound.questionName}` });
          }
        }

        // Query precisa ser precisa: sem filtros busca apenas docs sem filtros,
        // evitando que analytics de queries filtradas sejam confundidos com o master
        const hasActiveFilters = filters && filters.length > 0;
        const masterQuery = {
          surveyId: objectId,
          $or: [{ filters: { $exists: false } }, { filters: null }, { filters: [] as FilterCondition[] }],
        };
        const query = hasActiveFilters ? { surveyId: objectId, filters } : masterQuery;

        // Busca o master separadamente para checar hasPublic de forma confiável
        const masterAnalytics = await SurveyAnalytics.findOne(masterQuery as any).exec();

        const surveyResults: SurveyResultDocument[] = await SurveyResult.find({ surveyId: objectId, isComplete: true }).exec();
        const processedData = processResults(survey, surveyResults, filters);
        processedData.surveyId = objectId;

        const existing = hasActiveFilters
          ? await SurveyAnalytics.findOne(query as any).exec()
          : masterAnalytics;

        let savedAnalytics: ISurveyAnalytics | null;

        if (!existing) {
          // Analytics filtrado herda hasPublic do master
          processedData.hasPublic = masterAnalytics?.hasPublic ?? false;
          savedAnalytics = await SurveyAnalytics.create(processedData);
        } else {
          const updatedPages = processedData.pages.map(newPage => {
            const existingPage = existing.pages.find(p => p.title === newPage.title);
            return {
              ...newPage,
              questions: newPage.questions.map(newQ => {
                const existingQ = existingPage?.questions.find(q => q.name === newQ.name);
                return existingQ
                  ? { ...newQ, isPublic: existingQ.isPublic, chart: existingQ.chart }
                  : newQ;
              }),
            };
          });

          savedAnalytics = await SurveyAnalytics.findOneAndUpdate(
            query as any,
            { $set: { pages: updatedPages, hasPublic: existing.hasPublic } },
            { new: true }
          ).exec();
        }

        // Permission Check: usa o master para verificar hasPublic (evita checar analytics filtrado)
        if (!isStaff) {
          if (savedAnalytics === null) {
            return res.status(404).json({ message: "Resultados não encontrados" });
          }

          const isPublicAllowed = masterAnalytics?.hasPublic ?? savedAnalytics.hasPublic;
          if (!isPublicAllowed) {
            return res.status(403).json({ message: "Acesso negado aos resultados privados" });
          }

          // Filter out questions that are not public
          savedAnalytics.pages = savedAnalytics.pages.map(page => ({
            ...page,
            questions: page.questions.filter(q => q.isPublic)
          })).filter(page => page.questions.length > 0);
        }

        return res.status(200).json(savedAnalytics || {message: "Resultados não encontrados"} );
      } catch (error) {
        console.error("Erro completo:", error);
        return res.status(500).json({ message: "Internal server error" });
      }

    case "PATCH":
      try {
        const { questions, hasPublic } = req.body;
        if (!id || !questions) {
          return res.status(400).json({ message: "ID e perguntas são obrigatórios" });
        }
        const objectId = new mongoose.Types.ObjectId(id as string);

        const surveyForPatch = await Survey.findById(objectId);
        if (!surveyForPatch) {
          return res.status(404).json({ message: "Pesquisa não encontrada" });
        }

        const patchUserId = session?.user?._id;
        const isPatchAuthor = patchUserId && surveyForPatch.author.toString() === patchUserId.toString();
        const isPatchShared = patchUserId && surveyForPatch.sharedWith?.some((uid: any) => uid.toString() === patchUserId.toString());

        if (!isPatchAuthor && !isPatchShared && session?.user?.role !== "admin") {
          return res.status(403).json({ message: "Acesso negado" });
        }

        // Atualiza apenas o documento master (sem filtros)
        const updatedAnalytics = await SurveyAnalytics.findOneAndUpdate(
          { surveyId: objectId, $or: [{ filters: { $exists: false } }, { filters: null }, { filters: [] }] },
          { $set: { hasPublic } },
          { new: true }
        );
        if (!updatedAnalytics) {
          return res.status(404).json({ message: "Pesquisa não encontrada" });
        }

        if (questions && questions.length > 0) {
          for (const q of questions) {
            await SurveyAnalytics.updateOne(
              { surveyId: objectId, "pages.questions.name": q.name },
              {
                $set: {
                  "pages.$[].questions.$[question].isPublic": q.isPublic,
                  "pages.$[].questions.$[question].chart": q.chart,
                }
              },
              { arrayFilters: [{ "question.name": q.name }] }
            );
          }
        }

        return res.status(200).json({ message: "Atualizado com sucesso" });
      } catch (error) {
        console.error("Erro ao atualizar:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
      }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
