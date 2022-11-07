import { Survey } from 'survey-engine/data_types';
import { Badge, ListGroup } from 'react-bootstrap';
import useLoadJSON from '../hooks/useLoadJSON';
import { useEffect, useState } from 'react';
import Card from './Card';
import { format, parseISO } from 'date-fns';

interface localisedString {
    [key:string]: string;
}

interface SurveyDescription {
    id: string // Id to load the survey
    label: string
    description: localisedString
    time: string;
    study: string;
}

interface SurveyLoaderProps {
    surveyProviderUrl: string
    onSurveyLoaded: (surveyFileContent: Survey) => void;
}

interface SurveyListUIText {
    load: string
    languages: string;
}

interface SurveyListProps {
    surveys: SurveyDescription[]
    texts: SurveyListUIText
    onSelectItem: (code: string) => void;
}

interface LangSelectorProps {
    languages: Set<string>;
    label: string;
    onChange: (lang:Set<string>)=>void;
}

const LangSelector: React.FC<LangSelectorProps> = (props) => {

    const languages = Array.from(props.languages.values());

    const [lang, setLang] = useState(() => {
        const init = new Set<string>(props.languages);
        init.delete('_timestamp');
        init.delete('id');
        return init;
    });

    useEffect(()=>{
        props.onChange(lang);
    }, [lang]);

    const change = (e: HTMLInputElement, code:string) => {
       if(e.checked) {
        lang.add(code)
       } else {
        lang.delete(code);
       }
       setLang(new Set<string>(lang.values()));
    };

    return (
        <div className='d-inline'>
            {props.label} :
            {
                languages.map((code) => <label key={code}><input type="checkbox" className="ms-1" onChange={(ev) => change(ev.currentTarget, code)} checked={lang.has(code)}/>{code}</label>) 
            }
        </div>
    )
}


const SurveyList: React.FC<SurveyListProps> = (props) => {

    const languages = new Set<string>();

    const [lang, setLang] = useState(new Set<string>(languages));

    props.surveys.forEach(s => {
        const codes = Object.keys(s.description);
        codes.forEach(k => languages.add(k));
    });

    const changeLanguage = (newLang: Set<string>)=> {
        setLang(newLang);
    }

    const surveySelector= (survey: SurveyDescription) => {

        const time = parseISO(survey.time);

        return (
            <ListGroup.Item action key={survey.id} onClick={() => props.onSelectItem(survey.id)}>
                <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1"><Badge bg="warning" pill={true} className="me-1">{survey.study}</Badge>{survey.label} <small className='text-muted'>{survey.id}</small></h5>
                    { time ? <small>{time.toLocaleString()}</small> : ''}
                </div>
                { Object.entries(survey.description).map((entry) => {
                            const [code, text] = entry;

                            if(!lang.has(code)) {
                                return '';
                            }

                            return <div className="text" key={code}><Badge bg="info" className='me-1' pill={true}>{code}</Badge>{text}</div>
                        })
                }
            </ListGroup.Item>
        )
    }

    return (
        <div>
        <LangSelector languages={languages} onChange={changeLanguage} label={props.texts.languages}/>
        <ListGroup className="py-1a">
            { props.surveys.map( (survey)=> { return surveySelector(survey)}) }
        </ListGroup>
        </div>
    );
};


const SurveyServiceLoader: React.FC<SurveyLoaderProps> = (props) => {
    const texts = {
        title: 'Load Survey from the server',
        loading: "List is loading",
        load: "Click on survey to load",
        empty_list: "List is empty",
        languages: "Languages codes"
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
            r.json().then(function(survey: Survey){
                props.onSurveyLoaded(survey);
            });
        });
    }
   
    return (
        <Card title={texts.title} className="my-1">
            <SurveyList onSelectItem={loadSurveyJSON} surveys={content} texts={texts}></SurveyList> 
        </Card>
    );
};

export default SurveyServiceLoader;
