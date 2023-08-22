import Multiselect from "multiselect-react-dropdown";
import React, { useCallback, useEffect, useState } from "react";
import { APIUrl } from "../../auth/constants";
import { assignDateFormate } from "../util.js";

export default function EditProject({
  editPopUp,
  editPopUpClose,
  itemDetails,
  token,
  changeStatus,
}) {
  const [selectedValue, setSelectedValue] = useState([]);
  const saveItem = (event) => {
    event.preventDefault();
    let {
      name,
      manager,
      projectDetail,
      startDate,
      completionDate,
      clientContactName,
      clientContactNumber,
    } = event.target;
    let itemData = {
      projectId: itemDetails.projectId,
      name: name.value,
      manager: manager.value,
      projectDetail: projectDetail.value,
      clientContactName: clientContactName.value,
      clientContactNumber: clientContactNumber.value,
      startDate: startDate.value,
      completionDate: completionDate.value,
    };
    itemData["emails"] = selectedValue.map((row) => row.email).join();
    itemData["teamSize"] = selectedValue.length;
    fetch(APIUrl + "api/project", {
      method: "PUT",
      body: JSON.stringify(itemData),
      headers: {
        "Content-Type": "application/json",
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
    console.log("itemData : ", itemData);
  };
  const setFormdata = (itemDetails) => {
    console.log("itemDetails : ", itemDetails);
    let projectForm = document.forms["projectForm"];
    projectForm.name.value = itemDetails.name;
    projectForm.manager.value = itemDetails.manager;
    projectForm.projectDetail.value = itemDetails.projectDetail;
    projectForm.startDate.value = assignDateFormate(itemDetails.startDate);
    projectForm.completionDate.value = assignDateFormate(
      itemDetails.completionDate
    );
    projectForm.clientContactName.value = itemDetails.clientContactName;
    projectForm.clientContactNumber.value = itemDetails.clientContactNumber;
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
          itemDetails.emails?.split(",")?.includes(row.email)
        );
        setSelectedValue([...defaultUser]);
        setuserArray([...users]);
        console.log(
          "Users List : ",
          users,
          defaultUser,
          itemDetails?.emails?.split(",")
        );
      })
      .catch((err) => {
        console.log("User Not Get : ", err);
      });
  }, [itemDetails.emails]);
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
            <h1 className="fw-bold mb-0 fs-2">Edit Project</h1>
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
            <form name="projectForm" className="row g-3" onSubmit={saveItem}>
              <div className="col-md-6">
                <label className="mb-1">Project Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control rounded-3"
                  placeholder="Enter Project Name"
                />
              </div>
              <div className="col-md-6">
                <label className="mb-1">Project Manager</label>
                <input
                  type="text"
                  name="manager"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="Project Manager Name"
                />
              </div>
              <div className="col-md-6">
                <label className="mb-1">Client Contact</label>
                <input
                  type="text"
                  name="clientContactName"
                  className="form-control rounded-3"
                  placeholder="Client Name"
                />
              </div>
              <div className="col-md-6">
                <label className="mb-1">Client Contact</label>
                <input
                  type="text"
                  name="clientContactNumber"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="Client Contact Number"
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
                <label className="mb-1">Completion Date</label>
                <input
                  type="date"
                  name="completionDate"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="Enter Completion Date"
                />
              </div>
              <div className="col-md-12">
                <label className="mb-1">Project Detail</label>
                <textarea
                  multiline={true}
                  name="projectDetail"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="Enter Project Detail"
                />
              </div>
              <div className="col-md-12">
                <label className="mb-1">Assign Project</label>
                <Multiselect
                  options={userArray} // Options to display in the dropdown
                  selectedValues={selectedValue} // Preselected value to persist in dropdown
                  onSelect={onSelect} // Function will trigger on select event
                  onRemove={onRemove} // Function will trigger on remove event
                  displayValue="name" // Property name to display in the dropdown options
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
    </div>
  );
}
