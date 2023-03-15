import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddHoliday from "./AddHoliday";
import HolidayList from "./HolidayList";

export default function Holidays() {
  const navigate = useNavigate();
  const [entryPopUp, setEntryPopUp] = useState(true);
  const [token, setToken] = useState(null);
  const [itemStatus, setItemStatus] = useState(false);

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
    checkUser();
    console.log("Item Page itemStatus : ", itemStatus);
    setItemStatus(false);
  }, [checkUser, itemStatus]);
  return (
    <>
      <AddHoliday
        token={token}
        entryPopUp={entryPopUp}
        entryPopUpClose={(status) => setEntryPopUp(status)}
        changeStatus={(status) => setItemStatus(status)}
      ></AddHoliday>
      <HolidayList
        token={token}
        entryPopUpOpen={(status) => setEntryPopUp(status)}
        itemStatus={itemStatus}
      ></HolidayList>
    </>
  );
}
