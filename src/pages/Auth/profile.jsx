import { useEffect, useState } from "react";

import { doc, getDoc } from "firebase/firestore";

import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";

function Profile() {
  const { currentUser } = useAuth();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userRef = doc(db, "users", currentUser.uid);

        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (currentUser) {
      fetchUser();
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="bg-zinc-900 rounded-2xl p-8 mb-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
          {/* PROFILE IMAGE */}
          <div className="w-32 h-32 rounded-full bg-zinc-800 overflow-hidden">
            {userData?.profilePicture ? (
              <img
                src={userData.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                {userData?.username?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* USER INFO */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-4xl font-bold">{userData?.username}</h1>

              <button className="bg-white text-black px-4 py-2 rounded-lg font-semibold">
                Edit Profile
              </button>
            </div>

            <p className="text-zinc-400 mb-4">
              {userData?.bio || "No biography yet."}
            </p>

            {/* STATS */}
            <div className="flex gap-8">
              <div>
                <p className="text-2xl font-bold">{userData?.upvotes || 0}</p>
                <p className="text-zinc-400 text-sm">Upvotes</p>
              </div>

              <div>
                <p className="text-2xl font-bold">
                  {userData?.friends?.length || 0}
                </p>
                <p className="text-zinc-400 text-sm">Friends</p>
              </div>

              <div>
                <p className="text-2xl font-bold">
                  {userData?.graveRobberyPoints || 0}
                </p>
                <p className="text-zinc-400 text-sm">Grave Robbery Points</p>
              </div>
            </div>
          </div>
        </div>

        {/* POSTS SECTION */}
        <div>
          <h2 className="text-2xl font-bold mb-6">User Posts</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* PLACEHOLDER POSTS */}
            <div className="bg-zinc-900 rounded-2xl h-64 flex items-center justify-center text-zinc-500">
              No posts yet
            </div>

            <div className="bg-zinc-900 rounded-2xl h-64 flex items-center justify-center text-zinc-500">
              No posts yet
            </div>

            <div className="bg-zinc-900 rounded-2xl h-64 flex items-center justify-center text-zinc-500">
              No posts yet
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
