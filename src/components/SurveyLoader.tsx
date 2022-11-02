import React, { useState } from 'react';
import { DialogBtn, FileDropzone } from 'case-web-ui';
import { Survey } from 'survey-engine/data_types';
import Card from './Card';
import { acceptJSON } from './constants';


export interface SurveyFileContent {
    studyKey: string;
    survey: Survey;
}

interface SurveyLoaderProps {
    onSurveyLoaded: (surveyFileContent: SurveyFileContent) => void;
}

const SurveyLoader: React.FC<SurveyLoaderProps> = (props) => {
    const texts = {
        title: 'Load Survey',
        btn: {
            open: 'Open',
            useUrl: 'use url'
        }
    }

    const [selectedFile, setSelectedFile] = useState<null | File>();

    const loadSurveyJSON = (file: File) => {
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
            props.onSurveyLoaded(content as SurveyFileContent);
        }
        reader.readAsText(file)
    }

    return (
        <Card title={texts.title}>
            <FileDropzone
                placeholderText="Drag and drop a file here or click this box"
                accept={acceptJSON}
                maxFiles={1}
                onDrop={(acceptedFiles, rejected, event) => {
                    if (acceptedFiles.length > 0) {
                        setSelectedFile(acceptedFiles[0])
                    }
                }}
            />
            <DialogBtn
                className="my-2"
                label={texts.btn.open}
                disabled={!selectedFile}
                onClick={() => {
                    if (selectedFile) {
                        loadSurveyJSON(selectedFile)
                    }
                }}
            />
            <div className="">
                <button
                    type="button"
                    className="btn btn-link p-0 text-decoration-none text-start text-uppercase"
                    disabled={true}
                    onClick={(event) => {
                        event.preventDefault();
                    }}
                >{texts.btn.useUrl}
                </button>
            </div>
        </Card>
    );
};

export default SurveyLoader;
