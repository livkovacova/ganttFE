import { useState, useEffect } from "react";
import { Routes, Route, useLocation} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App2.css";

import AuthService from "./services/auth.service";
import IUser from './types/user.type';

import Home from "./components/Examples/home.component";
import BoardUser from "./components/Examples/boardUser.component";
import BoardModerator from "./components/Examples/boardModerator.component";
import BoardAdmin from "./components/Examples/boardAdmin.component";

import EventBus from "./components/commons/EventBus";
import LoginPage from "./components/LoginPage/loginPage";
import RegisterPage from "./components/RegisterPage/registerPage";
import ProfilePage from "./components/ProfilePage/profilePage";
import HomePage from "./components/HomePage/homePage";
import ProjectDetailsPage from "./components/ProjectDetailsPage/ProjectDetailsPage";
import CreateGanttChartPage from "./components/CreateGanttChartPage/CreateGanttChartPage";
import GanttChartPage from "./components/GanttChartPage/GanttChartPage";
import DependencyDiagramPage from "./components/DependencyDiagram/DependencyDiagramPage";


type Props = {};

type State = {
  isManager: boolean,
  currentUser: IUser | undefined
}

const GanttApp: React.FC<Props> = () => {
    const [isManager, setIsManager] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);
    const location = useLocation();

    const logOut = () => {
        AuthService.logout();
        setIsManager(false);
        setCurrentUser(undefined);
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
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<HomePage isManager={isManager}/>} />
                <Route path="/projects/:id" element={<ProjectDetailsPage isManager={isManager} currentUser={currentUser}/>}/>
                <Route path="/projects/:id/create-gantt" element={<CreateGanttChartPage currentUser={currentUser}/>}/>
                <Route path="/projects/:id/gantt-chart" element={<GanttChartPage/>}/>
                <Route path="/projects/:id/dependency-diagram" element={<DependencyDiagramPage/>}/>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/user" element={<BoardUser />} />
                <Route path="/mod" element={<BoardModerator />} />
                <Route path="/manager" element={<BoardAdmin />} />
            </Routes>
        </div>
        </div>
    );
};

export default GanttApp;
