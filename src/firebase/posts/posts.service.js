import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

import { db } from "../config";

import { fetchPosts } from "../search/search.api";

function avg(ratings) {
  if (!ratings) return 0;
  const vals = Object.values(ratings);
  if (!vals.length) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export async function getPostsFiltered(sortBy = "recent") {
  const snap = await fetchPosts();

  let posts = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  if (sortBy === "popular") {
    posts.sort((a, b) => (b.likes?.length ?? 0) - (a.likes?.length ?? 0));
  }

  if (sortBy === "rating") {
    posts.sort((a, b) => avg(b.ratings) - avg(a.ratings));
  }

  return posts;
}
export async function getGroupPosts(groupId) {
  const q = query(
    collection(db, "posts"),
    where("groupId", "==", groupId),
    orderBy("createdAt", "desc"),
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}
