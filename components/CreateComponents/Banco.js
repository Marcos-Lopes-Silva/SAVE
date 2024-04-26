import { useEffect, useState } from 'react';
import styles from './Banco.module.css';
import { Form } from '../Form';
import { updateSurvey } from '../../redux/actions';

export default function Banco({ survJSON, changeBancoView, survey, dispatch, idCounterPage, setIdCounterPage }) {

    const [dimension, setDimension] = useState('');
    const [pageTitles, setPageTitles] = useState();
    const [checkedValues, setCheckedValues] = useState([]);
  
    const style = {
      menu: {
        display: "flex",
        flexDirection: "column",
        width: "90%",
      },
      button: {
        display: "flex",
        width: "80%",
        boxShadow: "0px 4px 4px 1px rgba(0, 0, 0, 0.25)",
        borderRadius: "10px",
        gap: "10px",
        padding: "15px",
        paddingLeft: "35px"
  
      },
      span: {
        width: "90%",
        display: "flex",
        fontSize: "14px",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        fontWeight: "600"
      },
      options: {
        width: "80%",
        position: "relative",
        height: "auto",
      },
      option: {
        justifyContent: "flex-start",
      }
    }
  
    const handleCheckboxChange = (event) => {
  
      if (event.target.checked) {
        setCheckedValues([...checkedValues, event.target.value]);
      } else {
        setCheckedValues(checkedValues.filter(value => value !== event.target.value));
      }
    };
  
    const handleAddQuestionsFromDatabase = (event) => {
      event.preventDefault();
  
      let updatedSurvey = { ...survey };
      let id = 1;
  
      if (survey.pages.length === 0) {
  
        const page1 = {
          id: idCounterPage,
          title: dimension,
          elements: checkedValues.map(index => {
            const element = survJSON.pages.find(item => item.title == dimension).elements[parseInt(index)];
            
            element.id = id;
            id++;
            
            return element;
          })
        };
  
        const page2 = {
          id: idCounterPage + 1,
          elements: []
        };
        setIdCounterPage(idCounterPage + 1);
  
        id++;
        updatedSurvey.pages = [page1, page2];
      } else {
  
        const page = survey.pages[survey.pages.length - 2];
        
        id = page.elements.length + 1;
  
        const elements =  page.elements.concat(checkedValues.map(index => {
            const element = survJSON.pages.find(item => item.title == dimension).elements[parseInt(index)];
  
            element.id = id;
            id++;
          
            return element;
          }));
  
        const newPage = { ...page, elements: elements };
  
        updatedSurvey.pages = survey.pages.map((pageI) => pageI.id === page.id ? newPage : pageI);
      }
      dispatch(updateSurvey(updatedSurvey));
      changeBancoView(event);
    }
  
    useEffect(() => {
      setPageTitles(survJSON.pages.map(page => page.title));
    }, []);
  
    return (
      <div className={styles.page_banco}>
        <div onClick={(event) => changeBancoView(event)}>
          Voltar
        </div>
        <div className={styles.group_banco}>
          <div className={styles.banco_header}>
            <h1>
              Adicionar do banco de questões
            </h1>
          </div>
          <div className={styles.questions_area}>
            <p>
              Selecione uma dimensão
            </p>
            <Form.Dropdown span={'Dimensão'} style={style} arrFields={pageTitles} selected={dimension} setSelected={setDimension} />
            {
              dimension && survJSON.pages.map(page => (
                page.title === dimension && (
                  <>
                    <div className={styles.question_shape}>
                      {page.elements.map((element, index) => (
                        <div className={styles.question}>
  
                          <input
                            type='checkbox'
                            value={index}
                            onChange={handleCheckboxChange}
                          />
                          <h3>  {element.title}:  </h3>
  
                        </div>
                      ))
                      }
                    </div>
                    <button
                      className={styles.question_button}
                      onClick={(e) => handleAddQuestionsFromDatabase(e)}
                    >
                      Adicionar questões ao questionário
                    </button>
                  </>
                )
              ))
            }
          </div>
        </div>
      </div>
    )
  }