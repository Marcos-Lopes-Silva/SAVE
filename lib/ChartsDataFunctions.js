import { returnSurveyPages } from "./ManipulaJSON";
import { capitalizeWords } from "./FuncoesAux";
const _ = require('underscore')

export const calculaObjetos = (objetos, valueText, _) => {
    const counter = {};
    objetos.forEach(obj => {
        valueText.forEach(vT => {

            const groupValue = obj[vT.value];

            if (groupValue === "Sim") {

                if (!counter[vT.value]) {
                    counter[vT.value] = {};
                    counter[vT.value]['name'] = vT.text;
                    counter[vT.value]['value'] = 1;

                    // if(vT.value.includes('[SQ')) {
                    //     let tmp = vT.value.replace(']', '');
                    //     tmp = tmp.concat('comment]');
                    //     tmp = obj[tmp];
                    //     const ocorrencias = (tmp.match(/, A-Z/g) || tmp.match(/ e A-Z/g) || []).length;
                    //     counter[vT.value]['value'] += ocorrencias - 1;
                    // }  
                } else {
                    counter[vT.value]['value'] += 1;
                }
            }
            // counter[groupValue][value] = (counter[groupValue][value] || 0) + (value ? 1 : 0);
        })
    });
    return Object.values(counter);
}

export const separaAnd = (values) => {
    if (values[1] === 'and') return true;
    return false;
}

export const buscaObjetos = (objeto, arr) => {

    const array = [];

    const [chave, valor] = arr;

    if (Array.isArray(chave)) {
        const [vetor1, _, vetor2] = arr

        const [chave1, valor1] = vetor1;
        const [chave2, valor2] = vetor2;

        objeto.forEach((value) => {
            if (isNaN(valor1)) {
                
                if (value[chave1] === valor1) {
                    if (value[chave2] === valor2) {
                        array.push(value);
                    }
                }
            } else {
                
                if ((value[chave1] > valor1) || (value[chave1] < valor1)) {
                    if ((value[chave2] > valor2) || (value[chave2] < valor2) || (value[chave2] === valor2)) {
                        array.push(value);
                    }
                }
            }

        })


        return array;
    }

    objeto.forEach((value) => {

        if (value[chave] === valor) {
            if (value[chave] !== '' && value[chave] !== undefined && value[chave] !== null)
                array.push(value)
        } else if (valor == 'notempty') {
            if (value[chave] !== '' && value[chave] !== undefined && value[chave] !== null)
                array.push(value)
        }
    });

    return array;
}



export function isConditional(objeto, dado2) {

    let bool = false;

    objeto.forEach((value) => {
        if (_.get(value, dado2) === ('Sim' || 'Não')) {
            bool = true
        }
    })

    return bool;
}

export function countWithConditional(objeto, key, key2) {
    const counter = {};
    objeto.forEach(obj => {
        const groupValue = obj[key];

        if (!counter[groupValue]) {
            counter[groupValue] = {};
            counter[groupValue]['name'] = groupValue;
            counter[groupValue]['Sim'] = 0;
            counter[groupValue]['Não'] = 0;
        }

        const value = obj[key2];
        counter[groupValue][value] = (counter[groupValue][value] || 0) + (value ? 1 : 0);
    });
    return Object.values(counter);
}



export function countByKeys(jsonArray, groupByKey, countKeys) {
    const counter = {};
    jsonArray.forEach(obj => {
        const groupValue = obj[groupByKey];

        if (!countKeys) {
            counter[groupValue] = {};
            counter[groupValue]['name'] = groupValue;
        }

        if (!counter[groupValue]) {
            counter[groupValue] = {};
            counter[groupValue]['name'] = groupValue;
        }

        countKeys.forEach(key => {
            const value = obj[key];
            counter[groupValue][value] = (counter[groupValue][value] || 0) + (value ? 1 : 0);
        });
    });
    console.log(counter)
    return Object.values(counter);
}

export function countByKey(jsonArray, groupByKey) {
    const ocorrencias = {};
    if (Array.isArray(jsonArray))
        jsonArray.forEach(obj => {
            if (obj[groupByKey] !== '' && obj[groupByKey] !== 'other') {
                const groupValue = obj[groupByKey];

                if (ocorrencias[groupValue]) {
                    ocorrencias[groupValue].value += 1;
                } else {
                    ocorrencias[groupValue] = { name: groupValue, value: 1 };
                }
            } else if (obj[groupByKey] === 'other') {
                if (obj[groupByKey.concat('[other]')] !== '') {

                    if (ocorrencias['Outros']) {
                        ocorrencias['Outros'].value += 1;
                    } else {
                        ocorrencias['Outros'] = { name: 'Outros', value: 1 };
                    }
                }
            }
        });
    else {
        if (jsonArray[groupByKey] !== '' && jsonArray[groupByKey] !== 'other') {
            const groupValue = jsonArray[groupByKey];

            if (ocorrencias[groupValue]) {
                ocorrencias[groupValue].value += 1;
            } else {
                ocorrencias[groupValue] = { name: groupValue, value: 1 };
            }
        } else if (jsonArray[groupByKey] === 'other') {
            if (jsonArray[groupByKey.concat('[other]')] !== '') {

                if (ocorrencias['Outros']) {
                    ocorrencias['Outros'].value += 1;
                } else {
                    ocorrencias['Outros'] = { name: 'Outros', value: 1 };
                }
            }
        }
    }
    return Object.values(ocorrencias);
}


export const listaFiltros = (tipo, surveys) => {
    let index = 0;
    let filtros = [];

    filtros[index] = 'Selecione um';
    index++;

    const itens = returnSurveyPages(surveys);


    itens.map((item) => {
        Object.entries(item).forEach(([key2, value2]) => {
            if (key2 === 'title') {
                filtros[index] = value2;
                index++;
            }
        }
        )
    })

    if (tipo === 1) {
        const filtrosParaOrganização = filtros;

        for (let i in filtrosParaOrganização) {
            if (filtrosParaOrganização[i] !== 'Selecione um')
                filtrosParaOrganização[i] = capitalizeWords(filtrosParaOrganização[i]);
            else filtrosParaOrganização.splice(i, 1);
        }

        return filtrosParaOrganização;
    } else {

        for (let i in filtros) {
            const indice = filtros[i].indexOf(' - ');
            if (indice !== -1) {
                const parte1 = filtros[i].substring(0, indice);
                filtros[i] = parte1;
            }
        }

        for (let i in filtros) {
            if (filtros[i] !== 'Selecione um')
                filtros[i] = capitalizeWords(filtros[i]);
        }


        filtros = filtros.filter((item, index) => {
            return filtros.indexOf(item) === index;
        })

        return filtros;
    }
}

