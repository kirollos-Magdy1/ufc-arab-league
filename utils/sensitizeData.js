exports.sensitizeUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    overallScore: user.overallScore,
  };
};
