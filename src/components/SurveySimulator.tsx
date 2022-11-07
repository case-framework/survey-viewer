import { AlertBox, SurveyView, Dialog, DialogBtn } from 'case-web-ui';
import React, { useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { Survey, SurveyContext, SurveySingleItemResponse } from 'survey-engine/data_types';

import { nl, nlBE, fr, de, it, da, es, pt } from 'date-fns/locale';
import { CustomSurveyResponseComponent } from 'case-web-ui/build/components/survey/SurveySingleItemView/ResponseComponent/ResponseComponent';

const dateLocales = [
    { code: 'nl', locale: nl, format: 'dd-MM-yyyy' },
    { code: 'nl-be', locale: nlBE, format: 'dd.MM.yyyy' },
    { code: 'fr-be', locale: fr, format: 'dd.MM.yyyy' },
    { code: 'de-be', locale: de, format: 'dd.MM.yyyy' },
    { code: 'it', locale: it, format: 'dd/MM/yyyy' },
    { code: 'fr', locale: fr, format: 'dd/MM/yyyy'},
    { code: 'dk', locale: da, format: 'dd/MM/yyyy'},
    { code: 'es', locale: es, format: 'dd/MM/yyyy'},
    { code: 'pt', locale: pt, format: 'dd/MM/yyyy'},
];

export interface SurveyUILabels {
    backBtn: string;
    nextBtn: string;
    submitBtn: string;
    invalidResponseText: string;
    noSurveyLoaded: string;
}

export interface SimulatorUIConfig {
    texts: SurveyUILabels;
    showKeys: boolean;
}

interface SurveySimulatorProps {
    config: SimulatorUIConfig;
    surveyAndContext?: {
        survey: Survey;
        context: SurveyContext;
    };
    prefills?: SurveySingleItemResponse[];
    selectedLanguage?: string;
    customResponseComponents?:CustomSurveyResponseComponent[]
    onExit: () => void;
}

const SurveySimulator: React.FC<SurveySimulatorProps> = (props) => {
    const [openSurveyEndDialog, setOpenSurveyEndDialog] = useState(false);
    const [surveyResponseData, setSurveyResponseData] = useState<SurveySingleItemResponse[]>([]);

    const surveySubmitDialog = <Dialog
        title="Survey Finished"
        onClose={() => {
            setSurveyResponseData([]);
            setOpenSurveyEndDialog(false);
            props.onExit();
        }}
        open={openSurveyEndDialog}
        ariaLabelledBy="title"
    >
        <div className="px-3 py-2a">
            <p>Survey finished. What do you want to do next?</p>
            <DialogBtn
                className="me-2"
                onClick={() => {
                    setSurveyResponseData([]);
                    setOpenSurveyEndDialog(false);
                    props.onExit();
                }}
                label="Exit without Save"
                outlined={true}
            />
            <DialogBtn
                onClick={() => {

                    const exportData = surveyResponseData;
                    var a = document.createElement("a");
                    var file = new Blob([JSON.stringify(exportData, undefined, 2)], { type: 'json' });
                    a.href = URL.createObjectURL(file);
                    a.download = `${props.surveyAndContext?.survey.surveyDefinition.key}_responses_${(new Date()).toLocaleDateString()}.json`;
                    a.click();

                    setSurveyResponseData([]);
                    setOpenSurveyEndDialog(false)
                    props.onExit()
                }}
                label="Save and Exit"
            />
        </div>

    </Dialog>

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
                                showKeys={props.config.showKeys}
                                survey={props.surveyAndContext.survey}
                                context={props.surveyAndContext.context}
                                prefills={props.prefills}
                                languageCode={props.selectedLanguage ? props.selectedLanguage : 'en'}
                                onSubmit={(responses,) => {
                                    setSurveyResponseData(responses.slice())
                                    setOpenSurveyEndDialog(true);
                                }}
                                nextBtnText={props.config.texts.nextBtn}
                                backBtnText={props.config.texts.backBtn}
                                submitBtnText={props.config.texts.submitBtn}
                                invalidResponseText={props.config.texts.invalidResponseText}
                                dateLocales={dateLocales}
                                customResponseComponents={props.customResponseComponents}
                            /> :
                            <AlertBox type="danger"
                                useIcon={true}
                                content={props.config.texts.noSurveyLoaded}
                            />
                        }
                    </div>
                </div>
            </div>
            {surveySubmitDialog}
        </div >
    );
};

export default SurveySimulator;
