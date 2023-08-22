import Multiselect from "multiselect-react-dropdown";
import React, { useCallback, useEffect, useState } from "react";
import { APIUrl } from "../../auth/constants";
import { assignDateFormate } from "../util.js";

export default function EditTask({
  editPopUp,
  editPopUpClose,
  itemDetails,
  token,
  changeStatus,
}) {
  const [selectedValue, setSelectedValue] = useState([]);
  const saveItem = (event) => {
    event.preventDefault();
    let { status, taskDetail, startDate, dueDate } = event.target;
    let itemData = {
      taskId: itemDetails.taskId,
      status: status.value,
      taskDetail: taskDetail.value,
      startDate: startDate.value,
      dueDate: dueDate.value,
      assignedTo: selectedValue[0].email,
    };
    fetch(APIUrl + "api/task/update", {
      method: "PUT",
      body: JSON.stringify(itemData),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        console.log("Edit Task : ", res);
        editPopUpClose(true);
        changeStatus(true);
      })
      .catch((err) => {
        console.log("Task Not Edit : ", err);
        editPopUpClose(true);
        changeStatus(false);
      });
    console.log("itemData : ", itemData);
  };
  const setFormdata = (itemDetails) => {
    console.log("itemDetails : ", itemDetails);
    let itemLength = Object.keys(itemDetails).length;
    if (itemLength > 0) {
      let TaskForm = document.forms["TaskForm"];
      TaskForm.taskDetail.value = itemDetails.taskDetail;
      TaskForm.status.value = itemDetails.status;
      TaskForm.dueDate.value = assignDateFormate(itemDetails.dueDate);
      TaskForm.startDate.value = assignDateFormate(itemDetails.startDate);
    }
  };
  const [userArray, setuserArray] = useState([]);
  const getUsers = useCallback(() => {
    let tokenValue = window.localStorage.getItem("am_token");
    fetch(APIUrl + "api/users", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokenValue,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        let users = res.map((user) => {
          return { name: user.displayName, email: user.email, id: user.id };
        });
        let defaultUser = users.filter((row) =>
          itemDetails.assignedTo.split(",").includes(row.email)
        );
        setSelectedValue([...defaultUser]);
        setuserArray([...users]);
        console.log(
          "Users List : ",
          users,
          defaultUser,
          itemDetails.assignedTo.split(",")
        );
      })
      .catch((err) => {
        console.log("User Not Get : ", err);
      });
  }, [itemDetails.assignedTo]);
  useEffect(() => {
    getUsers();
    setFormdata(itemDetails);
  }, [getUsers, itemDetails]);
  const onSelect = (selectedList, selectedItem) => {
    console.log("selectedList ", selectedList);
    setSelectedValue([...selectedList]);
  };

  const onRemove = (selectedList, removedItem) => {
    console.log("selectedList ", selectedList);
    setSelectedValue([...selectedList]);
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
        (editPopUp ? "closePopUp" : "displayPopUp")
      }
      tabIndex="-1"
      role="dialog"
      id="modalSignin"
    >
      <div className="modal-dialog modal-xl" role="document">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header p-4 pb-4 border-bottom-0 headercolor bgColor">
            <h1 className="fw-bold mb-0 fs-2">Edit Task</h1>
            <button
              onClick={() => {
                editPopUpClose(true);
                setSelectedValue([]);
              }}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-4">
            <form name="TaskForm" className="row g-3" onSubmit={saveItem}>
              <div className="col-md-12">
                <label className="mb-1">Task Detail</label>
                <textarea
                  multiline={true}
                  name="taskDetail"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="Enter Task Detail"
                />
              </div>
              <div className="col-md-6">
                <label className="mb-1">Start Date</label>
                <input
                  type="date"
                  max={setMaxMinDate(10)}
                  defaultValue={setMaxMinDate(0)}
                  onKeyDown={(e) => customDateLimiter(e)}
                  name="startDate"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="Enter Assign Date"
                />
              </div>

              <div className="col-md-6">
                <label className="mb-1">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  max={setMaxMinDate(10)}
                  defaultValue={setMaxMinDate(0)}
                  onKeyDown={(e) => customDateLimiter(e)}
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="Enter Completion Date"
                />
              </div>

              <div className="col-md-12">
                <label className="mb-1">Assign Task</label>
                <Multiselect
                  options={userArray} // Options to display in the dropdown
                  selectedValues={selectedValue} // Preselected value to persist in dropdown
                  onSelect={onSelect} // Function will trigger on select event
                  onRemove={onRemove} // Function will trigger on remove event
                  displayValue="name" // Property name to display in the dropdown options
                />
              </div>
              <div className="col-md-6">
                <label className="mb-1">Status</label>
                <select name="status" className="form-select rounded-3">
                  <option value="" disabled>
                    Select status
                  </option>
                  <option value="Todo">Todo</option>
                  <option value="In-progress">In-progress</option>
                  <option value="Pending">Pending</option>
                  <option value="Testing">Testing</option>
                  <option value="Complete">Complete</option>
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
