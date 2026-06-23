import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, getDocs, collection, query, where, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/authContext";
import {
  sendFriendRequest,
  removeFriend,
  blockUser,
  unblockUser,
  getOutgoingRequests,
} from "../../firebase/friends/friends.service";
import { reportUser } from "../../firebase/reports/reports.service";
import PostStemp from "../posts/PostStemp";

const REPORT_REASONS = ["Spam", "Ongepaste inhoud", "Intimidatie", "Nep account", "Anders"];

export default function UserProfile() {
  const { uid } = useParams();
  const { currentUser } = useAuth();

  const [posts, setPosts] = useState([]);
  
  const [profile, setProfile] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [requestPending, setRequestPending] = useState(false);
  const [busy, setBusy] = useState(false);

  const [reportModal, setReportModal] = useState(false);
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0]);
  const [reportDetails, setReportDetails] = useState("");
  const [reportSent, setReportSent] = useState(false);

  useEffect(() => {
  async function load() {
    setLoading(true);

    const [profileSnap, currentSnap] = await Promise.all([
      getDoc(doc(db, "users", uid)),
      currentUser ? getDoc(doc(db, "users", currentUser.uid)) : null,
    ]);

    if (profileSnap.exists()) setProfile(profileSnap.data());
    if (currentSnap?.exists()) setCurrentUserData(currentSnap.data());

    const postsQuery = query(
      collection(db, "posts"),
      where("userId", "==", uid)
    );

    const postsSnap = await getDocs(postsQuery);

    setPosts(
      postsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
    );

    if (currentUser) {
      const outgoing = await getOutgoingRequests(currentUser.uid);
      setRequestPending(outgoing.some((r) => r.to === uid));
    }

    setLoading(false);
  }

    load();
  }, [uid, currentUser]);

  if (loading) return <div className="text-white p-6">Laden...</div>;
  if (!profile) return <div className="text-white p-6">Gebruiker niet gevonden.</div>;

  const isSelf = currentUser?.uid === uid;
  const isFriend = currentUserData?.friends?.includes(uid);
  const isBlocked = currentUserData?.blockedUsers?.includes(uid);

  // Can this user see the posts?
  const canSeePosts = !profile.private || isFriend || isSelf;

  async function handleFriendAction() {
    if (!currentUser) return;
    setBusy(true);
    if (isFriend) {
      await removeFriend(currentUser.uid, uid);
    } else if (!requestPending) {
      await sendFriendRequest(currentUser.uid, uid);
      setRequestPending(true);
    }
    const snap = await getDoc(doc(db, "users", currentUser.uid));
    setCurrentUserData(snap.data());
    setBusy(false);
  }

  async function handleBlock() {
    if (!currentUser) return;
    setBusy(true);
    if (isBlocked) {
      await unblockUser(currentUser.uid, uid);
    } else {
      await blockUser(currentUser.uid, uid);
    }
    const snap = await getDoc(doc(db, "users", currentUser.uid));
    setCurrentUserData(snap.data());
    setBusy(false);
  }

  async function handleReport() {
    await reportUser(uid, currentUser.uid, reportReason, reportDetails);
    setReportSent(true);
    setTimeout(() => { setReportModal(false); setReportSent(false); }, 1500);
  }

  const avatarSrc = profile.profilePicture;
// testing data
  console.log("isBlocked:", isBlocked);
  console.log("canSeePosts:", canSeePosts);
  console.log("profile.private:", profile?.private);
  console.log("isFriend:", isFriend);
  console.log("isSelf:", isSelf);


  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      {/* HEADER */}
      <div className="bg-zinc-900 rounded-2xl p-8 mb-6 flex flex-col md:flex-row gap-6 items-center md:items-start">

        {/* AVATAR */}
        <div className="w-32 h-32 rounded-full bg-zinc-800 overflow-hidden shrink-0">
          {avatarSrc ? (
            <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              {profile.username?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <h1 className="text-3xl font-bold">{profile.username}</h1>
            {profile.private && (
              <span className="text-xs bg-zinc-800 px-2 py-1 rounded-full text-zinc-400">
                Privé
              </span>
            )}
          </div>

          <p className="text-zinc-400 mb-4">{profile.bio || "Geen biografie."}</p>

          <div className="flex gap-6 mb-4 text-sm text-zinc-400">
            <span>{profile.friends?.length ?? 0} vrienden</span>
          </div>

          {/* ACTIONS */}
          {!isSelf && currentUser && !isBlocked && (
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleFriendAction}
                disabled={busy || requestPending}
                className="bg-white text-black px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
              >
                {isFriend ? "Vriend verwijderen" : requestPending ? "Verzoek verzonden" : "Vriend toevoegen"}
              </button>

              <button
                onClick={() => setReportModal(true)}
                className="bg-zinc-700 px-4 py-2 rounded-lg text-sm"
              >
                Melden
              </button>
            </div>
          )}

          {!isSelf && currentUser && (
            <button
              onClick={handleBlock}
              disabled={busy}
              className="mt-3 text-sm text-red-400 hover:text-red-300 transition"
            >
              {isBlocked ? "Deblokkeren" : "Blokkeren"}
            </button>
          )}
        </div>
      </div>

      {/* BLOCKED NOTICE */}
      {isBlocked && (
        <div className="bg-zinc-900 rounded-2xl p-6 text-zinc-400 text-center">
          Je hebt deze gebruiker geblokkeerd.
        </div>
      )}

      {/* PRIVATE NOTICE */}
      {!isBlocked && profile.private && !canSeePosts && (
        <div className="bg-zinc-900 rounded-2xl p-6 text-center">
          <p className="text-zinc-400">Dit profiel is privé. Voeg toe als vriend om posts te zien.</p>
        </div>
      )}

      {/* POSTS PLACEHOLDER */}
      {!isBlocked && canSeePosts && (
        <div>
        <PostStemp userId={uid} />
        </div>
      )}

      {/* REPORT MODAL */}
      {reportModal && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setReportModal(false)}
        >
          <div
            className="bg-zinc-900 p-6 rounded-2xl w-full max-w-sm flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold">Gebruiker melden</h2>

            {reportSent ? (
              <p className="text-green-400">Melding verstuurd, bedankt!</p>
            ) : (
              <>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="bg-zinc-800 p-2 rounded-lg text-white"
                >
                  {REPORT_REASONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>

                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Extra toelichting (optioneel)"
                  rows={3}
                  className="bg-zinc-800 p-2 rounded-lg text-white resize-none"
                />

                <div className="flex gap-3">
                  <button
                    onClick={handleReport}
                    className="flex-1 bg-white text-black py-2 rounded-lg font-semibold"
                  >
                    Versturen
                  </button>
                  <button
                    onClick={() => setReportModal(false)}
                    className="flex-1 bg-zinc-700 py-2 rounded-lg"
                  >
                    Annuleren
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
