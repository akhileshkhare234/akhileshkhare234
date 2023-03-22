import React, { useCallback, useEffect, useState } from "react";
import { APIUrl } from "../../auth/constants";
import { getMonthByDate, getYears } from "../util";

export default function AddLeave({
  entryPopUp,
  entryPopUpClose,
  token,
  changeStatus,
}) {
  const [days, setdays] = useState(1);
  const [userInfo, setUserInfo] = useState([]);
  const getUsers = useCallback(() => {
    let tokenValue = window.localStorage.getItem("am_token");
    fetch(APIUrl + "api/user/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokenValue,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setUserInfo(res);
        console.log("User Profile : ", res);
      })
      .catch((err) => {
        console.log("User Not Get : ", err);
      });
  }, []);
  useEffect(() => {
    getUsers();
  }, [getUsers]);
  const saveItem = (event) => {
    event.preventDefault();
    let { leaveTo, leaveFrom, reason, leaveType } = event.target;
    let itemData = {
      leaveTo: leaveTo.value,
      leaveFrom: leaveFrom.value,
      unit: days,
      reason: reason.value,
      leaveType: leaveType.value,
    };
    itemData["status"] = "Submit";
    itemData["department"] = "development";
    itemData["comment"] = "";
    itemData["year"] = getYears();
    itemData["month"] = getMonthByDate(leaveTo.value);
    itemData["email"] = userInfo.email;
    fetch(APIUrl + "api/leave", {
      method: "POST",
      body: JSON.stringify(itemData),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        console.log("Save Leave : ", res);
        entryPopUpClose(true);
        changeStatus(true);
      })
      .catch((err) => {
        console.log("Leave Not Save : ", err);
        entryPopUpClose(true);
        changeStatus(false);
      });
    event.target.reset();
    console.log("Leave Data : ", itemData);
  };

  useEffect(() => {
    console.log("entryPopUp", entryPopUp);
  }, [entryPopUp]);
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

  const getFromDate = (e) => {
    console.log(" getFromDate : ", e.target.value);
  };
  const getToDate = (e) => {
    console.log(" getToDate : ", e.target.value);
    let leaveForm = document.forms["leaveForm"];
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
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header p-4 pb-4 border-bottom-0 headercolor bgColor">
            <h1 className="fw-bold mb-0 fs-2">Leave Entry Form</h1>
            <button
              onClick={() => entryPopUpClose(true)}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-4">
            <form name="leaveForm" className="row g-3" onSubmit={saveItem}>
              <div className="col-md-6">
                <label className="mb-1">Leave From</label>
                <input
                  type="date"
                  min={setMaxMinDate(-10)}
                  max={setMaxMinDate(10)}
                  defaultValue={setMaxMinDate(0)}
                  name="leaveFrom"
                  className="form-control rounded-3"
                  onChange={getFromDate}
                  placeholder="Enter Release Date"
                />
              </div>
              <div className="col-md-6">
                <label className="mb-1">Leave To</label>
                <input
                  type="date"
                  min={setMaxMinDate(-1)}
                  max={setMaxMinDate(1)}
                  defaultValue={setMaxMinDate(0)}
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
                  defaultValue={days >= 2 ? days + " days" : days + " day"}
                  className="form-control rounded-3"
                  placeholder="Enter Days"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="floatingInput" className="mb-1">
                  Leave Type
                </label>
                <select name="leaveType" className="form-control rounded-3">
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
                  Submit Leave
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
