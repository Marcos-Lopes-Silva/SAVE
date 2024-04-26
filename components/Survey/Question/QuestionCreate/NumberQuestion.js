import { Form } from "react-hook-form";



export function NumberQuestion() {

    return (
        <Form.Field>
            <Form.Input type="text" id="title" name="title" />
            <Form.Input type="number" id="number" name="number" />
        </Form.Field>
    )
}