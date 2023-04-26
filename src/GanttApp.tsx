import { useState, useEffect } from "react";
import { Routes, Route, useLocation} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./GanttApp.css";

import AuthService from "./services/AuthService";
import IUser from './types/user.type';

import EventBus from "./components/commons/EventBus";
import LoginPage from "./components/LoginPage/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import HomePage from "./components/MyProjectsPage/MyProjectsPage";
import ProjectDetailsPage from "./components/ProjectDetailsPage/ProjectDetailsPage";
import CreateGanttChartPage from "./components/CreateGanttChartPage/CreateGanttChartPage";
import GanttChartPage from "./components/GanttChartPage/GanttChartPage";
import DependencyDiagramPage from "./components/DependencyDiagramPage/DependencyDiagramPage";
import {useNavigate} from "react-router-dom";


type Props = {};

const GanttApp: React.FC<Props> = () => {
    const [isManager, setIsManager] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);
    const location = useLocation();
    const navigate = useNavigate()

    const logOut = () => {
        AuthService.logout();
        setIsManager(false);
        setCurrentUser(undefined);
        navigate("/login");
    }

    const setUserInfo = () => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
            setIsManager(user.roles.includes("ROLE_MANAGER"));
        }
    }

    useEffect(() => {
        setUserInfo();
        EventBus.on("logout", logOut);

        return () => {
        EventBus.remove("logout", logOut);
        };
    }, []);

    useEffect(() => {
        setUserInfo();
    }, [location]);

    return (
        <div>
        <div>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/home" element={<HomePage isManager={isManager}/>} />
                <Route path="/projects/:id" element={<ProjectDetailsPage isManager={isManager} currentUser={currentUser}/>}/>
                <Route path="/projects/:id/create-gantt" element={<CreateGanttChartPage currentUser={currentUser}/>}/>
                <Route path="/projects/:id/gantt-chart" element={<GanttChartPage/>}/>
                <Route path="/projects/:id/dependency-diagram" element={<DependencyDiagramPage/>}/>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </div>
        </div>
    );
};

export default GanttApp;
