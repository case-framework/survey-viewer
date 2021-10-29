import { AlertBox, SurveyView } from 'case-web-ui';
import React from 'react';
import { Survey, SurveyContext } from 'survey-engine/lib/data_types';

export interface SurveyUILabels {
    backBtn: string;
    nextBtn: string;
    submitBtn: string;
    invalidResponseText: string;
    noSurveyLoaded: string;
}

interface SurveySimulatorProps {
    texts: SurveyUILabels;
    surveyAndContext?: {
        survey: Survey;
        context: SurveyContext;
    }
    selectedLanguage?: string;
    onExit: () => void;
}

const SurveySimulator: React.FC<SurveySimulatorProps> = (props) => {
    return (
        <div className="container-fluid">
            <div className="container py-3">
                <div className="row">
                    <div className="col-12 col-lg-8 offset-lg-2"
                        style={{ minHeight: '70vh' }}
                    >
                        {props.surveyAndContext ?
                            <SurveyView
                                loading={false}
                                survey={props.surveyAndContext.survey}
                                context={props.surveyAndContext.context}
                                languageCode={props.selectedLanguage ? props.selectedLanguage : 'en'}
                                onSubmit={() => alert('TODO')}
                                nextBtnText={props.texts.nextBtn}
                                backBtnText={props.texts.backBtn}
                                submitBtnText={props.texts.submitBtn}
                                invalidResponseText={props.texts.invalidResponseText}
                            /> :
                            <AlertBox type="danger"
                                useIcon={true}
                                content={props.texts.noSurveyLoaded}
                            />
                        }
                    </div>
                </div>
            </div>
            <div className="row border-grey-2 border-top-2">
                <div className="col">
                    <button
                        disabled
                        className="btn btn-secondary mt-2 me-2">
                        Save Current Survey State
                    </button>

                    <button
                        className="btn btn-warning mt-2"
                        onClick={() => {
                            if (window.confirm('Do you want to exit the simulator (will lose current state)?')) {
                                props.onExit()
                            }
                        }}
                    >
                        Exit Simulator
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SurveySimulator;
