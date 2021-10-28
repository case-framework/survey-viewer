import React from 'react';
import Navbar from './components/NavbarComp';
import SurveyLoader from './components/SurveyLoader';

const App: React.FC = () => {

  return (
    <div>
      <Navbar
        surveyName={"weekly"}
        selectedLanguage={"en"}
        languagecodes={["en", "nl"]}
      />
      <div className="mt-4 p-3">
        <SurveyLoader onSurveyLoaded={(content) => {
          console.log(content);
        }} />
      </div>
    </div>
  )
}

export default App;
