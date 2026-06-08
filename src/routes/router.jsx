import {
  createBrowserRouter,
  Link,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Profile from "../pages/Auth/profile";
import ProtectedRoute from "./ProtectedRoute";
import Search from "../pages/Search/Search";
import Groups from "../pages/Groups/Groups";
import GroupDetail from "../pages/Groups/GroupDetail";
import { useAuth } from "../context/authContext";
import Notifications from "../pages/Notifications/Notifications";
import Settings from "../pages/Settings/Settings";
import UserProfile from "../pages/User/UserProfile";

function NotificationBell() {
  const { currentUser } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "notifications"),
      where("uid", "==", currentUser.uid),
      where("read", "==", false),
    );
    return onSnapshot(q, (snap) => setUnread(snap.size));
  }, [currentUser]);

  return (
    <Link
      to="/notifications"
      className="relative text-zinc-300 hover:text-white transition"
    >
      notficaties
      {unread > 0 && (
        <span className="absolute -top-1 -right-2 w-4 h-4 bg-white text-black text-xs rounded-full flex items-center justify-center font-bold">
          {unread}
        </span>
      )}
    </Link>
  );
}

function Layout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-zinc-800 px-8 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          GraveRate
        </Link>

        <div className="flex gap-6 items-center">
          <Link to="/" className="text-zinc-300 hover:text-white transition">
            Home
          </Link>
          <Link
            to="/search"
            className="text-zinc-300 hover:text-white transition"
          >
            Zoeken
          </Link>
          <Link
            to="/groups"
            className="text-zinc-300 hover:text-white transition"
          >
            Groepen
          </Link>

          {currentUser ? (
            <>
              <NotificationBell />
              <Link
                to="/profile"
                className="text-zinc-300 hover:text-white transition"
              >
                Profiel
              </Link>
              <button
                onClick={handleLogout}
                className="text-zinc-300 hover:text-white transition"
              >
                Uitloggen
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

function Home() {
  return (
    <div className="p-8">
      <h1 className="text-5xl font-bold mb-4">Welcome to GraveRate</h1>
      <p className="text-zinc-400 max-w-2xl">
        Discover, rate and share peaceful cemeteries and historical graveyards.
      </p>
    </div>
  );
}

function SettingsWrapper() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, "users", currentUser.uid)).then((snap) => {
      if (snap.exists()) setUserData(snap.data());
    });
  }, [currentUser]);

  return <Settings userData={userData} />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "search", element: <Search /> },
      { path: "groups", element: <Groups /> },
      { path: "group/:id", element: <GroupDetail /> },
      { path: "user/:uid", element: <UserProfile /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
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
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <SettingsWrapper />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
