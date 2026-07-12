import { Form } from "@/components/Form";
import { IQuestionProp } from ".";
import { LuAsterisk } from "react-icons/lu";
import { useFormContext } from "react-hook-form";
import { Input } from "@nextui-org/react";
import { useAutosave } from "../AutosaveContext";



export function Text({ question }: IQuestionProp) {

    const { register } = useFormContext();
    const triggerSave = useAutosave();
    const { onBlur, ...fieldProps } = register(question.name);

    return (
        <Form.Field >
            <Form.Label className="py-2 px-2 font-bold flex gap-2 dark:text-white">{`${question.id}. ${question.title}`}{question.required ? <LuAsterisk size={10} /> : ""}</Form.Label>
            <Input required={question.required}
                {...fieldProps}
                onBlur={(e) => { onBlur(e); triggerSave(); }}
                className="bg-transparent p-2 rounded-md dark:text-white" placeholder={question.placeholder ?? "Insira um texto"} />
            <Form.ErrorMessage field={question.name} />
        </Form.Field>
    )
}