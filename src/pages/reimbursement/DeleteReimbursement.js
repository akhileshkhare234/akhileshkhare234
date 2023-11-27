import React, { useEffect } from "react";
import { APIUrl } from "../../auth/constants";

export default function DeleteReimbursement({
  deletePopUp,
  deletePopUpClose,
  token,
  itemid,
  changeStatus,
}) {
  useEffect(() => {
    console.log("deletePopUp ", deletePopUp);
  }, [deletePopUp]);
  const removeItem = () => {
    fetch(APIUrl + "api/reimbursement/" + itemid, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }).then((res) => {
      console.log("Save Item : ", res);
      deletePopUpClose(true);
      changeStatus(true);
    });
  };
  return (
    <>
      {/* aria-hidden="true" */}
      <div
        className={
          "modal modal-signin position-static d-block bg-secondary py-5 " +
          (deletePopUp ? "closePopUp" : "displayPopUp")
        }
        role="dialog"
        id="deleteReimbursement"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Delete Reimbursement
              </h1>
              <button
                onClick={() => deletePopUpClose(true)}
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body" id="deleteReimbursementbody">
              <h1 className="modal-title fs-6">
                <i className="bi bi-trash iconBg"></i> Are you sure you want to
                delete this Reimbursement{" "}
                <i className="bi bi-question-circle"></i>
              </h1>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={removeItem}
                className="btn btn-primary"
                id="yesbtn"
              >
                YES
              </button>
              <button
                onClick={() => deletePopUpClose(true)}
                type="button"
                className="btn btn-primary"
                id="nobtn"
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
