import { connect } from 'react-redux';
import TopBar from '../components/TopBar';

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

const TopBarContainer = connect(mapStateToProps)(TopBar);

export default TopBarContainer;
