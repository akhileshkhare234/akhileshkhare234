import React, { memo, useEffect } from "react";
import { APIUrl } from "../../auth/constants";

function ApproveLeave({
  approvePopUp,
  approvePopUpClose,
  token,
  itemData,
  changeStatus,
}) {
  useEffect(() => {
    console.log("approvePopUp ", approvePopUp);
  }, [approvePopUp]);
  const rejectLeave = () => {
    console.log("Leave Data", itemData);
    let leaveDetails = {
      leaveTo: itemData.leaveTo,
      leaveFrom: itemData.leaveFrom,
      unit: itemData.unit,
      reason: itemData.reason,
      leaveType: itemData.leaveType,
      id: itemData.id,
      status: "Reject",
      department: itemData.department,
      comment: itemData.comment,
      year: itemData.year,
      month: itemData.month,
      email: itemData.email,
    };

    fetch(APIUrl + "api/leave/" + itemData.id, {
      method: "PUT",
      body: JSON.stringify(leaveDetails),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        console.log("Edit Leave : ", res);
        approvePopUpClose(true);
        changeStatus(true);
      })
      .catch((err) => {
        console.log("Leave Not Edit : ", err);
        approvePopUpClose(true);
        changeStatus(false);
      });
    console.log("Leave Data : ", itemData);
  };
  const approveLeaveChange = () => {
    console.log("Leave Data", itemData);
    let leaveDetails = {
      leaveTo: itemData.leaveTo,
      leaveFrom: itemData.leaveFrom,
      unit: itemData.unit,
      reason: itemData.reason,
      leaveType: itemData.leaveType,
      id: itemData.id,
      status: "Approve",
      department: itemData.department,
      comment: itemData.comment,
      year: itemData.year,
      month: itemData.month,
      email: itemData.email,
    };

    fetch(APIUrl + "api/leave/" + itemData.id, {
      method: "PUT",
      body: JSON.stringify(leaveDetails),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        console.log("Edit Leave : ", res);
        approvePopUpClose(true);
        changeStatus(true);
      })
      .catch((err) => {
        console.log("Leave Not Edit : ", err);
        approvePopUpClose(true);
        changeStatus(false);
      });
    console.log("Leave Data : ", itemData);
  };
  return (
    <>
      {/* aria-hidden="true" */}
      <div
        className={
          "modal modal-signin position-static d-block bg-secondary py-5 " +
          (approvePopUp ? "closePopUp" : "displayPopUp")
        }
        role="dialog"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Approve leave
              </h1>
              <button
                onClick={() => approvePopUpClose(true)}
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <h1 className="modal-title fs-6">
                <i className="bi bi-info iconBg"></i> Are you sure you want to
                approve this leave <i className="bi bi-question-circle"></i>
              </h1>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={approveLeaveChange}
                className="btn btn-primary"
              >
                Approve
              </button>
              <button
                onClick={rejectLeave}
                type="button"
                className="btn btn-primary"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default memo(ApproveLeave);
