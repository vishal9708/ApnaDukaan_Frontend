import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import Login from './Pages/Login';
import Otp from './Pages/Otp';
import { GreetPage } from './Pages/GreetPage';
import { ErrorPage } from './Pages/Error';
import AdminControl from './Pages/AdminControl';
import AdminLogin from './Pages/AdminLogin';
import ForgotPassword from './Pages/authentication/ForgotPassword';
import ResetPassword from './Pages/authentication/ResetPassword';
const RouterPage = () => {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Login />}></Route>
        <Route path='/otp' element={<Otp />}></Route>
        <Route path='/dashboard' element={<Dashboard />}></Route>
        <Route exact path='/admin/login' element={<AdminLogin />}></Route>
        <Route exact path='/greetPage' element={<GreetPage />}></Route>
        <Route exact path='/controlPage' element={<AdminControl />}></Route>
        <Route exact path='/forgotPassword' element={<ForgotPassword/>}></Route>
        <Route exact path='/resetPassword' element={<ResetPassword/>}></Route>
        <Route exact path='/*' element={<ErrorPage />}></Route>
      </Routes>
    </Router>
  )
}

export default RouterPage