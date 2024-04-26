import { Form } from "../../../Form";
import BottomButtons from "../BottomButtons";
import styles from "./Question.module.css";

export function TextAreaQuestion({ title, handleInputChange, id, deleteQuestion, filled, Required, isRequired }) {
    return (
        <Form.Field className={styles.field}>
            <Form.Input className={styles.title} value={title} type="text" id={"titleQuestion" + id} style={filled ? {outline:'none'} : null} name={"titleQuestion" + id} placeholder={'Question ' + id}  onChange={(e) => handleInputChange(e, id)}/> 
            <Form.TextArea id={"textareaQuestion" + id} name={"textareaQuestion" + id} readOnly />
            <BottomButtons showAll={true} id={id} deleteQuestion={deleteQuestion} Required={Required} isRequired={isRequired}/>
        </Form.Field>
    );
}