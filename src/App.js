import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';
import { Container, Header, Grid, Segment } from 'semantic-ui-react';

import AddToDo from './containers/AddToDo';
import ToDoListContainer from './containers/ToDoListContainer';
import CustomGridExample from './components/CustomGridExample';
import Callback from './containers/Callback';
import NavigationContainer from './containers/NavigationContainer';

function App() {
  return (
    <Fragment>
      <NavigationContainer />
      <Container>
        <Grid>
          <Grid.Column>
            <Segment>
              <Header>To Do List</Header>
              <Route exact path="/" component={ToDoListContainer} />
              <Route exact path="/new-item" component={AddToDo} />
              <Route exact path="/custom-grid" component={CustomGridExample} />
              <Route exact path="/callback" component={Callback} />
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    </Fragment>
  );
}

export default App;
