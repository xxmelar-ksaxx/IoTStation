import Cookies from 'js-cookie';
import axios from 'axios';
import {
    LOAD_DEVICES_SUCCESS,
    LOAD_DEVICES_FAIL,
    LOAD_DEVICES_STATES_SUCCESS,
    LOAD_DEVICES_STATES_FAIL


} from './types';

export const has_update = (date) => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        params:{
            'type':'has_update',
            date
        }
    };
    
    try {
        const res = await axios.get('api/devices', config);

        if (res.data.error) {
            dispatch({
                type: LOAD_DEVICES_STATES_FAIL
            });
        } else {
            dispatch({
                type: LOAD_DEVICES_STATES_SUCCESS,
                payload: res.data
            });
            return res.data
        }
    } catch (err) {
        dispatch({
            type: LOAD_DEVICES_STATES_FAIL
        });
    }
};

export const get_devices = () => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    };

    try {
        const res = await axios.get('api/devices', config);

        if (res.data.error) {
            dispatch({
                type: LOAD_DEVICES_FAIL
            });
        } else {
            dispatch({
                type: LOAD_DEVICES_SUCCESS,
                // payload: res.data
            });
            return res.data
        }
    } catch (err) {
        dispatch({
            type: LOAD_DEVICES_FAIL
        });
    }
};

export const send_device_update = (updates) => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken')
        }
    };
    const body = JSON.stringify(updates);
    try {
        const res = await axios.put('api/devices',body, config);

        if (res.data.error) {
            dispatch({
                type: LOAD_DEVICES_FAIL
            });
        } else {
            dispatch({
                type: LOAD_DEVICES_SUCCESS,
                // payload: res.data
            });
            return res.data
        }
    } catch (err) {
        dispatch({
            type: LOAD_DEVICES_FAIL
        });
    }
};

export const send_add_new_device = (data) => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken')
        }
    };
    const body = JSON.stringify(data);
    console.log("trying post")
    try {
        const res = await axios.post('api/devices',body, config);

        if (res.data.error) {
            dispatch({
                type: LOAD_DEVICES_FAIL
            });
            return res.data.error;
        } else {
            dispatch({
                type: LOAD_DEVICES_SUCCESS,
                // payload: res.data
            });
            return res.data.success
        }
    } catch (err) {
        dispatch({
            type: LOAD_DEVICES_FAIL
        });
        return false;
    }
};

export const send_delete_device = (label, hw_id) => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken')
        },
        params:{
            "label":label,
            "hw_id":hw_id
        }
    };
    // const body = JSON.stringify({"label":label, "hw_id":hw_id});
    // console.table(body);
    console.log("trying post")
    try {
        const res = await axios.delete('api/devices', config);

        if (res.data.error) {
            dispatch({
                type: LOAD_DEVICES_FAIL
            });
            return res.data.error;
        } else {
            dispatch({
                type: LOAD_DEVICES_SUCCESS,
                // payload: res.data
            });
            return res.data.success
        }
    } catch (err) {
        dispatch({
            type: LOAD_DEVICES_FAIL
        });
        return false;
    }
};