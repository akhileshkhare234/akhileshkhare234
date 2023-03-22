import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { APIUrl } from "../../auth/constants";
import { assignDateFormate } from "../util";
import { userFields } from "./fileds";

export default function EditUser({
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
    if (itemData.employeeId.length === 0) fields["employeeId"] = "Employee Id";
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
    if (
      new Date(itemData.doj).toDateString() ===
      new Date("1/1/1970").toDateString()
    )
      fields["doj"] = "Date of joining";
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
      email,
      displayName,
      designation,
      employeeId,
      ofcLocation,
      tempAddress,
      permanentAddress,
      city,
      state,
      pinCode,
      managerName,
      mobileNumber,
      emergencyMobileNumber,
      gender,
      type,
      department,
      pan,
      dob,
      doj,
      uan,
      role,
    } = event.target;
    let itemData = {
      id: parseInt(itemDetails.id),
      email: email.value,
      displayName: displayName.value,
      designation: designation.value,
      employeeId: employeeId.value,
      ofcLocation: ofcLocation.value,
      tempAddress: tempAddress.value,
      permanentAddress: permanentAddress.value,
      city: city.value,
      state: state.value,
      pinCode: pinCode.value,
      managerName: managerName.value,
      mobileNumber: mobileNumber.value,
      emergencyMobileNumber: emergencyMobileNumber.value,
      gender: gender.value,
      type: type.value,
      department: department.value,
      pan: pan.value,
      dob: dob.value,
      doj: doj.value,
      uan: uan.value,
      role: role.value,
    };
    let blankFields = checkFields(itemData);
    displayName.style.border = "1px solid #ccc";
    designation.style.border = "1px solid #ccc";
    employeeId.style.border = "1px solid #ccc";
    ofcLocation.style.border = "1px solid #ccc";
    tempAddress.style.border = "1px solid #ccc";
    permanentAddress.style.border = "1px solid #ccc";
    city.style.border = "1px solid #ccc";
    state.style.border = "1px solid #ccc";
    pinCode.style.border = "1px solid #ccc";
    mobileNumber.style.border = "1px solid #ccc";
    emergencyMobileNumber.style.border = "1px solid #ccc";
    gender.style.border = "1px solid #ccc";
    pan.style.border = "1px solid #ccc";
    dob.style.border = "1px solid #ccc";
    doj.style.border = "1px solid #ccc";
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
    itemForm.email.value = itemDetails.email;
    itemForm.displayName.value = itemDetails.displayName;
    itemForm.designation.value = itemDetails.designation;
    itemForm.employeeId.value = itemDetails.employeeId;
    itemForm.ofcLocation.value = itemDetails.ofcLocation;
    itemForm.tempAddress.value = itemDetails.tempAddress;
    itemForm.permanentAddress.value = itemDetails.permanentAddress;
    itemForm.city.value = itemDetails.city;
    itemForm.state.value = itemDetails.state;
    itemForm.pinCode.value = itemDetails.pinCode;
    itemForm.managerName.value = itemDetails.managerName;
    itemForm.mobileNumber.value = itemDetails.mobileNumber;
    itemForm.emergencyMobileNumber.value = itemDetails.emergencyMobileNumber;
    itemForm.gender.value = itemDetails.gender;
    itemForm.type.value = itemDetails.type;
    itemForm.department.value = itemDetails.department;
    itemForm.pan.value = itemDetails.pan;
    itemForm.dob.value = assignDateFormate(itemDetails.dob);
    itemForm.doj.value = assignDateFormate(itemDetails.doj);
    itemForm.uan.value = itemDetails.uan;
    itemForm.role.value = itemDetails.role;
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
            <h1 className="fw-bold mb-0 fs-2">Edit User Details</h1>
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
              {userFields.map((field, index) => (
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
              {msgStatus ? (
                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <h5>{msg}</h5>
                </div>
              ) : null}
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button
                  className="mb-2 btn btn-lg rounded-3 btn-primary center profilebtn2"
                  type="submit"
                >
                  Edit User
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
