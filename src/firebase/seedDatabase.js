import { db } from "./config";

import { collection, addDoc, Timestamp } from "firebase/firestore";

export async function seedDatabase() {
  try {
    console.log("Seeding database...");

    // =========================
    // USERS
    // =========================

    const user1 = await addDoc(collection(db, "users"), {
      username: "bart",
      email: "bart@graverate.com",
      bio: "Photography enthusiast",
      profilePicture: "",
      private: false,
      friends: [],
      blockedUsers: [],
      upvotes: 120,
      graveRobberyPoints: 15,
      createdAt: Timestamp.now(),
    });

    const user2 = await addDoc(collection(db, "users"), {
      username: "kiano",
      email: "kiano@graverate.com",
      bio: "Architecture lover",
      profilePicture: "",
      private: false,
      friends: [],
      blockedUsers: [],
      upvotes: 95,
      graveRobberyPoints: 8,
      createdAt: Timestamp.now(),
    });

    // =========================
    // CEMETERIES
    // =========================

    const cemetery1 = await addDoc(collection(db, "cemeteries"), {
      name: "Rustoord Nijmegen",
      location: "Nijmegen",
      description: "Peaceful cemetery surrounded by trees.",
      averageRatings: {
        environment: 5,
        peace: 5,
        architecture: 4,
        uniqueness: 4,
      },
      savedBy: [],
      createdAt: Timestamp.now(),
    });

    const cemetery2 = await addDoc(collection(db, "cemeteries"), {
      name: "Old Graveyard Arnhem",
      location: "Arnhem",
      description: "Historic cemetery with gothic architecture.",
      averageRatings: {
        environment: 4,
        peace: 4,
        architecture: 5,
        uniqueness: 5,
      },
      savedBy: [],
      createdAt: Timestamp.now(),
    });

    // =========================
    // POSTS
    // =========================

    const post1 = await addDoc(collection(db, "posts"), {
      userId: user1.id,
      cemeteryId: cemetery1.id,
      description: "Very calm atmosphere during sunset.",
      mediaUrl: "",
      mediaType: "image",
      likes: [],
      commentsCount: 0,
      ratings: {
        environment: 5,
        peace: 5,
        architecture: 4,
        uniqueness: 3,
      },
      createdAt: Timestamp.now(),
    });

    const post2 = await addDoc(collection(db, "posts"), {
      userId: user2.id,
      cemeteryId: cemetery2.id,
      description: "Beautiful old statues and pathways.",
      mediaUrl: "",
      mediaType: "image",
      likes: [],
      commentsCount: 0,
      ratings: {
        environment: 4,
        peace: 4,
        architecture: 5,
        uniqueness: 5,
      },
      createdAt: Timestamp.now(),
    });

    // =========================
    // COMMENTS
    // =========================

    await addDoc(collection(db, "comments"), {
      postId: post1.id,
      userId: user2.id,
      text: "Amazing lighting!",
      createdAt: Timestamp.now(),
    });

    await addDoc(collection(db, "comments"), {
      postId: post2.id,
      userId: user1.id,
      text: "Love the architecture here.",
      createdAt: Timestamp.now(),
    });

    // =========================
    // GROUPS
    // =========================

    await addDoc(collection(db, "groups"), {
      name: "Cemetery Photography NL",
      description: "Photography focused cemetery exploration.",
      private: false,
      ownerId: user1.id,
      members: [user1.id, user2.id],
      createdAt: Timestamp.now(),
    });

    await addDoc(collection(db, "groups"), {
      name: "Historic Graveyards",
      description: "Exploring historic cemeteries.",
      private: true,
      ownerId: user2.id,
      members: [user2.id],
      createdAt: Timestamp.now(),
    });

    // =========================
    // NOTIFICATIONS
    // =========================

    await addDoc(collection(db, "notifications"), {
      userId: user1.id,
      type: "like",
      message: "Someone liked your post.",
      read: false,
      createdAt: Timestamp.now(),
    });

    // =========================
    // REPORTS
    // =========================

    await addDoc(collection(db, "reports"), {
      reportedUserId: user2.id,
      reason: "Spam content",
      status: "pending",
      createdAt: Timestamp.now(),
    });

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Seed error:", error);
  }
}
