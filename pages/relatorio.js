import { useState, useEffect, useMemo } from 'react';
import { getSession } from 'next-auth/react';
import {
  Button, Flex, FormControl, FormLabel, Input, Select, Text
} from '@chakra-ui/react'
import clientPromise from "../lib/mongodb";
import Charts from '../components/Charts';
import { getSurveyResult } from '../lib/FuncoesAux';
import { returnSurveyQuestions } from '../lib/ManipulaJSON';
import Pagination from '../components/Pagination/Pagination';
import { Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';


let PageSize = 10;


const Relatorio = ({ data, surveyResults, surveys }) => {

  surveyResults = getSurveyResult(surveyResults);
  /* -------------------------------------------------- */
  const [loaded, setLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  /* -------------------------------------------------- */
  const [addDado, setAddDado] = useState(false);
  const [dados, setDados] = useState(data);


  const addNewChart = (values) => {
    console.log(values)
    
    if(values.title !== '' || values.firstdata !== '' || values.seconddata !== '' || values.editable !== ''){

      setDados([...dados, {titulo: values.title, dado1: values.title, dado2: values.seconddata, tipoChart: values.chartType, editar: values.editable}])

    }

    setAddDado(false);
  }


  useEffect(() => {
    setLoaded(true);

  }, [0]);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return dados.slice(firstPageIndex, lastPageIndex);
  }, [currentPage]);


  //JSX.React renderizado no DOM
  return (
    <>
      {loaded &&

        (
          <Flex
            flexDir={'column'}
            width={'100%'}
            position={'relative'}
            overflow={'hidden'}
            height={'auto'}
          >

            <Text
              fontSize={'2xl'}
              fontWeight={'bold'}
              alignSelf={'center'}
              marginBottom={'125px'}
            >
              Visualização dos dados
            </Text>
            <Flex
              width={'900px'}
              flexDir={'column'}
              alignSelf={'center'}
            >


              {currentTableData.map((item, index) => (
                <Charts surveys={surveys} key={index} editavel={item.editar} title={item.titulo} dado1={item.dado1} dado2={item.dado2} tipoChart={item.tipoChart} surveyResult={surveyResults} />
              ))}

              {addDado
                ?
                (
                  <Formik
                    initialValues={{ title: '', firstdata: '', seconddata: '', editable: false, chartType: '' }}
                    onSubmit={(values, actions) => {
                      setTimeout(() => {
                        addNewChart(values)
                        actions.setSubmitting(false)
                      }, 1000)
                    }}
                  >
                    {(props) => (
                      <Form>
                        <Field name='title'>
                          {({ field, form }) => (
                            <FormControl isInvalid={form.errors.title && form.touched.title}>
                              <FormLabel>Titulo</FormLabel>
                              <Input {...field} />
                            </FormControl>
                          )}
                        </Field>
                        <Field name='firstdata'>
                          {({ field, form }) => (
                            <FormControl isInvalid={form.errors.firstdata && form.touched.firstdata}>
                              <FormLabel>Primeiro Dado</FormLabel>
                              <Input {...field} />
                            </FormControl>
                          )}
                        </Field>
                        <Field name='seconddata'>
                          {({ field, form }) => (
                            <FormControl isInvalid={form.errors.name && form.touched.name}>
                              <FormLabel>Segundo Dado</FormLabel>
                              <Input {...field} />
                            </FormControl>
                          )}
                        </Field>
                        <Field name='chartType'>
                          {({ field, form }) => (
                            <FormControl isInvalid={form.errors.name && form.touched.name}>
                              <FormLabel>Tipo do Chart</FormLabel>
                              <Select {...field} placeholder='Selecione uma opção' >
                                <option value='bar'>Barras</option>
                                <option value='pie'>Pizza</option>
                              </Select>
                            </FormControl>
                          )}
                        </Field>
                        <Field name='editable'>
                          {({ field, form }) => (
                            <FormControl isInvalid={form.errors.name && form.touched.name}>
                              <FormLabel>Editavél</FormLabel>
                              <Select {...field} placeholder='Selecione uma opção' >
                                <option value='true'>Sim</option>
                                <option value='false'>Não</option>
                              </Select>
                            </FormControl>
                          )}
                        </Field>
                        <Button
                          mt={4}
                          colorScheme='teal'
                          isLoading={props.isSubmitting}
                          type='submit'
                        >
                          Submit
                        </Button>
                      </Form>
                    )}
                  </Formik>

                )
                :
                (
                  <Button
                    w={'100%'}
                    pos={'relative'}
                    fontSize={'20px'}
                    marginBottom={'30px'}
                    onClick={() => setAddDado(!addDado)}
                  >
                    +
                  </Button>
                )}

            </Flex>
            <Pagination
              currentPage={currentPage}
              totalCount={dados.length}
              pageSize={PageSize}
              onPageChange={page => setCurrentPage(page)}
            />
          </Flex >
        )
      }
    </>
  )
}


/* -------------------------------------------------------------------------------------------------------------------------------------- */





const genCharts = (surveys, surveyResult) => {

  const charts = [];

  const questions = returnSurveyQuestions(surveys);

  questions.map((question) => {

    Object.entries(question).forEach(([key, value]) => {

      if (value === ('radiogroup' || 'checkbox')) {

        Object.entries(question).forEach(([key2, value2]) => {
          if (key2 === 'title') {

            const titulo = value2;

            Object.entries(question).forEach(([key3, value3]) => {

              if (key3 === 'name') {
                const name = value3;
                const novoChart = {
                  id: charts.length + 1,
                  titulo: titulo,
                  tipoChart: verifyChartType(name, surveys, surveyResult),
                  dado1: name,
                  dado2: '',
                  editar: false,
                }

                charts.push(novoChart);
              }
            })
          }
        })
      }
    })
  })


  return charts;
}

const verifyChartType = (name, surveys, surveyResult) => {

  let chartType = '';

  const questions = returnSurveyQuestions(surveys);

  questions.map((question) => {
    if (question.name === name)
      if (question.choices) {
        if (abrangeTotal(question.name, surveyResult)) chartType = 'pie';
        else chartType = 'bar';
      }
  })


  return chartType;
}

const abrangeTotal = (name, surveyResult) => {

  const total = [];

  surveyResult.map((pessoa) => {

    if (pessoa[name] != "") {
      total.push(pessoa);
    }
  })

  return surveyResult.length === total.length ? true : false;
}

export async function getServerSideProps(context) {
  const client = await clientPromise;
  const db = client.db("SurveyTool");
  const session = await getSession(context);


  if (session) {
    let surveyResults = await db.collection("surveyResults").find({}).toArray();
    let surveys = await db.collection("surveys").find({}).toArray();

    let surveyResult = getSurveyResult(surveyResults);
    let chartsDatas = genCharts(surveys, surveyResult);

    return {
      props: {
        data: chartsDatas,
        surveys: JSON.parse(JSON.stringify(surveys)),
        surveyResults: JSON.parse(JSON.stringify(surveyResults)),
      },
    };

  } else {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };

  }
}

export default Relatorio;




