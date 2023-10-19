import Editor from '@monaco-editor/react';
import { FileDropzone } from 'case-web-ui';
import clsx from 'clsx';
import React, { useState } from 'react';
import { SurveyContext } from 'survey-engine/data_types';
import Card from './Card';
import { acceptJSON } from './constants';
import { SimulatorUIConfig, SurveyUILabels } from './SurveySimulator';
import UploadDialog from './UploadDialog';
import { ParticipantFlag, ParticipantFlags } from '../types/flags';
import { Badge, Button, Collapse, OverlayTrigger, Tooltip } from 'react-bootstrap';

interface SimulationSetupProps {
    currentSimulatorUIConfig: SimulatorUIConfig;
    currentSurveyContext: SurveyContext;
    participantFlags: ParticipantFlags
    prefillsFile?: File;
    onSimulatorUIConfigChanged: (config: SimulatorUIConfig) => void;
    onSurveyContextChanged: (context: SurveyContext) => void;
    onPrefillChanged: (prefills?: File) => void;
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

export const defaultSurveyContext: SurveyContext = {
    isLoggedIn: false,
    participantFlags: {},
}

const SimulationSetup: React.FC<SimulationSetupProps> = (props) => {
    const [hasSurveyContextEditorErrors, setHasSurveyContextEditorErrors] = useState(false);
    const [openSurveyContextUploadDialog, setOpenSurveyContextUploadDialog] = useState(false);

    const [hasUILabelEditorErrors, setHasUILabelEditorErrors] = useState(false);
    const [openSurveyUIConfigUploadDialog, setOpenSurveyUIConfigUploadDialog] = useState(false);

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

    const surveyContextUploader = <UploadDialog
        open={openSurveyContextUploadDialog}
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
                props.onSurveyContextChanged(
                    content as SurveyContext
                )
            }
            reader.readAsText(file)
        }}
        onClose={() => setOpenSurveyContextUploadDialog(false)}
    />

    return (
        <div className="container my-3">
            <Card title="Participant"
                className="my-2"
            >
                <h6 className="fw-bold">Prefill:</h6>
                <FileDropzone
                    placeholderText="No file selected"
                    accept={acceptJSON}
                    maxFiles={1}
                    files={props.prefillsFile ? [props.prefillsFile] : []}
                    onDrop={(acceptedFiles) => {
                        if (acceptedFiles.length > 0) {
                            props.onPrefillChanged(acceptedFiles[0]);
                        }
                    }}
                />
                <button
                    type="button"
                    disabled={hasSurveyContextEditorErrors}
                    className="btn btn-link p-0 text-decoration-none text-start text-uppercase me-3 mt-2"
                    onClick={() => {
                        props.onPrefillChanged(undefined)
                    }}
                >
                    Clear
                </button>

                <h6 className="fw-bold mt-3">Survey context:</h6>
                <p className='ps-4'>Participant Flags</p>
                <FlagsEditor availableFlags={props.participantFlags} surveyContext={props.currentSurveyContext} onChange={props.onSurveyContextChanged}/>
                <p>Edit the JSON directly:</p>
                <Editor
                    height="150px"
                    defaultLanguage="json"
                    value={JSON.stringify(props.currentSurveyContext, undefined, 4)}
                    className={clsx(
                        { 'border border-danger': hasSurveyContextEditorErrors }
                    )}
                    onValidate={(markers) => {
                        if (markers.length > 0) {
                            setHasSurveyContextEditorErrors(true)
                        } else {
                            setHasSurveyContextEditorErrors(false)
                        }
                    }}
                    onChange={(value) => {
                        if (!value) { return }
                        let context: SurveyContext;
                        try {
                            context = JSON.parse(value);
                        } catch (e: any) {
                            console.error(e);
                            return
                        }
                        if (!context) { return }
                        props.onSurveyContextChanged({
                            ...context
                        })

                    }}
                />
                {hasSurveyContextEditorErrors ?
                    <p className="text-danger p-0">
                        Check the editor for errors
                    </p>
                    : null}
                <div>
                    <button
                        type="button"
                        disabled={hasSurveyContextEditorErrors}
                        className="btn btn-link p-0 text-decoration-none text-start text-uppercase me-3 mt-2"
                        onClick={() => {
                            props.onSurveyContextChanged({
                                ...defaultSurveyContext
                            })
                        }}
                    >
                        Clear
                    </button>
                    <button
                        className="btn btn-link p-0 text-decoration-none text-start text-uppercase me-2 mt-2"
                        onClick={() => {
                            setOpenSurveyContextUploadDialog(true)
                        }}
                    >Upload survey context</button>
                </div>


            </Card>

            <Card className="my-2" title="UI Customizations">
                <h6 className="fw-bold">Survey UI Labels:</h6>
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
            {surveyContextUploader}
            {surveyUIConfigUploader}
        </div>
    );
};


