import React from 'react';

import { Content, Log } from '../../../global/types';
import PrimerItem from '../PrimerItem/PrimerItem';

import { DownOutlined } from '@ant-design/icons';
import './PrimerSelect.scss';

interface Props {
  content: Content
  log: Log
}

const PrimerSelect = (props: Props) => {
  return (
    <div className="primerSelect">
      <div className="primerSelectAction">
        <PrimerItem collection={props.content.collection} />
        <DownOutlined />
      </div>
    </div>
  )
}

export default PrimerSelect
