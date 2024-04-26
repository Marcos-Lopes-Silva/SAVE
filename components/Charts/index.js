import {
    Box, HStack, Button, Icon, Text, Stack, Collapse, Input
} from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons';
import { useState, useEffect, useRef, useCallback } from 'react';
import Chart from './Chart';
import { toPng } from 'html-to-image';
import { format } from 'date-fns';
import { returnSurveyQuestions, separaChaveValor, returnSurveyPages } from '../../lib/ManipulaJSON';
import { calculaObjetos, countByKey, buscaObjetos, countByKeys, countWithConditional, isConditional, separaAnd } from '../../lib/ChartsDataFunctions';
const _ = require('underscore')
import PDF from '../../pages/pdf';

const Charts = ({ surveyResult, dado1, dado2, tipoChart, editavel, title, surveys }) => {

    const [isEditing, setEditing] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [dataKey, setDataKey] = useState([]);
    const [isLoaded, setLoaded] = useState(false);
    const ref = useRef(null);


    let dataKey3 = '';
    let dataKey4 = '';

    const getFileName = (fileType) => `${format(new Date(), `'${title}' -"dd-MM-yy"`)}.${fileType}`
    const complex = verificaComplexidade(surveys, dado1);

    const downloadPng = useCallback(() => {
        setExporting(true)
        if (ref.current === null) {
            setExporting(false)
            return
        }
        toPng(ref.current, { cacheBust: true, })
            .then((dataUrl) => {
                const link = document.createElement('a')
                link.download = `${getFileName('png')}`
                link.href = dataUrl
                link.click()
            })
            .catch((err) => {
                console.log(err)
            })

        setExporting(false)
    }, [ref]);

    const geraPDF = () => {
        
        setExporting(true);
        // const element = ref.current;
        // const canvas = await html2canvas(element);
        // const data = canvas.toDataURL('image/png');

        // const pdf = new jsPDF();
        // const imgProperties = pdf.getImageProperties(data);
        // const pdfWidth = pdf.internal.pageSize.getWidth();
        // const pdfHeight =
        //     (imgProperties.height * pdfWidth) / imgProperties.width;

        // pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
        // console.log(pdf.save('print.pdf'));
        // setExporting(false);
    };


    useEffect(() => {

        if (dado2 !== '') {
            getDataKey(surveyResult, dado2, setDataKey);
        }

        setLoaded(true);
    }, [])

    const objInfos = {
        data: separaDadosnoJSON(complex, dado1, dado2, surveyResult, dataKey3),
        dataKey: dataKey[0],
        dataKey2: dataKey[1]
    }

    const renderEdit = () => {
        return (
            <Collapse in={isEditing} animateOpacity visibility={isEditing ? 'visible' : 'hidden'} >
                <Stack spacing={3}>
                    <Input variant='filled' placeholder='Titulo' onChange={(e) => handleChange(e, 'titulo')} />
                    <Input variant='filled' placeholder='Primeiro dado a relacionar' onChange={(e) => handleChange(e, '1')} />
                    <Input variant='filled' placeholder='Segundo dado a relacionar' onChange={(e) => handleChange(e, '2')} />
                    <Input variant='filled' placeholder='Tipo de gráfico' onChange={(e) => handleChange(e, 'tipo')} />
                </Stack>
                <Button marginTop={'10px'} onClick={() => setEditing(false)}>Salvar</Button>
            </Collapse>
        )
    }

    const renderShape = () => {

        return (
            <>
                {exporting ? (
                    <PDF>
                        <Box ref={ref} h={'auto'} maxH={'900px'} width={'100%'} maxW={'1000px'} borderRadius={'11px'} display={'flex'} flexDir={'column'} marginBottom={'10px'} border={'2px solid'}>
                            <Text alignSelf={'center'} h={'auto'} backgroundColor={'black'} textColor={'white'} borderTopLeftRadius={'9px'} borderBottomRightRadius={'9px'} width={'550px'} maxW={'550px'} marginBottom={5}>{title}</Text >
                            <Box alignSelf={'center'} gridRow={2} minW={'80%'} w={`${objInfos.data.length * 7}%`} h={550} maxW={tipoChart === 'radar' ? '900px' : '1fr'} >
                                <Chart type={tipoChart} data={objInfos.data} dataKey={tipoChart === 'bar' && dado2 === '' ? 'value' : objInfos.dataKey} dataKey2={objInfos.dataKey2} dataKey3={dataKey3} dataKey4={dataKey4} />
                            </Box>
                        </Box>
                    </PDF>
                )
                    : (
                        <Box ref={ref} h={'auto'} maxH={'900px'} width={'100%'} maxW={'1000px'} borderRadius={'11px'} display={'flex'} flexDir={'column'} marginBottom={'10px'} border={'2px solid'}>
                            <Text alignSelf={'center'} h={'auto'} backgroundColor={'black'} textColor={'white'} borderTopLeftRadius={'9px'} borderBottomRightRadius={'9px'} width={'550px'} maxW={'550px'} marginBottom={5}>{title}</Text >
                            <Box alignSelf={'center'} gridRow={2} minW={'80%'} w={`${objInfos.data.length * 7}%`} h={550} maxW={tipoChart === 'radar' ? '900px' : '1fr'} >
                                <Chart type={tipoChart} data={objInfos.data} dataKey={tipoChart === 'bar' && dado2 === '' ? 'value' : objInfos.dataKey} dataKey2={objInfos.dataKey2} dataKey3={dataKey3} dataKey4={dataKey4} />
                            </Box>

                            {
                                exporting ? null : (

                                    <HStack spacing={4}>
                                        <Button onClick={downloadPng}>Generate PNG</Button>
                                        <Button onClick={geraPDF}>Generate PDF</Button>
                                        {
                                            editavel ? (
                                                <Button cursor={'pointer'} onClick={() => setEditing(true)} >
                                                    <Icon as={EditIcon} color={'green.100'} marginRight={3} />
                                                    Editar
                                                </Button>) : null
                                        }
                                    </HStack>
                                )

                            }
                        </Box >
                    )
                }
            </>)
    }


















    return (
        <>
            {isLoaded && isEditing ? renderEdit() : renderShape()}
        </>
    )
}


