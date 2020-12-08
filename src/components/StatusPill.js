import React from 'react';

const StatusPill = ({children, type, color}) => {
  if(type === 'solid'){
    switch(color){
      case 'green': {
        return(<div className="statusPill solidPill greenPillSolid">{children}</div>);
      }
      case 'yellow': {
        return(<div className="statusPill solidPill yellowPillSolid">{children}</div>);
      }
      case 'red': {
        return (<div className="statusPill solidPill redPillSolid">{children}</div>);
      }
      case 'grey': {
        return(<div className="statusPill solidPill greyPillSolid">{children}</div>);
      }
      case 'lightBlue': {
        return(<div className="statusPill solidPill lightBluePillSolid">{children}</div>);
      }
      case 'blue': {
        return(<div className="statusPill solidPill bluePillSolid">{children}</div>);
      }
      case 'astral': {
        return (<div className="statusPill solidPill astralPillSolid">{children}</div>)
      }

      default: {
        return(<div className="statusPill solidPill greyPillSolid">{children}</div>);
      }
    }
  } else if(type === 'opaque'){
    switch(color){
      case 'green': {
        return (<div className="statusPill greenPillOpaque">{children}</div>);
      }
      case 'red': {
        return (<div className="statusPill redPillOpaque">{children}</div>);
      }
      default: {
        return(<div className="statusPill">{children}</div>);
      }
    }
  } else if(type === 'paper'){
    return (<div className="statusPill floatPill">{children}</div>);
  } else{
    return (<div className="statusPill">{children}</div>)
  }
  
}
export default StatusPill;