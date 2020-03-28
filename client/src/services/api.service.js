import axios from "axios";
import constants from "../constants";

let token = localStorage.getItem("token") || "";
let refreshToken = localStorage.getItem("refreshToken") || "";

const setUserInfo = headers => {
  token = headers["auth-token"];
  refreshToken = headers["auth-token"];
  localStorage.setItem("token", token);
  localStorage.setItem("refreshToken", refreshToken);
};

const unsetUserInfo = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};

const getConfig = () => {
  return { headers: { authorization: `Bearer ${token}` } };
};

class ApiService {
  // TODO: set headers config on axios instance
  login = credentials => {
    return axios.post(constants.LOGIN_PATH, credentials).then(res => {
      setUserInfo(res.headers);
    });
  };

  // TODO: implement logout
  logOut() {
    unsetUserInfo();
    return axios.post(constants.LOGOUT_PATH, {}, {});
  }

  createUser(userObj) {
    return axios.post(constants.USERS_PATH, userObj, getConfig());
  }

  getUsers() {
    return axios.get(constants.USERS_PATH, getConfig());
  }

  updateUser(user, id) {
    return axios.put(`${constants.USERS_PATH}/${id}`, user, getConfig());
  }

  deleteUser(id) {
    return axios.delete(`${constants.USERS_PATH}/${id}`, getConfig());
  }

  getTimecards() {
    return axios.get(constants.TIMECARDS_PATH, getConfig());
  }

  createTimecard(timecard) {
    return axios.post(constants.TIMECARDS_PATH, timecard, getConfig());
  }

  updateTimecard(timecard, id) {
    return axios.put(`${constants.TIMECARDS_PATH}/${id}`, timecard, getConfig());
  }

  deleteTimecard(id) {
    return axios.delete(`${constants.TIMECARDS_PATH}/${id}`, getConfig());
  }
}

export default new ApiService();
