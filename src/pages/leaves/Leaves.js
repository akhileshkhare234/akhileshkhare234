import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APIUrl } from "../../auth/constants";
import DeleteLeave from "./DeleteLeave";
import EditLeave from "./EditLeave";
import LeaveDetails from "./LeaveDetails";
import AddLeave from "./AddLeave";
import LeaveList from "./LeaveList";
import ApproveLeave from "./ApproveLeave";

export default function Leaves() {
  const navigate = useNavigate();
  const [editPopUp, setEditPopUp] = useState(true);
  const [deletePopUp, setDeletePopUp] = useState(true);
  const [detailsPopUp, setDetailsPopUp] = useState(true);
  const [entryPopUp, setEntryPopUp] = useState(true);
  const [approvePopUp, setapprovePopUp] = useState(true);
  const [itemData, setItemdata] = useState({});
  const [token, setToken] = useState(null);
  const [itemId, setItemId] = useState(null);
  const [itemStatus, setItemStatus] = useState(false);
  const showDetails = (status, data) => {
    setDetailsPopUp(status);
    setItemdata(data);
  };
  const setEditData = (status, data) => {
    setEditPopUp(status);
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
    console.log("Item Page itemStatus : ");
    // setItemStatus(false);
  }, [checkUser]);
  return (
    <>
      <AddLeave
        token={token}
        entryPopUp={entryPopUp}
        entryPopUpClose={(status) => setEntryPopUp(status)}
        changeStatus={(status) => setItemStatus(status)}
      ></AddLeave>
      <EditLeave
        token={token}
        itemDetails={itemData}
        editPopUp={editPopUp}
        editPopUpClose={(status) => setEditPopUp(status)}
        changeStatus={(status) => setItemStatus(status)}
      ></EditLeave>
      <DeleteLeave
        token={token}
        itemid={itemId}
        deletePopUp={deletePopUp}
        deletePopUpClose={(status) => setDeletePopUp(status)}
        changeStatus={(status) => setItemStatus(status)}
      ></DeleteLeave>

      <LeaveDetails
        itemData={itemData}
        detailsPopUp={detailsPopUp}
        detailsPopUpClose={(status) => setDetailsPopUp(status)}
      ></LeaveDetails>
      <LeaveList
        token={token}
        entryPopUpOpen={(status) => setEntryPopUp(status)}
        editPopUpOpen={(status, data) => setEditData(status, data)}
        deletePopUpOpen={(status, id) => {
          setDeletePopUp(status);
          setItemId(id);
        }}
        setApproveData={(status, data) => {
          setapprovePopUp(status);
          setItemdata(data);
        }}
        detailsPopUpOpen={(status, data) => showDetails(status, data)}
        itemStatus={itemStatus}
      ></LeaveList>
      <ApproveLeave
        approvePopUp={approvePopUp}
        itemData={itemData}
        token={token}
        changeStatus={(status) => setItemStatus(status)}
        approvePopUpClose={(status) => setapprovePopUp(status)}
      />
    </>
  );
}
