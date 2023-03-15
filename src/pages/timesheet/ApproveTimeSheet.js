import React, { useEffect } from "react";
import { APIUrl } from "../../auth/constants";

export default function ApproveTimeSheet({
  approvePopUp,
  approvePopUpClose,
  token,
  itemid,
  changeStatus,
}) {
  useEffect(() => {
    console.log("approvePopUp ", approvePopUp);
  }, [approvePopUp]);
  const approveTimesheet = () => {
    // fetch(APIUrl + "api/assets/" + itemid, {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: "Bearer " + token,
    //   },
    // }).then((res) => {
    //   console.log("Save Item : ", res);
    //   approvePopUpClose(true);
    //   changeStatus(true);
    // });
  };
  return (
    <>
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
                Approve TimeSheet
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
                approve this TimeSheet <i className="bi bi-question-circle"></i>
              </h1>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={approveTimesheet}
                className="btn btn-primary"
              >
                YES
              </button>
              <button
                onClick={() => approvePopUpClose(true)}
                type="button"
                className="btn btn-primary"
              >
                NO
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
