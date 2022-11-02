import React from 'react';
import { SurveyCard } from 'case-web-ui';
import { LocalizedString, Survey } from 'survey-engine/data_types';
import { getSurveyDefinition } from '../utils/survey';

interface SurveyMenuProps {
    survey: Survey;
    selectedLangue: string;
    onOpenSimulator: () => void;
    onExit: () => void;
}

const SurveyMenu: React.FC<SurveyMenuProps> = (props) => {

    const surveyDefinition = getSurveyDefinition(props.survey);

    return (
        <div className="container mt-3">
            <div className="row">
                <div className="col-sm-4 mb-3">
                    <h2>Actions</h2>
                    <div>
                        <button disabled className="btn btn-primary w-100 mb-2">
                            Overview
                        </button>
                    </div>
                    <div>
                        <button className="btn btn-primary w-100 mb-2"
                            onClick={() => props.onOpenSimulator()}
                        >
                            Simulator
                        </button>
                    </div>
                    <div>
                        <button className="btn btn-warning w-100"
                            onClick={() => {
                                if (window.confirm('Are you sure you want to close this survey?')) {
                                    props.onExit()
                                }
                            }}
                        >
                            Exit
                        </button>
                    </div>
                </div>
                <div className="col-sm-8 mb-3">
                    <h2>Infos</h2>
                    <h3>Survey Card</h3>
                    {
                        props.survey.props ? <SurveyCard
                            details={{
                                surveyInfos: {
                                    name: props.survey.props.name as LocalizedString[],
                                    description: props.survey.props.description as LocalizedString[],
                                    typicalDuration: props.survey.props.typicalDuration as LocalizedString[],
                                    studyKey: '',
                                    surveyKey: surveyDefinition.key,
                                },
                                studyKey: '',
                                surveyKey: surveyDefinition.key,
                                profiles: [],
                                category: 'normal'
                            }}
                            selectedLanguage={props.selectedLangue}
                            avatars={[]}
                        /> : null
                    }

                </div>

            </div>

        </div>
    );
};

export default SurveyMenu;
