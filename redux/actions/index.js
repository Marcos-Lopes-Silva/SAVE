export const UPDATE_SURVEY = 'UPDATE_SURVEY';

export function updateSurvey(survey) {
  return { type: UPDATE_SURVEY, survey };
}