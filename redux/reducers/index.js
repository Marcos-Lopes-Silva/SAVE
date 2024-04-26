import { UPDATE_SURVEY } from '../actions';

const initialState = {
  survey: {
    title: '',
    description: '',
    respondentes: 0,
    total: 0,
    openDate: '',
    editionDate: '',
    endDate: '',
    status: '',
    completeMessage: '',
    pages: [],
  },
};

export default function surveyReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_SURVEY:
      return {
        ...state,
        survey: {...state.survey, ...action.survey}
      };
    default:
      return state;
  }
}