import styles from './QuestionCreate/Question.module.css'
import { QuestionCreate } from "./QuestionCreate";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSurvey } from "../../../redux/actions";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


export default function Question({ id, title, type, deleteQuestion, isRequired, pageId }) {

    const survey = useSelector((state) => state.survey);
    const dispatch = useDispatch();
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const [ choices, setChoices ] = useState([]);
    const [ filled, setFilled ] = useState(false);

    /**
     * This function handles the input change event and updates the survey state with the new value of the question title.
     * @param {Event} e
     * @returns
     */
    const handleInputChange = (e) => {
        e.preventDefault();

        const value = e.target.value;
        
        if (value.length > 0) {
            setFilled(true);
        } else {
            setFilled(false);
        }
        
        const updatedSurvey = { ...survey };
        let pages = [...survey.pages];
        let page = { ...survey.pages.find(page => page.id === pageId) };
        let elements = [...page.elements];
        const element = { ...elements.find(element => element.id === id), title: value };
        elements = elements.map(elementF => elementF.id === id ? elementF = element : elementF);
        page = { ...page, elements: elements };
        pages = pages.map(pageI => pageI.id === pageId ? page : pageI);
        updatedSurvey.pages = pages;
        console.log(updatedSurvey)
        dispatch(updateSurvey(updatedSurvey));
    }

    /**
     * This function updates the isRequired property of the question element.
     * @returns
     */
    const Required = () => {
        let updatedSurvey = { ...survey };
        let pages = [...survey.pages];
        let page = { ...pages.find(page => page.id === pageId) };

        const elements = [...page.elements];
        const element = { ...elements[id - 1], isRequired: !elements[id - 1].isRequired };

        elements[id - 1] = element;
        page = { ...page, elements: elements };
        pages = pages.map(pageI => pageI.id === pageId ? page : pageI);
        updatedSurvey.pages = pages;

        dispatch(updateSurvey(updatedSurvey));
    }

    useEffect(() => {
        const page = survey.pages.find(page => page.id === pageId)

        if (type === 'radiogroup') {
            
            let choicesAux = page.elements.find(element => element.id === id).choices

            if (choicesAux === null) {
                setChoices([
                    {
                        id: 1,
                        title: 'Item 1',
                    },
                    {
                        id: 2,
                        title: 'Item 2',
                    }
                ])
            } else 
                setChoices(choicesAux);

        }
    }, [ 0 ])

    /**
     * This function renders the question component based on the type of the question.
     * @param {String} type - type of the question
     * @returns
     */
    const renderQuestion = (type) => {
        switch (type) {
            case 'text': return <QuestionCreate.TextQuestion title={title} deleteQuestion={deleteQuestion} handleInputChange={handleInputChange} id={id} filled={filled} isRequired={isRequired} Required={Required}/>;
            case 'textarea': return <QuestionCreate.TextAreaQuestion  title={title} deleteQuestion={deleteQuestion} handleInputChange={handleInputChange} id={id} filled={filled} isRequired={isRequired} Required={Required}/>;
            case 'radiogroup': return <QuestionCreate.RadioQuestion choices={choices} title={title} deleteQuestion={deleteQuestion} handleInputChange={handleInputChange} id={id} filled={filled} isRequired={isRequired} Required={Required}/>;
            case 'number': return <QuestionCreate.NumberQuestion title={title} handleInputChange={handleInputChange} id={id} filled={filled} Required={Required}/>;
            case 'date': return <QuestionCreate.DateQuestion title={title} handleInputChange={handleInputChange} id={id} filled={filled} Required={Required}/>;
            case 'rating': return <QuestionCreate.RatingQuestion title={title} deleteQuestion={deleteQuestion} id={id} isRequired={isRequired} handleInputChange={handleInputChange} filled={filled} Required={Required}/>;
            
        }
    }

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    return (
        <div ref={setNodeRef} 
        style={style}
        className={styles.box_question}
        >
            <div className={styles.drag_div} {...attributes}{...listeners}>
                <div className={styles.drag_handle}/>
            </div>
            { renderQuestion(type) }
        </div>
    );
}