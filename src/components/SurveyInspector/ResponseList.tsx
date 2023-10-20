import React, {  useState } from 'react';
import {  ListGroup, ListGroupItem } from 'react-bootstrap';
import { SurveySingleItemResponse } from 'survey-engine/data_types';


interface ResponsesListProps {
    responses?: SurveySingleItemResponse[]
    meta?: boolean;
    json?: boolean;
}

export const ResponsesList: React.FC<ResponsesListProps> = (props) => {

    const [search, setSearch] = useState<string|undefined>(undefined);
    const [json, setJSON] = useState<boolean>(false);

    const jsonify = (data: any)=>{
        return <pre className='w-100'> { JSON.stringify(data, undefined, 2) } </pre>
    }

    const showResponse = (response : SurveySingleItemResponse, index:number) => {
       return <ListGroupItem key={index}>
        <h6>{response.key}</h6>
        Response
        { jsonify(response.response) }
        { props.meta ? jsonify(response.meta) : ''}
        </ListGroupItem>
    }

    const selectResponses = (responses: SurveySingleItemResponse[]) => {
        if(!search) {
            return responses;
        }
        return responses.filter(r => {
           return r.key.includes(search);
        });
    }

    const responses = props.responses ? selectResponses(props.responses) : [];

    return <React.Fragment>
        <div className='mb-1'>
            <label className='me-1' title="Show as json">
            <input type="checkbox" defaultChecked={json} onClick={() => setJSON(!json) }/> {"{}"}</label>
            <input type="text" placeholder="item key search" onKeyDown={(e)=>{ if(e.key === "Enter") setSearch(e.currentTarget.value) }}/>
        </div>
        {
            json ?
            jsonify(responses) :
            <ListGroup> { responses.map(showResponse) }</ListGroup>
        }
    </React.Fragment>
}


