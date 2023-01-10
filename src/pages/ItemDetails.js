import React from "react";
import { dateFormate } from "./util";

export default function ItemDetails({
  detailsPopUp,
  detailsPopUpClose,
  itemData,
}) {
  return (
    <div
      className={
        "modal modal-signin position-static bg-secondary py-5 " +
        (detailsPopUp ? "closePopUp" : "displayPopUp")
      }
      tabIndex="-1"
      role="dialog"
      id="modalSignin"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header p-4 pb-4 border-bottom-0 headercolor bgColor">
            <h1 className="fw-bold mb-0 fs-2">Item Details</h1>
            <button
              onClick={() => detailsPopUpClose(true)}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-5 pt-0">
            <hr className="mb-3" />
            <dl className="row">
              <dt className="col-sm-5">Model</dt>
              <dd className="col-sm-7">{itemData.model}</dd>
            </dl>
            <dl className="row">
              <dt className="col-sm-5">Brand</dt>
              <dd className="col-sm-7">{itemData.brand}</dd>
            </dl>
            <dl className="row">
              <dt className="col-sm-5">Purchase Date</dt>
              <dd className="col-sm-7">{dateFormate(itemData.purchaseDate)}</dd>
            </dl>
            <dl className="row">
              <dt className="col-sm-5">Validity From</dt>
              <dd className="col-sm-7">{dateFormate(itemData.validityFrom)}</dd>
            </dl>
            <dl className="row">
              <dt className="col-sm-5">Validity To</dt>
              <dd className="col-sm-7">{dateFormate(itemData.validityTo)}</dd>
            </dl>
            <dl className="row">
              <dt className="col-sm-5">Assign to</dt>
              <dd className="col-sm-7">{itemData.assign}</dd>
            </dl>
            <dl className="row">
              <dt className="col-sm-5">Assign Date</dt>
              <dd className="col-sm-7">{dateFormate(itemData.assignDate)}</dd>
            </dl>
            <dl className="row">
              <dt className="col-sm-5">Release Date</dt>
              <dd className="col-sm-7">{dateFormate(itemData.releaseDate)}</dd>
            </dl>
            <hr className="mb-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
