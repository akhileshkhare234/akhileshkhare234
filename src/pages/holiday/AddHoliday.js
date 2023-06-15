import React, { useEffect, useState } from "react";
import { APIUrl } from "../../auth/constants";
import { getFullDayName, getMonthByDate } from "../util";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function AddHoliday({
  entryPopUp,
  entryPopUpClose,
  token,
  changeStatus,
}) {
  const saveItem = (event) => {
    event.preventDefault();
    let { holidayDate, location, occasion, type, description } = event.target;
    let itemData = {
      holidayDate: holidayDate.value,
      occasion: occasion.value,
      location: location.value,
      type: type.value,
      description: description.value,
    };
    itemData["month"] = getMonthByDate(holidayDate.value);
    itemData["day"] = getFullDayName(holidayDate.value);
    itemData["year"] = new Date(holidayDate.value).getFullYear();
    itemData["location"] =
      location.value === "Both"
        ? ["Bangalore", "Indore"].join()
        : location.value;
    fetch(APIUrl + "api/holiday", {
      method: "POST",
      body: JSON.stringify(itemData),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        console.log("Save Holiday : ", res);

        changeStatus(true);
      })
      .catch((err) => {
        console.log("Holiday Not Save : ", err);

        changeStatus(false);
      });
    toast.success(occasion.value + " Holiday Save Successfully.", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      theme: "colored",
    });
    event.target.reset();
    console.log("Holiday Data : ", itemData);
  };
  const closePopUp = () => {
    entryPopUpClose(true);
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
      <div className="modal-dialog modal-xl" role="document">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header p-4 pb-4 border-bottom-0 headercolor bgColor">
            <h1 className="fw-bold mb-0 fs-2">Holiday Entry Form</h1>
            <button
              onClick={() => entryPopUpClose(true)}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-4">
            <form className="row g-3" onSubmit={saveItem}>
              <div className="col-md-2">
                <label htmlFor="floatingInput" className="mb-1">
                  Holiday Date
                </label>
                <input
                  type="date"
                  min={setMaxMinDate(-1)}
                  max={setMaxMinDate(1)}
                  defaultValue={setMaxMinDate(0)}
                  onKeyDown={(e) => customDateLimiter(e)}
                  name="holidayDate"
                  className="form-control rounded-3"
                />
              </div>
              <div className="col-md-2">
                <label htmlFor="floatingInput" className="mb-1">
                  Occasion
                </label>
                <input
                  type="text"
                  name="occasion"
                  className="form-control rounded-3"
                  placeholder="Holiday Occasion"
                />
              </div>
              <div className="col-md-2">
                <label htmlFor="floatingInput" className="mb-1">
                  Location
                </label>
                <select name="location" className="form-control rounded-3">
                  <option value="Both">Both</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Indore">Indore</option>
                </select>
              </div>
              <div className="col-md-2">
                <label htmlFor="floatingInput" className="mb-1">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  className="form-control rounded-3"
                  placeholder="Holiday description"
                />
              </div>
              <div className="col-md-2">
                <label htmlFor="floatingInput" className="mb-1">
                  Holiday Type
                </label>
                <select name="type" className="form-control rounded-3">
                  <option value="mandatory">Mandatory</option>
                  <option value="optional">Optional</option>
                </select>
              </div>
              <div className="col-md-2 mt-3">
                <button
                  className="mb-2  btn btn-lg rounded-3 btn-primary center py-1 px-3 mt-4"
                  type="submit"
                >
                  Add
                </button>
              </div>
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button
                  className="mb-2 btn btn-lg rounded-3 btn-primary center profilebtn2 py-2"
                  type="button"
                  onClick={closePopUp}
                >
                  Save
                </button>
                <button
                  className="mb-2 btn btn-lg rounded-3 btn-primary center profilebtn2 py-2"
                  type="button"
                  onClick={closePopUp}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
