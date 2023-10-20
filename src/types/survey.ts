
import { Survey, SurveyContext, SurveySingleItemResponse } from 'survey-engine/data_types';

export interface SurveyAndContext {
    survey: Survey;
    context: SurveyContext;
}

export interface PrefillEntry {
    name: string;
    data: SurveySingleItemResponse[]
}

export interface PrefillsRegistry {
    current?: number;
    prefills: PrefillEntry[]
}
