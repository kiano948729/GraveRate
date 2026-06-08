import {
  fetchUsers,
  fetchGroups,
  fetchPosts,
  fetchCemeteries,
} from "./search.api";

const normalize = (s) => (s ?? "").toLowerCase();

export async function searchUsers(term) {
  const snap = await fetchUsers();

  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter(
      (u) =>
        normalize(u.username).includes(term) || normalize(u.bio).includes(term),
    );
}

export async function searchGroups(term) {
  const snap = await fetchGroups();

  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter(
      (g) =>
        normalize(g.name).includes(term) ||
        normalize(g.description).includes(term),
    );
}

export async function searchPosts(term) {
  const snap = await fetchPosts();

  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((p) => normalize(p.description).includes(term));
}

export async function searchCemeteries(term) {
  const snap = await fetchCemeteries();

  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter(
      (c) =>
        normalize(c.name).includes(term) ||
        normalize(c.location).includes(term) ||
        normalize(c.description).includes(term),
    );
}

export async function searchLocations(term) {
  const snap = await fetchCemeteries();

  const locations = [
    ...new Map(
      snap.docs.map((d) => {
        const data = d.data();

        return [
          data.location,
          {
            id: data.location.toLowerCase(),
            name: data.location,
            description: `Locatie van begraafplaatsen`,
          },
        ];
      }),
    ).values(),
  ];

  return locations.filter(
    (l) =>
      normalize(l.name).includes(term) ||
      normalize(l.description).includes(term),
  );
}
