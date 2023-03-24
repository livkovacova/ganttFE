import axios from 'axios';
import authHeader from './auth-header';
import authService from './auth.service';

const API_URL = 'http://localhost:8080/api/test/';

class UserService {
  getPublicContent() {
    console.log(authService.getCurrentUser());
    return axios.get(API_URL + 'all');
  }

  getUserBoard() {
    console.log(authHeader());
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + 'mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'manager', { headers: authHeader() });
  }
}

export default new UserService();