import { useEffect, useState } from "react";
import { Form } from "../../../Form";
import { useDispatch, useSelector } from 'react-redux';
import { IoIosAddCircle, IoIosRemoveCircle } from "react-icons/io";
import BottomButtons from "../BottomButtons";
import styles from './Question.module.css';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



export function RadioQuestion({ title, handleInputChange, id, deleteQuestion, Required, isRequired, choices = [] }) {

    const survey = useSelector(state => state.survey);
    const dispatch = useDispatch();

    const [ options, setOptions ] = useState([]);

    const handleInputOpChange = (e, index) => {
        const value = e.target.value;
        const updatedOptions = [...options];

        updatedOptions[index] = value;
        setOptions(updatedOptions);
    }

    const addOption = () => {
        setOptions([...options, 
            `Item ${options.length + 1}`,
        ])
    }

    const removeOption = (id) => {
        if( options.length === 1 ) {
            toast.error('You must have at least one option');
            return;
        }
        setOptions(options.filter((option) => option.id !== id));
    }

    useEffect(() => {
        console.log(choices);
        if (choices.length > 0) {
            setOptions(choices);
        } 
    }, [options])

    return (
        <Form.Field className={styles.field}>
            <Form.Input value={title} type="text" id={"titleQuestion" + id} name={"title" + id} placeholder={'Question ' + id} className={styles.title} onChange={() => handleInputChange}/>

            {options.map((option, index) => (
                <Form.Field key={option} className={styles.fieldOp}>
                    <IoIosRemoveCircle onClick={() => removeOption(option.id)} cursor={'pointer'} size={21}/>
                    <div className={styles.circleRadio}/>
                    <Form.Input type="text" id={"optionQuestion" + index} name={"optionQuestion" + index} value={option} className={styles.inputOp} onChange={(e) => handleInputOpChange(e, index)}/>
                </Form.Field>
            ))}

            <Form.Field className={styles.fieldOpAdd}>
                <IoIosAddCircle onClick={() => addOption()} cursor={'pointer'} size={21} color="#9A9594"/>
                <div className={styles.circleRadioAdd}/>
                <Form.Input type="text" id={"optionTitleQuestion" + id} name={"optionTitleQuestion" + id} placeholder={`Item ${options.length + 1}`} readOnly />
            </Form.Field>
            <ToastContainer />
            <BottomButtons id={id} deleteQuestion={deleteQuestion} Required={Required} isRequired={isRequired}/>
        </Form.Field>
    )
}