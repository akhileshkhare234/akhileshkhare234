import React, { useEffect, useRef, useState } from "react";
import { APIUrl } from "../../auth/constants";
import {
  inventorytypes,
  inventoryTypesKeys,
  inventoryIdentityType,
} from "../../util/inventorytypes";

export default function ItemEntry({
  entryPopUp,
  entryPopUpClose,
  token,
  changeStatus,
  userArray,
}) {
  const [inventoryIdentity, setinventoryIdentity] = useState(
    inventoryTypesKeys[0]
  );
  const formRef = useRef();
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
      assetPassword,
    } = event.target;
    let itemData = {
      model: model.value,
      brand: brand.value,
      purchaseDate: purchaseDate.value,
      validityFrom: validityFrom.value,
      validityTo: validityTo.value,
      assign: getUserInfo(assign.value, 0),
      assignDate: assignDate.value,
      releaseDate: releaseDate.value,
      type: type.value,
      status: status.value,
      location: location.value,
      owner: owner.options[owner.selectedIndex].text,
      identityType: inventoryIdentityType[inventoryIdentity],
      identity: identity.value,
      assetPassword: assetPassword.value,
      userEmail,
      config:
        ["Laptop", "CPU"].indexOf(inventoryIdentity) >= 0
          ? {
              ram: ram.value,
              processor: processor.value,
              harddisk: harddisk.value,
              harddiskType: harddiskType.value,
              operatingSystem: operatingSystem.value,
            }
          : null,
    };
    fetch(APIUrl + "api/assets", {
      method: "POST",
      body: JSON.stringify(itemData),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        console.log("Save Item : ", res);
        entryPopUpClose(true);
        changeStatus(true);
        formRef.current.reset();
      })
      .catch((err) => {
        console.log("Item Not Save : ", err);
        entryPopUpClose(true);
        changeStatus(false);
      });
    console.log("itemData : ", itemData);
  };
  const [userEmail, setuserEmail] = useState(null);
  useEffect(() => {
    console.log("entryPopUp", entryPopUp);
  }, [entryPopUp]);
  const getUserInfo = (user, index) => {
    return user?.split("/")[index];
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
      id="modalItemEntry"
    >
      <div className="modal-dialog modal-xl" role="document">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header p-4 pb-4 border-bottom-0 headercolor bgColor">
            <h1 className="fw-bold mb-0 fs-2">Inventory Entry</h1>
            <button
              onClick={() => entryPopUpClose(true)}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-4" id="ItemEntrybody">
            <form ref={formRef} className="row g-3" onSubmit={saveItem}>
              <div className="col-md-4">
                <label htmlFor="" className="mb-1">
                  Model <span className="required">*</span>
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  name="model"
                  required
                  className="form-control rounded-3"
                  id="model"
                  placeholder="Enter Model"
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="" className="mb-1">
                  Brand <span className="required">*</span>
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  name="brand"
                  required
                  className="form-control rounded-3"
                  id="brand"
                  placeholder="Enter Brand"
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="" className="mb-1">
                  Inventory type <span className="required">*</span>
                </label>
                <select
                  className="form-select rounded-3"
                  name="type"
                  required
                  onChange={(e) => {
                    setinventoryIdentity(
                      inventoryTypesKeys[e.target.selectedIndex - 1]
                    );
                    console.log(inventoryTypesKeys[e.target.selectedIndex - 1]);
                    return false;
                  }}
                  defaultValue=""
                >
                  <option value="" disabled={true}>
                    Select inventory type{" "}
                  </option>
                  {inventoryTypesKeys.map((inventory) => (
                    <option value={inventory} key={inventory}>
                      {inventorytypes[inventory]}
                    </option>
                  ))}
                </select>
              </div>
              {["Laptop", "CPU"].indexOf(inventoryIdentity) >= 0 ? (
                <div className="col-md-12">
                  <div
                    className="row mt-0 py-2"
                    style={{ border: "1px solid #ccc" }}
                  >
                    <div className="col-md-2">
                      <label htmlFor="" className="mb-1">
                        RAM
                      </label>
                      <input
                        type="text"
                        autoComplete="off"
                        name="ram"
                        className="form-control rounded-3"
                        id="ram"
                        placeholder="RAM Size"
                      />
                    </div>
                    <div className="col-md-2">
                      <label htmlFor="" className="mb-1">
                        Processor
                      </label>
                      <input
                        type="text"
                        autoComplete="off"
                        name="processor"
                        className="form-control rounded-3"
                        id="processor"
                        placeholder="Processor Name"
                      />
                    </div>
                    <div className="col-md-2">
                      <label htmlFor="" className="mb-1">
                        Hard Disk Size
                      </label>
                      <input
                        type="text"
                        autoComplete="off"
                        name="harddisk"
                        className="form-control rounded-3"
                        id="harddisk"
                        placeholder="HDD Size"
                      />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="" className="mb-1">
                        Hard Disk Type
                      </label>
                      <input
                        type="text"
                        autoComplete="off"
                        name="harddiskType"
                        className="form-control rounded-3"
                        id="harddiskType"
                        placeholder="HDD Type"
                      />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="" className="mb-1">
                        Operating System
                      </label>
                      <input
                        type="text"
                        autoComplete="off"
                        name="operatingSystem"
                        className="form-control rounded-3"
                        id="operatingSystem"
                        placeholder="Operating System Name"
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="col-md-4">
                <label htmlFor="" className="mb-1">
                  Inventory {inventoryIdentityType[inventoryIdentity]}
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  name="identity"
                  className="form-control rounded-3"
                  id="identity"
                  placeholder={
                    "Enter " + inventoryIdentityType[inventoryIdentity]
                  }
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="" className="mb-1">
                  Inventory location <span className="required">*</span>
                </label>
                <select
                  name="location"
                  id="location"
                  required
                  className="form-select rounded-3"
                  defaultValue=""
                >
                  <option value="" disabled={true}>
                    Select inventory location{" "}
                  </option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Indore">Indore</option>
                  <option value="US">US</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-md-4">
                <label htmlFor="" className="mb-1">
                  Inventory status
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  name="status"
                  className="form-control rounded-3"
                  id="status"
                  placeholder="Enter inventory status"
                />
              </div>

              <div className="col-md-4">
                <label htmlFor="" className="mb-1">
                  Inventory owner <span className="required">*</span>
                </label>
                <select
                  className="form-select rounded-3"
                  required
                  name="owner"
                  id="owner"
                  defaultValue=""
                >
                  <option value="" disabled={true}>
                    Select inventory owner{" "}
                  </option>
                  {userArray.map((user, index) => (
                    <option value={user.email} key={index}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label htmlFor="" className="mb-1">
                  Assign To <span className="required">*</span>
                </label>
                <select
                  required
                  className="form-select rounded-3"
                  onChange={(e) => setuserEmail(e.target.value)}
                  name="assign"
                  id="assign"
                  defaultValue=""
                >
                  <option value="" disabled={true}>
                    Select assign to
                  </option>
                  <option value="unassigned">Unassigned</option>
                  {userArray.map((user, index) => (
                    <option value={user.email} key={index}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label htmlFor="" className="mb-1">
                  Assign Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  min={setMaxMinDate(-10)}
                  max={setMaxMinDate(10)}
                  defaultValue={setMaxMinDate(0)}
                  onKeyDown={(e) => customDateLimiter(e)}
                  name="assignDate"
                  required
                  className="form-control rounded-3"
                  id="assignDate"
                  placeholder="Enter Assign Date"
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="" className="mb-1">
                  {inventoryIdentity} Password
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  name="assetPassword"
                  className="form-control rounded-3"
                  id="assetPassword"
                  placeholder={"Enter " + inventoryIdentity + " Password"}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="" className="mb-1">
                  Employee Email
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  name="userEmail"
                  className="form-control rounded-3"
                  id="userEmail"
                  defaultValue={userEmail}
                  placeholder="Enter user email"
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="" className="mb-1">
                  Release Date
                </label>
                <input
                  type="date"
                  min={setMaxMinDate(-10)}
                  max={setMaxMinDate(10)}
                  defaultValue={setMaxMinDate(0)}
                  onKeyDown={(e) => customDateLimiter(e)}
                  name="releaseDate"
                  className="form-control rounded-3"
                  id="releaseDate"
                  placeholder="Enter Release Date"
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="" className="mb-1">
                  Validity From
                </label>
                <input
                  type="date"
                  min={setMaxMinDate(-10)}
                  max={setMaxMinDate(10)}
                  defaultValue={setMaxMinDate(0)}
                  onKeyDown={(e) => customDateLimiter(e)}
                  name="validityFrom"
                  className="form-control rounded-3"
                  id="validityFrom"
                  placeholder="Enter Validity From"
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="" className="mb-1">
                  Validity To
                </label>
                <input
                  type="date"
                  min={setMaxMinDate(-10)}
                  max={setMaxMinDate(10)}
                  defaultValue={setMaxMinDate(0)}
                  onKeyDown={(e) => customDateLimiter(e)}
                  name="validityTo"
                  className="form-control rounded-3"
                  id="validityTo"
                  placeholder="Enter Validity To"
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="" className="mb-1">
                  Purchase Date
                </label>
                <input
                  type="date"
                  min={setMaxMinDate(-10)}
                  max={setMaxMinDate(10)}
                  defaultValue={setMaxMinDate(0)}
                  onKeyDown={(e) => customDateLimiter(e)}
                  name="purchaseDate"
                  className="form-control rounded-3"
                  id="purchaseDate"
                  placeholder="Enter Purchase Date"
                />
              </div>

              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button
                  className="mb-2 btn btn-lg rounded-3 btn-primary center profilebtn2"
                  type="submit"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
