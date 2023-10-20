import React, { useEffect, useState } from 'react';
import { SurveyCard } from 'case-web-ui';
import { LocalizedString, Survey } from 'survey-engine/data_types';
import { Tabs, Tab, Container, Button } from 'react-bootstrap';
import { SurveyContext, SurveySingleItemResponse } from 'survey-engine/data_types';
import SimulationSetup, { defaultSimulatorUIConfig, defaultSurveyContext } from './SimulationSetup';
import SurveySimulator, { SimulatorUIConfig } from './SurveySimulator';
import { CustomSurveyResponseComponent } from 'case-web-ui';
import { ParticipantFlags, PrefillsRegistry, SurveyAndContext } from '../types';
import { format } from 'date-fns';

interface SurveyMenuProps {
    survey: Survey;
    selectedLanguage: string;
    customResponseComponents?: CustomSurveyResponseComponent[]
    participantFlags: ParticipantFlags
    onExit: () => void;
}

const SurveyMenu: React.FC<SurveyMenuProps> = (props) => {

    const [surveyContext, setSurveyContext] = useState<SurveyContext>(defaultSurveyContext);
    const [prefillValues, setPrefillValues] = useState<SurveySingleItemResponse[]>([]);
    const [simulatorUIConfig, setSimulatorUIConfig] = useState<SimulatorUIConfig>(defaultSimulatorUIConfig);
    const [surveyAndContext, setSurveyAndContext] = useState<SurveyAndContext>({
        survey: props.survey,
        context: surveyContext
    });

    // Show survey is used in the reset process. When ShowSurvey is set to false, a timer will 
    const [showSurvey, setShowSurvey] = useState<boolean>(true);

    const [prefillRegistry, SetPrefillRegistry] = useState<PrefillsRegistry>({current: undefined, prefills:[]});

    useEffect(() => {
        if(showSurvey) {
            return;
        }
        const timer = setTimeout(() => setShowSurvey(true), 500);
        return () => clearTimeout(timer);
      }, [showSurvey]);


    const updateRegistry = (registry: PrefillsRegistry) => {
        SetPrefillRegistry(registry);
        if(typeof(registry.current) != "undefined") {
            const e = registry.prefills[registry.current];
            setPrefillValues(e.data);
        } else {
            setPrefillValues([]);
        }
        setShowSurvey(false);
    }

    const handleSaveAsPrefill = (data: SurveySingleItemResponse[]) => {
        const name = 'response_'+ format(Date.now(), 'yyyy-MM-dd hh:mm:ss');
        const n = prefillRegistry.prefills.push({name: name, data: data});
        prefillRegistry.current = n - 1;
        updateRegistry({'current': n-1, prefills: prefillRegistry.prefills });
    }
    
    const handleReset = () => {
        console.log('reset');
        setSurveyAndContext({survey: props.survey, context: surveyContext});
        setShowSurvey(false);
    };

    const surveyDefinition = props.survey.surveyDefinition;

    return <Container className='mt-1 mx-1' fluid={true}>
        <Tabs defaultActiveKey="simulator" id="survey-menu" className="mb-1">
            <Tab eventKey="simulator" title="Simulator">
                {showSurvey ?
                <SurveySimulator
                    config={simulatorUIConfig}
                    surveyAndContext={surveyAndContext}
                    prefills={prefillValues}
                    selectedLanguage={props.selectedLanguage}
                    onExit={() => props.onExit()}
                    onReset={handleReset}
                    customResponseComponents={props.customResponseComponents}
                    onSaveAsPrefill={handleSaveAsPrefill}
                />:
                    <Button variant='info'  onClick={()=>setShowSurvey(true)}>Restart the survey</Button>
                }
            </Tab>
            <Tab eventKey="simulator-setup" title="Simulator Setup">
                <SimulationSetup
                    participantFlags={props.participantFlags}
                    prefillRegistry={prefillRegistry}
                    onPrefillChanged={(r: PrefillsRegistry) => {
                        updateRegistry(r);
                    }}
                    currentSurveyContext={surveyContext}
                    onSurveyContextChanged={(config) => setSurveyContext(config)}
                    currentSimulatorUIConfig={simulatorUIConfig}
                    onSimulatorUIConfigChanged={(config) => setSimulatorUIConfig(config)}
                />
            </Tab>
        </Tabs>
    </Container>;
};

export default SurveyMenu;
