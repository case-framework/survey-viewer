import React, { useState } from 'react';
import { Survey } from 'survey-engine/data_types';
import Navbar from './components/NavbarComp';
import SurveyLoader from './components/SurveyLoader';
import SurveyMenu from './components/SurveyMenu';
import SurveyServiceLoader from './components/SurveyServiceLoader';
import { registerCustomComponents, registerParticipantFlags } from './localConfig';
interface AppState {
  selectedLanguage?: string;
  languageCodes?: string[];
  surveyKey?: string;
  survey?: Survey;
  screen: Screens;
}

const customResponseComponents = registerCustomComponents();
const participantFlags = registerParticipantFlags();

type Screens = 'loader' | 'menu';

const initialState: AppState = {
  screen: 'loader',
}

const surveyProviderUrl = process.env.REACT_APP_SURVEY_URL ?? "";

console.log("Using provider "+ surveyProviderUrl);

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    ...initialState
  })

  const onLoadSurvey = (surveyObject: Survey) => {
    if (!surveyObject) {
      alert('No survey content found.');
      return;
    }

    const languageCodes = surveyObject.props?.name?.map(o => o.code);
    if (!languageCodes || languageCodes.length < 1) {
      alert('Languages cannot be extracted');
      return;
    }

    const surveyDef = surveyObject.surveyDefinition;

    const surveyKey = surveyDef.key;

    setAppState({
      ...initialState,
      selectedLanguage: languageCodes[0],
      languageCodes: languageCodes,
      surveyKey: surveyKey,
      screen: 'menu',
      survey: surveyObject
    })
  }

  const navigateTo = (screen: Screens) => {
    setAppState(prev => {
      return {
        ...prev,
        screen: screen
      }
    })
  }

  const reset = () => {
    setAppState({ ...initialState })
  }

  const pageContent = () => {
    switch (appState.screen) {
      case 'loader':
        return <div className="container d-flex align-items-center h-100" style={{
          minHeight: '70vh'
        }}>
          <div className="row flex-grow-1">
            <div className="col-12">
            <SurveyLoader onSurveyLoaded={onLoadSurvey}/>
            {
                surveyProviderUrl ? <SurveyServiceLoader onSurveyLoaded={onLoadSurvey} surveyProviderUrl={surveyProviderUrl} /> : null
            }
            </div>
          </div>
        </div>
        
      case 'menu':
        if (!appState.selectedLanguage || !appState.survey) {
          reset();
          return null;
        }
        return <SurveyMenu
          participantFlags={participantFlags}
          selectedLanguage={appState.selectedLanguage}
          survey={appState.survey}
          customResponseComponents={customResponseComponents}
          onExit={() => {
            reset()
          }}
        />
    }
  }
  

  return (
    <div className="d-flex flex-column overflow-scroll" style={{
      minHeight: '100vh'
    }}>
      <Navbar
        surveyName={appState.surveyKey}
        selectedLanguage={appState.selectedLanguage}
        languagecodes={appState.languageCodes}
        onSelectLanguage={(code) => {
          setAppState(prev => {
            return {
              ...prev,
              selectedLanguage: code
            }
          })
        }}
      />
      <div className="flex-grow-1">
        {pageContent()}
      </div>
      <footer className="text-center py-2">
        Version: {process.env.REACT_APP_VERSION}
      </footer>
    </div>
  )
}

export default App;
