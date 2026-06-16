import { createBrowserRouter } from "react-router-dom";

import Layout from "../components/layout/Layout";
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/login";
import Register from "../pages/Auth/Register";
import Profile from "../pages/Auth/profile";
import Settings from "../pages/Settings/Settings";
import Search from "../pages/Search/Search";
import Groups from "../pages/Groups/Groups";
import GroupDetail from "../pages/Groups/GroupDetail";
import ProtectedRoute from "./ProtectedRoute";
import Notifications from "../pages/Notifications/Notifications";
import PostStemp from "../pages/posts/postStemp";
import Posts from "../pages/posts/posts";
import UserProfile from "../pages/User/UserProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "search", element: <Search /> },
      { path: "groups", element: <Groups /> },
      { path: "group/:id", element: <GroupDetail /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "postStemp", element: <PostStemp />},
      { path: "posts", element: <Posts /> },
      { path: "user/:uid", element: <UserProfile /> },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: "notifications",
        element: (
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
