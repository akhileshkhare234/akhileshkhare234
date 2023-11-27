const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const getCurrentWeek = () => {
  const today = new Date();
  const currentDay = today.getDay() || 7;
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - currentDay + 1);
  const endDate = new Date(today);
  endDate.setDate(today.getDate() - currentDay + 7);
  return { startDate, endDate };
};

const updateWeek = (currentWeek, weekOffset) => {
  const startDate = new Date(currentWeek.startDate);
  startDate.setDate(startDate.getDate() + weekOffset * 7);
  const endDate = new Date(currentWeek.endDate);
  endDate.setDate(endDate.getDate() + weekOffset * 7);
  return { startDate, endDate };
};

const displayWeek = (week) =>
  Object.assign(
    {},
    {
      startWeek: formatDate(week.startDate),
      endWeek: formatDate(week.endDate),
    }
  );

export const getWeekValue = (value) => {
  const currentWeek = getCurrentWeek();
  const updatedWeek = updateWeek(currentWeek, value);
  return displayWeek(updatedWeek);
};

// const prevWeekButton = document.getElementById("prevWeek");
// prevWeekButton.addEventListener("click", () => {
//   const currentWeek = getCurrentWeek();
//   const updatedWeek = updateWeek(currentWeek, -1);
//   displayWeek(updatedWeek);
// });

// const nextWeekButton = document.getElementById("nextWeek");
// nextWeekButton.addEventListener("click", () => {
//   const currentWeek = getCurrentWeek();
//   const updatedWeek = updateWeek(currentWeek, 1);
//   displayWeek(updatedWeek);
// });

// Initial display of the current week
// export const currentWeek = getCurrentWeek();
// getWeekValue(value);
