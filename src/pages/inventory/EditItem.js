import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserData } from "../../App";
import { APIUrl } from "../../auth/constants";
import { assignDateFormate } from "../util.js";

export default function EditItem({
  editPopUp,
  editPopUpClose,
  itemDetails,
  token,
  changeStatus,
  userArray,
}) {
  const userInfo = useContext(UserData);
  const saveItem = (event) => {
    event.preventDefault();
    let {
      model,
      brand,
      purchaseDate,
      validityFrom,
      validityTo,
      assign,
      assignDate,
      releaseDate,
      type,
      status,
      location,
      owner,
      identity,
      ram,
      processor,
      harddisk,
      harddiskType,
      operatingSystem,
    } = event.target;
    let itemData = {
      id: itemDetails.id,
      model: model.value,
      brand: brand.value,
      purchaseDate: purchaseDate.value,
      validityFrom: validityFrom.value,
      validityTo: validityTo.value,
      assign: assign.value,
      assignDate: assignDate.value,
      releaseDate: releaseDate.value,
      type: type.value,
      status: status.value,
      location: location.value,
      owner: owner.value,
      identityType: itemDetails.identityType,
      identity: identity.value,
      config:
        ["Laptop", "CPU"].indexOf(type.value) >= 0
          ? {
              ram: ram.value,
              processor: processor.value,
              harddisk: harddisk.value,
              harddiskType: harddiskType.value,
              operatingSystem: operatingSystem.value,
              id: itemDetails.config?.id,
            }
          : null,
    };

    fetch(APIUrl + "api/assets", {
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
    console.log(
      "itemDetails : ",
      itemDetails,
      assignDateFormate(new Date()),
      assignDateFormate(itemDetails.validityTo)
    );
    let itemForm = document.forms["itemForm"];
    itemForm.model.value = itemDetails.model;
    itemForm.brand.value = itemDetails.brand;
    itemForm.type.value = itemDetails.type;
    itemForm.status.value = itemDetails.status;
    itemForm.location.value = itemDetails.location;
    itemForm.owner.value = itemDetails.owner;
    itemForm.purchaseDate.value = assignDateFormate(itemDetails.purchaseDate);
    itemForm.validityFrom.value = assignDateFormate(itemDetails.validityFrom);
    itemForm.validityTo.value =
      assignDateFormate(itemDetails.validityTo) === "1970-01-01"
        ? assignDateFormate(new Date().toISOString())
        : assignDateFormate(itemDetails.validityTo);
    itemForm.assign.value = itemDetails.assign;
    itemForm.assignDate.value = assignDateFormate(itemDetails.assignDate);
    itemForm.releaseDate.value =
      assignDateFormate(itemDetails.releaseDate) === "1970-01-01"
        ? assignDateFormate(new Date().toISOString())
        : assignDateFormate(itemDetails.releaseDate);
    itemForm.identity.value = itemDetails.identity;
    if (["Laptop", "CPU"].indexOf(itemDetails.type) >= 0) {
      itemForm.ram.value = itemDetails.config.ram;
      itemForm.processor.value = itemDetails.config.processor;
      itemForm.harddisk.value = itemDetails.config.harddisk;
      itemForm.harddiskType.value = itemDetails.config.harddiskType;
      itemForm.operatingSystem.value = itemDetails.config.operatingSystem;
    }
  };
  // const [userArray, setuserArray] = useState([]);
  // const getUsers = useCallback(() => {
  //   if (userInfo.role === 2) {
  //     let tokenValue = window.localStorage.getItem("am_token");
  //     fetch(APIUrl + "api/users", {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + tokenValue,
  //       },
  //     })
  //       .then((res) => res.json())
  //       .then((res) => {
  //         let users = res.map((user) => user.displayName);
  //         setuserArray([...users]);
  //         // console.log("Users List : ", users);
  //       })
  //       .catch((err) => {
  //         console.log("User Not Get : ", err);
  //       });
  //   } else setuserArray([]);
  // }, [userInfo.role]);
  useEffect(() => {
    // getUsers();
    setFormdata(itemDetails);
  }, [itemDetails]);
  const getUserInfo = (userinfo, index) => {
    return userinfo.split("/")[index];
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
            <h1 className="fw-bold mb-0 fs-2">Update Inventory</h1>
            <button
              onClick={() => editPopUpClose(true)}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-4">
            <form name="itemForm" className="row g-3" onSubmit={saveItem}>
              <div className="col-md-4">
                <label htmlFor="floatingInput" className="mb-1">
                  Assign To
                </label>
                <select className="form-select rounded-3" name="assign">
                  <option value="unassigned">Unassigned</option>
                  {userArray.map((user, index) => (
                    <option value={user.name} key={index}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label htmlFor="floatingInput" className="mb-1">
                  Assign Date
                </label>
                <input
                  type="date"
                  name="assignDate"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="Enter Assign Date"
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="floatingInput" className="mb-1">
                  Release Date
                </label>
                <input
                  type="date"
                  name="releaseDate"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="Enter Release Date"
                />
              </div>

              <div className="col-md-4">
                <label htmlFor="floatingInput" className="mb-1">
                  Model
                </label>
                <input
                  type="text"
                  name="model"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="Enter Model"
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="floatingInput" className="mb-1">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="Enter Brand"
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="floatingInput" className="mb-1">
                  Inventory type
                </label>
                <input
                  type="text"
                  name="type"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="Enter type"
                />
              </div>
              {["Laptop", "CPU"].indexOf(itemDetails.type) >= 0 ? (
                <div className="col-md-12">
                  <div
                    className="row mt-0 py-2"
                    style={{ border: "1px solid #ccc" }}
                  >
                    <div className="col-md-2">
                      <label htmlFor="floatingInput" className="mb-1">
                        RAM
                      </label>
                      <input
                        type="text"
                        name="ram"
                        className="form-control rounded-3"
                        id="floatingInput"
                        placeholder="RAM Size"
                      />
                    </div>
                    <div className="col-md-2">
                      <label htmlFor="floatingInput" className="mb-1">
                        Processor
                      </label>
                      <input
                        type="text"
                        name="processor"
                        className="form-control rounded-3"
                        id="floatingInput"
                        placeholder="Processor Name"
                      />
                    </div>
                    <div className="col-md-2">
                      <label htmlFor="floatingInput" className="mb-1">
                        Hard Disk Size
                      </label>
                      <input
                        type="text"
                        name="harddisk"
                        className="form-control rounded-3"
                        id="floatingInput"
                        placeholder="HDD Size"
                      />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="floatingInput" className="mb-1">
                        Hard Disk Type
                      </label>
                      <input
                        type="text"
                        name="harddiskType"
                        className="form-control rounded-3"
                        id="floatingInput"
                        placeholder="HDD Type"
                      />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="floatingInput" className="mb-1">
                        Operating System
                      </label>
                      <input
                        type="text"
                        name="operatingSystem"
                        className="form-control rounded-3"
                        id="floatingInput"
                        placeholder="Operating System Name"
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="col-md-4">
                <label htmlFor="floatingInput" className="mb-1">
                  Inventory {itemDetails.identityType}
                </label>
                <input
                  type="text"
                  name="identity"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder={"Enter " + itemDetails.identityType}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="floatingInput" className="mb-1">
                  Inventory location
                </label>
                <select name="location" className="form-select rounded-3">
                  <option value="Bangalore">Bangalore</option>
                  <option value="Indore">Indore</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-md-4">
                <label htmlFor="floatingInput" className="mb-1">
                  Inventory status
                </label>
                <input
                  type="text"
                  name="status"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="Enter inventory status"
                />
              </div>

              <div className="col-md-4">
                <label htmlFor="floatingInput" className="mb-1">
                  Inventory owner
                </label>
                <select className="form-select rounded-3" name="owner">
                  {userArray.map((user, index) => (
                    <option value={user.name} key={index}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label htmlFor="floatingInput" className="mb-1">
                  Purchase Date
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="Enter Purchase Date"
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="floatingInput" className="mb-1">
                  Validity From
                </label>
                <input
                  type="date"
                  name="validityFrom"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="Enter Validity From"
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="floatingInput" className="mb-1">
                  Validity To
                </label>
                <input
                  type="date"
                  name="validityTo"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="Enter Validity To"
                />
              </div>
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button
                  className="mb-2 btn btn-lg rounded-3 btn-primary center profilebtn2"
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
