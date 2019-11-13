import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';

const ToDo = ({ title }) => <List.Item>{title}</List.Item>;

ToDo.propTypes = {
  title: PropTypes.string.isRequired,
};

export default ToDo;
