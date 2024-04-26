

export function returnSurveyValues(surveys) {
    const arr = []
    surveys.map((survey) => {
        Object.keys(survey).forEach((key) => {

            arr.push(survey[key]);
        })
    })

    return arr;
}

export function returnSurveyPages(surveys) {
    const arr = []
    const values = returnSurveyValues(surveys);

    values.map((value) => {

        Object.keys(value).forEach((key) => {
            
            arr.push(value[key]);
        })

    })

    return arr;
}

export function returnSurveyPagesValues(surveys) {
    const arr = [];
    const pages = returnSurveyPages(surveys);

    pages.map((page) => {
        Object.keys(page).forEach((key) => {
            
            arr.push(page[key]);
        })
    })

    return arr;
}

export function returnSurveyQuestions(surveys) {
    const questions = []
    const pages = returnSurveyPagesValues(surveys);

    pages.map((page) => {

        if (Array.isArray(page)) {

            Object.keys(page).forEach((key) => {
                
                questions.push(page[key]);
            })
        }
    })

    return questions;
}

export const separaChaveValor = (item) => {

    let value = null;
    if (item.includes('='))
        value = item.split(' = ');
    else if (item.includes('>'))
        value = item.split(' > ');
    else if (item.includes('<'))
        value = item.split(' < ');
    else if (item.includes('!='))
        value = item.split(' != ');
    else if (item.includes('=='))
        value = item.split(' == ');
    else if (item.includes('>='))
        value = item.split(' >= ');
    else if (item.includes('<='))
        value = item.split(' <= ');
    else
        value = item.split(' ');

    value[0] = value[0].replace(/[{$}]/g, '');
    value[1] = value[1].replace(/['$']/g, '');

    return value;
}
