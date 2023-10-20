
import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import React, { useState } from 'react';

interface HelpTooltipProps {
    label: string;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = (props) => {
    return <OverlayTrigger overlay={<Tooltip>{props.label}</Tooltip>}><Badge className='mx-1' pill={true}>?</Badge></OverlayTrigger>
}
