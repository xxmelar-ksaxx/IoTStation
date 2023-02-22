import React, { useEffect, Fragment } from 'react';
import { Outlet } from "react-router-dom";
// import Navbar from '../components/Navbar';
import { connect } from 'react-redux';
import { checkAuthenticated } from '../actions/auth';
import { load_user } from '../actions/profile';

const Layout = ({checkAuthenticated}) => {
    useEffect(() => {
        checkAuthenticated();
        load_user();
    }, []);

    return (
        <Fragment>
            <Outlet />
        </Fragment>
    );
};

// const mapStateToProps = state => ({
//     isAuthenticated: state.auth.isAuthenticated
// });

// export default Layout;
export default connect(null, { checkAuthenticated})(Layout);