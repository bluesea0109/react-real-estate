import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';
import { Container, Header, Grid, Segment } from 'semantic-ui-react';

import AddToDo from './containers/AddToDo';
import Navigation from './components/Navigation';
import ToDoListContainer from './containers/ToDoListContainer';

function App() {
  return (
    <Fragment>
      <Navigation />
      <Container>
        <Grid>
          <Grid.Column>
            <Segment>
              <Header>To Do List</Header>
              <Route exact path="/" component={ToDoListContainer} />
              <Route exact path="/new-item" component={AddToDo} />
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    </Fragment>
  );
}

export default App;
