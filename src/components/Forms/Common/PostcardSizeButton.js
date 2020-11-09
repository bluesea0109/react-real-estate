import React from 'react';
import { Icon } from 'semantic-ui-react';

export default function PostcardSizeButton({ postcardSize }) {
  return (
    <div
      style={{
        display: 'grid',
        height: '100%',
        gridTemplateColumns: '1fr',
        gridTemplateRows: '1fr 20px',
        justifyItems: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: `${postcardSize === '6x9' ? '47px' : postcardSize === '6x11' ? '57px' : '32px'}`,
          height: `${postcardSize === '6x9' ? '32px' : postcardSize === '6x11' ? '32px' : '22px'}`,
          border: '2px solid #666666',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon
          color="grey"
          fitted
          name="home"
          size={postcardSize === '6x9' ? 'large' : postcardSize === '6x11' ? 'large' : undefined}
          style={postcardSize === '4x6' ? { transform: 'translateY(-2px)' } : undefined}
        ></Icon>
      </div>
      <span
        style={{
          fontSize: '13px',
          fontWeight: 'bold',
          color: '#59C4C4',
        }}
      >{`${postcardSize}" Postcard`}</span>
    </div>
  );
}
