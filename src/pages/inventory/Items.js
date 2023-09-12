import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { APIUrl } from "../../auth/constants";
import DeleteItem from "./DeleteItem";
import EditItem from "./EditItem";
import ItemDetails from "./ItemDetails";
import ItemEntry from "./ItemEntry";
import ItemsHistory from "./itemsHistory";
import ItemsList from "./ItemsList";
import { UserData } from "../../App";

function Items() {
  const navigate = useNavigate();
  const userInfo = useContext(UserData);
  const [editPopUp, setEditPopUp] = useState(true);
  const [historiPopUp, setHistoriPopUp] = useState(true);
  const [deletePopUp, setDeletePopUp] = useState(true);
  const [detailsPopUp, setDetailsPopUp] = useState(true);
  const [entryPopUp, setEntryPopUp] = useState(true);
  const [itemData, setItemdata] = useState({});
  const [token, setToken] = useState(null);
  const [itemId, setItemId] = useState(null);
  const [itemStatus, setItemStatus] = useState(false);
  const [userArray, setuserArray] = useState([]);
  const getUsers = useCallback(() => {
    if (userInfo && userInfo?.role === 2) {
      // let tokenValue = window.localStorage.getItem("am_token");
      // fetch(APIUrl + "api/users", {
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: "Bearer " + tokenValue,
      //   },
      // })
      //  .then((res) => {
      //   if (res.status === 401) {
      //     window.localStorage.removeItem("am_token");
      //     navigate("/");
      //   } else return res.json();
      // })
      //   .then((res) => {
      //     let users = res.map((user) => user.displayName + "/" + user.email);
      //     setuserArray([...users]);
      //     // console.log("Users List : ", users);
      //   })
      //   .catch((err) => {
      //     console.log("User Not Get : ", err);
      //   });
      let users = userInfo?.userList.map((user) => {
        return {
          name: user.displayName,
          email: user.email,
          userDetails: user.displayName + "/" + user.email,
        };
      });

      console.log("User Details : ", users);
      setuserArray([...users]);
    } else setuserArray([]);
  }, [userInfo]);
  useEffect(() => {
    console.log("getUsers call");
    getUsers();
  }, [getUsers]);
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
  // const getUserData = useCallback(() => {
  //   token &&
  //     fetch(APIUrl + "api/user/me", {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + token,
  //       },
  //     })
  //      .then((res) => {
  //   if (res.status === 401) {
  //     window.localStorage.removeItem("am_token");
  //     navigate("/");
  //   } else return res.json();
  // })
  //       .then((res) => console.log("User Info "));
  // }, [token]);
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
    // getUserData();
    checkUser();
    console.log("Item Page itemStatus : ", itemStatus);
    setItemStatus(false);
  }, [checkUser, itemStatus]);
  return (
    <>
      <ItemEntry
        token={token}
        userArray={userArray}
        entryPopUp={entryPopUp}
        entryPopUpClose={(status) => setEntryPopUp(status)}
        changeStatus={(status) => setItemStatus(status)}
      ></ItemEntry>
      <EditItem
        token={token}
        userArray={userArray}
        itemDetails={itemData}
        editPopUp={editPopUp}
        editPopUpClose={(status) => setEditPopUp(status)}
        changeStatus={(status) => setItemStatus(status)}
      ></EditItem>
      <DeleteItem
        token={token}
        userArray={userArray}
        itemid={itemId}
        deletePopUp={deletePopUp}
        deletePopUpClose={(status) => setDeletePopUp(status)}
        changeStatus={(status) => setItemStatus(status)}
      ></DeleteItem>
      <ItemsHistory
        token={token}
        userArray={userArray}
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
export default memo(Items);
