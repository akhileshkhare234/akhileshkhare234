import React, { memo, useContext, useEffect, useRef, useState } from "react";
import { APIUrl } from "../../auth/constants";
import { getMonthByDate, getYears } from "../util";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserData } from "../../App";
function AddLeave({ entryPopUp, entryPopUpClose, token, changeStatus }) {
  const userInfo = useContext(UserData);
  const [days, setdays] = useState(1);
  // const [userInfo, setUserInfo] = useState([]);
  const formRef = useRef(null);

  const saveItem = (event) => {
    event.preventDefault();
    let { leaveTo, leaveFrom, reason, leaveType } = event.target;
    if (leaveTo.value < leaveFrom.value) {
      toast.error("Leave to date value cannot be less than leave from date. ", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "colored",
        toastId: "customId1",
      });
    } else if (reason.value) {
      let itemData = {
        leaveTo: leaveTo.value,
        leaveFrom: leaveFrom.value,
        unit: days,
        reason: reason.value,
        leaveType: leaveType.value,
      };
      itemData["status"] = "Submitted";
      itemData["department"] = "development";
      itemData["comment"] = "";
      itemData["year"] = getYears();
      itemData["month"] = getMonthByDate(leaveTo.value);
      itemData["email"] = userInfo?.email;
      fetch(APIUrl + "api/leave", {
        method: "POST",
        body: JSON.stringify(itemData),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => {
          toast.success("Leave apply successfully.", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            theme: "colored",
            toastId: "customId2",
          });
          window.setTimeout(() => {
            console.log("Save Leave : ", res);
            entryPopUpClose(true);
            changeStatus(true);
            formRef.current.reset();
            event.target.reset();
          }, 3000);
        })
        .catch((err) => {
          console.log("Leave Not Save : ", err);
          toast.error("Leave not apply. " + err, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            theme: "colored",
            toastId: "customId3",
          });
          changeStatus(false);
        });
      event.target.reset();
      console.log("Leave Data : ", itemData);
    } else {
      reason.focus();
      console.log("reason.value ", reason.value);
      toast.warning("Please Enter Reason of Leave.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "colored",
        toastId: "customId4",
      });
    }
  };

  useEffect(() => {
    console.log("entryPopUp call");
  }, []);
  const setMaxMinDate = (years, months = null, days = null) => {
    let today = new Date();
    let month =
      months !== null
        ? today.getMonth() + parseInt(months)
        : today.getMonth() + 1;
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
  const getToDate = () => {
    // console.log(" getToDate : ", e.target.value);
    let leaveForm = document.forms["leaveForm"];
    console.log(leaveForm.leaveFrom.value);
    let Difference_In_Time =
      new Date(leaveForm.leaveTo.value).getTime() -
      new Date(leaveForm.leaveFrom.value).getTime();
    // To calculate the no. of days between two dates
    var days =
      Difference_In_Time / (1000 * 3600 * 24) +
      parseFloat(leaveForm.leavefor.value);
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
      id="modalAddLeave"
    >
      <ToastContainer id="toastmsgAddLeave" />
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header p-4 pb-4 border-bottom-0 headercolor bgColor">
            <h1 className="fw-bold mb-0 fs-2" id="leavetitle">
              Leave Entry Form
            </h1>
            <button
              onClick={() => {
                entryPopUpClose(true);
                let leaveForm = document.forms["leaveForm"];
                leaveForm.reset();
              }}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="closebtn"
            ></button>
          </div>

          <div className="modal-body p-4" id="AddLeavebody">
            <form
              ref={formRef}
              name="leaveForm"
              id="leaveFormid"
              className="row g-3"
              onSubmit={saveItem}
            >
              <div className="col-md-4">
                <label className="mb-1" id="LeaveFromlabel">
                  Leave From
                </label>
                <input
                  type="date"
                  min={setMaxMinDate(0, 0)}
                  max={setMaxMinDate(1)}
                  defaultValue={setMaxMinDate(0)}
                  name="leaveFrom"
                  id="leaveFromField"
                  className="form-control rounded-3"
                  onChange={getFromDate}
                  placeholder="Enter Release Date"
                />
              </div>
              <div className="col-md-4">
                <label className="mb-1" id="Leavetolabel">
                  Leave To
                </label>
                <input
                  type="date"
                  min={setMaxMinDate(0, 0)}
                  max={setMaxMinDate(1)}
                  defaultValue={setMaxMinDate(0)}
                  name="leaveTo"
                  id="leaveToField"
                  onChange={getToDate}
                  className="form-control rounded-3"
                />
              </div>
              <div className="col-md-4" id="Leaveforlabel">
                <label htmlFor="" className="mb-1">
                  Leave for
                </label>
                <select
                  name="leavefor"
                  id="leaveforField"
                  className="form-select rounded-3"
                  onChange={getToDate}
                >
                  <option value="1">Full day leave</option>
                  <option value="0.5">Half day leave</option>
                </select>
              </div>
              <div className="col-md-12">
                <label className="mb-1" id="reasonlabel">
                  Reason
                </label>
                <input
                  type="text"
                  name="reason"
                  id="reasonField"
                  autoComplete="off"
                  className="form-control rounded-3"
                  placeholder="Leave reason"
                />
              </div>
              <div className="col-md-6">
                <label className="mb-1" id="dayslabel">
                  Days
                </label>
                <input
                  type="text"
                  name="unit"
                  id="unitField"
                  defaultValue={days >= 2 ? days + " days" : days + " day"}
                  className="form-control rounded-3"
                  placeholder="Enter Days"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="" className="mb-1" id="Leavetypelabel">
                  Leave Type
                </label>
                <select
                  name="leaveType"
                  id="leaveTypeField"
                  className="form-select rounded-3"
                >
                  <option value="" disabled>
                    Select leave
                  </option>
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
                  <option value="Paid leave">Paid leave</option>
                  <option value="Other leave">Other leave</option>
                </select>
              </div>
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button
                  className="mb-2 btn btn-lg rounded-3 btn-primary center profilebtn2 py-2"
                  type="Submitted"
                  id="submitbtn"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default memo(AddLeave);
