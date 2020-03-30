import decode from "jwt-decode";

const isTokenExpired = token => {
  const { exp } = decode(token);
  if (exp < new Date().getTime() / 1000) {
    return true;
  }
  return false;
};

const getUserRoleFromToken = token => {
  const { role } = decode(token);
  console.log("wh", role);
  return role;
};

export { isTokenExpired, getUserRoleFromToken };
