import mongoose from 'mongoose';
import Button from '@/components/layout/Button';
import { api } from '@/lib/api';
import { Accordion, AccordionItem, button, Checkbox, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, Switch, useDisclosure } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { CiUnlock } from 'react-icons/ci';
import { FaEye } from 'react-icons/fa';
import SurveyAnalytics, { ISurveyAnalytics } from '../../../../models/surveyAnalytics';
import { getSession, useSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { connectToMongoDB } from '@/lib/db';
import Survey, { ISurveyDocument } from '../../../../models/surveyModel';
import { toast } from 'react-toastify';
import Graphics from '@/components/Graphics';

export default function ShowData({ surveys }: { surveys: ISurveyDocument[] }) {
    const [selectedQuestion, setSelectedQuestion] = useState<{ questionName: string, surveyId: string } | null>(null);
    const [selectedQuestions, setSelectedQuestions] = useState<Record<string, string[]>>({}); // Record<surveyId, questionNames[]>
    const [selectedChartTypes, setSelectedChartTypes] = useState<Record<string, Record<string, string>>>({}); // Record<surveyId, Record<questionName, chartType>>
    const [surveysAnalytics, setSurveysAnalytics] = useState<Record<string, ISurveyAnalytics>>({});
    const [managerPreview, setManagerPreview] = useState<{ surveyId: string } | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { data: session } = useSession();
    const userId = session?.user?._id;

    useEffect(() => {
        const fetchAllAnalytics = async () => {
            try {
                const analyticsMap: Record<string, ISurveyAnalytics> = {};
                for (const survey of surveys) {
                    const response = await api.get<ISurveyAnalytics>(`/survey/${survey._id}/results`);
                    analyticsMap[survey._id as string] = response;
                }
                setSurveysAnalytics(analyticsMap);
            } catch (error) {
                console.error(error);
            }
        };
        if (surveys.length > 0) {
            fetchAllAnalytics();
        }
    }, [surveys]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getFilteredAnalytics = (surveyId: string) => {
        const surveyAnalytics = surveysAnalytics[surveyId];
        if (!surveyAnalytics) return null;

        const currentSelectedQuestions = selectedQuestions[surveyId] || [];

        return {
            ...surveyAnalytics,
            pages: surveyAnalytics.pages.map(page => ({
                ...page,
                questions: page.questions.filter(question => currentSelectedQuestions.includes(question.name))
            })).filter(page => page.questions.length > 0)
        };
    };

    const handleConfirm = async (surveyId: string) => {
        try {
            const surveyAnalytics = surveysAnalytics[surveyId];
            if (!surveyAnalytics) {
                toast.error('Dados ainda carregando, tente novamente em instantes.');
                return;
            }

            const currentSelectedQuestions = selectedQuestions[surveyId] || [];
            const currentChartTypes = selectedChartTypes[surveyId] || {};

            const updatedQuestions = surveyAnalytics.pages.flatMap(page =>
                page.questions
                    .filter(q => ["checkbox", "radio", "table", "select"].includes(q.type))
                    .map(q => ({
                        name: q.name,
                        isPublic: currentSelectedQuestions.includes(q.name),
                        chart: currentChartTypes[q.name] || q.chart,
                    }))
            );

            await api.patch(`survey/${surveyId}/results`, { questions: updatedQuestions, hasPublic: true });

            toast.success('Gráficos disponibilizados com sucesso!');

        } catch (error) {
            console.error(error);
            toast.error('Erro ao disponibilizar gráficos.');
        }
    }

    if (Object.keys(surveysAnalytics).length === 0 && surveys.length > 0) {
        return (
            <main className="flex justify-center items-center h-screen">
                <Spinner size="lg" />
            </main>
        );
    }

    if (managerPreview) {
        const filteredAnalytics = getFilteredAnalytics(managerPreview.surveyId);
        return (
            <main>
                <header className="flex flex-col rounded-xl shadow-2xl bg-zinc-200 dark:bg-zinc-900 px-16 py-10">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="mb-1 text-xl font-medium dark:text-white">Preview</h1>
                            <a className="mb-3 text-sm dark:text-white">Visualize os gráficos que serão disponibilizados ao público.</a>
                        </div>
                        <Button onClick={() => setManagerPreview(null)}>Voltar</Button>
                    </div>
                    <div className="mb-1 rounded-2xl bg-zinc-600 dark:bg-zinc-700 w-16 h-2" />
                    <div className="ml-3 rounded-2xl bg-zinc-300 w-16 h-2" />
                </header>
                <section>
                    {filteredAnalytics && (
                        <Graphics
                            data={filteredAnalytics}
                            selectedPageIndex={0}
                            lastUpdate={true}
                            download={false}
                            modal={true}
                            selectCharts={true}
                            selectedChartTypes={selectedChartTypes[managerPreview.surveyId] || {}}
                            setSelectedChartTypes={(types: any) => {
                                setSelectedChartTypes(prev => ({
                                    ...prev,
                                    [managerPreview.surveyId]: types
                                }));
                            }}
                        />
                    )}
                </section>
            </main>
        );
    }

    return (
        <main className="flex flex-col px-16 py-12">
            <header className="flex flex-col rounded-xl shadow-2xl bg-zinc-200 dark:bg-zinc-900 px-16 py-10">
                <h1 className="mb-1 text-xl font-medium dark:text-white">
                    Disponibilizando Informações ao Público
                </h1>
                <p className="mb-3 text-sm dark:text-white">
                    Personalize a visualização dos dados que serão acessíveis ao público em geral.
                </p>
                <div className="mb-1 rounded-2xl bg-zinc-600 dark:bg-zinc-700 w-16 h-2" />
                <div className="ml-3 rounded-2xl bg-zinc-300 w-16 h-2" />
            </header>

            <section className="flex py-10 w-full items-end flex-col px-8">
                <div className="w-full text-center text-base mb-5">
                    <h1>
                        Pronto para compartilhar? Selecione os gráficos que serão exibidos publicamente
                    </h1>
                </div>

                <div className="w-full flex flex-col items-center gap-6">
                    {surveys.length === 0 ? (
                        <div className="text-zinc-500 dark:text-zinc-300">
                            Sem questionário no momento
                        </div>
                    ) : (
                        surveys.map((survey) => {
                            const surveyId = survey._id as string;
                            const currentSelectedQuestions = selectedQuestions[surveyId] || [];
                            
                            return (
                                <div
                                    key={surveyId}
                                    className="w-10/12 bg-white dark:bg-zinc-800 shadow-lg rounded-xl p-3"
                                >
                                    <Accordion variant="shadow">
                                        <AccordionItem
                                            title={survey.title}
                                            subtitle={`Aberto: ${formatDate(survey.openDate)} | Fechado: ${formatDate(survey.endDate)}`}
                                        >
                                            <Accordion variant="splitted" className="mb-3 mt-3">
                                                {survey.pages.map((page, pageIndex) => {
                                                    const filteredQuestions = page.questions.filter(q =>
                                                        ["checkbox", "radio", "select", "table"].includes(q.type)
                                                    );

                                                    const allSelected = filteredQuestions.length > 0 && filteredQuestions.every(q =>
                                                        currentSelectedQuestions.includes(q.name)
                                                    );

                                                    const handleToggleAll = () => {
                                                        if (allSelected) {
                                                            setSelectedQuestions(prev => ({
                                                                ...prev,
                                                                [surveyId]: (prev[surveyId] || []).filter(
                                                                    q => !filteredQuestions.some(fq => fq.name === q)
                                                                )
                                                            }));
                                                        } else {
                                                            setSelectedQuestions(prev => ({
                                                                ...prev,
                                                                [surveyId]: Array.from(new Set([
                                                                    ...(prev[surveyId] || []),
                                                                    ...filteredQuestions.map(q => q.name)
                                                                ]))
                                                            }));
                                                        }
                                                    };

                                                    return (
                                                        <AccordionItem
                                                            key={pageIndex}
                                                            title={page.title}
                                                            className="bg-zinc-50 dark:bg-zinc-900 rounded-xl"
                                                        >
                                                            <div className="mb-3 mt-1 flex">
                                                                <Switch
                                                                    color="success"
                                                                    isSelected={allSelected}
                                                                    onChange={handleToggleAll}
                                                                >
                                                                    Selecionar tudo
                                                                </Switch>
                                                            </div>

                                                            {page.questions.map((question, questionIndex) => {
                                                                if (!["checkbox", "radio", "table", "select"].includes(question.type)) {
                                                                    return null;
                                                                }

                                                                return (
                                                                    <div
                                                                        key={questionIndex}
                                                                        className="py-3 px-4 w-full flex items-center justify-between rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
                                                                    >
                                                                        <Checkbox
                                                                            classNames={{ icon: "text-white" }}
                                                                            color="success"
                                                                            isSelected={currentSelectedQuestions.includes(question.name)}
                                                                            onChange={(e) => {
                                                                                if (e.target.checked) {
                                                                                    setSelectedQuestions(prev => ({
                                                                                        ...prev,
                                                                                        [surveyId]: [...(prev[surveyId] || []), question.name]
                                                                                    }));
                                                                                } else {
                                                                                    setSelectedQuestions(prev => ({
                                                                                        ...prev,
                                                                                        [surveyId]: (prev[surveyId] || []).filter(q => q !== question.name)
                                                                                    }));
                                                                                }
                                                                            }}
                                                                        >
                                                                            {question.title.split(":")[0]}
                                                                        </Checkbox>

                                                                        <button
                                                                            onClick={() => {
                                                                                setSelectedQuestion({ questionName: question.name, surveyId: surveyId });
                                                                                onOpen();
                                                                            }}
                                                                            className="flex items-center gap-2 rounded-lg px-4 py-2 bg-zinc-800 text-white hover:bg-zinc-700 transition"
                                                                        >
                                                                            <FaEye size={14} />
                                                                            Visualizar
                                                                        </button>
                                                                    </div>
                                                                );
                                                            })}
                                                        </AccordionItem>
                                                    );
                                                })}
                                            </Accordion>

                                            <div className="pt-4 flex gap-4">
                                                <button
                                                    onClick={() => setManagerPreview({ surveyId })}
                                                    className="flex items-center gap-2 bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white px-6 py-2 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
                                                >
                                                    Preview
                                                </button>
                                                <button
                                                    onClick={() => handleConfirm(surveyId)}
                                                    className="flex items-center gap-2 bg-zinc-800 text-white px-6 py-2 rounded-lg hover:bg-zinc-700 transition"
                                                >
                                                    <CiUnlock size={18} />
                                                    Tornar Público
                                                </button>
                                            </div>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>
            
            {selectedQuestion && (
                <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
                    <ModalContent>
                        {(onClose) => {
                            const surveyAnalytics = surveysAnalytics[selectedQuestion.surveyId];
                            const filteredForSingleQuestion = {
                                ...surveyAnalytics,
                                pages: surveyAnalytics?.pages.map(page => ({
                                    ...page,
                                    questions: page.questions.filter(q => q.name === selectedQuestion.questionName)
                                })).filter(page => page.questions.length > 0)
                            };

                            return (
                                <>
                                    <ModalHeader className="dark:text-white">Visualização do Gráfico</ModalHeader>
                                    <ModalBody>
                                        {filteredForSingleQuestion.pages.length > 0 ? (
                                            <Graphics
                                                data={filteredForSingleQuestion}
                                                selectedPageIndex={0}
                                                lastUpdate={true}
                                                download={false}
                                                modal={true}
                                                selectCharts={false}
                                                selectedChartTypes={selectedChartTypes[selectedQuestion.surveyId] || {}}
                                            />
                                        ) : (
                                            <p>Nenhum dado disponível para esta questão.</p>
                                        )}
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button onClick={onClose}>Fechar</Button>
                                    </ModalFooter>
                                </>
                            );
                        }}
                    </ModalContent>
                </Modal>
            )}
        </main>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    await connectToMongoDB();

    const session = await getSession(context);

    const userId = session?.user._id;
    const surveys = await Survey.find({
        $or: [
            { author: userId },
            { sharedWith: new mongoose.Types.ObjectId(userId) }
        ],
        status: { $in: ["active", "closed"] }
    }).sort({ updatedAt: -1 }) || [];

    return {
        props: {
            surveys: JSON.parse(JSON.stringify(surveys))
        }
    }
}
