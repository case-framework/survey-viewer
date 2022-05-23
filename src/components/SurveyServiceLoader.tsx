import { Survey } from 'survey-engine/data_types';
import Card from './Card';
import { Button, ListGroup } from 'react-bootstrap';
import useLoadJSON from '../hooks/useLoadJSON';

export interface SurveyFileContent {
    studyKey: string;
    survey: Survey;
}

interface SurveyDescription {
    id: string // Id to load the survey
    label: string
    description: string
}

interface SurveyLoaderProps {
    surveyProviderUrl: string
    onSurveyLoaded: (surveyFileContent: SurveyFileContent) => void;
}

interface SurveyListUIText {
    load: string
}

interface SurveyListProps {
    surveys: SurveyDescription[]
    texts: SurveyListUIText
    onSelectItem: (code: string) => void;
}

const SurveyList: React.FC<SurveyListProps> = (props) => {

    const surveySelector= (survey: SurveyDescription) => {
        return (
            <ListGroup.Item>
                <h5>{survey.label}</h5>
                <div className="text">{survey.description}</div>
                <Button variant="primary" onClick={() => {
                        props.onSelectItem(survey.id);
                    }
                }>{props.texts.load}</Button>
            </ListGroup.Item>
        )
    }

    return (
        <ListGroup className="py-1a">
            { props.surveys.map( (survey)=> { return surveySelector(survey)}) }
        </ListGroup>
    );
};


const SurveyServiceLoader: React.FC<SurveyLoaderProps> = (props) => {
    const texts = {
        title: 'Load Survey from the server',
        loading: "List is loading",
        load: "Load",
        empty_list: "List is empty"
    }

    const { content, loading } = useLoadJSON<SurveyDescription[]>(props.surveyProviderUrl +'/list');

    if(loading) {
        return(
            <div>{texts.loading}</div>
        );
    }

    if(!content) {
        return (
            <div>{texts.empty_list}</div>
        )
    }

    const loadSurveyJSON = (id: string) => {
        fetch(props.surveyProviderUrl + '/survey?id=' + id).then((r)=>{
            r.json().then(function(survey: SurveyFileContent){
                props.onSurveyLoaded(survey);
            });
        });
    }
   
    return (
        <Card title={texts.title}>
            <SurveyList onSelectItem={loadSurveyJSON} surveys={content} texts={texts}></SurveyList> 
        </Card>
    );
};

export default SurveyServiceLoader;
