import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';
import { Container, Grid, Segment } from 'semantic-ui-react';

import EmptyPage from './components/EmptyPage';
import IndexPage from './containers/IndexPage';
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
              <Route exact path="/" component={IndexPage} />
              <Route exact path="/callback" component={Callback} />
              <Route exact path="/dashboard" component={EmptyPage} />
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    </Fragment>
  );
}

export default App;
