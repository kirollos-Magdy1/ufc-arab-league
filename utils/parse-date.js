function monthToIndex(month) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return (
    monthNames.findIndex((m) => m.toLowerCase() === month.toLowerCase()) + 1
  );
}

function parseDate(dateString) {
  const parts = dateString.split("_");

  const month = parts[0];
  const day = parseInt(parts[1]);
  const year = parseInt(parts[2]);

  return (date = new Date(year, monthToIndex(month) - 1, day));
}

module.exports = parseDate;
