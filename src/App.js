import "./App.css";
import * as React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Books from "./pages/book/books/Books";
import BookDetail from "./pages/book/book-detail/BookDetail";
import Error404 from "./pages/404Error/Error404";
import AddBook from "./pages/book/add/AddBook";
import Home from "./pages/home/Home";
import Forgot from "./components/password-reset/Forgot";
import Reset from "./components/password-reset/Reset";
// Profile Page ...
import Profile from "./pages/profile/Profile";
// IsLoggedIn User For Route Protection.
import AuthService from "./services/Authentication";
import Emailverify from "./components/auth/Emailverify";
// For Toasting ....
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const auth = new AuthService();

  // For Protecting Routes ..
  const AuthenticatedRoute = ({ children }) => {
    const isAuthenticated = auth.isLoggedIn();
    const location = useLocation();
    // not logged in
    if (!isAuthenticated) {
      console.log("not authenticated");
      //toast.info("You Must Be Login !");
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
  };
  // If User Authenticated
  const Authenticated = ({ children }) => {
    const isAuthenticated = auth.isLoggedIn();
    const location = useLocation();
    if (isAuthenticated) {
      return <Navigate to="/books" state={{ from: location }} replace />;
    }
    return children;
  };

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* {auth.isLoggedIn() ? "" : "" } */}
          <Route path="/" index element={<Home />} />
          <Route
            path="/login"
            element={
              <Authenticated>
                <Login />
              </Authenticated>
            }
          />
          <Route
            path="/register"
            element={
              <Authenticated>
                <Register />
              </Authenticated>
            }
          />{" "}
          <Route
            path="/profile"
            element={
              <AuthenticatedRoute>
                <Profile />
              </AuthenticatedRoute>
            }
          />
          <Route path="/add" element={<AddBook />} />
          <Route
            path="/books"
            element={
              <AuthenticatedRoute>
                <Books />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/book/:id"
            element={
              <AuthenticatedRoute>
                <BookDetail />
              </AuthenticatedRoute>
            }
          />
          <Route path="*" element={<Error404 />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/reset/:token" element={<Reset />} />
          <Route path="/activate/:token" element={<Emailverify />} />
        </Routes>
      </BrowserRouter>
      {/* <ToastContainer theme="colored" autoClose={2000} /> */}
    </>
  );
}

export default App;
