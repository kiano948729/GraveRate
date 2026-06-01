import { createBrowserRouter, Link, Outlet } from "react-router-dom";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Profile from "../pages/Auth/Profile";
import Posts from "../pages/posts/posts";
import ProtectedRoute from "./ProtectedRoute";
import { useEffect } from "react";
import { testConnection } from "../firebase/testConnection";

function Layout() {
  useEffect(() => {
    testConnection();
  }, []);
  return (
    <div className="min-h-screen bg-black text-white">
      {/* NAVBAR */}
      <nav className="border-b border-zinc-800 px-8 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          GraveRate
        </Link>

        <div className="flex gap-6">
          <Link to="/" className="text-zinc-300 hover:text-white transition">
            Home
          </Link>

          <Link
            to="/profile"
            className="text-zinc-300 hover:text-white transition"
          >
            Profile
          </Link>

          <Link
            to="/login"
            className="text-zinc-300 hover:text-white transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-white text-black px-4 py-2 rounded-lg font-semibold"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

function Home() {
  return (
    <Posts/>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
