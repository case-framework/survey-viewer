import { SurveyCard,  } from 'case-web-ui';
import React, { useState } from 'react';
import { Card, CardBody} from 'react-bootstrap';
import { Survey, LocalizedString } from 'survey-engine/data_types';

interface SurveyInfoProps {
    survey: Survey;
    languageCode?: string;
}

const SurveyInfo: React.FC<SurveyInfoProps> = (props) => {
    const [showDetails, setShowDetails] = useState<boolean>(false);
    const surveyDefinition = props.survey.surveyDefinition;
    const surveyProps = props.survey.props;
    const surveyCard = surveyProps ? <SurveyCard
                        details={{
                            surveyInfos: {
                                name: surveyProps.name as LocalizedString[],
                                description: surveyProps.description as LocalizedString[],
                                typicalDuration: surveyProps.typicalDuration as LocalizedString[],
                                studyKey: '',
                                surveyKey: surveyDefinition.key,
                            },
                            studyKey: '',
                            surveyKey: surveyDefinition.key,
                            profiles: [],
                            category: 'normal'
                        }}
                        selectedLanguage={props.languageCode}
                        avatars={[]}
                    /> : '';

    return (
            <Card className='mb-1'>
            <CardBody className='py-1'>
                <small className='float-end'><a href="#" onClick={()=>setShowDetails(!showDetails)}>Toggle info</a></small>
                <h3 className="text-center">Survey <strong>{surveyDefinition.key}</strong></h3>
                {showDetails ? (
                    <div>
                        {surveyCard}
                    </div>
                ) : ''}
            </CardBody>
        </Card>
    );
};

export default SurveyInfo;