import React, { memo, useEffect, useState, useRef } from "react";
import { APIUrl } from "../../auth/constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function ApproveLeave({
  approvePopUp,
  approvePopUpClose,
  token,
  itemData,
  changeStatus,
}) {
  const [comments, setComments] = useState(null);
  const commentInput = useRef();
  useEffect(() => {
    console.log("approvePopUp ", approvePopUp);
    if (itemData?.comment) setComments(itemData.comment);
    else setComments("");
  }, [approvePopUp, itemData.comment]);
  const rejectLeave = () => {
    if (comments) {
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
        comment: comments,
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
          commentInput.current.style.border = "2px solid #ccc";
          commentInput.current.className = "commentsclass2";
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
    } else {
      commentInput.current.style.border = "2px solid red";
      commentInput.current.className = "commentsclass";
      toast.warning("Please Enter Comments of Rejected Leave.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "colored",
      });
    }
  };
  const approveLeaveChange = () => {
    if (comments) {
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
        comment: comments,
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
          commentInput.current.style.border = "2px solid #ccc";
          commentInput.current.className = "commentsclass2";
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
    } else {
      commentInput.current.style.border = "2px solid red";
      commentInput.current.className = "commentsclass";
      toast.warning("Please Enter Comments of Approved Leave.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "colored",
      });
    }
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
              <h1 className="modal-title fs-6 ">
                <i className="bi bi-info iconBg"></i> Are you sure you want to
                approve this leave <i className="bi bi-question-circle"></i>
              </h1>
              <div className="row">
                <div className="col-12 text-end mt-3 mb-2">
                  <input
                    ref={commentInput}
                    type="text"
                    style={{ width: "92%", paddingLeft: "10px" }}
                    placeholder="Enter Comments of Accepted/Rejected Leave"
                    defaultValue={comments}
                    onChange={(e) => {
                      e.target.style.border = "2px solid #ccc";
                      e.target.className = "commentsclass2";
                      setComments(e.target.value);
                    }}
                  />
                </div>
              </div>
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
      <ToastContainer />
    </>
  );
}
export default memo(ApproveLeave);
