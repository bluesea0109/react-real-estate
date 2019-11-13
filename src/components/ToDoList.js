import React from 'react';
import PropTypes from 'prop-types';
import { Segment, List } from 'semantic-ui-react';

import ToDo from './ToDo';

const ToDoList = ({ toDoList }) => (
  <Segment>
    <List>
      {toDoList.map((toDo, index) => (
        <ToDo key={index} {...toDo} />
      ))}
    </List>
  </Segment>
);

ToDoList.propTypes = {
  toDoList: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
};

export default ToDoList;
