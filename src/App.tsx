import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Route, Routes, useLocation} from "react-router-dom"
import secureLocalStorage from "react-secure-storage";
import { MyProjectsPage } from './components/MyProjectsPage/MyProjectsPage';
import Login from './components/Examples/login.component';
import Register from './components/Examples/register.component';
import Profile from './components/Examples/profile.component';


function App() : React.ReactElement {
  
  secureLocalStorage.setItem("isManager", true);
  const getIsManager = () => {
        const getManager = Boolean(secureLocalStorage.getItem("isManager"));
        return getManager != undefined ? getManager : false;
    };
  
  const [isManager, setIsManager] = React.useState<boolean>(getIsManager);
  const location = useLocation();

  React.useEffect(() => {
        setIsManager(getIsManager);
    }, [location]);

  return (<>
    <Routes location={location}>
      <Route path="/" element={<MyProjectsPage isManager={isManager}/>}/>
      <Route path="/team" element={<MyProjectsPage isManager={false}/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/profile" element={<Profile/>}/>
    </Routes>
  </>);
}

export default App;
