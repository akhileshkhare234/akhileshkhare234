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
        "modal modal-signin position-static bg-secondary py-1 " +
        (detailsPopUp ? "closePopUp" : "displayPopUp")
      }
      tabIndex="-1"
      role="dialog"
      id="modalSignin"
    >
      <div className="modal-dialog modal-lg" role="document">
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

          <div className="modal-body px-5 pt-0">
            <hr className="mb-3" />
            <dl className="row">
              <dt className="col-sm-3">Inventory Type</dt>
              <dd className="col-sm-3">{itemData.type}</dd>
              <dt className="col-sm-3">Assign to</dt>
              <dd className="col-sm-3">{itemData.assign}</dd>
            </dl>
            <dl className="row">
              <dt className="col-sm-3">Assign Date</dt>
              <dd className="col-sm-3">{dateFormate(itemData.assignDate)}</dd>
              <dt className="col-sm-3">Release Date</dt>
              <dd className="col-sm-3">{dateFormate(itemData.releaseDate)}</dd>
            </dl>
            <dl className="row">
              <dt className="col-sm-3">Model</dt>
              <dd className="col-sm-3">{itemData.model}</dd>
              <dt className="col-sm-3">Brand</dt>
              <dd className="col-sm-3">{itemData.brand}</dd>
            </dl>

            {["Laptop", "CPU"].indexOf(itemData.type) >= 0 ? (
              <>
                <dl className="row">
                  <dt className="col-sm-3">RAM</dt>
                  <dd className="col-sm-3">{itemData.config.ram}</dd>
                  <dt className="col-sm-3">Processor</dt>
                  <dd className="col-sm-3">{itemData.config.processor}</dd>
                </dl>
                <dl className="row">
                  <dt className="col-sm-3">Hard Disk Size</dt>
                  <dd className="col-sm-3">{itemData.config.harddisk}</dd>
                  <dt className="col-sm-3">Hard Disk Type</dt>
                  <dd className="col-sm-3">{itemData.config.harddiskType}</dd>
                </dl>
                <dl className="row">
                  <dt className="col-sm-3">Operating System</dt>
                  <dd className="col-sm-3">
                    {itemData.config.operatingSystem}
                  </dd>
                </dl>
              </>
            ) : null}
            <dl className="row">
              <dt className="col-sm-3">Inventory Password</dt>
              <dd className="col-sm-3">{itemData.assetPassword}</dd>
              <dt className="col-sm-3">User Email</dt>
              <dd className="col-sm-3">{itemData.userEmail}</dd>
            </dl>
            <dl className="row">
              <dt className="col-sm-3">Identity Type</dt>
              <dd className="col-sm-3">{itemData.identityType}</dd>
              <dt className="col-sm-3">Identity Value</dt>
              <dd className="col-sm-3">{itemData.identity}</dd>
            </dl>
            <dl className="row">
              <dt className="col-sm-3">Location</dt>
              <dd className="col-sm-3">{itemData.location}</dd>
              <dt className="col-sm-3">Owner</dt>
              <dd className="col-sm-3">{itemData.owner}</dd>
            </dl>
            <dl className="row">
              <dt className="col-sm-3">Purchase Date</dt>
              <dd className="col-sm-3">{dateFormate(itemData.purchaseDate)}</dd>
              <dt className="col-sm-3">Status</dt>
              <dd className="col-sm-3">{itemData.status}</dd>
            </dl>
            <dl className="row">
              <dt className="col-sm-3">Validity To</dt>
              <dd className="col-sm-3">{dateFormate(itemData.validityTo)}</dd>
              <dt className="col-sm-3">Validity From</dt>
              <dd className="col-sm-3">{dateFormate(itemData.validityFrom)}</dd>
            </dl>

            <hr className="mb-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
