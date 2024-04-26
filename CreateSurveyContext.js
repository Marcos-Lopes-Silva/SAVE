import { createContext } from "react";
const survey = {
    title: '',
    description: '',
    respondentes: 0,
    total: 0,
    openDate: '',
    editionDate: '',
    endDate: '',
    status: '',
    pages: [],
};


export const CreateSurveyContext = createContext(survey);