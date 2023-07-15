exports.paginate = (model, countDocuments) => {
  const page = 1;
  const limit = 2;
  const skip = (page - 1) * limit;
  const endIndex = page * limit;

  // Pagination result
  const pagination = {};
  pagination.currentPage = page;
  pagination.limit = limit;
  pagination.numberOfPages = Math.ceil(countDocuments / limit);

  // next page
  if (endIndex < countDocuments) {
    pagination.next = page + 1;
  }
  if (skip > 0) {
    pagination.prev = page - 1;
  }
  res = model.skip(skip).limit(limit);

  return res;
};
