// src/Utils/LogoutHandler.js
import { clearMessages } from "./Session/ChatStorage";
import { clearUser } from "./Session/UserStorage";

/**
 * Handles full logout: clears user context, localStorage, and chat session.
 * @param {Function} logoutContextFn - logout function from UserContext
 * @param {Function} [callback] - optional callback (like navigation)
 */
export const handleLogout = (logoutContextFn, callback) => {
  try {
    if (logoutContextFn) logoutContextFn(); // clear context + localStorage
    clearUser(); // just in case
    clearMessages(); // clear chat session

    if (callback && typeof callback === "function") callback();
  } catch (error) {
    console.error("Logout failed:", error);
  }
};