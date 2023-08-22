import React, { useCallback, useEffect, useState } from "react";
import { APIUrl } from "../../auth/constants";
import Header from "../inventory/Header";
import { dateFormate, dateTimeFormate } from "../util";
import EditProfile from "./EditProfile";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../util/Loader";
export default function UserProfiles() {
  const [userInfo, setUserInfo] = useState(null);
  const [itemData, setItemdata] = useState({});
  const [editPopUp, setEditPopUp] = useState(true);
  const [itemStatus, setItemStatus] = useState(false);
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
        console.log("User Profile : ", res, itemStatus);
      })
      .catch((err) => {
        console.log("User Not Get : ", err);
      });
  }, [itemStatus]);
  useEffect(() => {
    getUsers();
    setItemStatus(false);
  }, [getUsers]);
  const setEditProfile = () => {
    setEditPopUp(false);
    setItemdata(userInfo);
  };
  const getUploadImage = (e) => {
    let tokenValue = window.localStorage.getItem("am_token");
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    console.log(e.target.files[0]);
    if (userInfo)
      fetch(APIUrl + "api/image/" + userInfo.id, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: "Bearer " + tokenValue,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          console.log("User Profile Image : ", res);
          setItemStatus(true);
          toast.success("Profile image uploaded successfully.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            theme: "colored",
          });
        })
        .catch((err) => {
          console.log("User Profile Image Not upload : ", err);
        });
  };
  return (
    <>
      <ToastContainer />
      <Header title="User Profile" />
      {userInfo ? (
        <div className="container">
          <div className="row mx-5">
            <div className="col mt-4">
              <div className="profiles">
                <div className="upload-btn-wrapper">
                  {userInfo && userInfo.imageUrl ? (
                    <img
                      className="profileimage2"
                      src={userInfo.imageUrl}
                      alt=""
                    />
                  ) : (
                    <i
                      className="bi bi-person profileimage"
                      style={{ color: "#333" }}
                    ></i>
                  )}

                  <i
                    className="bi bi-pen profileedit"
                    style={{ color: "#333" }}
                  ></i>
                  <input
                    type="file"
                    title="Click here for update profile Photo"
                    onChange={getUploadImage}
                    name="image"
                  />
                </div>
                {/* <button
                className="btn btn-success profilebtn3"
                onClick={uploadImage}
              >
                <i
                  className="bi bi-person"
                  style={{
                    color: "#fff",
                    marginRight: "8px",
                    fontSize: "20px",
                  }}
                ></i>{" "}
                Upload
              </button> */}
                <button
                  className="btn btn-success profilebtn"
                  onClick={setEditProfile}
                >
                  <i
                    className="bi bi-person-plus"
                    style={{
                      color: "#fff",
                      marginRight: "8px",
                      fontSize: "20px",
                    }}
                  ></i>{" "}
                  Update Profile
                </button>
              </div>
              <hr className="mb-3" />
              <dl className="row mb-1">
                <dt className="col-sm-2">Employee Name</dt>
                <dd className="col-sm-4">
                  {userInfo?.displayName ? userInfo?.displayName : "-"}
                </dd>
                <dt className="col-sm-2">Email-id</dt>
                <dd className="col-sm-4">
                  {userInfo?.email ? userInfo?.email : "-"}
                </dd>
              </dl>
              <dl className="row mb-1">
                <dt className="col-sm-2">Modified Date</dt>
                <dd className="col-sm-4">
                  {dateTimeFormate(userInfo?.modifiedDate)}
                </dd>
                <dt className="col-sm-2">Designation</dt>
                <dd className="col-sm-4">
                  {userInfo?.designation ? userInfo?.designation : "-"}
                </dd>
              </dl>
              <dl className="row mb-1">
                <dt className="col-sm-2">Employee Id</dt>
                <dd className="col-sm-4">
                  {userInfo?.employeeId ? userInfo?.employeeId : "-"}
                </dd>
                <dt className="col-sm-2">Address</dt>
                <dd className="col-sm-4">
                  {userInfo?.tempAddress ? userInfo?.tempAddress : "-"}
                </dd>
              </dl>
              <dl className="row mb-1">
                <dt className="col-sm-2">Permanent Address</dt>
                <dd className="col-sm-4">
                  {userInfo?.permanentAddress
                    ? userInfo?.permanentAddress
                    : "-"}
                </dd>
                <dt className="col-sm-2">City</dt>
                <dd className="col-sm-4">
                  {userInfo?.city ? userInfo?.city : "-"}
                </dd>
              </dl>
              <dl className="row mb-1">
                <dt className="col-sm-2">State</dt>
                <dd className="col-sm-4">
                  {userInfo?.state ? userInfo?.state : "-"}
                </dd>
                <dt className="col-sm-2">PinCode</dt>
                <dd className="col-sm-4">
                  {userInfo?.pinCode ? userInfo?.pinCode : "-"}
                </dd>
              </dl>
              <dl className="row mb-1">
                <dt className="col-sm-2">Office Location</dt>
                <dd className="col-sm-4">
                  {userInfo?.ofcLocation ? userInfo?.ofcLocation : "-"}
                </dd>
                <dt className="col-sm-2">Manager Name</dt>
                <dd className="col-sm-4">
                  {userInfo?.managerName ? userInfo?.managerName : "-"}
                </dd>
              </dl>
              <dl className="row mb-1">
                <dt className="col-sm-2">Mobile Number</dt>
                <dd className="col-sm-4">
                  {userInfo?.mobileNumber ? userInfo?.mobileNumber : "-"}
                </dd>
                <dt className="col-sm-2">Emergency Number</dt>
                <dd className="col-sm-4">
                  {userInfo?.emergencyMobileNumber
                    ? userInfo?.emergencyMobileNumber
                    : "-"}
                </dd>
              </dl>
              <dl className="row mb-1">
                <dt className="col-sm-2">Gender</dt>
                <dd className="col-sm-4">
                  {userInfo?.gender ? userInfo?.gender : "-"}
                </dd>
                <dt className="col-sm-2">Type</dt>
                <dd className="col-sm-4">
                  {userInfo?.type ? userInfo?.type : "-"}
                </dd>
              </dl>
              <dl className="row mb-1">
                <dt className="col-sm-2">Category</dt>
                <dd className="col-sm-4">
                  {userInfo?.category ? userInfo?.category : "-"}
                </dd>
                <dt className="col-sm-2">Department</dt>
                <dd className="col-sm-4">
                  {userInfo?.department ? userInfo?.department : "-"}
                </dd>
              </dl>
              <dl className="row mb-1">
                <dt className="col-sm-2">Date of Birth</dt>
                <dd className="col-sm-4">
                  {userInfo?.dob ? dateFormate(userInfo?.dob) : "-"}
                </dd>
                <dt className="col-sm-2">PAN Number</dt>
                <dd className="col-sm-3">
                  {userInfo?.pan ? userInfo?.pan : "-"}
                </dd>
              </dl>
              <dl className="row mb-1">
                <dt className="col-sm-2">Date of Joining</dt>
                <dd className="col-sm-4">
                  {userInfo?.doj ? dateFormate(userInfo?.doj) : "-"}
                </dd>
                <dt className="col-sm-2">UAN</dt>
                <dd className="col-sm-3">
                  {userInfo?.uan ? userInfo?.uan : "-"}
                </dd>
              </dl>
              <dl className="row mb-1">
                <dt className="col-sm-2">Assigned Projects </dt>
                {userInfo?.projects?.map((row) => (
                  <dd className="col-sm" key={row.projectId}>
                    <span
                      style={{
                        backgroundColor: "#f1eed2",
                        color: "#333",
                        padding: "5px 10px",
                      }}
                    >
                      <i
                        className="bi bi-person-vcard "
                        style={{ color: "#333", marginRight: "10px" }}
                      ></i>{" "}
                      {row.name}
                    </span>
                  </dd>
                ))}
              </dl>
              <hr className="mb-3" />
            </div>
            <EditProfile
              token={window.localStorage.getItem("am_token")}
              itemDetails={itemData}
              editPopUp={editPopUp}
              editPopUpClose={(status) => setEditPopUp(status)}
              changeStatus={(status) => setItemStatus(status)}
            />
          </div>
        </div>
      ) : (
        <Loader msg="Profile loading" />
      )}
    </>
  );
}
