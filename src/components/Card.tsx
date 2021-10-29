import React from 'react';

interface CardProps {
    title: string;
    className?: string;
}

const Card: React.FC<CardProps> = (props) => {
    return (
        <div className={props.className}>
            <div className="bg-primary text-white px-2 px-sm-3 py-2a">
                <h4 className="fw-bold m-0">{props.title}</h4>
            </div>
            <div className="bg-grey-1 px-2 px-sm-3 py-3">
                {props.children}
            </div>
        </div >
    );
};

export default Card;
