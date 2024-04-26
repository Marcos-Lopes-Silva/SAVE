import { Form } from "../../../Form";
import BottomButtons from "../BottomButtons";
import styles from "./Question.module.css";

export function TextQuestion({ title, handleInputChange, id, deleteQuestion, filled, isRequired, Required }) {
    return (
        <Form.Field className={styles.field}>
            <Form.Input className={styles.title} value={title} type="text" id={"titleQuestion" + id} style={filled ? {outline:'none'} : null} name={"titleQuestion" + id} placeholder={'Question ' + id}  onChange={(e) => handleInputChange(e, id)}/> 
            <Form.Input className={styles.input_text} type="text" id={"textareaQuestion" + id} name={"textareaQuestion" + id} readOnly />
            <BottomButtons showAll={true} id={id} deleteQuestion={deleteQuestion} isRequired={isRequired} Required={Required}/>
        </Form.Field>
    );
}