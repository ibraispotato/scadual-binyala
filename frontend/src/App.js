import React,{useEffect,useState} from "react"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import {Auth} from "./hooks/loginHook"

import './App.css';
import SignUp from "./register/signUp"
import Login from "./register/login"
import Admin from "./admin/admin"
import AllScadual from "./AllScadual/AllScadual.jsx"
import AdminScadual from "./admin/adminScadual/adminScadual.jsx";
import MyScadual from "./myScadual/myScadual"
import Settings from "./settings/settings"
import ScadualSettings from './admin/scadualSettings/scadualSettings.jsx'
import ForgotPassword from "./register/forgotPassword.jsx"
import ResetPassword from "./register/resetPassword.jsx"
function App() {
  const { dispatch,user } = Auth()
// console.log(user?.admin)
  return (
    <div>
      <Router>
        <Routes>
          <Route element={user?user?.admin?<AdminScadual />:<AllScadual />:<Navigate to={'/signUp'}/>} path="/AdminScadual"/>
          <Route element={user?user?.admin?<Admin />:<MyScadual />:<Navigate to={'/signUp'}/>} path="/"/>
          <Route element={user?user?.admin?<ScadualSettings />:<MyScadual />:<Navigate to={'/signUp'}/>} path="/scadualSettings"/>
          <Route element={user?<MyScadual />:<Navigate to={'/signUp'}/>} path="/MyScadual"/>
          <Route element={!user?<ForgotPassword />:<Navigate to={'/signUp'}/>} path="/forgotPassword"/>
          <Route element={!user?<ResetPassword />:<Navigate to={'/signUp'}/>} path="/resetPassword/:token"/>
          <Route element={user?<Settings />:<Navigate to={'/signUp'}/>} path="/settings"/>
          <Route element={!user?<SignUp />:<Navigate to={'/'}/>} path="/signUp"/>
          <Route element={!user?<Login />:<Navigate to={'/'}/>} path="/login"/>
        </Routes>
      </Router>
    </div>
    
  );
}

export default App;
