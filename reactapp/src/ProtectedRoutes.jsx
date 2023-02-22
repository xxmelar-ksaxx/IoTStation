import { Outlet } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { connect } from 'react-redux';

// const verifyUserCrdintials = async ()=>{

// }

// const useOuth= () => {
//     const user = {loggedIn: true};
//     return user && user.loggedIn;
// };

const ProtectedRoutes = ({isAuthenticated}) => {
    // const isAuth = useOuth();
    
    return isAuthenticated ? <Outlet /> : <LoginPage/>;
};


const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {})(ProtectedRoutes);
// export default ProtectedRoutes;
