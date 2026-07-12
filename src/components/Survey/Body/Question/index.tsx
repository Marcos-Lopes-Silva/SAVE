import { toast } from "react-toastify";
import { IQuestion } from "../../../../../models/surveyModel";
import { QuestionsBody } from "../Questions";
import { useFormContext, useWatch } from "react-hook-form";
import React, { useEffect, useRef } from "react";

interface Props {
    id: string;
    question: IQuestion;
}

// Sentinel field name: passing `name: undefined` to useWatch subscribes to
// the ENTIRE form instead of nothing, so every non-dependent question would
// re-render (and re-run its effects) on every keystroke anywhere in the
// survey, including on other pages. Watching a name that can never be a
// real field keeps the subscription inert for questions with no dependsOn.
const NO_DEPENDENCY = "__no_dependency__";

const QuestionBody = ({ id, question }: Props) => {
    const { control, setValue } = useFormContext();
    const dependsOn = question.dependsOn;

    const questionAnswer = useWatch({
        control,
        name: dependsOn || NO_DEPENDENCY,
    });

    // Guarda o último valor visto de forma síncrona (não via efeito), para
    // não confundir a dupla invocação de efeitos do React Strict Mode (dev)
    // com uma mudança real — um ref "já rodei uma vez" sozinho não resiste
    // a isso, pois a segunda invocação simulada acontece antes de qualquer
    // mudança real de dado.
    const prevAnswerRef = useRef(questionAnswer);

    // Quando a resposta da pergunta "pai" (ex.: Sim/Não) muda, a resposta
    // desta pergunta dependente perde o contexto e precisa ser limpa,
    // senão fica uma resposta "presa" de um caminho que não existe mais.
    useEffect(() => {
        const prevAnswer = prevAnswerRef.current;
        prevAnswerRef.current = questionAnswer;

        if (!dependsOn) return;
        if (prevAnswer === questionAnswer) return;

        setValue(question.name, undefined, { shouldValidate: true, shouldDirty: true });
    }, [questionAnswer, dependsOn]);


    function handleType(type: IQuestion["type"]) {
        switch (type) {
            case "text":
                return <QuestionsBody.Text question={question} />;
            case "radio":
                return <QuestionsBody.Radio question={question} />;
            case "checkbox":
                return <QuestionsBody.Checkbox question={question} />;
            case "dropdown":
                return <QuestionsBody.Dropdown question={question} />;
            case "date":
                return <QuestionsBody.DateQuestion question={question} />;
            case "number":
                return <QuestionsBody.Number question={question} />;
            case "textarea":
                return <QuestionsBody.TextArea question={question} />;
            case "rating":
                return <QuestionsBody.Rating question={question} />;
            case "select":
                return <QuestionsBody.Select question={question} />;
            case "table":
                return <QuestionsBody.TableSurvey question={question} />;
            default:
                toast.error("Invalid question type");
        }
    }

    if (question.dependsOn) {
        const shouldShowQuestion = question.dependsOn
            ? question.dependsOnValue !== undefined
                ? questionAnswer && questionAnswer[question.dependsOn] === question.dependsOnValue
                    ? true
                    : typeof questionAnswer === "string"
                        ? (question.dependsOnValue.includes("Outro") && questionAnswer.includes("Outro"))
                            ? true
                            : questionAnswer === question.dependsOnValue
                        : false
                : Boolean(questionAnswer) &&
                (Array.isArray(questionAnswer) ? questionAnswer.length > 0 : true)
            : true;

        if (!shouldShowQuestion) return null;
    }


    return (
        <div id={id} className="bg-zinc-100 dark:bg-zinc-800 p-10 rounded-2xl shadow-lg">
            {handleType(question.type)}
        </div>
    );
};

QuestionBody.displayName = "QuestionBody";

export default QuestionBody;