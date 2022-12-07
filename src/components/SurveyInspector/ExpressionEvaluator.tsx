import React, { ReactNode, useState } from 'react';
import {  ListGroup, Tabs, Tab, } from 'react-bootstrap';
import { Expression, ExpressionArg, isExpression, isItemGroupComponent, isSurveyGroupItem, ItemComponent, SurveyGroupItem, SurveyItem, SurveySingleItemResponse } from 'survey-engine/data_types';
import clsx from 'clsx';

import { SurveyEngineCore } from 'survey-engine/engine';

/**
 * Reference to an expression in a survey
 */
interface ExpressionRef {
    exp: Expression; // The expression to inspect
    field: string; // Field in the survey item
    key: string; // itemKey where the expression lives
    value?: any; // Resolved value with the last state
    changed?: boolean; // Does this value change after the last survey state transition ?
    show: boolean;
}

/**
 * Expression Registry collect all known expression in a survey
 */
class ExpressionRegistry {
    
    exps : Map<string, ExpressionRef[]>; // All known expressions

    fields: Set<string>;

    constructor() {
        this.exps = new Map();
        this.fields = new Set();
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
        if(field) {
            this.fields.add(field);
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
        if(comp)
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
            if(item.validations) {
                item.validations.forEach((v) => {
                    if(isExpression(v.rule)) {
                        this.add(item.key, v.key,  'validations' , v.rule );
                    }  
                });
            }
        }
    }
}  

export class EngineState {
    engine?: SurveyEngineCore;
    surveyDefinition?: SurveyGroupItem
    registry: ExpressionRegistry
    responses?: SurveySingleItemResponse[]

    constructor(surveyDefinition?: SurveyGroupItem) {
        this.engine = undefined;
        this.registry = new ExpressionRegistry();
        this.responses = undefined;
        this.surveyDefinition = surveyDefinition;
        if(surveyDefinition) {
            this.registry.build(surveyDefinition);
        }
    }

    setEngine(engine: SurveyEngineCore) {
        this.engine = engine;
    }

    setResponses(responses : SurveySingleItemResponse[]) {
        this.responses = responses;
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

interface ExpressionListProps {
    engineState: EngineState
    update: number;
    onSelect: (exp:Expression)=>void;
}

export const ExpressionList: React.FC<ExpressionListProps> = (props) => {

    const list = props.engineState.registry.exps;

    const [search, setSearch] = useState<string|undefined>(undefined);
   
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
                <small>{itemKey}{ref.key ? ' [' + ref.key + ']' : ''}</small> 
                <b>{ref.field}</b> 
            </span>
            <p><code>{ toFunc(ref.exp) }</code></p>
            <p>{ JSON.stringify(ref.value) }</p>
        </ListGroup.Item>
    };

    const buildList = (refresh: boolean) => {
        const r : ReactNode[] = [];
        list.forEach( (refs, key) => {
            if(search) {
                if(!key.includes(search) ){
                    return;
                }
            }
            r.push( ...refs.map( (ref, index) => ExpItem(key, ref, index)) );
        });
        return r;
    }

    return <React.Fragment>
        <div>
            <input type="text" placeholder='item key search' onKeyDown={(e)=>{ if(e.key === "Enter") setSearch(e.currentTarget.value) }}/>
        </div>
        <ListGroup>
            { buildList(refresh) }
        </ListGroup>
    </React.Fragment>
}