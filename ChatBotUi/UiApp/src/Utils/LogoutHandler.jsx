import { clearMessages } from "./Session/ChatStorage";
import { clearUser } from "./Session/UserStorage";

export const handleLogout = (logoutContextFn, callback) => {
  try {
    if (logoutContextFn) logoutContextFn();
    clearUser();
    clearMessages();
    sessionStorage.removeItem("chatSessionId");
    sessionStorage.removeItem("guestChat");

    if (callback && typeof callback === "function") callback();
  } catch (error) {
    console.error("Logout failed:", error);
  }
};