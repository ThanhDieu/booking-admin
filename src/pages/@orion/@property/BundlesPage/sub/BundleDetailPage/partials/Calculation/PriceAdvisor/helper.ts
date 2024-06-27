export const average = (arr: number[]): number => {
  const sum = arr.reduce((total, num) => total + num, 0);
  return sum / arr.length;
};

export const median = (arr: number[]): number => {
  const sortedArr = [...arr].sort((a, b) => a - b);
  const middleIndex = Math.floor(sortedArr.length / 2);

  return sortedArr.length % 2 === 1
    ? sortedArr[middleIndex]
    : (sortedArr[middleIndex - 1] + sortedArr[middleIndex]) / 2;
};
