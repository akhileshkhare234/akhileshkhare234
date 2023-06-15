import React, { useCallback, useEffect, useState } from "react";
import { APIUrl } from "../../auth/constants";
import { localDateFormate } from "../util.js";

export default function EditReimbursement({
  editPopUp,
  editPopUpClose,
  itemDetails,
  token,
  changeStatus,
}) {
  const saveItem = (event) => {
    event.preventDefault();
    let { type, comment, differenceAmonut, approveAmonut, status } =
      event.target;
    //       {
    //         "id": 1,
    //         "spentDate": "2022-12-27T00:00:00.000+00:00",
    // 		"status": "APPROVED",
    // 		"approveAmonut": 750,
    // 		"comment": "Extra things not be eligible for that.",
    // 		"unit": "INR",
    // 		"type": "Party",
    //         "description": "description update by Admin",
    //         "differenceAmonut": 250,
    // 		"lastModifiedDate": "2023-05-30T00:00:00.000+00:00"
    // }
    let itemData = {
      id: itemDetails.id,
      type: type.value,
      description: itemDetails.value,
      submitAmonut: itemDetails.value,
      spentDate: itemDetails.value,
      lastModifiedDate: new Date().toLocaleDateString(),
      differenceAmonut: differenceAmonut.value,
      approveAmonut: approveAmonut.value,
      status: status.value,
      comment: comment.value,
    };
    const dto_object = new Blob([JSON.stringify(itemData)], {
      type: "application/json",
    });
    itemData = JSON.stringify(itemData);
    let formdata = new FormData();

    formdata.append("reimbursement", dto_object);
    fetch(APIUrl + "api/reimbursement", {
      method: "PUT",
      body: formdata,
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        console.log("Edit Item : ", res);
        editPopUpClose(true);
        changeStatus(true);
      })
      .catch((err) => {
        console.log("Item Not Edit : ", err);
        editPopUpClose(true);
        changeStatus(false);
      });
    console.log("itemData : ", itemData);
  };
  const setFormdata = (itemDetails) => {
    console.log("itemDetails : ", itemDetails);
    let ReimbursementForm = document.forms["ReimbursementForm"];
    ReimbursementForm.type.value = itemDetails.type;
    ReimbursementForm.submitAmonut.value = itemDetails.submitAmonut;
    ReimbursementForm.spentDate.value = localDateFormate(itemDetails.spentDate);
    ReimbursementForm.submitDate.value = localDateFormate(
      itemDetails.submitDate
    );
  };

  useEffect(() => {
    setFormdata(itemDetails);
  }, [itemDetails]);
  const setMaxMinDate = (years, months = null, days = null) => {
    let today = new Date();
    let month = months ? months : today.getMonth() + 1;
    let day = days ? days : today.getDate();
    let year = today.getFullYear() + years;

    let newDate =
      year +
      "-" +
      (month < 10 ? "0" + month : month) +
      "-" +
      (day < 10 ? "0" + day : day);
    return newDate;
  };
  const customDateLimiter = (input) => {
    let conditionDates = {
      min: new Date(input.target.min),
      max: new Date(input.target.max),
    };
    const currentDate = new Date(input.target.value);
    if (currentDate < conditionDates.min || currentDate > conditionDates.max) {
      input.preventDefault();
      input.target.value = setMaxMinDate(
        0,
        currentDate.getMonth() + 1,
        currentDate.getDate()
      );
    } else return currentDate;
  };
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
      <div className="modal-dialog modal-xl" role="document">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header p-4 pb-4 border-bottom-0 headercolor bgColor">
            <h1 className="fw-bold mb-0 fs-2">Edit Reimbursement</h1>
            <button
              onClick={() => editPopUpClose(true)}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body p-4">
            <form
              name="ReimbursementForm"
              className="row g-3"
              onSubmit={saveItem}
            >
              <div className="col-md-6">
                <label className="mb-1">Reimbursement type</label>
                <select name="type" className="form-control rounded-3">
                  <option value="Reimbursement type" disabled>
                    Select reimbursement type
                  </option>
                  <option value="Travel">Travel</option>
                  <option value="Office">Office</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Party">Party</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="mb-1">Submit Amount</label>
                <input
                  type="text"
                  name="submitAmonut"
                  className="form-control rounded-3"
                  id="floatingInput"
                  readOnly
                  placeholder="Amount"
                />
              </div>
              <div className="col-md-6">
                <label className="mb-1">Spent Date</label>
                <input
                  type="text"
                  readOnly
                  name="spentDate"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="Enter Assign Date"
                />
              </div>
              <div className="col-md-6">
                <label className="mb-1">Submit Date</label>
                <input
                  type="text"
                  readOnly
                  name="submitDate"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="Enter submit Date"
                />
              </div>
              <div className="col-md-6">
                <label className="mb-1">Approve Amount</label>
                <input
                  type="text"
                  name="approveAmonut"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="Approve Amount"
                />
              </div>
              <div className="col-md-6">
                <label className="mb-1">Difference Amount</label>
                <input
                  type="text"
                  name="differenceAmonut"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="Difference Amount"
                />
              </div>
              <div className="col-md-6">
                <label className="mb-1">Status</label>
                <select name="status" className="form-control rounded-3">
                  <option value="">Select status</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="mb-1">Reimbursement comment</label>
                <input
                  type="text"
                  name="comment"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="Enter Reimbursement comment"
                />
              </div>
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button
                  className="mb-2 btn btn-lg rounded-3 btn-primary center profilebtn2 py-2"
                  type="submit"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
