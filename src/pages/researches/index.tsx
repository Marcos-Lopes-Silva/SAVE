import { t } from "i18next";
import { connectToMongoDB } from "@/lib/db";
import ImageGraphic from "@/static/images/graphicsPage.svg";
import Image from "next/image";
import { Select, SelectItem } from "@nextui-org/select";
import { FaFilter } from "react-icons/fa";
import { GetServerSideProps } from "next";
import { Key } from "@react-types/shared";
import { Button } from "@nextui-org/button";
import { IoMdDownload } from "react-icons/io";
import { useState, useEffect } from "react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { ISurveyAnalytics } from "../../../models/surveyAnalytics";
import Survey from "../../../models/surveyModel";
import SurveyAnalytics from "../../../models/surveyAnalytics";
import mongoose from "mongoose";
import Filters, { Filter } from "@/components/Filters";
import Graphics from "@/components/Graphics";
import { Progress } from "@nextui-org/react";

interface CustomISurveyDocument extends mongoose.Document {
  _id: string;
  title: string;
  description: string;
}

export default function Researches({ surveys }: { surveys: CustomISurveyDocument[] }) {
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);
  const [selectedSurvey, setSelectedSurvey] = useState<(CustomISurveyDocument & { _id: string }) | null>(null);
  const [data, setData] = useState<ISurveyAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFilterClicked, setIsFilterClicked] = useState(false);
  const [selectedPageIndex, setSelectedPageIndex] = useState<number>(-1);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  // Carrega analytics com filtros
  useEffect(() => {
    const loadAnalytics = async () => {
      if (!selectedSurveyId) return;

      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        filters.forEach((f) => {
          params.append("filterQuestion[]", f.question);
          params.append("filterAnswer[]", f.answer);
          if (f.row) params.append("filterRow[]", f.row);
        });

        const response = await fetch(`/api/survey/${selectedSurveyId}/results?${params.toString()}`);
        if (!response.ok) throw new Error("Erro na resposta da API");

        const json = await response.json();
        setData(json.pages?.length ? json : null);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);

        // Log adicional para depuração
        if (error instanceof Error) {
          console.error("Mensagem de erro:", error.message);
          console.error("Stack trace:", error.stack);
        } else {
          console.error("Erro desconhecido:", error);
        }

        setError("Erro ao carregar os dados. Por favor, tente recarregar a página.");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [selectedSurveyId, filters]);

  const handleSurveyChange = (key: Key) => {
    const newId = (Array.isArray(key) ? key[0] : key) as string;
    setSelectedSurveyId(newId);

    if (!newId) {
      setSelectedSurvey(null);
      setData(null); // Limpe os gráficos
      setError(null); // Limpe os erros
      return;
    }

    // Atualize o selectedSurvey diretamente com base nos surveys disponíveis
    const survey = surveys.find((s) => s._id === newId);
    if (survey) {
      setSelectedSurvey(survey);
      setError(null); // Limpe o erro, pois o questionário foi encontrado
    } else {
      setSelectedSurvey(null);
      setData(null); // Limpe os gráficos
      setError("Questionário não encontrado. Verifique o ID e tente novamente.");
    }
  };

  const handleDownloadPDF = async () => {
    if (!selectedSurvey) return;
    setIsGeneratingPDF(true);
    setDownloadProgress(0); // Inicialize o progresso

    try {
      const allContainers = document.querySelectorAll('.chart-container');

      // Filtrar apenas gráficos válidos
      const validContainers = Array.from(allContainers).filter(container => {
        const text = container.textContent || "";
        return !text.includes("Nenhum dado disponível para esta pergunta");
      });

      if (!validContainers.length) {
        console.warn('Nenhum gráfico com dados disponível para capturar.');
        setIsGeneratingPDF(false);
        return;
      }

      const pdf = new jsPDF('p', 'px', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const headerHeight = 50;
      const footerHeight = 70;
      const marginX = 20;
      const marginYFirstPage = headerHeight + 20;
      const marginYOtherPages = 30;
      const chartsPerPage = 2;
      const chartWidth = pageWidth - marginX * 2;
      const chartHeight = (pageHeight - marginYOtherPages - footerHeight - (chartsPerPage + 1) * 30) / chartsPerPage; // Ajuste para maior espaçamento entre gráficos
      const verticalSpacing = 30;

      // Atualize o progresso inicial
      const totalSteps = validContainers.length * chartsPerPage + 1; // Total de passos (gráficos + salvamento)
      let currentStep = 0;

      const updateProgress = () => {
        currentStep++;
        setDownloadProgress(Math.min((currentStep / totalSteps) * 100, 100)); // Atualize o progresso
      };

      // Formatar filtros para exibição
      const formattedFilters = filters.length > 0
        ? filters.map(f => {
          const questionTitle = data?.pages
            .flatMap(page => page.questions)
            .find(q => q.name === f.question)?.title || f.question;
          return `(${questionTitle} ${f.answer})`;
        })
        : ['Nenhum filtro aplicado'];

      // Cabeçalho do PDF
      pdf.setFillColor("#0F0F0F");
      pdf.rect(0, 0, pageWidth, headerHeight, 'F');

      pdf.setTextColor(255);
      pdf.setFontSize(16);
      pdf.text(selectedSurvey.title, marginX, 20);

      pdf.setFontSize(12);
      pdf.text(`Dimensão: ${selectedPageIndex === -1 ? 'Todas' : data?.pages[selectedPageIndex]?.title || 'Desconhecida'}`, marginX, 35);

      let isLastPage = false;

      for (let i = 0; i < validContainers.length; i += chartsPerPage) {
        const isFirstPage = i === 0;
        const marginY = isFirstPage ? marginYFirstPage : marginYOtherPages;

        if (!isFirstPage) {
          pdf.addPage();
        }

        const currentCharts = validContainers.slice(i, i + chartsPerPage);

        const availableHeight = pageHeight - headerHeight - footerHeight;
        const totalChartHeight = chartHeight * currentCharts.length + verticalSpacing * (currentCharts.length - 1);
        const startY = headerHeight + (availableHeight - totalChartHeight) / 2;

        for (let j = 0; j < currentCharts.length; j++) {
          const container = currentCharts[j] as HTMLElement;
          await new Promise(resolve => setTimeout(resolve, 100));

          const dataUrl = await toPng(container, { cacheBust: true, pixelRatio: 2 });

          const posX = (pageWidth - chartWidth) / 2;
          const posY = startY + j * (chartHeight + verticalSpacing);

          pdf.setDrawColor(15);
          pdf.setLineWidth(1);
          pdf.roundedRect(posX - 2, posY - 2, chartWidth + 4, chartHeight + 4, 5, 5, 'S');
          pdf.addImage(dataUrl, 'PNG', posX, posY, chartWidth, chartHeight);

          updateProgress(); // Atualiza o progresso após cada gráfico
          isLastPage = i + j + 1 === validContainers.length;
        }

        // rodapé na última página
        if (isLastPage) {
          pdf.setFillColor("#0F0F0F");
          pdf.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, 'F');

          pdf.setTextColor(255);
          pdf.setFontSize(12);
          pdf.text('Filtros Aplicados:', marginX, pageHeight - footerHeight + 20);

          let currentX = marginX;
          let currentY = pageHeight - footerHeight + 35;
          formattedFilters.forEach((filter, index) => {
            const filterWidth = pdf.getTextWidth(filter + ', ');
            if (currentX + filterWidth > pageWidth - marginX) {
              currentX = marginX;
              currentY += 10;
            }
            if (currentY + 10 > pageHeight) {
              pdf.addPage();
              pdf.setFillColor("#0F0F0F");
              pdf.rect(0, 0, pageWidth, footerHeight, 'F');
              pdf.setTextColor(255);
              pdf.text('Filtros Aplicados (continuação):', marginX, 20);
              currentX = marginX;
              currentY = 35;
            }
            pdf.text(filter + (index < formattedFilters.length - 1 ? ',' : ''), currentX, currentY);
            currentX += filterWidth;
          });
        }
      }

      updateProgress(); // Atualize o progresso antes de salvar
      pdf.save(`${selectedSurvey.title}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
      setDownloadProgress(0); // Redefina o progresso após o download
    }
  };

  return (
    <main className="flex flex-col px-28 py-12">
      <header className="flex flex-col rounded-xl shadow-2xl bg-zinc-200 dark:bg-zinc-900 px-24 py-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="mb-1 text-xl font-medium dark:text-white">
              Pesquisas
            </h1>
            <p className="mb-2 text-sm dark:text-white max-w-lg">
              Explore as pesquisas e conduza análises personalizadas, selecionando a dimensão desejada
              para visualizar os dados com precisão.
            </p>
          </div>
          <Image
            className="w-48 self-end"
            src={ImageGraphic}
            alt="graphics"
            priority
          />
        </div>
        <div className="mb-1 rounded-2xl bg-zinc-600 dark:bg-zinc-700 w-16 h-2" />
        <div className="ml-2 rounded-2xl bg-zinc-300 w-16 h-2" />
      </header>

      <section className="flex flex-col py-10 px-8 gap-4">
        <div className="flex justify-between items-center gap-4">
          <Select
            className="max-w-xs"
            label="Questionários"
            placeholder="Selecione"
            selectedKeys={selectedSurveyId ? [selectedSurveyId] : new Set()}
            variant="bordered"
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;
              handleSurveyChange(selectedKey);
            }}
          >
            {surveys.map((survey) => (
              <SelectItem
                key={String(survey._id)}
                value={String(survey._id)}
              >
                {survey.title}
              </SelectItem>
            ))}
          </Select>

          <Button
            variant="bordered"
            className="flex items-center gap-2 px-10"
            onClick={() => setIsFilterClicked((prev) => !prev)}
            isDisabled={!selectedSurveyId}
          >
            <FaFilter />
            Filtros
          </Button>

          <Button
            variant="solid"
            className="bg-zinc-800 text-white px-10"
            isDisabled={isGeneratingPDF || !selectedSurveyId}
            onClick={!isGeneratingPDF && selectedSurveyId ? handleDownloadPDF : undefined}
          >
            {isGeneratingPDF ? (
              <div className="flex items-center gap-2 w-full justify-center">
                <span className="text-white text-sm w-8 text-right">
                  {Math.round(downloadProgress)}%
                </span>
                <Progress
                  aria-label="Progresso do download"
                  className="w-full"
                  color="success"
                  size="sm"
                  value={downloadProgress}
                />
              </div>
            ) : (
              <span className="flex items-center gap-2">
                Download <IoMdDownload />
              </span>
            )}
          </Button>
        </div>

        {!selectedSurveyId && (
          <div className="text-center text-zinc-500 dark:text-zinc-300 py-4">
            <p>
              Selecione um dos questionários disponíveis para começar a visualizar os gráficos.
              <br />Utilize os filtros personalizados para análises mais detalhadas dos resultados obtidos.
            </p>
          </div>
        )}

        {isFilterClicked && selectedSurvey && (
          <Filters
            surveyId={selectedSurvey._id}
            setFiltersApplied={(applied) => {
              setFilters(applied);
              setIsFilterClicked(false);
            }}
            setError={setError}
            setSelectedPageIndex={setSelectedPageIndex}
            initialFilters={filters}
            initialPageIndex={selectedPageIndex}
          />
        )}

        {error && !selectedSurvey && (
          <div className="text-center text-red-500 text-lg font-semibold">
            {error}
          </div>
        )}

        <div className="flex flex-col">
          {data && (
            <Graphics
              data={data}
              selectedPageIndex={selectedPageIndex}
              lastUpdate={false}
              download={!isGeneratingPDF}
              modal={!isGeneratingPDF}
              selectCharts={false}
              selectedChartTypes={{} as Record<string, string>}
            />
          )}
        </div>
      </section>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    await connectToMongoDB();

    const publicAnalytics = await SurveyAnalytics.find({ hasPublic: true }).lean();

    const validSurveyIds = publicAnalytics
      .map(a => {
        try {
          return new mongoose.Types.ObjectId(a.surveyId.toString());
        } catch (error) {
          console.error("ID inválido:", a.surveyId);
          return null;
        }
      })
      .filter(Boolean);

    const publicSurveys = await Survey.find({
      _id: { $in: validSurveyIds }
    }).lean();

    return {
      props: {
        surveys: JSON.parse(JSON.stringify(publicSurveys))
      }
    };
  } catch (error) {
    console.error("Erro no servidor:", error);
    return {
      props: {
        surveys: []
      }
    };
  }
};