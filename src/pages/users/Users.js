import React, { memo, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditUser from "./EditUser";
import UserDetails from "./UserDetails";
import UsersList from "./UserList";
import AssignProject from "./AssignProject";

function UsersComponent() {
  const navigate = useNavigate();
  const [detailsPopUp, setDetailsPopUp] = useState(true);
  const [projectPopUp, setProjectPopUp] = useState(true);
  const [itemData, setItemdata] = useState({});
  const [token, setToken] = useState(null);
  const [editPopUp, setEditPopUp] = useState(true);
  const [itemStatus, setItemStatus] = useState(false);

  const showDetails = (status, data) => {
    console.log("status, data ", status, data);
    setDetailsPopUp(status);
    setItemdata(data);
  };
  const showProjectDetails = (status, data) => {
    console.log("status, data ", status, data);
    setProjectPopUp(status);
    setItemdata(data);
  };

  const checkUser = useCallback(() => {
    // console.log("user checking...");
    let tokenValue = window.localStorage.getItem("am_token");
    if (tokenValue && tokenValue !== "undefined") {
      // console.log("Dashboard Page:User already login!", tokenValue);
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
  const setEditData = (status, data) => {
    setEditPopUp(status);
    setItemdata(data);
  };
  return (
    <>
      <UserDetails
        itemData={itemData}
        detailsPopUp={detailsPopUp}
        detailsPopUpClose={(status) => setDetailsPopUp(status)}
      ></UserDetails>
      <AssignProject
        itemData={itemData}
        projectPopUp={projectPopUp}
        projectPopUpClose={(status) => setProjectPopUp(status)}
        changeStatus={(status) => setItemStatus(status)}
        shouldFetchData={projectPopUp}
      ></AssignProject>
      <UsersList
        token={token}
        userDetails={(status, data) => showDetails(status, data)}
        projectDetails={(status, data) => showProjectDetails(status, data)}
        editPopUpOpen={(status, data) => setEditData(status, data)}
        itemStatus={itemStatus}
      ></UsersList>
      <EditUser
        token={token}
        itemDetails={itemData}
        editPopUp={editPopUp}
        editPopUpClose={(status) => setEditPopUp(status)}
        changeStatus={(status) => setItemStatus(status)}
        shouldFetchData={editPopUp}
      />
    </>
  );
}

export default memo(UsersComponent);
