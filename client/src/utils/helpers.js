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

const isUserAuthenticated = () => {
  const accessToken = networkInterface.getAccessToken();
  return accessToken;
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

//TODO test this with undefined user
const mapTimecardOwners = (timecards, users) => {
  const tcWithOwnerNames = timecards.map(t => {
    let user = users.find(u => u._id === t.ownerId);
    if (!user) {
      t.owner = "(user deleted)";
    } else {
      t.owner = user.email;
    }
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
