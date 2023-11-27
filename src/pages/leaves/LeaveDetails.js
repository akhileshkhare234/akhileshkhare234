import React, { memo } from "react";
import { dateFormate } from "../util.js";

function LeaveDetails({ detailsPopUp, detailsPopUpClose, itemData }) {
  return (
    <div
      className={
        "modal modal-signin position-static bg-secondary py-1 " +
        (detailsPopUp ? "closePopUp" : "displayPopUp")
      }
      tabIndex="-1"
      role="dialog"
      id="LeaveDetails"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header p-4 pb-4 border-bottom-0 headercolor bgColor">
            <h1 className="fw-bold mb-0 fs-2">Leave Details</h1>
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
              <dt className="col-sm-3">Leave From</dt>
              <dd className="col-sm-3">{dateFormate(itemData.leaveFrom)}</dd>
              <dt className="col-sm-3">Leave To</dt>
              <dd className="col-sm-3">{dateFormate(itemData.leaveTo)}</dd>
            </dl>
            <dl className="row">
              <dt className="col-sm-3">Days</dt>
              <dd className="col-sm-3">{itemData.unit}</dd>
              <dt className="col-sm-3">Applied Date</dt>
              <dd className="col-sm-3">
                {itemData.leaveAppliedDate
                  ? dateFormate(itemData.leaveAppliedDate)
                  : "-"}
              </dd>
            </dl>
            <dl className="row">
              <dt className="col-sm-3">Year</dt>
              <dd className="col-sm-3">{itemData.year}</dd>
              <dt className="col-sm-3">Month</dt>
              <dd className="col-sm-3">{itemData.month}</dd>
            </dl>
            <dl className="row">
              <dt className="col-sm-3">Status</dt>
              <dd className="col-sm-3">{itemData.status}</dd>
              <dt className="col-sm-3">Comment</dt>
              <dd className="col-sm-3">{itemData.comment}</dd>
            </dl>
            <dl className="row">
              <dt className="col-sm-3">Reason</dt>
              <dd className="col-sm-9">{itemData.reason}</dd>
            </dl>

            <hr className="mb-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
export default memo(LeaveDetails);
