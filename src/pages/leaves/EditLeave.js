import React, { useEffect, useState } from "react";
import { APIUrl } from "../../auth/constants";
import { assignDateFormate, getMonthByDate, getYears } from "../util.js";

export default function EditLeave({
  editPopUp,
  editPopUpClose,
  itemDetails,
  token,
  changeStatus,
}) {
  const [days, setdays] = useState(1);
  const updateLeave = (event) => {
    event.preventDefault();
    let { leaveTo, leaveFrom, unit, reason, leaveType } = event.target;
    let itemData = {
      leaveTo: leaveTo.value,
      leaveFrom: leaveFrom.value,
      unit: unit.value.split(" ")[0],
      reason: reason.value,
      leaveType: leaveType.value,
    };
    itemData["id"] = itemDetails.id;
    itemData["status"] = "submitted";
    itemData["department"] = "development";
    itemData["comment"] = "";
    itemData["year"] = getYears();
    itemData["month"] = getMonthByDate(leaveTo.value);
    itemData["email"] = itemDetails.email;
    fetch(APIUrl + "api/leave/" + itemDetails.id, {
      method: "PUT",
      body: JSON.stringify(itemData),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        console.log("Edit Leave : ", res);
        editPopUpClose(true);
        changeStatus(true);
      })
      .catch((err) => {
        console.log("Leave Not Edit : ", err);
        editPopUpClose(true);
        changeStatus(false);
      });
    console.log("Leave Data : ", itemData);
  };
  const getToDate = (e) => {
    console.log(" getToDate : ", e.target.value);
    let leaveForm = document.forms["leaveform"];
    console.log(leaveForm.leaveFrom.value);
    let Difference_In_Time =
      new Date(e.target.value).getTime() -
      new Date(leaveForm.leaveFrom.value).getTime();
    // To calculate the no. of days between two dates
    var days = Difference_In_Time / (1000 * 3600 * 24) + 1;
    console.log("Days ", days);
    setdays(days);
    leaveForm.unit.value = days >= 2 ? days + " days" : days + " day";
  };
  const setFormdata = (itemDetails) => {
    let leaveForm = document.forms["leaveform"];
    console.log("Leave Details : ", itemDetails, leaveForm);
    leaveForm.reason.value = itemDetails.reason;
    leaveForm.leaveType.value = itemDetails.leaveType;
    leaveForm.unit.value = itemDetails.unit;
    leaveForm.leaveTo.value = assignDateFormate(itemDetails.leaveTo);
    leaveForm.leaveFrom.value = assignDateFormate(itemDetails.leaveFrom);
    setdays(itemDetails.unit);
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
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header p-4 pb-4 border-bottom-0 headercolor bgColor">
            <h1 className="fw-bold mb-0 fs-2">Leave Update Form</h1>
            <button
              onClick={() => editPopUpClose(true)}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-4">
            <form name="leaveform" className="row g-3" onSubmit={updateLeave}>
              <div className="col-md-6">
                <label className="mb-1">Leave From</label>
                <input
                  type="date"
                  min={setMaxMinDate(-1)}
                  max={setMaxMinDate(1)}
                  name="leaveFrom"
                  className="form-control rounded-3"
                />
              </div>
              <div className="col-md-6">
                <label className="mb-1">Leave To</label>
                <input
                  type="date"
                  min={setMaxMinDate(-1)}
                  max={setMaxMinDate(1)}
                  onKeyDown={(e) => customDateLimiter(e)}
                  name="leaveTo"
                  onChange={getToDate}
                  className="form-control rounded-3"
                />
              </div>
              <div className="col-md-12">
                <label className="mb-1">Reason</label>
                <input
                  type="text"
                  name="reason"
                  className="form-control rounded-3"
                  placeholder="Leave reason"
                />
              </div>
              <div className="col-md-6">
                <label className="mb-1">Days</label>
                <input
                  type="text"
                  name="unit"
                  className="form-control rounded-3"
                  defaultValue={days >= 2 ? days + " days" : days + " day"}
                  placeholder="Enter Days"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="floatingInput" className="mb-1">
                  Leave Type
                </label>
                <select name="leaveType" className="form-select rounded-3">
                  <option value="Sick leave">Sick leave</option>
                  <option value="Urgent leave">Urgent leave</option>
                  <option value="Maternity and paternity leave">
                    Maternity and paternity leave
                  </option>
                  <option value="Public and religious holidays">
                    Public and religious holidays
                  </option>
                  <option value="Bereavement leave">Bereavement leave</option>
                  <option value="Time off in lieu (TOIL)">
                    Time off in lieu (TOIL)
                  </option>
                  <option value="Sabbatical leave">Sabbatical leave</option>
                  <option value="Unpaid leave">Unpaid leave</option>
                </select>
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
