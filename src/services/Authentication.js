import React, { useState, useEffect } from "react";
import Axios from "axios";
class AuthService {
  logout() {
    localStorage.removeItem("x-access-token");
    localStorage.removeItem("userID");
    localStorage.removeItem("userName");
  }
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
  isLoggedIn() {
    return !!localStorage.getItem("x-access-token");
  }
}

export default AuthService;
