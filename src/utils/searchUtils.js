export function averageRating(ratings) {
  if (!ratings) return 0;

  const values = Object.values(ratings);
  if (!values.length) return 0;

  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function sortPosts(posts, sortBy) {
  const list = [...posts];

  if (sortBy === "popular") {
    return list.sort((a, b) => (b.likes?.length ?? 0) - (a.likes?.length ?? 0));
  }

  if (sortBy === "rating") {
    return list.sort(
      (a, b) => averageRating(b.ratings) - averageRating(a.ratings),
    );
  }

  return list;
}

export function sortCemeteries(cemeteries, sortBy) {
  const list = [...cemeteries];

  if (sortBy === "rating") {
    return list.sort(
      (a, b) =>
        averageRating(b.averageRatings) - averageRating(a.averageRatings),
    );
  }

  return list;
}