interface HelpTooltipProps {
    label: string;
}

export const HelpTooltip : React.FC<HelpTooltipProps> = (props) => {
return <OverlayTrigger overlay={<Tooltip>{props.label}</Tooltip>}><Badge className='mx-1' pill={true}>?</Badge></OverlayTrigger>
}

interface FlagsEditorProps {
    availableFlags: ParticipantFlags
    surveyContext: SurveyContext
    onChange: (ctx: SurveyContext)=>void;
}

export const FlagsEditor : React.FC<FlagsEditorProps> = (props) => {
    
    const [newFlag, setNewFlag] = useState<string>('');
    
    
    const knownFlags = new Map(Object.entries(props.availableFlags));
    const curCtx = props.surveyContext.participantFlags ?? {};
    
    const flagUpdated = (name: string, value: string) => {
        if(name === '') {
            return;
        }
        const ctx = { ...props.surveyContext};
        ctx.participantFlags[name] = value;
        props.onChange(ctx);
    }

    const removeFlag = (name:string) => {
        if(name === '') {
            return;
        }
        const ctx = { ...props.surveyContext};
        delete ctx.participantFlags[name];
        props.onChange(ctx);
    }

   const addCustomFlag = ()=> {
        flagUpdated(newFlag, '');
   }

    const FlagLabel = (key: string, def?: ParticipantFlag)=> {
        return <strong>
        {key}
        {def ? <HelpTooltip label={def.label}/> : ''}
        </strong>
    }

    const showFlag = (key:string) => {
        
        const def = knownFlags.get(key);

        const value = props.surveyContext.participantFlags[key] ?? '';
        return <div key={key} className='my-1 row'>
            <div className='col-3 text-end'>{ FlagLabel(key, def) }</div>  
            <div className='col-2'>
            <input value={value} onChange={ev => flagUpdated(key, ev.target.value)} className='form-control'/>
            </div>
            <div className='col'>
                {def ? 
                    (<span className='ms-1'>
                        Acceptable values :
                        <select className='mx-1' onChange={ev => flagUpdated(key, ev.target.value)}>
                        <option value="" selected={value === ""}>-Empty-</option>
                        {def.values.map(v=> <option value={v.value} key={v.value} selected={v.value === value}>{v.label} ({v.value})</option>)}
                        </select>
                    </span>) 
                : ''}
            <Button onClick={()=>removeFlag(key)} variant='danger' size='sm' className='ms-1'>Remove</Button>
            </div>
        </div>
       
    }

    const usedKeys = Array.from(Object.keys(curCtx));
    // List of missing flags in context, to be added
    const missing = Array.from(knownFlags.keys()).filter(k=>!usedKeys.includes(k));
   
    return <div className='my-1 p-1 ps-4'>
            { usedKeys.map(showFlag) }
            {missing.length > 0 ? (
                    <div className='my-1'>
                    <span>Add a known flag <HelpTooltip label="Flag known by the platform"/> :</span>
                    <select onChange={(ev)=> { flagUpdated(ev.target.value, '')}}>
                    <option value="">-- Select a new flag to add --</option>
                    {missing.map(n=> <option key={n} value={n}>{n} - {knownFlags.get(n)?.label}</option>)}
                    </select>
                    </div>
                ) : ''}
            Add custom flag 
            <input type="text" style={{"width":"20em"}} className="ms-1" onChange={(ev)=>setNewFlag(ev.target.value)}/> 
            <Button variant='info' size='sm' className="ms-1" onClick={addCustomFlag}>Add</Button>
        </div>
}

export default SimulationSetup;

