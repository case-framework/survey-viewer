import Editor from '@monaco-editor/react';
import React from 'react';
import Card from './Card';

interface SimulationSetupProps {
    onStart: () => void;
    onExit: () => void;
}

const defaultUIConfig = {
    backBtn: "Back"
}


const SimulationSetup: React.FC<SimulationSetupProps> = (props) => {
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
    return (
        <div className="container my-3">
            {navButtons}
            <Card
                className="mt-2"
                title="UI Customizations">
                <Editor
                    height="200px"
                    //height="90vh"
                    defaultLanguage="json"
                    defaultValue={JSON.stringify(defaultUIConfig, undefined, 4)}
                />
            </Card>
            <Card title="Participant"
                className="my-2"
            >

            </Card>
            {navButtons}
        </div>
    );
};

export default SimulationSetup;
