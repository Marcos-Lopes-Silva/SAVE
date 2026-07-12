import { LuAsterisk } from "react-icons/lu";
import { IQuestionProp } from ".";
import { Form } from "@/components/Form";
import { useFormContext } from "react-hook-form";
import { useAutosave } from "../AutosaveContext";



export function TextArea({ question }: IQuestionProp) {

    const { register } = useFormContext();
    const triggerSave = useAutosave();
    const { onBlur } = register(question.name);

    return (
        <Form.Field>
            <Form.Label className="py-2 px-2 font-bold flex gap-2 dark:text-white">{`${question.id}. ${question.title}`}{question.required ? <LuAsterisk size={10} /> : ""}</Form.Label>
            <Form.TextArea
                name={question.name}
                onBlur={(e: any) => { onBlur(e); triggerSave(); }}
                className="bg-transparent p-2 rounded-md"
                placeholder={question.placeholder ?? "Insira um texto"}
            />
            <Form.ErrorMessage field={question.name} />
        </Form.Field>
    )
}