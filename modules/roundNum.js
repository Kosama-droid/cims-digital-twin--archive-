export default roundNum = (num, decimals = 1) => {
  const multiplier = 10 ** decimals;
  const result = Math.round(num * multiplier) / multiplier;
  return result;
};