/*
------------------------------------------------------Funções Auxiliares de busca-------------------------------------------------------------------------------
*/


function getDataKey(surveyResult, dado2, setDataKey) {
    const map = surveyResult;
    let dado = []

    map.forEach((value) => {
        if (value[dado2]) {
            dado.push(value[dado2])
        }
    })

    let dadonovo = []
    dado.forEach((value) => {

        if (value !== dado[1]) {
            dadonovo.push(value)
        }
    })

    dado = dado.filter((value) => value !== dadonovo[0])
    console.log(dado, dadonovo)
    setDataKey([dado[0], dadonovo[0]])
}

function separaDadosnoJSON(complex, dado1, dado2, surveyResult) {

    if (complex) {
        
        let obj = [];

        complex.map((value) => {
            if (Array.isArray(value)) {
                if (value.length > 0) {

                    value.map((value) => {
                        if (typeof value === 'object') obj[obj.length] = value;

                    })
                }
            }
        });

        if (separaAnd(complex)) {

            let arr = buscaObjetos(surveyResult, complex);

            arr = countByKey(arr, dado1);

            return arr;

        } else if (dado2 === '') {

            let arr = buscaObjetos(surveyResult, complex);

            if (obj.length > 0) {

                arr = calculaObjetos(arr, obj, dado1)

                return arr;

            } else {
                arr = countByKey(arr, dado1);

                return arr;
            }

        }
    }

    if (dado2 === '') {
        
        let array = countByKey(surveyResult, dado1);

        return array;

    } else if (isConditional(surveyResult, dado2)) {
        
        let array = countWithConditional(surveyResult, dado1, dado2);

        return array;
    } else {
        
        let array = countByKeys(surveyResult, dado1, [dado2]);

        return array;
    }

}


/* 
params: surveys, dado1, dado2
return: array com os dados de complexidade, no caso os itens necessários para verificação, eg. ['fezestagio = true', 'and', 'qtdestagios > 1']
        ou null caso não haja complexidade
isObject = um array para verificar se o dado é um objeto, eg. [{value: 'fezestagio', text: 'Fez estágio'}]
visibleIf = uma variável para armazenar uma string com o valor do visibleIf, o visibleIf é um campo existente em algumas questões que tornam 
        ela visível apenas se a condição for atendida
*/

const verificaComplexidade = (surveys, dado1) => {

    let isObject = [];
    let visibleIf = '';

    const questions = returnSurveyQuestions(surveys);

    questions.map((question) => {
        if (question.name === dado1) {
            if (Array.isArray(question.choices))
                question.choices.map((choices) => {
                    if (typeof choices === 'object') {
                        isObject.push({ value: choices.value, text: choices.text });
                    }
                })
            if (question.visibleIf) visibleIf = question.visibleIf;
        }
    })


    if (visibleIf === '' || visibleIf === null || visibleIf === undefined) return null;

    if (visibleIf.includes('and')) {
        const value = visibleIf.split(' and ');

        value[0] = value[0].replace(/[{$}]/g, '');

        value[1] = value[1].replace(/[{$}]/g, '');

        const value1 = separaChaveValor(value[0]);
        const value2 = separaChaveValor(value[1]);

        if (isObject.length !== 0) return [value1, 'and', value2, isObject];

        return [value1, 'and', value2];
    }

    visibleIf = separaChaveValor(visibleIf);
    visibleIf.push(isObject);

    return visibleIf;
}


export default Charts;