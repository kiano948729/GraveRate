export function calculateAverageRating(ratings) {
  if (!ratings) return 0;

  const values = Object.values(ratings);
  if (!values.length) return 0;

  return values.reduce((sum, v) => sum + v, 0) / values.length;
}