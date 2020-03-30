const API_BASE = "http://localhost:3001/api/v1/";
const AUTH_BASE = "http://localhost:3001/auth/";

const constants = {
  LOGIN_PATH: `${AUTH_BASE}login`,
  LOGOUT_PATH: `${AUTH_BASE}logout`,
  TOKEN_PATH: `${AUTH_BASE}token`,
  USERS_PATH: `${API_BASE}users`,
  TIMECARDS_PATH: `${API_BASE}timecards`,
  ALLOWED_ROUTES: {
    "1": ["/timecard"],
    "2": ["/timecard", "/manage-users"],
    "3": ["/timecard", "/manage-users"],
  },
};

export default constants;
