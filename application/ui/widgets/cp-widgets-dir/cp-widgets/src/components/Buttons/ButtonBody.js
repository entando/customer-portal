import React from 'react';
import i18n from '../../i18n';

const ButtonBody = ({label, icon}) => {
  return (
    <>
      {i18n.t(label)}
      {icon}
    </>
  );
}

export default ButtonBody;
