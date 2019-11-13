import React, { useState } from 'react';
import { connect } from 'react-redux';
import { addToDo } from '../store/actions';
import { Message, Form, Segment } from 'semantic-ui-react';

let AddToDo = ({ dispatch }) => {
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    const inputValue = event.target.elements[0].value;

    if (!inputValue) {
      setError('valid input is required');
    } else {
      setError('');
      dispatch(addToDo(inputValue));
      event.target.elements[0].value = '';
    }
  }

  return (
    <Segment>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Input placeholder="Enter an item" name="itemInput" />
          <Form.Button content="Submit" />
        </Form.Group>
      </Form>
      {error ? <Message role="alert">{error}</Message> : null}
    </Segment>
  );
};

AddToDo = connect()(AddToDo);

export default AddToDo;
