import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Items from "./pages/Items";
import "./App.css";
import DashboardLayout from "./pages/DashboardLayout";
import UserList from "./pages/users/Users";
import UserProfiles from "./pages/UserProfiles";
import { createContext, useCallback, useEffect, useState } from "react";
import { APIUrl } from "./auth/constants";
import UploadCSV from "./pages/UploadCSV";
import UserTimeSheet from "./pages/timesheet/UserTimeSheet";

export const UserData = createContext(null);
function App() {
  const [userInfo, setUserInfo] = useState([]);
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
        setUserInfo(res);
        console.log("User Profile : ", res);
      })
      .catch((err) => {
        console.log("User Not Get : ", err);
      });
  }, []);
  useEffect(() => {
    getUsers();
  }, [getUsers]);
  return (
    <UserData.Provider value={userInfo}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/:?token" element={<Login />}></Route>
          <Route path="/dashboard" exact element={<DashboardLayout />}>
            <Route path="" exact element={<UserProfiles />} />
            <Route path="items" exact element={<Items />} />
            <Route path="timesheet" exact element={<UserTimeSheet />} />
            <Route path="users" exact element={<UserList />} />
            <Route path="userprofile" exact element={<UserProfiles />} />
            <Route path="uploadcsv" exact element={<UploadCSV />} />
          </Route>
        </Routes>
      </Router>
    </UserData.Provider>
  );
}

export default App;
