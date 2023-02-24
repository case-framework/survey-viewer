import React, {  useState }  from 'react';
import { SurveyCard } from 'case-web-ui';
import { LocalizedString, Survey } from 'survey-engine/data_types';
import { Tabs, Tab, Container } from 'react-bootstrap';
import { SurveyContext, SurveySingleItemResponse } from 'survey-engine/data_types';
import SimulationSetup, { defaultSimulatorUIConfig, defaultSurveyContext } from './SimulationSetup';
import SurveySimulator, { SimulatorUIConfig } from './SurveySimulator';
import { CustomSurveyResponseComponent } from 'case-web-ui';

interface SurveyMenuProps {
    survey: Survey;
    selectedLanguage: string;
    customResponseComponents?:CustomSurveyResponseComponent[]
    onExit: () => void;
}

const SurveyMenu: React.FC<SurveyMenuProps> = (props) => {

    const [surveyContext, setSurveyContext] = useState<SurveyContext>(defaultSurveyContext);
    const [prefillValues, setPrefillValues] = useState<SurveySingleItemResponse[]>([]);
    const [ simulatorUIConfig, setSimulatorUIConfig ] = useState<SimulatorUIConfig>(defaultSimulatorUIConfig);
    const [ prefillsFile, setprefillFile] = useState<File|undefined>(undefined);
      
    const surveyDefinition = props.survey.surveyDefinition;

    return <Container className='mt-1 mx-1' fluid={true}>
        <Tabs defaultActiveKey="simulator" id="survey-menu" className="mb-1">
            <Tab eventKey="simulator" title="Simulator">
                <SurveySimulator
                    config={simulatorUIConfig}
                    surveyAndContext={{
                        survey: props.survey,
                        context: surveyContext
                        }}
                    prefills={prefillValues}
                    selectedLanguage={props.selectedLanguage}
                    onExit={() => props.onExit()}
                    customResponseComponents={props.customResponseComponents}
                    />
            </Tab>
            <Tab eventKey="simulator-setup" title="Simulator Setup">
                <SimulationSetup
                    prefillsFile={prefillsFile}
                    onPrefillChanged={(file?: File) => {
                        if (file) {
                        const reader = new FileReader()

                        reader.onabort = () => console.log('file reading was aborted')
                        reader.onerror = () => console.log('file reading has failed')
                        reader.onload = () => {
                            // Do whatever you want with the file contents
                            const res = reader.result;
                            if (!res || typeof (res) !== 'string') {
                            console.error('TODO: handle file upload error')
                            return;
                            }
                            const content = JSON.parse(res);
                            setprefillFile(file);
                            setPrefillValues(content);
                            
                        }
                        reader.readAsText(file)
                        } else {
                            setprefillFile(file);
                            setPrefillValues([]);
                        }

                    }}
                    currentSurveyContext={surveyContext}
                    onSurveyContextChanged={(config) => setSurveyContext(config)}
                    currentSimulatorUIConfig={simulatorUIConfig}
                    onSimulatorUIConfigChanged={(config) => setSimulatorUIConfig(config)}
                />
            </Tab>
            <Tab eventKey="info" title="Survey Infos" className='p-2'>
                    <h2>Survey Infos</h2>
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
                            selectedLanguage={props.selectedLanguage}
                            avatars={[]}
                        /> : null
                    }
            </Tab>
        </Tabs>
    </Container>;
};

export default SurveyMenu;
