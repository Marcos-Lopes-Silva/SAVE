import { useEffect, useState } from "react";
import { Form } from "../../../Form";
import BottomButtons from "../BottomButtons";
import styles from "./Question.module.css";
import { IoIosAddCircle, IoIosRemoveCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export function RatingQuestion({ title, id, deleteQuestion, Required, filled, isRequired, handleInputChange}) {

    const survey = useSelector((state) => state.survey);
    const dispatch = useDispatch();

    const [ selectedId, setSelectedId ] = useState(0);


    const [ options, setOptions ] = useState([]);

    /**
     * This function adds an option to the options array
     * @returns
    */
    const addOption = () => {
        setOptions([...options, {
            id: options.length + 1,
            title: `${options.length + 1}`,
        }])
    }

    /**
     * This function selects a value from the options array
     * @param {HTMLElement} e 
     * @param {int} value - id of the selected option
     */
    const selectValue = (e, value) => {
        e.preventDefault();
        let updatedSurvey = {...survey};
        if (value === selectedId) {
            setSelectedId(0);
        } else {
            setSelectedId(value);
        }
    }   

    /**
     * This function removes an option from the options array
     * @param {Int} id 
     * @returns 
     */
    const removeOption = (id) => {
        if( options.length === 2 ) {
            toast.error('São necessárias ao menos duas opções.');
            return;
        }
        setOptions(options.filter((option) => option.id !== id));
    }
    
    useEffect(() => {
        if (options.length === 0) {
            addOption();
        }
        if (options.length === 1) {
            addOption();
        }
    }, [options])


    return (
        <Form.Field className={styles.field}>
            <Form.Input className={styles.title} value={title} style={filled ? {outline:'none'} : null} type={'text'} placeholder={`Question ` + id} name={'ratingQuestion' + id} id={'ratingQuestion' + id} onChange={(e) => handleInputChange(e, id)}/>
            <div className={styles.optionsRating}>
                <IoIosRemoveCircle onClick={() => removeOption(options.length)} cursor={'pointer'} size={21}/>
                <IoIosAddCircle onClick={addOption} cursor={'pointer'} size={21}/>
                {options && options.map((option) => (
                    <Form.Select key={option.id} value={option.id} selectValue={selectValue} id={option.id} selectedId={selectedId} />
                ))}
            </div>
            <ToastContainer />
            <BottomButtons showAll={false} id={id} deleteQuestion={deleteQuestion} Required={Required} isRequired={isRequired}/>
        </Form.Field>
    )
}