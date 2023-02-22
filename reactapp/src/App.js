// import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import React, { useEffect, Fragment } from 'react';
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoutes from './ProtectedRoutes';
import HomePage from './pages/HomePage'

// import PrivateRoute from './hocs/PrivateRoute';
import Layout from './hocs/Layout'

import { Provider } from 'react-redux';
import store from './store';

function App() {
  return (
    <Provider store={store}>
        <Router>
          <Routes>

          {/* <Layout> */}
          <Route element={<Layout />} >


            <Route path='/' element={<LoginPage/>} />
            <Route path='/login' element={<LoginPage/>} />
            <Route exact path='/register' element={<RegisterPage/>} />
            

            {/* <PrivateRoute exact path='/home_devices' element={<HomePage/>} /> */}

            <Route element={<ProtectedRoutes />} >
              <Route path='/home_devices' element={<HomePage />} />
            </Route>


          </Route>
          {/* </Layout> */}
          
          </Routes>
        </Router>
      </Provider>
  );
}

export default App;
