import React, { useState } from "react";
import axios from "axios";
import history from '../history';
import useLocalStorage from "functions/localstorage/useLocalStorage";

import {
  NOT_LOGGED_IN,
  LOG_IN_FORM,
  SIGN_UP_FORM,
  LOGGED_IN,
} from "../constants/AuthStatus";
const AppContext = React.createContext();
const AppProvider = (props) => {
  let hostName = "http://localhost:8000/";
  if (process.env.NODE_ENV === "development") {
    hostName = "http://localhost:8000/";
  } else if (process.env.NODE_ENV === "production") {
    hostName = "https://we.com/";
  }
  const host=hostName;
  const [authStatus, setAuthStatus] = useState(NOT_LOGGED_IN);
  const [errorMessage, setErrorMessage] = useState("");
  const [userId, setUserId] = useState(0);
  const [userName, setUserName] = useState("");
  const [userNameInput, setUserNameInput] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userRole, setUserRole] = useState("");
  const [cart, setCart] = useLocalStorage("cart", []);
  function changeAuthStatusLogin() {
    setAuthStatus(LOG_IN_FORM);
  }
  function changeAuthStatusSignup() {
    setAuthStatus(SIGN_UP_FORM);
  }
  function handleUserNameInput(changeEvent) {
    let updatedUserName = changeEvent.target.value;
    setUserNameInput(updatedUserName);
  }
  function handleUserEmail(changeEvent) {
    let updatedUserEmail = changeEvent.target.value;
    setUserEmail(updatedUserEmail);
  }
  function handleUserPassword(changeEvent) {
    let updatedUserPassword = changeEvent.target.value;
    setUserPassword(updatedUserPassword);
  }
  const signup = () => {
    axios.defaults.withCredentials = true;
    // CSRF COOKIE
    axios.get(hostName + "sanctum/csrf-cookie").then(
      (response) => {
        // SIGNUP / REGISTER
        axios
          .post(hostName + "api/register", {
            name: userNameInput,
            email: userEmail,
            password: userPassword,
          })
          .then(
            (response) => {
              // GET USER
              history.push("/profile");
            },
            // SIGNUP ERROR
            (error) => {
              if (error.response.data.errors.name) {
                setErrorMessage(error.response.data.errors.name[0]);
              } else if (error.response.data.errors.email) {
                setErrorMessage(error.response.data.errors.email[0]);
              } else if (error.response.data.errors.password) {
                setErrorMessage(error.response.data.errors.password[0]);
              } else if (error.response.data.message) {
                setErrorMessage(error.response.data.message);
              } else {
                setErrorMessage("Could not complete the sign up");
              }
            }
          );
      },
      // COOKIE ERROR
      (error) => {
        setErrorMessage("Could not complete the sign up");
      }
    );
  };
  const login = () => {
    setAuthStatus(LOGGED_IN);
    axios.defaults.withCredentials = true;
    // CSRF COOKIE  
    axios.get(hostName + "sanctum/csrf-cookie").then(
      (response) => {
        // LOGIN
        axios
          .post(hostName + "api/login", {
            email: userEmail,
            password: userPassword,
          })
          .then(
            (response) => {
              
              console.log("li");
              history.push("/profile");
            },
            // LOGIN ERROR
            (error) => {
              if (error.response) {
                setErrorMessage(error.response.data.message);
              } else {
                setErrorMessage("Could not complete the login");
              }
            }
          );
      },
      // COOKIE ERROR
      (error) => {
        setErrorMessage("Could not complete the login");
      }
    );
    
  };

  function getprofile() {
    axios.defaults.withCredentials = true;
    axios.get('http://localhost:8000/sanctum/csrf-cookie').then(response => {
        // Login...
    axios.get("http://localhost:8000/api/user").then(
      (response) => {
        // LOGIN
                  setUserId(response.data.id);
                  setUserName(response.data.name);
                  setUserRole(response.data.role_id);
                  setErrorMessage("");
                  setAuthStatus(LOGGED_IN);
                },
                // GET USER ERROR
                (error) => {
                 console.log(error);
                 history.push("/auth");
                }
    );
              });
  }

  function getprofileforbuying() {
    axios.defaults.withCredentials = true;
    axios.get('http://localhost:8000/sanctum/csrf-cookie').then(response => {
        // Login...
    axios.get("http://localhost:8000/api/user").then(
      (response) => {
        // LOGIN
                  setUserId(response.data.id);
                  setUserName(response.data.name);
                  setUserRole(response.data.role_id);
                  setErrorMessage("");
                  setAuthStatus(LOGGED_IN);
                },
                // GET USER ERROR
                (error) => {
                 console.log(error);
                 return false;
                }
    );
              });
  }
  function logout() {
    out();
    setUserId(0);
    setUserName("");
    setUserNameInput("");
    setUserEmail("");
    setUserPassword("");
    setAuthStatus(NOT_LOGGED_IN);
    history.push("/auth");
  }
  function out(){
    axios.defaults.withCredentials = true;
    return axios.get(hostName + "api/logout");

  }

  return (
    <AppContext.Provider
      value={{
        host,
        authStatus,
        changeAuthStatusLogin,
        changeAuthStatusSignup,
        userId,
        userName,
        userNameInput,
        userEmail,
        userPassword,
        userRole,
        handleUserNameInput,
        handleUserEmail,
        handleUserPassword,
        signup,
        login,
        logout,
        getprofile,
        getprofileforbuying,
        errorMessage,
        cart,
        setCart,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
