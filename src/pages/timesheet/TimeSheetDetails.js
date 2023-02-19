import React, { useCallback, useEffect, useState } from "react";
import { APIUrl } from "../../auth/constants";
import Header from "../Header";
import { getMonthName, getYears } from "../util.js";
import ProjetcList from "./ProjetcList";

export default function TimeSheetDetails({ projects }) {
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
    <>
      <Header title="Time Sheet Details" />
      <div className="container">
        {/* <hr className="mb-3" /> */}
        <dl className="row mb-1">
          <dt className="col-sm-2">User Name</dt>
          <dd className="col-sm-4">
            {userInfo.displayName ? userInfo.displayName : "-"}
          </dd>
          <dt className="col-sm-2">Email-id</dt>
          <dd className="col-sm-4">{userInfo.email ? userInfo.email : "-"}</dd>
        </dl>
        <dl className="row mb-1">
          <dt className="col-sm-2">Month</dt>
          <dd className="col-sm-4">{getMonthName()}</dd>
          <dt className="col-sm-2">Year</dt>
          <dd className="col-sm-4">{getYears()}</dd>
        </dl>
        <dl className="row mb-1">
          <dt className="col-sm-2">Projetcs</dt>
          <dd className="col-sm-4">
            <ProjetcList projects={projects} />
          </dd>
          <dt className="col-sm-2">Status</dt>
          <dd className="col-sm-4">Open</dd>
        </dl>
      </div>
    </>
  );
}
