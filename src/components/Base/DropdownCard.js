import React from 'react';
import styled from 'styled-components';
import { Icon } from '.';

const DropdownCard = ({ children, className, isOpen, toggleOpen, iconName, title }) => {
  return (
    <>
      <div className={className}>
        <div className="card-title" onClick={toggleOpen}>
          <Icon name={iconName} />
          <h4>{title}</h4>
          <Icon className="arrow" name={isOpen ? 'chevron up' : 'chevron right'}></Icon>
        </div>
        {isOpen && <div className="content">{children}</div>}
      </div>
    </>
  );
};

const StyledDropdownCard = styled(DropdownCard)`
  box-shadow: 0 2px 8px 0 rgba(213, 213, 213, 0.5);
  border-radius: 7px;
  padding: 0.5rem 1rem;
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  & > .card-title {
    font-size: 17px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding: 0.5rem 0;
    & > h4 {
      margin-left: 0.5rem;
      flex: 1;
    }
  }
  & > .content {
    margin-top: 0.5rem;
  }
`;

export default StyledDropdownCard;
