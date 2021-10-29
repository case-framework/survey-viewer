import React, { useState } from 'react';
import { Survey } from 'survey-engine/lib/data_types';
import Navbar from './components/NavbarComp';
import SimulationSetup from './components/SimulationSetup';
import SurveyLoader, { SurveyFileContent } from './components/SurveyLoader';
import SurveyMenu from './components/SurveyMenu';

interface AppState {
  selectedLanguage?: string;
  languageCodes?: string[];
  surveyKey?: string;
  survey?: Survey;
  screen: Screens;
}

type Screens = 'loader' | 'menu' | 'simulation-setup' | 'simulator';

const initialState: AppState = {
  screen: 'loader',
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    ...initialState
  })

  const onLoadSurvey = (surveyObject: SurveyFileContent) => {
    if (!surveyObject.survey) {
      alert('No survey content found.');
      return;
    }

    const languageCodes = surveyObject.survey.props?.name?.map(o => o.code);
    if (!languageCodes || languageCodes.length < 1) {
      alert('Languages cannot be extracted');
      return;
    }

    const surveyKey = surveyObject.survey.current.surveyDefinition.key;

    setAppState({
      ...initialState,
      selectedLanguage: languageCodes[0],
      languageCodes: languageCodes,
      surveyKey: surveyKey,
      screen: 'menu',
      survey: surveyObject.survey,
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
              <SurveyLoader onSurveyLoaded={onLoadSurvey} />
            </div>
          </div>
        </div>
      case 'menu':
        if (!appState.selectedLanguage || !appState.survey) {
          reset();
          return null;
        }
        return <SurveyMenu
          selectedLangue={appState.selectedLanguage}
          survey={appState.survey}
          onOpenSimulator={() => navigateTo('simulation-setup')}
          onExit={() => {
            reset()
          }}
        />
      case 'simulation-setup':
        return <SimulationSetup />
    }
  }

  return (
    <div className="d-flex flex-column" style={{
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
