import constants from "../constants";
import networkInterface from "./network-interface";

class ApiService {
  login = credentials => {
    return networkInterface.login(constants.LOGIN_PATH, credentials);
  };

  logOut() {
    return networkInterface.deleteToken(constants.LOGOUT_PATH);
  }

  createUser({ name, email, password }) {
    return networkInterface.createUser(constants.USERS_PATH, { name, email, password });
  }

  getUsers() {
    return networkInterface.getUsers(constants.USERS_PATH).then(r => r);
  }

  updateUser(user, id) {
    return networkInterface.updateUser(`${constants.USERS_PATH}/${id}`, user);
  }

  deleteUser(id) {
    return networkInterface.deleteUser(`${constants.USERS_PATH}/${id}`);
  }

  getTimecards() {
    return networkInterface.getTimecards(constants.TIMECARDS_PATH).then(r => {
      this.allTimecards = r;
      return r;
    });
  }

  getStoredTimecards() {
    return this.allTimecards;
  }

  createTimecard(timecard) {
    return networkInterface.createTimecard(constants.TIMECARDS_PATH, timecard);
  }

  updateTimecard(timecard, id) {
    return networkInterface.updateTimecard(`${constants.TIMECARDS_PATH}/${id}`, timecard);
  }

  deleteTimecard(id) {
    return networkInterface.deleteTimecard(`${constants.TIMECARDS_PATH}/${id}`);
  }
}

export default new ApiService();
