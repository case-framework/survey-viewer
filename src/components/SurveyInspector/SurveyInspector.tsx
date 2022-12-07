import React, {  useState } from 'react';
import { Button,  Tabs, Tab } from 'react-bootstrap';
import { Expression, } from 'survey-engine/data_types';
import Editor from '@monaco-editor/react';
import clsx from 'clsx';

import { EngineState, ExpressionList } from "./ExpressionEvaluator";
import { ResponsesList } from "./ResponseList";

interface SurveyInspectorProps {
    engineState: EngineState
    update: number;
} 


export const SurveyInspector: React.FC<SurveyInspectorProps> = (props) => {

    const [hasEditorErrors, setHasEditorErrors] = useState(false);
    const [expression, setExpression] = useState<Expression|undefined>(undefined);
    const [inputExp, setInputExpression] = useState<Expression>({name:"getContext"});
    const [result, setResult] = useState<any>(undefined);
    
    const evaluateExpression = () => {
       if(props.engineState.engine) {
         setResult(props.engineState.engine.resolveExpression(expression));
       }
    };

    const handleExpSelected = (exp: Expression) => {
        setInputExpression(exp);
    }

    return <Tabs defaultActiveKey="list" id="expression-evaluator" className="mb-1 bg-secondary">
            <Tab eventKey="response" title="Responses">
                <ResponsesList responses={props.engineState.responses}/>
            </Tab>
            <Tab eventKey="list" title="Expressions">
                <ExpressionList engineState={props.engineState} onSelect={handleExpSelected} update={props.update}/>
            </Tab>
            <Tab eventKey="custom" title="Custom">
                <Editor   
                        height="250px"
                        defaultLanguage="json"
                        value={JSON.stringify(inputExp)}
                        className={clsx(
                            { 'border border-danger': hasEditorErrors }
                        )}
                        onValidate={(markers) => {
                            if (markers.length > 0) {
                                setHasEditorErrors(true)
                            } else {
                                setHasEditorErrors(false)
                            }
                        }}
                        onChange={(value) => {
                            if (!value) { return }
                            let config: Expression;
                            try {
                                config = JSON.parse(value);
                            } catch (e: any) {
                                console.error(e);
                                return
                            }
                            if (!config) { return }
                            setExpression(config);
                        }}
                    />
                <Button onClick={evaluateExpression} disabled={hasEditorErrors}>Evaluate</Button>
                <div>
                    <h5>Result</h5>
                    <Editor
                        height="150px"
                        options={{readOnly: true}}
                        defaultLanguage="json"
                        value={result ? JSON.stringify(result) : ''}
                    />
                </div>
            </Tab>
        </Tabs>;
}
