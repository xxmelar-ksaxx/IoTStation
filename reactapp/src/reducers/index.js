import { combineReducers } from 'redux';
import auth from './auth';
import profile from './profile';
import devices from './devices';

export default combineReducers({
    auth,
    profile,
    devices
});