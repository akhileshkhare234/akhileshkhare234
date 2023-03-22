import React, { useEffect, useState } from "react";
import { APIUrl } from "../../auth/constants";
import { assignDateFormate } from "../util";
import { profileFileds } from "./profilefileds";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function EditProfile({
  editPopUp,
  editPopUpClose,
  itemDetails,
  token,
  changeStatus,
}) {
  const [msgStatus, setMsgStatus] = useState(false);
  const [msg, setMsg] = useState("");
  const checkFields = (itemData) => {
    let msg = "Please enter ";
    let fields = {};
    if (itemData.displayName.length === 0)
      fields["displayName"] = "Display name";
    if (itemData.city.length === 0) fields["city"] = "City";
    if (itemData.permanentAddress.length === 0)
      fields["permanentAddress"] = "Permanent address";
    if (itemData.mobileNumber.length === 0)
      fields["mobileNumber"] = "Mobile number";
    if (
      new Date(itemData.dob).toDateString() ===
      new Date("1/1/1970").toDateString()
    )
      fields["dob"] = "Date of birth";
    console.log("fields ", Object.keys(fields).length);
    if (Object.keys(fields).length === 0) {
      setMsgStatus(true);
      setMsg("");
      return [];
    } else {
      setMsgStatus(false);
      setMsg(msg + Object.values(fields).join());
      return Object.keys(fields);
    }
  };
  const saveItem = (event) => {
    event.preventDefault();
    let {
      displayName,
      ofcLocation,
      tempAddress,
      permanentAddress,
      city,
      state,
      pinCode,
      mobileNumber,
      emergencyMobileNumber,
      gender,
      dob,
    } = event.target;
    let itemData = {
      id: parseInt(itemDetails.id),
      displayName: displayName.value,
      ofcLocation: ofcLocation.value,
      tempAddress: tempAddress.value,
      permanentAddress: permanentAddress.value,
      city: city.value,
      state: state.value,
      pinCode: pinCode.value,
      mobileNumber: mobileNumber.value,
      emergencyMobileNumber: emergencyMobileNumber.value,
      gender: gender.value,
      dob: dob.value,
    };
    let blankFields = checkFields(itemData);
    displayName.style.border = "1px solid #ccc";
    ofcLocation.style.border = "1px solid #ccc";
    tempAddress.style.border = "1px solid #ccc";
    permanentAddress.style.border = "1px solid #ccc";
    city.style.border = "1px solid #ccc";
    state.style.border = "1px solid #ccc";
    pinCode.style.border = "1px solid #ccc";
    mobileNumber.style.border = "1px solid #ccc";
    emergencyMobileNumber.style.border = "1px solid #ccc";
    gender.style.border = "1px solid #ccc";
    dob.style.border = "1px solid #ccc";
    console.log(msgStatus, blankFields);
    if (msgStatus || blankFields.length === 0) {
      fetch(APIUrl + "api/user", {
        method: "PUT",
        body: JSON.stringify(itemData),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => {
          console.log("Edit user : ", res);
          editPopUpClose(true);
          changeStatus(true);
        })
        .catch((err) => {
          console.log("User Not Edit : ", err);
          editPopUpClose(true);
          changeStatus(false);
        });
    } else {
      blankFields.forEach((field) => {
        event.target[field].style.border = "1px solid red";
      });
    }
    console.log("itemData : ", itemData);
  };
  const setFormdata = (itemDetails) => {
    let itemForm = document.forms["itemForm"];
    itemForm.displayName.value = itemDetails.displayName;
    itemForm.ofcLocation.value = itemDetails.ofcLocation;
    itemForm.tempAddress.value = itemDetails.tempAddress;
    itemForm.permanentAddress.value = itemDetails.permanentAddress;
    itemForm.city.value = itemDetails.city;
    itemForm.state.value = itemDetails.state;
    itemForm.pinCode.value = itemDetails.pinCode;
    itemForm.mobileNumber.value = itemDetails.mobileNumber;
    itemForm.emergencyMobileNumber.value = itemDetails.emergencyMobileNumber;
    itemForm.gender.value = itemDetails.gender;
    itemForm.dob.value = assignDateFormate(itemDetails.dob);
  };
  useEffect(() => {
    setFormdata(itemDetails);
  }, [itemDetails]);
  return (
    <div
      className={
        "modal modal-signin position-static d-block bg-secondary py-1 " +
        (editPopUp ? "closePopUp" : "displayPopUp")
      }
      tabIndex="-1"
      role="dialog"
      id="modalSignin"
    >
      <ToastContainer />
      <div className="modal-dialog modal-xl" role="document">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header p-4 pb-4 border-bottom-0 headercolor bgColor">
            <h1 className="fw-bold mb-0 fs-2">Update Profile</h1>
            <button
              onClick={() => editPopUpClose(true)}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-4">
            <form name="itemForm" className="row g-3" onSubmit={saveItem}>
              {profileFileds.map((field, index) => (
                <div key={index} className="col-md-3">
                  <label htmlFor="floatingInput" className="mb-1">
                    {field.title}
                  </label>
                  {field.type === "text" || field.type === "date" ? (
                    <input
                      type={field.type}
                      name={field.name}
                      className="form-control rounded-3"
                      placeholder={"Enter " + field.title}
                    />
                  ) : (
                    <select
                      className="form-control rounded-3"
                      name={field.name}
                    >
                      {field.values?.map((val, index) => (
                        <option key={index} value={val.value}>
                          {val.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}

              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button
                  className="mb-2 btn btn-lg rounded-3 btn-primary center profilebtn2"
                  type="submit"
                >
                  Update
                </button>
              </div>
            </form>
            {!msgStatus ? (
              <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                <h5 className="errormsg">* {msg}</h5>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
