import React, { useEffect } from "react";
import { APIUrl } from "../../auth/constants";
import { assignDateFormate } from "./util";

export default function EditItem({
  editPopUp,
  editPopUpClose,
  itemDetails,
  token,
  changeStatus,
}) {
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
    let itemForm = document.forms["itemForm"];
    itemForm.model.value = itemDetails.model;
    itemForm.brand.value = itemDetails.brand;
    itemForm.type.value = itemDetails.type;
    itemForm.status.value = itemDetails.status;
    itemForm.location.value = itemDetails.location;
    itemForm.owner.value = itemDetails.owner;
    itemForm.purchaseDate.value = assignDateFormate(itemDetails.purchaseDate);
    itemForm.validityFrom.value = assignDateFormate(itemDetails.validityFrom);
    itemForm.validityTo.value = assignDateFormate(itemDetails.validityTo);
    itemForm.assign.value = itemDetails.assign;
    itemForm.assignDate.value = assignDateFormate(itemDetails.assignDate);
    itemForm.releaseDate.value = assignDateFormate(itemDetails.releaseDate);
  };
  useEffect(() => {
    setFormdata(itemDetails);
  }, [itemDetails]);
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
            <h1 className="fw-bold mb-0 fs-2">Edit Item Form</h1>
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
              <div className="col-md-6">
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
              <div className="col-md-6">
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
              <div className="col-md-6">
                <label htmlFor="floatingInput" className="mb-1">
                  Inventory type
                </label>
                <input
                  type="text"
                  name="type"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="Enter inventory type"
                />
              </div>
              <div className="col-md-6">
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
              <div className="col-md-6">
                <label htmlFor="floatingInput" className="mb-1">
                  Inventory location
                </label>
                <input
                  type="text"
                  name="location"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="Enter inventory location"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="floatingInput" className="mb-1">
                  Inventory owner
                </label>
                <input
                  type="text"
                  name="owner"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="Enter inventory owner"
                />
              </div>
              <div className="col-md-6">
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
              <div className="col-md-6">
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
              <div className="col-md-6">
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
              <div className="col-md-6">
                <label htmlFor="floatingInput" className="mb-1">
                  Assign
                </label>
                <select
                  name="assign"
                  defaultValue={"1"}
                  className="form-select"
                  aria-label="Default select example"
                >
                  <option>Assign to</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
              </div>
              <div className="col-md-6">
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
              <div className="col-md-6">
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
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button
                  className="w-25 mb-2 btn btn-lg rounded-3 btn-primary center"
                  type="submit"
                >
                  Edit Item
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
