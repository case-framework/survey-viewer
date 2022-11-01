import { SurveyGroupItem, Survey } from "survey-engine/data_types"

export const getSurveyDefinition = (survey:Survey): SurveyGroupItem => {
    return survey.current.surveyDefinition;
}