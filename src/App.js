import React, { Fragment } from 'react';
import { Container, Header, Grid, Segment } from 'semantic-ui-react';

import AddToDo from './containers/AddToDo';
import ToDoListContainer from './containers/ToDoListContainer';

function App() {
  return (
    <Fragment>
      {/* Menu Goes Here */}
      <Container>
        <Grid>
          <Grid.Column>
            <Segment>
              <Header>To Do List</Header>
              <AddToDo />
              <ToDoListContainer />
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    </Fragment>
  );
}

export default App;
