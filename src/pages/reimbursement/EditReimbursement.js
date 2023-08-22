import React, { useEffect } from "react";
import { APIUrl } from "../../auth/constants";
import { localDateFormate } from "../util.js";
import { ToastContainer, toast } from "react-toastify";
export default function EditReimbursement({
  editPopUp,
  editPopUpClose,
  itemDetails,
  token,
  changeStatus,
}) {
  const editDetails = (event) => {
    event.preventDefault();
    let { comment, differenceAmount, approveAmount, status } = event.target;
    let itemData = {
      id: itemDetails.id,
      type: itemDetails.type,
      unit: itemDetails.unit,
      description: itemDetails.description,
      spentDate: itemDetails.spentDate,
      lastModifiedDate: new Date().toISOString(),
      differenceAmount: differenceAmount.value,
      approveAmount: approveAmount.value,
      status: status.value,
      comment: comment.value,
    };
    console.log(" status.value ", status.value, itemDetails.status);
    if (
      approveAmount.value !== "" &&
      status.value !== "" &&
      itemDetails.status !== "APPROVED"
    ) {
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
    } else {
      toast.warning(
        itemDetails.status === "APPROVED"
          ? "Amount already approved."
          : "Please Enter approve amount and select reimbursement status.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          theme: "colored",
        }
      );
    }
    console.log("itemData : ", itemData);
  };
  const setFormdata = (itemDetails) => {
    console.log("itemDetails : ", itemDetails);
    let ReimbursementForm = document.forms["ReimbursementForm"];
    ReimbursementForm.type.value = itemDetails.type;
    ReimbursementForm.submitAmount.value = itemDetails.submitAmount;
    ReimbursementForm.approveAmount.value = itemDetails.approveAmount;
    ReimbursementForm.differenceAmount.value = itemDetails.differenceAmount;
    ReimbursementForm.spentDate.value = localDateFormate(itemDetails.spentDate);
    ReimbursementForm.submitDate.value = localDateFormate(
      itemDetails.submitDate
    );
  };

  useEffect(() => {
    setFormdata(itemDetails);
  }, [itemDetails]);
  // const setMaxMinDate = (years, months = null, days = null) => {
  //   let today = new Date();
  //   let month = months ? months : today.getMonth() + 1;
  //   let day = days ? days : today.getDate();
  //   let year = today.getFullYear() + years;

  //   let newDate =
  //     year +
  //     "-" +
  //     (month < 10 ? "0" + month : month) +
  //     "-" +
  //     (day < 10 ? "0" + day : day);
  //   return newDate;
  // };

  const diffAmount = (ApproveAmount) => {
    let differenceAmount = document.getElementById("differenceAmount");
    let submitAmount = document.getElementById("submitAmount").value;
    if (ApproveAmount >= 0) {
      differenceAmount.value = submitAmount - ApproveAmount;
    }
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
              onSubmit={editDetails}
            >
              <div className="col-md-6">
                <label className="mb-1">Reimbursement type</label>
                <select name="type" className="form-select rounded-3">
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
                  name="submitAmount"
                  className="form-control rounded-3"
                  id="submitAmount"
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
                  type="number"
                  name="approveAmount"
                  onKeyUp={(e) => diffAmount(e.target.value)}
                  className="form-control rounded-3"
                  id="approveAmount"
                  placeholder="Approve Amount"
                />
              </div>
              <div className="col-md-6">
                <label className="mb-1">Difference Amount</label>
                <input
                  type="text"
                  readOnly
                  name="differenceAmount"
                  className="form-control rounded-3"
                  id="differenceAmount"
                  placeholder="Difference Amount"
                />
              </div>
              <div className="col-md-6">
                <label className="mb-1">Status</label>
                <select name="status" className="form-select rounded-3">
                  <option value="" disabled>
                    Select status
                  </option>
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
      <ToastContainer />
    </div>
  );
}
