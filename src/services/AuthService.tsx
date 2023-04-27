import axios from "axios";
import secureLocalStorage from "react-secure-storage";


const API_URL = "https://lk-gantt-app.herokuapp.com/api/auth/";

class AuthService {
  login(username: string, password: string) {
    return axios
      .post(API_URL + "signin", {
        username,
        password
      })
      .then(response => {
        if (response.data.token) {
          secureLocalStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
    });
  }

  logout() {
    secureLocalStorage.removeItem("user");
  }

  register(username: string, email: string, password: string, roles: Array<string>) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password,
      roles
    });
  }

  getCurrentUser() {
    const userStr = secureLocalStorage.getItem("user");
    if (userStr) return JSON.parse(userStr as string);

    return null;
  }
}

export default new AuthService();