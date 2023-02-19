export const dateFormate = (dateval) => {
  let date = new Date(dateval);
  var strArray = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var d = date.getDate();
  var m = strArray[date.getMonth()];
  var y = date.getFullYear();
  return "" + (d <= 9 ? "0" + d : d) + "-" + m + "-" + y;
};
export const dateTimeFormate = (dateval) => {
  let date = new Date(dateval ? dateval : "");
  var strArray = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var d = date.getDate();
  var m = strArray[date.getMonth()];
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
const getDays = (year, month) => {
  return new Date(year, month, 0).getDate();
};
const getDayName = (date_val) => {
  // const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const d = new Date(date_val);
  let day = weekday[d.getDay()];
  return day;
};
export const getMonthName = () => {
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
  let dates = new Date().getMonth();
  return monthNames[dates];
};
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
  return dates;
};
