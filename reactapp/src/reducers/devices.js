import {
    LOAD_DEVICES_STATES_SUCCESS,
    LOAD_DEVICES_STATES_FAIL
} from '../actions/types';

const initialState = {
    // update => has_update
    update: '',
    date:''
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case LOAD_DEVICES_STATES_SUCCESS:
            return {
                ...state,
                update: payload.update,
                date: payload.date
                
            }
        case LOAD_DEVICES_STATES_FAIL:
            return {
                ...state,
                update: '',
                date: ''
            }
        default:
            return state
    };
};