import constants from "../constants";
import { format } from "date-fns";
import networkInterface from "../services/network-interface";

const handleUiError = (err, reject) => {
  const errMsg = err && err.response && err.response.data;
  if (errMsg) {
    console.error("Error: ", err.response.data);
    alert(`Error: ${err.response.data}`);
  }
  return reject(err.response.data);
};

const isUserAuthenticated = async () => {
  const accessToken = networkInterface.getAccessToken();
  if (!accessToken) {
    return false;
  }

  // it would be best to check for expiration here as well
  // Although the user doesn't get data access if token expired, the user shouldn't see the UI

  return true;
};

const getRole = () => {
  return networkInterface.getUserRole();
};

const isUserAllowed = path => {
  const role = getRole();
  const allowed = constants.ALLOWED_ROUTES[role];
  return allowed && allowed.indexOf(path) !== -1;
};

const isUserAdmin = () => {
  console.log("is", getRole());
  return getRole().toString() === "3";
};

const formatDateFromMsForAllTimecards = timecards => {
  if (!timecards) return [];
  const formattedRes = timecards.map(tc => {
    tc.rawDate = +tc.date;
    tc.date = formatDateForOneEntity(tc.rawDate);
    return tc;
  });

  return formattedRes;
};

const formatDateForOneEntity = dt => {
  return format(new Date(+dt), "dd LLLL yyyy");
};

const mapTimecardOwners = (timecards, users) => {
  const tcWithOwnerNames = timecards.map(t => {
    let user = users.find(u => u._id === t.ownerId);
    t.owner = user.email;
    return t;
  });
  return tcWithOwnerNames;
};

export {
  handleUiError,
  isUserAllowed,
  isUserAuthenticated,
  formatDateFromMsForAllTimecards,
  formatDateForOneEntity,
  isUserAdmin,
  mapTimecardOwners,
};
