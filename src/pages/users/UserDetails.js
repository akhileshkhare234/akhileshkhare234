import React from "react";
import { dateFormate, dateTimeFormate } from "../util";

export default function UserDetails({
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
      <div className="modal-dialog modal-xl" role="document">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header p-4 pb-4 border-bottom-0 headercolor bgColor">
            <h1 className="fw-bold mb-0 fs-2">User Details</h1>
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
            <dl className="row mb-1">
              <dt className="col-sm-3">User Name</dt>
              <dd className="col-sm-3">
                {itemData.displayName ? itemData.displayName : "-"}
              </dd>
              <dt className="col-sm-3">Email-id</dt>
              <dd className="col-sm-3">
                {itemData.email ? itemData.email : "-"}
              </dd>
            </dl>
            <dl className="row mb-1">
              <dt className="col-sm-3">Role</dt>
              <dd className="col-sm-3">
                {itemData.role === 1 ? "User" : "Admin"}
              </dd>

              <dt className="col-sm-3">Designation</dt>
              <dd className="col-sm-3">
                {itemData.designation ? itemData.designation : "-"}
              </dd>
            </dl>
            <dl className="row mb-1">
              <dt className="col-sm-3">Employee Id</dt>
              <dd className="col-sm-3">
                {itemData.employeeId ? itemData.employeeId : "-"}
              </dd>
              <dt className="col-sm-3">Address</dt>
              <dd className="col-sm-3">
                {itemData.tempAddress ? itemData.tempAddress : "-"}
              </dd>
            </dl>
            <dl className="row mb-1">
              <dt className="col-sm-3">Permanent Address</dt>
              <dd className="col-sm-3">
                {itemData.permanentAddress ? itemData.permanentAddress : "-"}
              </dd>
              <dt className="col-sm-3">City</dt>
              <dd className="col-sm-3">
                {itemData.city ? itemData.city : "-"}
              </dd>
            </dl>
            <dl className="row mb-1">
              <dt className="col-sm-3">State</dt>
              <dd className="col-sm-3">
                {itemData.state ? itemData.state : "-"}
              </dd>
              <dt className="col-sm-3">PinCode</dt>
              <dd className="col-sm-3">
                {itemData.pinCode ? itemData.pinCode : "-"}
              </dd>
            </dl>
            <dl className="row mb-1">
              <dt className="col-sm-3">Remaining Leave</dt>
              <dd className="col-sm-3">
                {itemData.remainingLeave ? itemData.remainingLeave : "-"}
              </dd>
              <dt className="col-sm-3">Manager Name</dt>
              <dd className="col-sm-3">
                {itemData.managerName ? itemData.managerName : "-"}
              </dd>
            </dl>
            <dl className="row mb-1">
              <dt className="col-sm-3">Mobile Number</dt>
              <dd className="col-sm-3">
                {itemData.mobileNumber ? itemData.mobileNumber : "-"}
              </dd>
              <dt className="col-sm-3">Emergency Mobile Number</dt>
              <dd className="col-sm-3">
                {itemData.emergencyMobileNumber
                  ? itemData.emergencyMobileNumber
                  : "-"}
              </dd>
            </dl>
            <dl className="row mb-1">
              <dt className="col-sm-3">Gender</dt>
              <dd className="col-sm-3">
                {itemData.gender ? itemData.gender : "-"}
              </dd>
              <dt className="col-sm-3">Type</dt>
              <dd className="col-sm-3">
                {itemData.type ? itemData.type : "-"}
              </dd>
            </dl>
            <dl className="row mb-1">
              <dt className="col-sm-3">Modified Date</dt>
              <dd className="col-sm-3">
                {dateTimeFormate(itemData.modifiedDate)}
              </dd>
              <dt className="col-sm-3">Department</dt>
              <dd className="col-sm-3">
                {itemData.department ? itemData.department : "-"}
              </dd>
            </dl>
            <dl className="row mb-1">
              <dt className="col-sm-3">Date of Birth</dt>
              <dd className="col-sm-3">
                {itemData.dob ? dateFormate(itemData.dob) : "-"}
              </dd>
              <dt className="col-sm-3">PAN Number</dt>
              <dd className="col-sm-3">{itemData.pan ? itemData.pan : "-"}</dd>
            </dl>
            <dl className="row mb-1">
              <dt className="col-sm-3">Date of Joining</dt>
              <dd className="col-sm-3">
                {itemData.doj ? dateFormate(itemData.doj) : "-"}
              </dd>
              <dt className="col-sm-3">UAN</dt>
              <dd className="col-sm-3">{itemData.uan ? itemData.uan : "-"}</dd>
            </dl>
            <hr className="mb-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
