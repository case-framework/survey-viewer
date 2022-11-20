import React, { ReactNode, useState } from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import { Expression, ExpressionArg, isExpression, isItemGroupComponent, isSurveyGroupItem, ItemComponent, SurveyGroupItem, SurveyItem } from 'survey-engine/data_types';
import Editor from '@monaco-editor/react';
import clsx from 'clsx';

import { SurveyEngineCore } from 'survey-engine/engine';
import { Icon, IconButton } from '@material-ui/core';

interface ExpressionRef {
    exp: Expression;
    field: string;
    key: string;
    value?: any;
    changed?: boolean;
    show: boolean;
}

/**
 * Expression Registry collect all known expression in a survey
 */
class ExpressionRegistry {
    
    exps : Map<string, ExpressionRef[]>;

    constructor() {
        this.exps = new Map();
    }

    build(survey: SurveyGroupItem) {
        this.handleItem(survey);
    }

    add(itemKey:string, key: string, field: string, exp?: Expression) {
        if(!exp) {
            return;
        } 

        const ref = {
            key: key,
            field: field,
            exp: exp,
            show: true
        };

        if(!this.exps.has(itemKey)) {
           const rr : ExpressionRef[] = [ ref ];
           this.exps.set(itemKey, rr);
        } else {
            const rr = this.exps.get(itemKey);
            rr?.push(ref);
        }
    }

    handleComponent(itemKey:string, comp: ItemComponent, index: number) {
        const key = (comp.key ?? comp.role + '#'+ index);
        if(comp.disabled && isExpression(comp.disabled)) {
            this.add(itemKey, key, 'disabled', comp.disabled);
        }
        if(comp.displayCondition && isExpression(comp.displayCondition)) {
            this.add(itemKey, key, 'displayCondition', comp.displayCondition);
        }
        if(comp.properties) {
            const handleProp = (prop: ExpressionArg|number|string|undefined, name: string) => {
                if(prop && typeof(prop) == "object" && "dtype" in prop && prop.dtype === "exp" ) {
                    this.add(itemKey, key, 'properties.'+name, (prop as ExpressionArg).exp);
                }
            }
            handleProp(comp.properties.min, 'min');
            handleProp(comp.properties.max, 'max');
            handleProp(comp.properties.dateInputMode, 'dateInputMode');
            handleProp(comp.properties.stepSize, 'stepSize');
        }
        if(isItemGroupComponent(comp)) {
            comp.items.forEach( (c, i) => this.handleComponent(itemKey, c, i));
        }
    }

    handleItem(item: SurveyItem) {
        if(!item) {
            return;
        }
        if(item.condition) {
            this.add(item.key, '', 'condition', item.condition);
        }
        if(isSurveyGroupItem(item)) {
            item.items.forEach(i => this.handleItem(i));
        } else {
            if(item.components) {
                this.handleComponent(item.key, item.components, 0);
            }
        }
   }
}  

export class EngineState {
    engine?: SurveyEngineCore;
    surveyDefinition?: SurveyGroupItem
    registry: ExpressionRegistry

    constructor(surveyDefinition?: SurveyGroupItem) {
        this.engine = undefined;
        this.registry = new ExpressionRegistry();
            this.surveyDefinition = surveyDefinition;
        if(surveyDefinition) {
            this.registry.build(surveyDefinition);
        }
    }

    setEngine(engine: SurveyEngineCore) {
        this.engine = engine;
    }

    update() {
        this.registry.exps.forEach((refs)=> {
            refs.forEach(ref => {
                const oldValue = ref.value;
                ref.value = this.engine?.resolveExpression(ref.exp);
                ref.changed = oldValue !== ref.value;
            });
        });
    }
}


interface SurveyEvaluatorProps {
    engineState: EngineState
    update: number;
} 

interface ExpressionListProps {
    engineState: EngineState
    update: number;
    onSelect: (exp:Expression)=>void;
}

export const ExpressionList: React.FC<ExpressionListProps> = (props) => {

    const list = props.engineState.registry.exps;

    const [refresh, setRefresh] = useState(false);

    const toFunc = (e: Expression):string => {
        var p : string[];

        if(e.data) {
           p = e.data.map(arg => {
            if(arg.dtype) {
               if(arg.dtype === "exp" && arg.exp) {
                    return toFunc(arg.exp);
               }
               if(arg.dtype === "num") {
                    return '' + arg.num;
               }
            }
            return '"' + arg.str + '"';
           });
        } else {
            p = [];
        }
        return e.name + '(' + p.join(',') + ')';
    }

    const ExpItem = (itemKey: string, ref: ExpressionRef, index: number) => {
        return <ListGroup.Item key={itemKey + '=' + index} className={clsx({'bg-warning': ref.changed})}>
            <span>
                <small>{itemKey}:{ref.key}</small> 
                <b>{ref.field}</b> 
            </span>
            <p><code>{ toFunc(ref.exp) }</code></p>
            <p>{ JSON.stringify(ref.value) }</p>
        </ListGroup.Item>
    };

    const buildList = (refresh: boolean) => {
        const r : ReactNode[] = [];
        list.forEach( (refs, key) => {
            r.push( ...refs.map( (ref, index) => ExpItem(key, ref, index)) );
        });
        return r;
    }

    return <ListGroup>
        { buildList(refresh) }
    </ListGroup>

}

export const SurveyExpressionEvaluator: React.FC<SurveyEvaluatorProps> = (props) => {

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

    return <React.Fragment>
            <ExpressionList engineState={props.engineState} onSelect={handleExpSelected} update={props.update}/>
            <Editor   
                    height="150px"
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
                Result
                <Editor
                    height="150px"
                    options={{readOnly: true}}
                    defaultLanguage="json"
                    value={result ? JSON.stringify(result) : ''}
                />
                </div>
    </React.Fragment>;
}
