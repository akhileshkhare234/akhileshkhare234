import React, { useRef, useState } from "react";
import { APIUrl } from "../../auth/constants";
import { ToastContainer, toast } from "react-toastify";
export default function AddReimbursement({
  entryPopUp,
  entryPopUpClose,
  token,
  changeStatus,
}) {
  const [dataStatus, setDataStatus] = useState(false);
  const [saveStatus, setsaveStatus] = useState(false);
  const formRef1 = useRef(null);
  const saveItem = (event) => {
    event.preventDefault();
    setsaveStatus(true);
    let { type, data, description, spentDate, submitDate, unit, submitAmount } =
      event.target;

    if (
      submitAmount.value !== "" &&
      type.value !== "" &&
      data.files.length > 0
    ) {
      let itemData = {
        type: type.value,
        dataType: data.files[0].type,
        description: description.value,
        unit: unit.value,
        submitAmount: submitAmount.value,
        spentDate: spentDate.value,
        submitDate: submitDate.value,
      };
      const dto_object = new Blob([JSON.stringify(itemData)], {
        type: "application/json",
      });
      itemData = JSON.stringify(itemData);
      let formdata = new FormData();
      formdata.append("data", data.files[0]);
      formdata.append("reimbursement", dto_object);

      console.log("Assigned Users : ", data.files[0]);
      fetch(APIUrl + "api/reimbursement", {
        method: "POST",
        body: formdata,
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => {
          console.log("Save Reimbursement : ", res);
          changeStatus(true);
          formRef1.current.reset();
          setsaveStatus(false);
          entryPopUpClose(true);
        })
        .catch((err) => {
          console.log("Reimbursement Not Save : ", err);
          entryPopUpClose(true);
          changeStatus(false);
          setsaveStatus(false);
        });
      console.log("Reimbursement Data : ", itemData);
      setDataStatus(false);
    } else {
      setDataStatus(true);
      toast.warning(
        "Please Enter amount and select reimbursement type and document.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          theme: "colored",
        }
      );
    }
  };
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
        (entryPopUp ? "closePopUp" : "displayPopUp")
      }
      tabIndex="-1"
      role="dialog"
      id="modalSignin"
    >
      <ToastContainer />
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header p-4 pb-4 border-bottom-0 headercolor bgColor">
            <h1 className="fw-bold mb-0 fs-2">Reimbursement Entry Form</h1>
            <button
              onClick={() => {
                entryPopUpClose(true);
                setDataStatus(false);
                formRef1.current.reset();
                setsaveStatus(false);
                console.log(formRef1.current.submitAmount.value);
              }}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-4">
            <form ref={formRef1} className="row g-3" onSubmit={saveItem}>
              <div className="col-md-6">
                <label className="mb-1">Reimbursement type</label>
                <select
                  name="type"
                  className="form-control rounded-3"
                  defaultValue="Reimbursement type"
                >
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
                <label className="mb-1">Reimbursement file</label>
                <input
                  type="file"
                  name="data"
                  className="form-control rounded-3"
                />
              </div>

              <div className="col-md-6">
                <label className="mb-1">Amount</label>
                <input
                  type="number"
                  name="submitAmount"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="Amount"
                />
              </div>
              <div className="col-md-6">
                <label className="mb-1">Amount unit</label>
                <input
                  type="text"
                  name="unit"
                  defaultValue={"INR"}
                  className="form-control rounded-3"
                  placeholder="Amount unit"
                />
              </div>
              <div className="col-md-6">
                <label className="mb-1">Spent Date</label>
                <input
                  type="date"
                  max={setMaxMinDate(10)}
                  defaultValue={setMaxMinDate(0)}
                  onKeyDown={(e) => customDateLimiter(e)}
                  name="spentDate"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="Enter Assign Date"
                />
              </div>

              <div className="col-md-6">
                <label className="mb-1">Submit Date</label>
                <input
                  type="date"
                  defaultValue={setMaxMinDate(0)}
                  name="submitDate"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="Enter submit Date"
                />
              </div>
              <div className="col-md-12">
                <label className="mb-1">Reimbursement description</label>
                <textarea
                  multiline="true"
                  name="description"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="Enter Reimbursement description"
                />
              </div>
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button
                  className="mb-2 btn btn-lg rounded-3 btn-primary center profilebtn2 py-2"
                  type="submit"
                  disabled={saveStatus}
                >
                  {saveStatus ? "wait..." : "Save"}
                </button>
              </div>
            </form>
            {dataStatus ? (
              <h6 style={{ color: "red" }}>
                Please Enter the Reimbursement amount, select reimbursement type
                and document.
              </h6>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
