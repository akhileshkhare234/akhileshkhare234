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
