import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APIUrl } from "../../auth/constants";
import ViewTimeSheet from "./ViewTimeSheet";
import TimeSheetList from "./TimeSheetList";

export default function TimeSheets() {
  const navigate = useNavigate();

  const [historiPopUp, setHistoriPopUp] = useState(true);

  const [token, setToken] = useState(null);
  const [timeSheetData, settimeSheetData] = useState([]);
  const [itemStatus, setItemStatus] = useState(false);

  const setHistoryData = (status, data) => {
    setHistoriPopUp(status);
    settimeSheetData(data);
  };
  const getUserData = useCallback(() => {
    token &&
      fetch(APIUrl + "api/user/me", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => res.json())
        .then((res) => console.log("User Info ", res));
  }, [token]);
  const checkUser = useCallback(() => {
    console.log("user checking...");
    let tokenValue = window.localStorage.getItem("am_token");
    if (tokenValue && tokenValue !== "undefined") {
      console.log("Dashboard Page:User already login!", tokenValue);
      setToken(tokenValue);
    } else {
      console.log("Invalid Token!", tokenValue);
      navigate("/");
    }
  }, [navigate]);
  useEffect(() => {
    getUserData();
    checkUser();
    console.log("Item Page itemStatus : ", itemStatus);
    setItemStatus(false);
  }, [checkUser, getUserData, itemStatus]);
  return (
    <>
      <ViewTimeSheet
        token={token}
        timeSheetData={timeSheetData}
        historyPopUpOpen={historiPopUp}
        historyPopUpClose={(status) => setHistoriPopUp(status)}
        changeStatus={(status) => setItemStatus(status)}
      ></ViewTimeSheet>

      <TimeSheetList
        token={token}
        historyPopUpOpen={(status, data) => setHistoryData(status, data)}
        itemStatus={itemStatus}
      ></TimeSheetList>
    </>
  );
}
