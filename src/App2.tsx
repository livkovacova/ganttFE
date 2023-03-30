import { Component } from "react";
import { Routes, Route} from "react-router-dom";
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

type Props = {};

type State = {
  isManager: boolean,
  currentUser: IUser | undefined
}

class App2 extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      isManager: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        isManager: user.roles.includes("ROLE_MANAGER"),
      });
    }

    EventBus.on("logout", this.logOut);
  }

  componentWillUnmount() {
    EventBus.remove("logout", this.logOut);
  }

  componentDidUpdate(){
    
  }

  logOut() {
    AuthService.logout();
    this.setState({
      isManager: false,
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser, isManager } = this.state;

    return (
      <div>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<HomePage isManager={isManager}/>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/user" element={<BoardUser />} />
            <Route path="/mod" element={<BoardModerator />} />
            <Route path="/manager" element={<BoardAdmin />} />
          </Routes>
        </div>

        { /*<AuthVerify logOut={this.logOut}/> */}
      </div>
    );
  }
}

export default App2;