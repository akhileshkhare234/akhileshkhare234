import React, { useEffect } from "react";

export default function ItemEntry({
  entryPopUp,
  entryPopUpClose,
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
    } = event.target;
    let itemData = {
      model: model.value,
      brand: brand.value,
      purchaseDate: purchaseDate.value,
      validityFrom: validityFrom.value,
      validityTo: validityTo.value,
      assign: assign.value,
      assignDate: assignDate.value,
      releaseDate: releaseDate.value,
      type: "Mobile",
      status: "Running",
      location: "Indore",
      owner: "Akhilesh",
    };
    fetch("http://localhost:8080/api/assets", {
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
      })
      .catch((err) => {
        console.log("Item Not Save : ", err);
        entryPopUpClose(true);
        changeStatus(false);
      });
    console.log("itemData : ", itemData);
  };
  useEffect(() => {
    console.log("entryPopUp", entryPopUp);
  }, [entryPopUp]);
  return (
    <div
      className={
        "modal modal-signin position-static d-block bg-secondary py-5 " +
        (entryPopUp ? "closePopUp" : "displayPopUp")
      }
      tabIndex="-1"
      role="dialog"
      id="modalSignin"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header p-4 pb-4 border-bottom-0 headercolor bgColor">
            <h1 className="fw-bold mb-0 fs-2">Item Entry Form</h1>
            <button
              onClick={() => entryPopUpClose(true)}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-5 pt-0">
            <hr className="mb-3" />
            <form className="row g-3" onSubmit={saveItem}>
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
                  className="form-select"
                  defaultValue={"1"}
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
              <hr className="mt-4" />
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button
                  className="w-25 mb-2 btn btn-lg rounded-3 btn-primary center"
                  type="submit"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
