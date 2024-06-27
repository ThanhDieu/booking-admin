/* eslint-disable @typescript-eslint/no-explicit-any */
export const searchLocal = <T>(terms: string, items: T[]) => {
  if (!Array.isArray(items)) return [];
  return items.filter((item) => {
    const values = Object.values(item as any);
    const stringfiedValues = JSON.stringify(values).toLowerCase();
    return stringfiedValues.match(terms);
  });
};
