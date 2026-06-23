import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../firebase/notifications/notifications.service";
import {
  acceptFriendRequest,
  declineFriendRequest,
} from "../../firebase/friends/friends.service";

const TYPE_LABELS = {
  friend_request: "heeft je een vriendschapsverzoek gestuurd",
  friend_accepted: "heeft je vriendschapsverzoek geaccepteerd",
  report_received: "Je melding is ontvangen",
};

export default function Notifications() {
  const { currentUser } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await getNotifications(currentUser.uid);
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    if (currentUser) load();
  }, [currentUser]);

  async function handleMarkAllRead() {
    await markAllNotificationsRead(currentUser.uid);
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  async function handleRead(id) {
    await markNotificationRead(id);
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  async function handleAccept(notification) {
    const { requestId, fromUid } = notification.data;
    await acceptFriendRequest(requestId, fromUid, currentUser.uid);
    await handleRead(notification.id);
    load();
  }

  async function handleDecline(notification) {
    const { requestId } = notification.data;
    await declineFriendRequest(requestId);
    await handleRead(notification.id);
    load();
  }

  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <div className="max-w-2xl mx-auto p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Notificaties{" "}
          {unreadCount > 0 && (
            <span className="text-base bg-white text-black px-2 py-0.5 rounded-full font-semibold ml-2">
              {unreadCount}
            </span>
          )}
        </h1>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-sm text-zinc-400 hover:text-white transition"
          >
            Alles als gelezen markeren
          </button>
        )}
      </div>

      {loading && <p className="text-zinc-500">Laden...</p>}

      {!loading && items.length === 0 && (
        <p className="text-zinc-500">Geen notificaties.</p>
      )}

      <div className="space-y-2">
        {items.map((n) => (
          <div
            key={n.id}
            onClick={() => !n.read && handleRead(n.id)}
            className={`p-4 rounded-xl flex items-start justify-between gap-4 cursor-pointer transition
              ${n.read ? "bg-zinc-900" : "bg-zinc-800 border border-zinc-700"}`}
          >
            <div className="flex items-center gap-3">
              {!n.read && (
                <span className="w-2 h-2 rounded-full bg-white shrink-0 mt-1" />
              )}
              <p className={n.read ? "text-zinc-400" : "text-white"}>
                {TYPE_LABELS[n.type] ?? n.type}
              </p>
            </div>

            {n.type === "friend_request" && !n.read && (
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAccept(n);
                  }}
                  className="bg-white text-black text-sm px-3 py-1 rounded-lg font-semibold"
                >
                  Accepteren
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDecline(n);
                  }}
                  className="bg-zinc-700 text-sm px-3 py-1 rounded-lg"
                >
                  Weigeren
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
