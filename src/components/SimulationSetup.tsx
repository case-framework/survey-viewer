import Editor from '@monaco-editor/react';
import { Checkbox } from 'case-web-ui';
import clsx from 'clsx';
import React, { useState } from 'react';
import Card from './Card';
import { SimulatorUIConfig, SurveyUILabels } from './SurveySimulator';
import UploadDialog from './UploadDialog';

interface SimulationSetupProps {
    currentSimulatorUIConfig: SimulatorUIConfig;
    onSimulatorUIConfigChanged: (config: SimulatorUIConfig) => void;
    onStart: () => void;
    onExit: () => void;
}

export const defaultSimulatorUIConfig: SimulatorUIConfig = {
    showKeys: false,
    texts: {
        backBtn: 'Back',
        nextBtn: 'Next',
        submitBtn: 'Submit',
        invalidResponseText: 'Invalid response',
        noSurveyLoaded: 'Survey could not be loaded, please try again.'
    }
}

const SimulationSetup: React.FC<SimulationSetupProps> = (props) => {
    const [hasUILabelEditorErrors, setHasUILabelEditorErrors] = useState(false);
    const [openSurveyUIConfigUploadDialog, setOpenSurveyUIConfigUploadDialog] = useState(false);

    const navButtons = (
        <div>
            <button
                className="btn btn-secondary"
                onClick={() => props.onExit()}
            >Back to Menu</button>
            <button
                className="btn btn-primary ms-2"
                onClick={() => props.onStart()}
            >Start</button>
        </div>
    )

    const surveyUIConfigUploader = <UploadDialog
        open={openSurveyUIConfigUploadDialog}
        onReady={(file) => {
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
                if (!content.backBtn) {
                    return;
                }
                props.onSimulatorUIConfigChanged({
                    ...props.currentSimulatorUIConfig,
                    texts: {
                        ...content,
                    },
                })
            }
            reader.readAsText(file)
        }}
        onClose={() => setOpenSurveyUIConfigUploadDialog(false)}
    />



    return (
        <div className="container my-3">
            {navButtons}
            <Card
                className="mt-2"
                title="UI Customizations">
                <Checkbox
                    id="show-keys-checkbox"
                    name="show-keys-checkbox"
                    className="mb-3"
                    checked={props.currentSimulatorUIConfig.showKeys}
                    onChange={(value) => {
                        props.onSimulatorUIConfigChanged({
                            ...props.currentSimulatorUIConfig,
                            showKeys: value
                        })
                    }}
                    label="Show keys"
                />
                <h5>Survey UI Labels:</h5>
                <Editor
                    height="150px"
                    defaultLanguage="json"
                    value={JSON.stringify(props.currentSimulatorUIConfig.texts, undefined, 4)}
                    className={clsx(
                        { 'border border-danger': hasUILabelEditorErrors }
                    )}
                    onValidate={(markers) => {
                        if (markers.length > 0) {
                            setHasUILabelEditorErrors(true)
                        } else {
                            setHasUILabelEditorErrors(false)
                        }
                    }}
                    onChange={(value) => {
                        if (!value) { return }
                        let config: SurveyUILabels;
                        try {
                            config = JSON.parse(value);
                        } catch (e: any) {
                            console.error(e);
                            return
                        }
                        if (!config) { return }
                        props.onSimulatorUIConfigChanged({
                            ...props.currentSimulatorUIConfig,
                            texts: config,
                        })

                    }}
                />
                {hasUILabelEditorErrors ?
                    <p className="text-danger p-0">
                        Check the editor for errors
                    </p>
                    : null}
                <div>
                    <button
                        type="button"
                        disabled={hasUILabelEditorErrors}
                        className="btn btn-link p-0 text-decoration-none text-start text-uppercase me-3 mt-2"
                        onClick={() => {
                            props.onSimulatorUIConfigChanged({
                                ...props.currentSimulatorUIConfig,
                                texts: {
                                    ...defaultSimulatorUIConfig.texts,
                                },
                            })
                        }}
                    >
                        Reset to defaults
                    </button>
                    <button
                        className="btn btn-link p-0 text-decoration-none text-start text-uppercase me-2 mt-2"
                        onClick={() => {
                            setOpenSurveyUIConfigUploadDialog(true)
                        }}
                    >Upload config</button>
                </div>

            </Card>
            <Card title="Participant"
                className="my-2"
            >

            </Card>
            {navButtons}
            {surveyUIConfigUploader}
        </div>
    );
};

export default SimulationSetup;
