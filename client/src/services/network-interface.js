import axios from "axios";
import { isTokenExpired, getUserRoleFromToken } from "../utils/token-helpers";
import constants from "../constants";

//the reason why I'm also using "this.getConfig()" when requesting is to provide functionality when refreshing the app (corner case)
//setting default headers for the axios instance would require relogin after refreshing the page
class NetworkInterface {
  accessToken = localStorage.getItem("accessToken") || "";
  refreshToken = localStorage.getItem("refreshToken") || "";
  userRole = localStorage.getItem("userRole") || 1;

  login = async (path, credentials) => {
    try {
      const res = await axios.post(path, credentials);
      this.setUserInfo(res.data);
      return res.data;
    } catch (err) {
      handleErr(err);
    }
  };

  // have a retry mechanism in case the refresh token expired
  // TODO: add a general method to avoid repeating code
  getTimecards = async (path, tries = 2) => {
    try {
      const res = await axios.get(path, this.getConfig());
      this.setUserRole();
      return res.data;
    } catch (err) {
      if (errCausedByExp(err, this.accessToken, tries)) {
        await this.setNewAccessToken();
        return this.getTimecards(path, tries - 1);
      }
      handleErr(err);
    }
  };

  createTimecard = async (path, timecard, tries = 2) => {
    try {
      const res = await axios.post(path, timecard, this.getConfig());
      return res;
    } catch (err) {
      if (errCausedByExp(err, this.accessToken, tries)) {
        await this.setNewAccessToken();
        return this.createTimecard(path, timecard, tries - 1);
      }
      handleErr(err);
    }
  };

  updateTimecard = async (path, timecard, tries = 2) => {
    try {
      const res = await axios.put(path, timecard, this.getConfig());
      return res;
    } catch (err) {
      if (errCausedByExp(err, this.accessToken, tries)) {
        await this.setNewAccessToken();
        return this.updateTimecard(path, timecard, tries - 1);
      }
      handleErr(err);
    }
  };

  deleteTimecard = async (path, tries = 2) => {
    try {
      const res = await axios.delete(path, this.getConfig());
      return res;
    } catch (err) {
      if (errCausedByExp(err, this.accessToken, tries)) {
        await this.setNewAccessToken();
        return this.deleteTimecard(path, tries - 1);
      }
      handleErr(err);
    }
  };

  getUsers = async (path, tries = 2) => {
    try {
      const res = await axios.get(path, this.getConfig());
      return res.data;
    } catch (err) {
      if (errCausedByExp(err, this.accessToken, tries)) {
        await this.setNewAccessToken();
        return this.getUsers(path, tries - 1);
      }
      handleErr(err);
    }
  };

  createUser = async (path, userObj, tries = 2) => {
    try {
      const res = await axios.post(path, userObj, this.getConfig());
      return res;
    } catch (err) {
      if (errCausedByExp(err, this.accessToken, tries)) {
        await this.setNewAccessToken();
        return this.createUser(path, userObj, tries - 1);
      }
      handleErr(err);
    }
  };

  updateUser = async (path, userObj, tries = 2) => {
    try {
      const res = await axios.put(path, userObj, this.getConfig());
      return res;
    } catch (err) {
      if (errCausedByExp(err, this.accessToken, tries)) {
        await this.setNewAccessToken();
        return this.updateUser(path, userObj, tries - 1);
      }
      handleErr(err);
    }
  };

  deleteUser = async (path, tries = 2) => {
    try {
      const res = await axios.delete(path, this.getConfig());
      return res;
    } catch (err) {
      if (errCausedByExp(err, this.accessToken, tries)) {
        await this.setNewAccessToken();
        return this.deleteUser(path, tries - 1);
      }
      handleErr(err);
    }
  };

  deleteToken = async (path, tries = 2) => {
    try {
      const config = {
        headers: { "x-token": this.accessToken },
        data: { refreshToken: this.refreshToken },
      };
      const res = await axios.delete(path, config);
      this.unsetUserInfo();
      return res;
    } catch (err) {
      if (errCausedByExp(err, this.accessToken, tries)) {
        await this.setNewAccessToken();
        return this.deleteToken(path, tries - 1);
      }
      handleErr(err);
    }
  };

  getConfig = () => {
    return { headers: { "x-token": this.accessToken } };
  };

  setUserInfo = data => {
    this.userRole = getUserRoleFromToken(data.accessToken);
    this.setAccessToken(data.accessToken);
    localStorage.setItem("accessToken", data.accessToken);
    if (data.refreshToken) {
      this.setRefreshToken(data.refreshToken);
      localStorage.setItem("refreshToken", data.refreshToken);
    }
    localStorage.setItem("userRole", this.userRole);
  };

  getUserRole = () => {
    return this.userRole || localStorage.getItem("userRole");
  };

  setUserRole = () => {
    return (this.userRole = getUserRoleFromToken(this.accessToken));
  };

  unsetUserInfo = () => {
    this.setAccessToken(undefined);
    this.setRefreshToken(undefined);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
  };

  getAccessToken = () => {
    return this.accessToken;
  };

  setAccessToken = token => {
    this.accessToken = token;
  };

  getRefreshToken = () => {
    return this.refreshToken;
  };

  setRefreshToken = token => {
    this.refreshToken = token;
  };

  setNewAccessToken = async () => {
    const res = await axios.post(constants.TOKEN_PATH, { refreshToken: this.refreshToken }, this.getConfig());
    this.setUserInfo(res.data);
    return res.data.accessToken;
  };
}

const handleErr = err => {
  console.error(err.response);
  throw err;
};

const errCausedByExp = (err, token, tries) => {
  if (err.response && err.response.status === 403 && isTokenExpired(token) && tries > 1) {
    return true;
  }
  return false;
};

export default new NetworkInterface();
