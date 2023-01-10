import React, { useEffect } from "react";

export default function DeleteItem({
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
    fetch("http://localhost:8080/api/assets/" + itemid, {
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
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Delete Item
              </h1>
              <button
                onClick={() => deletePopUpClose(true)}
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <h1 className="modal-title fs-5">
                Are you sure you want to delete this item{" "}
                <i className="bi bi-question-circle"></i>
              </h1>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={removeItem}
                className="btn btn-primary"
              >
                YES
              </button>
              <button
                onClick={() => deletePopUpClose(true)}
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
