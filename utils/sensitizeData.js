exports.sensitizeUser = (user) => {
  return {
    name: user.name,
    email: user.email,
    overallScore: user.overallScore,
  };
};
