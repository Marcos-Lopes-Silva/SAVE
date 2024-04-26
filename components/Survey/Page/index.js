import styles from './Page.module.css';
import { Form } from '../../Form';
import Question from '../Question';
import { DndContext, closestCorners } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSurvey } from '../../../redux/actions';
import { getElementPos } from '../../../lib/ContextAuxSurvey';


export default function Page({ id, title, elements, setSelectedPage, selectedPage }) {

    const [ widthTitle, setWidthTitle ] = useState(0);
    const [ widthDesc, setWidthDesc ] = useState(0);
    const [ arr, setArr ] = useState([]);

    const survey = useSelector((state) => state.survey);
    const dispatch = useDispatch();


    const handleInputChange = (e, call) => {
        const value = e.target.value.length;
        let updatedSurvey = {...survey};
        let page = { ...survey.pages.find(page => page.id === id) };
        if (call === 'title') {
            if (value) {
                page.title = e.target.value;
                setWidthTitle((value + 4) * 10);
            } else {
                page.title = '';
                setWidthTitle(0);
            }
        }
        if (call === 'description') {
            if (value) {
                page.description = e.target.value;
                setWidthDesc((value + 4) * 10); 
            } else {
                page.description = '';
                setWidthDesc(0);
            }
        }
        updatedSurvey.pages = survey.pages.map((pageI) => pageI.id === id ? page : pageI);
        dispatch(updateSurvey(updatedSurvey));
    }

    const handleDragEnd = event => {
        const { active, over } = event
        if (active.id === over.id) return;
        const originalPos = getElementPos(active.id, arr);
        const newPos = getElementPos(over.id, arr);

        let updatedSurvey = {...survey};
        let page = { ...survey.pages.find(page => page.id === id) };
        let newArr = arrayMove(arr, originalPos, newPos);
        page.elements = newArr;
        updatedSurvey.pages = survey.pages.map((pageI) => pageI.id === id ? page : pageI);
        dispatch(updateSurvey(updatedSurvey));

        setArr(newArr);
    }

    const deleteQuestion = (elementId) => {

        let updatedSurvey = {...survey};

        let page = { ...survey.pages.find(page => page.id === id) };
        
        let elements = [ ...page.elements ];
        
        elements = elements.filter((element) => element.id !== elementId);
        
        page = { ...page, elements: elements };
        
        updatedSurvey.pages = survey.pages.map((pageI) => pageI.id === id ? page : pageI);
        
        dispatch(updateSurvey(updatedSurvey));
    }

    const selectPage = (e, id) => {
        console.log('selected page', id, selectedPage);
        e.preventDefault();
        setSelectedPage(id);
    }

    useEffect(() => {
        if (elements) {
            setArr(elements);
        }
        if (title) {
            setWidthTitle((title.length + 4) * 10);
        }

    }, [ elements ])
    return (
        <form 
            className={ id === selectedPage ? styles.selected_page : styles.page }
            onClick={(e) => selectPage(e, id)}
            >
        
            <Form.Field
                className={styles.field}
            >
                <Form.Input 
                    className={styles.inputPage}
                    type="text" 
                    id="title"
                    value={title}
                    onChange={(e) => handleInputChange(e, 'title')}
                    style={{width: widthTitle > 0 ? `${widthTitle}px` : '13%'}}
                    name={`page.${id}.title`}
                    placeholder={`Page ${id}`} 
                />
                <Form.Input
                    className={styles.inputDesc}
                    type="text"
                    style={{width: widthDesc > 0 ? `${widthDesc}px` : '15%'}}
                    onChange={(e) => handleInputChange(e, 'description')}
                    id="description"
                    name={`page.${id}.description`}
                    placeholder="Description"
                />
            </Form.Field>   
            <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
                <SortableContext items={arr} strategy={verticalListSortingStrategy}>
                    {arr && arr.map((element) => (
                        <Question choices={element.choices && element.choices.length > 0 ? element.choices : null} pageId={id} title={element.title} key={element.id} type={element.type} id={element.id} deleteQuestion={deleteQuestion} />
                    ))}
                </SortableContext>
            </DndContext>  
        </form>
    )
} 