import { connect } from 'react-redux';
import TopBar from '../components/TopBar';

const mapStateToProps = state => {
  return {
    auth0: state.auth0,
  };
};

const TopBarContainer = connect(mapStateToProps)(TopBar);

export default TopBarContainer;
