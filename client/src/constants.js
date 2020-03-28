const API_BASE = "http://localhost:3001/api/v1/";

const constants = {
  USERS_PATH: `${API_BASE}users`,
  LOGIN_PATH: `${API_BASE}users/login`,
  LOGOUT_PATH: `${API_BASE}users/logout`,
  TIMECARDS_PATH: `${API_BASE}timecards`,
  ALLOWED_ROUTES: {
    "1": ["/timecard"],
    "2": ["/timecard", "/manage-users"],
    "3": ["/timecard", "/manage-users"],
  },
};

export default constants;
