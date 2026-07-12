import { Form } from "@/components/Form";
import { IQuestionProp } from ".";
import { LuAsterisk } from "react-icons/lu";
import { FormEvent } from "react";
import { useFormContext } from "react-hook-form";
import { useAutosave } from "../AutosaveContext";


export function Number({ question }: IQuestionProp) {
    const { register } = useFormContext();
    const triggerSave = useAutosave();
    const { onBlur } = register(question.name);

    const handleInput = (e: FormEvent<HTMLInputElement>) => {
        const input = e.currentTarget;
        input.value = input.value.replace(/[^0-9.,]/g, '');
    }

    return (
        <Form.Field>
            <Form.Label className="flex gap-2 py-2 px-2 font-bold dark:text-white">{`${question.id}. ${question.title}`}{question.required ? <LuAsterisk size={10} /> : ""}</Form.Label>
            <Form.Input
                type="text"
                pattern="[0-9]*[.,]?[0-9]*"
                inputMode="decimal"
                required={question.required}
                onInput={handleInput}
                onBlur={(e: any) => { onBlur(e); triggerSave(); }}
                name={question.name}
            />
            <Form.ErrorMessage field={question.name} />
        </Form.Field>
    )
}