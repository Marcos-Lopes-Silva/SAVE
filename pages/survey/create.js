import styles from './Create.module.css'
import { getSession } from 'next-auth/react'
import { FaEye } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateSurvey } from '../../redux/actions';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputList from '../../components/InputList';
import clientPromise from '../../lib/mongodb';
import mongoose from 'mongoose';
import { ToastContainer, toast } from 'react-toastify';
import { useDisclosure } from '@chakra-ui/react';
import CreateQuestion from '../../components/CreateComponents/CreateQuestion';
import Banco from '../../components/CreateComponents/Banco';
import SurveyCreatorDialog from '../../components/SurveyCreatorDialog';
import { saveSurveyStatus } from '../../lib/utils/api';
import { elementIsValid, hasAtLeastThreeElements, hasTitle } from '../../lib/utils/validation';

const createSurveySchema = z.object({});

export default function create({ survJSON, surveyId, surv, groups }) {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [idCounterPage, setIdCounterPage] = useState(1);
  const [idCounterQuestion, setIdCounterQuestion] = useState(1);
  const [selectedPage, setSelectedPage] = useState(0);
  const [banco, setBanco] = useState(false);
  const hasRun = useRef(false);

  const createPageForm = useForm({
    resolver: zodResolver(createSurveySchema),
  });

  const survey = useSelector((state) => state.survey);
  const dispatch = useDispatch();


  /**
   * @author Marcos-Lopes-Silva
   * This function is called when the user clicks on the button to change the view, the view can be the questions from database or the question creator.
   * @param {HTMLElement} event 
   */
  const changeBancoView = (event) => {
    event.preventDefault();
    setBanco(!banco);
  }


  /**
   * @author Marcos-Lopes-Silva
   * @param {String} type - The type of the question that will be added to the survey.
   * This function is called when the user clicks on the add question button. It adds a question to the survey.
   * 
   */
  const addQuestion = (type) => {
    let updatedSurvey = { ...survey };

    if (selectedPage === 0) setSelectedPage(1);

    if (survey.pages && survey.pages.length === 0) {

      const page1 = { id: idCounterPage, title: '', elements: [{ type: type, id: idCounterQuestion, isRequired: false }] };

      updatedSurvey.pages = [page1];

      setIdCounterPage(idCounterPage + 1);
      setIdCounterQuestion(idCounterQuestion + 1);
    }

    if (survey.pages && survey.pages.length > 0) {


      const element = { type: type, id: idCounterQuestion, isRequired: false };

      let page = { ...survey.pages.find(page => page.id === selectedPage) };

      const elements = [...page.elements, element];

      page = { ...page, elements: elements };

      setIdCounterQuestion(idCounterQuestion + 1);

      updatedSurvey.pages = survey.pages.map((pageI) => pageI.id === selectedPage ? page : pageI);
    }

    dispatch(updateSurvey(updatedSurvey));
  };



  /**
   * This is the function that will be passed to the form provider and will be called when the form is submitted. This piece of code is from hook-form library.
   * @returns
   */
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = createPageForm;


  /**
   * @author Marcos-Lopes-Silva
   * This function is called when the user clicks on the submit button. It checks if the survey has at least one page and if each page has at least 3 questions.
   * @returns
   * **/
  const submitSurvey = () => {
    let canOpen = true;
    let message = '';

    if (survey.pages) {

      if (survey.pages.length === 0) {
        canOpen = false;
        message = 'Adicione pelo menos uma página ao questionário.';
      } else {

        for (let page of survey.pages) {
          if (!hasAtLeastThreeElements(page) || !hasTitle(page)) {
            canOpen = false;
            message = 'Cada página deve ter um título e pelo menos 3 perguntas.';
            break;
          }

          for (let element of page.elements) {
            if (!elementIsValid(element)) {
              canOpen = false;
              message = 'Cada pergunta deve ter um título e um tipo.';
              break;
            }
          }
          if (!canOpen) break;
        }
      }

      canOpen ? onOpen() : toast.error(message);
    }
  }

  useEffect(() => {
    if (!hasRun.current) {
      dispatch(updateSurvey(surv));
      hasRun.current = true;
    }

    const interval = setInterval(() => {
      saveSurveyStatus(survey, surveyId, toast);
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
    }
  }, [survey.pages, survey.pages.elements, survey.pages.title]);

  return (
    <div className={styles.page}>
      <InputList addQuestion={addQuestion} />
      <ToastContainer />
      <div className={styles.container}>
        <FormProvider {...createPageForm}>
          <form
            className={styles.form}
            onSubmit={handleSubmit(submitSurvey)}
          >
            <div className={styles.header}>

              <button className={styles.buttonsHeader}>
                <Link href={'/survey/preview/{id}'}>
                  <label>
                    <FaEye size={18} color='white' />
                    Preview
                  </label>
                </Link>
              </button>
              <button type='submit' className={styles.buttonsHeader}>

                <label>
                  <FaUsers size={18} color='white' />
                  Enviar
                </label>

              </button>
              <button className={styles.buttonSetting}>
                <Link href={'/survey/settings'}>
                  <label>
                    <IoSettingsSharp size={18} />
                  </label>
                </Link>
              </button>
            </div>
            {banco
              ? <Banco survJSON={survJSON} changeBancoView={changeBancoView} survey={survey} dispatch={dispatch}
                idCounterPage={idCounterPage} setIdCounterPage={setIdCounterPage} />
              :
              <CreateQuestion survey={survey} dispatch={dispatch} changeBancoView={changeBancoView} setSelectedPage={setSelectedPage} selectedPage={selectedPage} />
            }
            <SurveyCreatorDialog isOpen={isOpen} cancelRef={cancelRef} onClose={onClose} surveyId={surveyId} groups={groups}/>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}


/**
 * @author Marcos-Lopes-Silva
 * This function is called before the page is rendered. It gets the session and the survey, questions and groups from the database.
 * @param {Object} context 
 * @returns 
 */
export async function getServerSideProps(context) {
  
  const session = await getSession(context);
  const client = await clientPromise;
  const db = client.db('SurveyTool');
  const surveyId = context.query.id;

  if (!session || session.user.role === 'user') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
 
  let surv = await db.collection('surveys').findOne({
    _id: mongoose.Types.ObjectId(surveyId),
  });

  let survJSON = await db.collection('surveyQuestions').findOne({
    _id: mongoose.Types.ObjectId('62a1d298e64281cd326096b8'),
  });
  
  let groups = [];

  groups = JSON.parse(JSON.stringify(groups));
  survJSON = JSON.parse(JSON.stringify(survJSON));
  surv = JSON.parse(JSON.stringify(surv));
  
  return {
    props: {
      survJSON,
      surveyId,
      surv,
      groups
    },
  }
}
