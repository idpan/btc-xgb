// src/utils/auth.js
export const getAuthToken = () => localStorage.getItem("token");
export const getUserRole = () => localStorage.getItem("role");
export const logout = () => {
  localStorage.clear();
  window.location.href = "/login";
};
