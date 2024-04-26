import { useState } from 'react';
import styles from './CreateQuestion.module.css';
import { updateSurvey } from '../../redux/actions';
import { FaPen, FaTrash } from 'react-icons/fa';
import Page from '../Survey/Page';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { Form } from '../Form';

export default function CreateQuestion({ survey, dispatch, changeBancoView, setSelectedPage, selectedPage }) {

    const [showOptions, setShowOptions] = useState(false);
    const [changeCSS, setChangeCSS] = useState(false);
    const [editText, setEditText] = useState(false);
  
    const changeViewOptions = (e) => {
      e.preventDefault();
      setChangeCSS(!changeCSS);
      setTimeout(() => setShowOptions(!showOptions), 400);
    }
  
    const handleInputChange = (e, setText) => {
      const value = e.target.value;
  
      if (setText === 'title') {
        const updatedSurvey = { ...survey, title: value };
        dispatch(updateSurvey(updatedSurvey));
  
      }
      if (setText === 'description') {
        const updatedSurvey = { ...survey, description: value };
        dispatch(updateSurvey(updatedSurvey));
      }
    }
  
    return (
      <div className={styles.mountarea}>
        <div className={styles.questionarea}>
          <div className={styles.title}>
            <div className={styles.titlediv}>
              <h1>
                {editText ? (
                  <>
                    <Form.Input type={'text'} name={'title'} placeholder='Titulo' onChange={(e) => handleInputChange(e, 'title')} value={survey.title} />
                    <Form.ErrorMessage field={'title'} />  
                  </>
                ) : survey.title}
              </h1>
              <h3>
                {editText ? <Form.TextArea name={'description'} placeholder='Descrição' onChange={(e) => handleInputChange(e, 'description')} value={survey.description} /> : survey.description}
              </h3>
            </div>
            <div className={styles.buttonsTitle}>
              <FaPen onClick={() => setEditText(!editText)} />
              <FaTrash onClick={() => {
                const updatedSurvey = { ...survey, title: '', description: '' };
                dispatch(updateSurvey(updatedSurvey));
              }} />
            </div>
          </div>
          <div className={survey.pages.length > 0 ? styles.questionslist : styles.add_questions}>
  
            {survey.pages.length > 0
              ? survey.pages.map((page) => (
                <Page key={page.id} id={page.id} elements={page.elements} title={page.title} setSelectedPage={setSelectedPage} selectedPage={selectedPage}/>
              ))
              : <p>Adicione questões para o seu questionário</p>}

          </div>
        </div>
        <div className={styles.questionadd}>
          <button 
            onClick={(event) => changeViewOptions(event)}
            className={styles.show_options}>
            Adicionar questão {showOptions ? <IoMdArrowDropup cursor={'pointer'} size={'20px'} /> : <IoMdArrowDropdown cursor={'pointer'} size={'20px'} />}
          </button>
          {showOptions && (
            <div className={changeCSS ? styles.question_options : styles.question_optionsclosed}>
              <button>Nova questão</button>
              <button 
                onClick={(event) => changeBancoView(event)}
                >
                  Banco de questões
                </button>
            </div>
          )}
        </div>
      </div>
      
    )
  }