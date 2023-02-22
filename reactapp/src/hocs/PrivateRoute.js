// import React from 'react';
// import { Route, Navigate } from 'react-router-dom';
// import { connect } from 'react-redux';

// import LoginPage from "./pages/LoginPage";
// import { Outlet } from "react-router-dom";

// const PrivateRoute = ({ element, isAuthenticated, ...rest }) => (
//     <Route
//         {...rest}
//         render={props => isAuthenticated ? {element} : <Navigate to='/login' />}
//     />
    
    
// );

// const ProtectedRoutes = ({ element, isAuthenticated, ...rest }) => {
//     // const isAuth = useOuth();
    
//     return isAuthenticated ? <Outlet /> : <LoginPage />;
// };

// const mapStateToProps = state => ({
//     isAuthenticated: state.auth.isAuthenticated
// });

// export default connect(mapStateToProps, {})(PrivateRoute);