import clsx from 'clsx';
import React, { ReactNode } from 'react';
import { CardBody, CardHeader, Card } from 'react-bootstrap';


type VariantsType = 'primary' | 'grey' | 'info';

interface CardProps {
    title: ReactNode;
    className?: string;
    variant?: VariantsType;
    headerTag?: 'h3' | 'h4' |'h5' |'h6';
}

interface VariantProps {
    header: string;
    body: string;
}

const variants: Record<VariantsType, VariantProps> = {
    'primary': {
        header:'bg-primary text-white',
        body:'bg-grey-1'
    },
    'grey': {
        header:'bg-grey-1',
        body:''
    },
    'info': {
        header:'bg-info',
        body:''
    }
}


const CardTitled: React.FC<CardProps> = (props) => {

    const v = variants[props.variant ?? 'primary'];

    const hTag = props.headerTag ?? 'h4';
    const h = React.createElement(hTag, {className: "fw-bold m-0"}, props.title);

    return (
        <Card className={clsx(props.className, "rounded")}>
        <CardHeader className={v.header} >
           {h}
        </CardHeader>
        <CardBody className={v.body}>
                {props.children}
        </CardBody>
        </Card>
    );
};

export default CardTitled;
