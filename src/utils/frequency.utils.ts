export const isFrequencyCorrect = (expected: number, received: number) => {
  return received <= expected + 5 && received >= expected - 5;
};