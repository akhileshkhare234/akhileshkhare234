import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APIUrl } from "../../auth/constants";
import DeleteItem from "./DeleteItem";
import EditItem from "./EditItem";
import ItemDetails from "./ItemDetails";
import ItemEntry from "./ItemEntry";
import ItemsHistory from "./itemsHistory";
import ItemsList from "./ItemsList";

export default function Items() {
  const navigate = useNavigate();
  const [editPopUp, setEditPopUp] = useState(true);
  const [historiPopUp, setHistoriPopUp] = useState(true);
  const [deletePopUp, setDeletePopUp] = useState(true);
  const [detailsPopUp, setDetailsPopUp] = useState(true);
  const [entryPopUp, setEntryPopUp] = useState(true);
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
  const setHistoryData = (status, id) => {
    setHistoriPopUp(status);
    setItemId(id);
  };
  const getUserData = useCallback(() => {
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
      <ItemEntry
        token={token}
        entryPopUp={entryPopUp}
        entryPopUpClose={(status) => setEntryPopUp(status)}
        changeStatus={(status) => setItemStatus(status)}
      ></ItemEntry>
      <EditItem
        token={token}
        itemDetails={itemData}
        editPopUp={editPopUp}
        editPopUpClose={(status) => setEditPopUp(status)}
        changeStatus={(status) => setItemStatus(status)}
      ></EditItem>
      <DeleteItem
        token={token}
        itemid={itemId}
        deletePopUp={deletePopUp}
        deletePopUpClose={(status) => setDeletePopUp(status)}
        changeStatus={(status) => setItemStatus(status)}
      ></DeleteItem>
      <ItemsHistory
        token={token}
        itemid={itemId}
        historyPopUpOpen={historiPopUp}
        historyPopUpClose={(status) => setHistoriPopUp(status)}
        changeStatus={(status) => setItemStatus(status)}
      ></ItemsHistory>
      <ItemDetails
        itemData={itemData}
        detailsPopUp={detailsPopUp}
        detailsPopUpClose={(status) => setDetailsPopUp(status)}
      ></ItemDetails>
      <ItemsList
        token={token}
        entryPopUpOpen={(status) => setEntryPopUp(status)}
        editPopUpOpen={(status, data) => setEditData(status, data)}
        historyPopUpOpen={(status, data) => setHistoryData(status, data)}
        deletePopUpOpen={(status, id) => {
          setDeletePopUp(status);
          setItemId(id);
        }}
        detailsPopUpOpen={(status, data) => showDetails(status, data)}
        itemStatus={itemStatus}
      ></ItemsList>
    </>
  );
}
