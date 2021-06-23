import React from 'react';
import {Button} from 'carbon-components-react';
import ButtonBody from './ButtonBody';

const GhostButton = ({label, icon, onClick}) => {
  return (
    <Button kind="ghost" onClick={onClick}>
      <ButtonBody label={label} icon={icon}/>
    </Button>
  );
}

export default GhostButton;
