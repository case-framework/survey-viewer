import { AlertBox, SurveyView } from 'case-web-ui';
import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
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
            <div className="container pt-3">
                <div className="row">
                    <DropdownButton
                        id={`simulator-menu`}
                        //size="sm"
                        variant="secondary"
                        title="Menu"
                        onSelect={(eventKey) => {
                            switch (eventKey) {
                                case 'save':
                                    break;
                                case 'exit':
                                    if (window.confirm('Do you want to exit the simulator (will lose state)?')) {
                                        props.onExit();
                                    }
                                    break;
                            }
                        }}
                    >
                        <Dropdown.Item
                            disabled
                            eventKey="save">Save Current Survey State</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item eventKey="exit">Exit Simulator</Dropdown.Item>
                    </DropdownButton>
                </div>
                <div className="row">
                    <div className="col-12 col-lg-8 offset-lg-2"
                    //style={{ minHeight: 'calc()' }}
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
        </div >
    );
};

export default SurveySimulator;
