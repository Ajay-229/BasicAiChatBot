const USER_KEY = "user";

// Save user info to localStorage
export const saveUser = (user) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user session:", error);
  }
};

// Load user info from localStorage
export const loadUser = () => {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error loading user session:", error);
    return null;
  }
};

// Clear user session
export const clearUser = () => {
  try {
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error("Error clearing user session:", error);
  }
};