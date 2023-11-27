export const sortBy = (field, userArray, sortStatus = false) => {
  let newArray = sortStatus
    ? userArray.sort((p, n) =>
        p[field].toUpperCase() < n[field].toUpperCase()
          ? 1
          : p[field].toUpperCase() === n[field].toUpperCase()
          ? 0
          : -1
      )
    : userArray.sort((p, n) =>
        p[field].toUpperCase() < n[field].toUpperCase()
          ? -1
          : p[field].toUpperCase() === n[field].toUpperCase()
          ? 0
          : 1
      );
  return newArray;
};
