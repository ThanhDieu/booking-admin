export const calculatePrice = (standard = 0, overwrite?: number, discount?: number): number => {
  const cal = (type: 'overwrite' | 'discount', x: number, y: number) => {
    if (type === 'overwrite') return Number((((x - y) / x) * 100).toFixed());
    return Number((x * (1 - y / 100)).toFixed());
  };

  if (overwrite && !discount) {
    const result = cal('overwrite', standard, overwrite);
    return result < 0 ? 0 : result;
  } else if (!overwrite && discount !== undefined) {
    const result = cal('discount', standard, discount);
    return result < 0 ? 0 : result;
  } else {
    return 0;
  }
};
