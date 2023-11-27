import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Items from "./pages/inventory/Items";
import "./App.css";
import DashboardLayout from "./pages/inventory/DashboardLayout";
import UserList from "./pages/users/Users";
import UserProfiles from "./pages/users/UserProfiles";
import { createContext, useCallback, useEffect, useState } from "react";
import { APIUrl } from "./auth/constants";
import UploadCSV from "./pages/inventory/UploadCSV";
// import TimeSheetEntry from "./pages/timesheet/TimeSheetEntry";
import Projects from "./pages/projects/Projects";
import TimeSheets from "./pages/timesheet/TimeSheets";
import Holidays from "./pages/holiday/Holidays";
import Leaves from "./pages/leaves/Leaves";
import Reimbursement from "./pages/reimbursement/Reimbursement";
import Tasks from "./pages/tasks/Tasks";
import { sortBy } from "./util/UtilMethods";
import UserTimeSheet from "./pages/timesheet/UserTimeSheet";

export const UserData = createContext(null);
function App() {
  const [userInfo, setUserInfo] = useState([]);
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const getUsers = useCallback(() => {
    let tokenValue = window.localStorage.getItem("am_token");
    fetch(APIUrl + "api/user/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokenValue,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.role === 2) {
          fetch(APIUrl + "api/users", {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + tokenValue,
            },
          })
            .then((res) => res.json())
            .then((userArray) => {
              // Use the map function to capitalize names
              const capitalizedArray = userArray.map((obj) => ({
                ...obj,
                displayName: capitalize(obj.displayName),
              }));
              userArray = sortBy("displayName", capitalizedArray);
              let proData = sortBy("name", res["userProjectWithAssignedDate"]);
              let userData = {
                ...res,
                userProjectWithAssignedDate: [...proData],
                userList: [...userArray],
              };
              setUserInfo(userData);
              console.log("User Profile : ", userData);
            });
        } else {
          setUserInfo(res);
          console.log("User Profile : ", res);
        }
      })
      .catch((err) => {
        console.log("User Not Get : ", err);
      });
  }, []);
  useEffect(() => {
    getUsers();
    console.log("Routing call");
  }, [getUsers]);
  return (
    <UserData.Provider value={userInfo}>
      <Router>
        <Routes>
          <Route path="/" exact element={<Login />}></Route>
          <Route path="/:?token" element={<Login />}></Route>
          <Route path="/dashboard" exact element={<DashboardLayout />}>
            <Route path="" exact element={<UserProfiles />} />
            <Route path="items" exact element={<Items />} />
            <Route path="timesheet" exact element={<UserTimeSheet />} />
            <Route path="timesheets" exact element={<TimeSheets />} />
            <Route path="users" exact element={<UserList />} />
            <Route path="holidays" exact element={<Holidays />} />
            <Route path="leaves" exact element={<Leaves />} />
            <Route path="userprofile" exact element={<UserProfiles />} />
            <Route path="project" exact element={<Projects />} />
            <Route path="tasks" exact element={<Tasks />} />
            <Route path="reimbursement" exact element={<Reimbursement />} />
            <Route path="uploadcsv" exact element={<UploadCSV />} />
          </Route>
        </Routes>
      </Router>
    </UserData.Provider>
  );
}

export default App;
