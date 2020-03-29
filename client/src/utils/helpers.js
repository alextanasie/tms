import decode from "jwt-decode";
import constants from "../constants";
import { format } from "date-fns";

const handleUiError = (err, reject) => {
  const errMsg = err && err.response && err.response.data;
  if (errMsg) {
    console.error("Error: ", err.response.data);
    alert(`Error: ${err.response.data}`);
  }
  return reject(err.response.data);
};

const isUserAuthenticated = () => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  //TODO add functionality for refreshToken
  if (!token || !refreshToken) {
    return false;
  }

  try {
    // const { exp } = decode(refreshToken);
    const { exp, role } = decode(token);
    localStorage.setItem("userRole", role);
    if (exp < new Date().getTime() / 1000) {
      return false;
    }
  } catch (e) {
    return false;
  }

  return true;
};

const getRole = () => {
  return localStorage.getItem("userRole");
};

const isUserAllowed = path => {
  const role = getRole();
  return constants.ALLOWED_ROUTES[role].indexOf(path) !== -1;
};

const isUserAdmin = () => {
  return getRole() === "3";
};

const formatDateFromMsForAllTimecards = timecards => {
  const formattedRes = timecards.map(tc => {
    tc.rawDate = +tc.date;
    tc.date = formatDateForOneTimecard(tc.rawDate);
    return tc;
  });

  console.log("f", formattedRes);
  return formattedRes;
};

const formatDateForOneTimecard = dt => {
  return format(new Date(+dt), "dd LLLL yyyy");
};

export {
  handleUiError,
  isUserAllowed,
  isUserAuthenticated,
  formatDateFromMsForAllTimecards,
  formatDateForOneTimecard,
  isUserAdmin,
};