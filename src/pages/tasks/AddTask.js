import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { APIUrl } from "../../auth/constants";
import { Multiselect } from "multiselect-react-dropdown";
import { UserData } from "../../App";

export default function AddTask({
  entryPopUp,
  entryPopUpClose,
  token,
  changeStatus,
}) {
  const [selectedValue, setSelectedValue] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [errorStatus, setErrorStatus] = useState(false);
  const taskForm = useRef();
  const saveTask = (event) => {
    event.preventDefault();
    let { taskDetail, startDate, dueDate } = event.target;
    if (selectedValue?.length > 0) {
      setErrorStatus(false);
      let itemData = {
        taskDetail: taskDetail.value,
        dueDate: dueDate.value,
        startDate: startDate.value,
        assignedTo: selectedValue[0].email,
      };
      console.log("Assigned Users : ", selectedValue);
      fetch(APIUrl + "api/task/add", {
        method: "POST",
        body: JSON.stringify(itemData),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => {
          console.log("Save Task : ", res);
          entryPopUpClose(true);
          changeStatus(true);
          taskForm.current.reset();
        })
        .catch((err) => {
          console.log("Task Not Save : ", err);
          entryPopUpClose(true);
          changeStatus(false);
        });
      console.log("TaskData : ", itemData);
    } else {
      setErrorStatus(true);
      setErrorMsg(
        "Please select the employees to whom the work is to be assigned."
      );
    }
  };
  const [userArray, setuserArray] = useState([]);
  const userInfo = useContext(UserData);
  const getUsers = useCallback(() => {
    let users =
      userInfo.role === 2
        ? userInfo?.userList.map((user) => {
            return { name: user.displayName, email: user.email, id: user.id };
          })
        : [];
    setuserArray([...users]);
  }, [userInfo.role, userInfo?.userList]);
  useEffect(() => {
    getUsers();
  }, [getUsers]);

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
  const onSelect = (selectedList, selectedItem) => {
    console.log("selectedList ", selectedList);
    setSelectedValue([...selectedList]);
  };

  const onRemove = (selectedList, removedItem) => {
    console.log("selectedList ", selectedList);
    setSelectedValue([...selectedList]);
  };
  return (
    <div
      className={
        "modal modal-signin position-static d-block bg-secondary py-1 " +
        (entryPopUp ? "closePopUp" : "displayPopUp")
      }
      tabIndex="-1"
      role="dialog"
      id="modaladdtask"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header p-4 pb-4 border-bottom-0 headercolor bgColor">
            <h1 className="fw-bold mb-0 fs-2">Task Entry</h1>
            <button
              onClick={() => {
                entryPopUpClose(true);
                taskForm.current.reset();
              }}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-4" id="addtask">
            <form ref={taskForm} className="row g-3" onSubmit={saveTask}>
              <div className="col-md-12">
                <label className="mb-1" id="taskDetaillabel">
                  Task Detail <span className="required">*</span>
                </label>
                <textarea
                  multiline
                  name="taskDetail"
                  required
                  className="form-control rounded-3"
                  id="taskDetail"
                  placeholder="Enter Task Detail"
                />
              </div>
              <div className="col-md-12">
                <label className="mb-1" id="nameassignto">
                  Assign to <span className="required">*</span>
                </label>
                <Multiselect
                id="nameassigntofiled"
                  options={userArray} // Options to display in the dropdown
                  selectedValues={selectedValue} // Preselected value to persist in dropdown
                  onSelect={onSelect} // Function will trigger on select event
                  onRemove={onRemove} // Function will trigger on remove event
                  displayValue="name" // Property name to display in the dropdown options
                />
              </div>
              <div className="col-md-6">
                <label className="mb-1" id="startDatelabel">Start Date</label>
                <input
                  type="date"
                  max={setMaxMinDate(0)}
                  defaultValue={setMaxMinDate(0)}
                  onKeyDown={(e) => customDateLimiter(e)}
                  name="startDate"
                  className="form-control rounded-3"
                  id="startDate"
                  placeholder="Enter Assign Date"
                />
              </div>

              <div className="col-md-6">
                <label className="mb-1" id="dueDatelabel">Due Date</label>
                <input
                  type="date"
                  min={setMaxMinDate(0)}
                  defaultValue={setMaxMinDate(0)}
                  name="dueDate"
                  className="form-control rounded-3"
                  id="dueDate"
                  placeholder="Enter Completion Date"
                />
              </div>
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button
                  className="mb-2 btn btn-lg rounded-3 btn-primary center profilebtn2 py-2"
                  type="submit"
                >
                  Save
                </button>
              </div>
            </form>
            {errorStatus ? (
              <div className="col-md-12">
                <p className="errormsg">{errorMsg}</p>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
