export const monthNames = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];
const monthFullName = [
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
export const dateFormate = (dateval) => {
  let date = new Date(dateval);
  var d = date.getDate();
  var m = monthNames[date.getMonth()];
  var y = date.getFullYear();
  return "" + (d <= 9 ? "0" + d : d) + "-" + m + "-" + y;
};
export const dateTimeFormate = (dateval) => {
  let date = new Date(dateval ? dateval : "");
  var d = date.getDate();
  var m = monthNames[date.getMonth()];
  var y = date.getFullYear();
  let hrs = date.getHours();
  let min = date.getMinutes();
  return (
    "" +
    (d <= 9 ? "0" + d : d) +
    "-" +
    m +
    "-" +
    y +
    " " +
    (hrs > 12 ? hrs - 12 : hrs) +
    ":" +
    min +
    " " +
    (hrs > 12 ? "PM" : "AM")
  );
};
export const assignDateFormate = (dateval) => {
  let date = new Date(dateval);
  var d = date.getDate();
  var m = date.getMonth() + 1;
  var y = date.getFullYear();
  return "" + y + "-" + (m <= 9 ? "0" + m : m) + "-" + (d <= 9 ? "0" + d : d);
};
export const getDateBySelection = (selectedMonth, selectedYear) => {
  let dateVal =
    selectedMonth === getShortMonthByDate(new Date().toLocaleDateString())
      ? new Date().getDate()
      : "30";
  let monthVal = selectedMonth ? selectedMonth : getMonthName();
  let yearVal = selectedYear ? selectedYear : getYears();
  return parseDate(
    dateVal + "/" + (monthNames.indexOf(monthVal) + 1) + "/" + yearVal
  );
};
// Function to parse a date string in DD/MM/YYYY format and return a Date object
export const parseDate = (dateString) => {
  const parts = dateString.split("/");
  if (parts.length !== 3) {
    throw new Error("Invalid date format. Please use DD/MM/YYYY.");
  }
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1] - 1, 10); // Months in JavaScript are 0-based (0 = January)
  const year = parseInt(parts[2], 10);
  return new Date(year, month, day);
};
export const localDateFormate = (dateval) => {
  let date = new Date(dateval);
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();
  return (d <= 9 ? "0" + d : d) + "-" + monthNames[m] + "-" + y;
};
const getDays = (year, month) => {
  return new Date(year, month, 0).getDate();
};
export const getFullDayName = (date_val) => {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const d = new Date(date_val);
  let day = weekday[d.getDay()];
  return day;
};
export const getDayName = (date_val) => {
  // const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const d = new Date(date_val);
  let day = weekday[d.getDay()];
  return day;
};
export const getMonthByDate = (date_val) => {
  return monthFullName[new Date(date_val).getMonth()];
};
export const getShortMonthByDate = (date_val) => {
  return monthNames[new Date(date_val).getMonth()];
};
export const getMonthName = () => {
  let dates = new Date().getMonth();
  return monthNames[dates];
};
export const getMonthFullName = () => {
  let dates = new Date().getMonth();
  return monthFullName[dates];
};

export const getMonths = () => {
  return monthNames;
};
export const getMonthsFullName = () => {
  return monthFullName;
};
export const getMonthValue = (name) => {
  let months = getMonths();
  let index = months.indexOf(name) + 1;
  return index < 10 ? "0" + index : index;
};
export const getMonth = () => new Date().getMonth() + 1;
export const getYears = () => {
  return new Date().getFullYear();
};
export const getMonthDates = (
  month,
  year,
  projects,
  getDates = "Current",
  days = "Working"
) => {
  const dates = [];
  let TotalDates =
    getDates === "Current" ? new Date().getDate() : getDays(year, month);
  for (let I = 1; I <= TotalDates; I++) {
    let details = projects.map((project) => {
      return {
        task: "task_" + I + "_" + project.projectId,
        hour: "hour_" + I + "_" + project.projectId,
        projectId: project.projectId,
      };
    });

    if (days === "Working") {
      if (
        ["Sat", "Sun"].includes(getDayName(month + "/" + I + "/" + year)) ===
        false
      )
        dates.push({
          day: I,
          dayName: getDayName(month + "/" + I + "/" + year),
          details,
        });
    } else {
      dates.push({
        day: I,
        dayName: getDayName(month + "/" + I + "/" + year),
        details,
      });
    }
  }
  // console.log("Time Sheet Data : ", dates, projects);
  return dates;
};

const weekformatDate = (date, project) => {
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-indexed
  const year = date.getFullYear();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayOfWeek = daysOfWeek[date.getDay()]; // Get the day of the week

  return {
    day,
    month,
    year,
    dayOfWeek,
    task: "task_" + day,
    hour: "hour_" + day,
    projectId: project.projectId,
  };
};

const dateRange = function (startDate, endDate, project) {
  const dates = [];
  const currentDate = new Date(startDate);
  console.log(startDate, endDate);
  while (currentDate <= endDate) {
    dates.push(weekformatDate(currentDate, project));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

export const getWeekData = function (selectedWeek, project) {
  // console.log(
  //   "getWeekData data : ",
  //   selectedWeek,
  //   parseDate(selectedWeek.startWeek + ""),
  //   parseDate(selectedWeek.endWeek + ""),
  //   project,
  //   Object.keys(selectedWeek).length > 0 && project?.length > 0
  // );
  if (Object.keys(selectedWeek).length > 0 && project?.length > 0) {
    const startDate = parseDate(selectedWeek?.startWeek);
    const endDate = parseDate(selectedWeek?.endWeek);

    console.log("dateRange ", dateRange(startDate, endDate, project));
    return dateRange(startDate, endDate, project);
  } else {
    return [];
  }
};
