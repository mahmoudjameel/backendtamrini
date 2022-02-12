import { useContext, createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AppContext = createContext(null);
const AuthContext = createContext(null);
const NotifierContext = createContext(null);

export const useAppContext = () => useContext(AppContext);
export const useAuthContext = () => useContext(AuthContext);
export const useNotifierContext = () => useContext(NotifierContext);

export const AppProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Cookies.get("access_token") ? true : false
  );

  const [isNotifierVisible, setIsNotifierVisible] = useState(false);
  const [notifiers, setNotifiers] = useState({ errors: [], success: [] });

  useEffect(() => {
    if (!Cookies.get("access_token") || !Cookies.get("user_data")) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      Cookies.remove("access_token");
      Cookies.remove("user_data");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (
      (notifiers.errors && notifiers.errors.length !== 0) ||
      (notifiers.success && notifiers.success.length !== 0)
    ) {
      setIsNotifierVisible(true);
      setTimeout(() => {
        setIsNotifierVisible(false);
        setNotifiers({ errors: [], success: [] });
      }, 3900);
    }
  }, [notifiers]);

  return (
    <AppContext.Provider value={{}}>
      <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        <NotifierContext.Provider
          value={{
            isNotifierVisible,
            setIsNotifierVisible,
            notifiers,
            setNotifiers,
          }}
        >
          {children}
        </NotifierContext.Provider>
      </AuthContext.Provider>
    </AppContext.Provider>
  );
};
