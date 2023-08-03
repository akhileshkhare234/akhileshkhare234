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
            <h1 className="fw-bold mb-0 fs-2">Engineer Details</h1>
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
            <div className="row">
              <div className="col-2 text-center">
                <img
                  className="profileimage3 userimage2"
                  src={
                    itemData.data
                      ? "data:image/png;base64," + itemData.data
                      : itemData.gender === "Female"
                      ? process.env.PUBLIC_URL + "/images/female.png"
                      : process.env.PUBLIC_URL + "/images/male.png"
                  }
                  alt=""
                />
              </div>
              <div className="col-10">
                {" "}
                <dl className="row mb-1">
                  <dt className="col-sm-2">Employee Id</dt>
                  <dd className="col-sm-3">
                    {itemData.employeeId ? itemData.employeeId : "-"}
                  </dd>
                  <dt className="col-sm-2">Employee Name</dt>
                  <dd className="col-sm-3">
                    {itemData.displayName ? itemData.displayName : "-"}
                  </dd>
                </dl>
                <dl className="row mb-1">
                  <dt className="col-sm-2">Role</dt>
                  <dd className="col-sm-3">
                    {itemData.role === 1 ? "User" : "Admin"}
                  </dd>
                  <dt className="col-sm-2">Email-id</dt>
                  <dd className="col-sm-5">
                    {itemData.email ? itemData.email : "-"}
                  </dd>
                </dl>
                <dl className="row mb-1">
                  <dt className="col-sm-2">Designation</dt>
                  <dd className="col-sm-3">
                    {itemData.designation ? itemData.designation : "-"}
                  </dd>

                  <dt className="col-sm-2">City</dt>
                  <dd className="col-sm-5">
                    {itemData.city ? itemData.city : "-"}
                  </dd>
                </dl>
              </div>
            </div>
            <dl className="row mb-1">
              <dt className="col-sm-2">Permanent Address</dt>
              <dd className="col-sm-4">
                {itemData.permanentAddress ? itemData.permanentAddress : "-"}
              </dd>
              <dt className="col-sm-2">Address</dt>
              <dd className="col-sm-4">
                {itemData.tempAddress ? itemData.tempAddress : "-"}
              </dd>
            </dl>
            <dl className="row mb-1">
              <dt className="col-sm-2">State</dt>
              <dd className="col-sm-4">
                {itemData.state ? itemData.state : "-"}
              </dd>
              <dt className="col-sm-2">PinCode</dt>
              <dd className="col-sm-4">
                {itemData.pinCode ? itemData.pinCode : "-"}
              </dd>
            </dl>
            <dl className="row mb-1">
              <dt className="col-sm-2">Office Location</dt>
              <dd className="col-sm-4">
                {itemData.ofcLocation ? itemData.ofcLocation : "-"}
              </dd>
              <dt className="col-sm-2">Manager Name</dt>
              <dd className="col-sm-4">
                {itemData.managerName ? itemData.managerName : "-"}
              </dd>
            </dl>
            <dl className="row mb-1">
              <dt className="col-sm-2">Mobile Number</dt>
              <dd className="col-sm-4">
                {itemData.mobileNumber ? itemData.mobileNumber : "-"}
              </dd>
              <dt className="col-sm-2">Emergency Mobile Number</dt>
              <dd className="col-sm-4">
                {itemData.emergencyMobileNumber
                  ? itemData.emergencyMobileNumber
                  : "-"}
              </dd>
            </dl>
            <dl className="row mb-1">
              <dt className="col-sm-2">Gender</dt>
              <dd className="col-sm-4">
                {itemData.gender ? itemData.gender : "-"}
              </dd>
              <dt className="col-sm-2">Type</dt>
              <dd className="col-sm-4">
                {itemData.type ? itemData.type : "-"}
              </dd>
            </dl>
            <dl className="row mb-1">
              <dt className="col-sm-2">Modified Date</dt>
              <dd className="col-sm-4">
                {dateTimeFormate(itemData.modifiedDate)}
              </dd>
              <dt className="col-sm-2">Department</dt>
              <dd className="col-sm-4">
                {itemData.department ? itemData.department : "-"}
              </dd>
            </dl>
            <dl className="row mb-1">
              <dt className="col-sm-2">Date of Birth</dt>
              <dd className="col-sm-4">
                {itemData.dob ? dateFormate(itemData.dob) : "-"}
              </dd>
              <dt className="col-sm-2">PAN Number</dt>
              <dd className="col-sm-4">{itemData.pan ? itemData.pan : "-"}</dd>
            </dl>
            <dl className="row mb-1">
              <dt className="col-sm-2">Date of Joining</dt>
              <dd className="col-sm-4">
                {itemData.doj ? dateFormate(itemData.doj) : "-"}
              </dd>
              <dt className="col-sm-2">UAN</dt>
              <dd className="col-sm-4">{itemData.uan ? itemData.uan : "-"}</dd>
            </dl>
            <dl className="row mb-1">
              <dt className="col-sm-2">Assigned Projects </dt>
              {itemData.projects?.length === 0 ? (
                <dd className="col-sm">
                  <span
                    style={{
                      backgroundColor: "#f1eed2",
                      color: "#333",
                      padding: "5px 10px",
                    }}
                  >
                    No projects assigned yet.
                  </span>
                </dd>
              ) : (
                itemData.projects?.map((row) => (
                  <dd className="col-sm" key={row.projectId}>
                    <span
                      style={{
                        backgroundColor: "#f1eed2",
                        color: "#333",
                        padding: "5px 10px",
                      }}
                    >
                      <i
                        className="bi bi-person-vcard "
                        style={{ color: "#333", marginRight: "10px" }}
                      ></i>{" "}
                      {row.name}
                    </span>
                  </dd>
                ))
              )}
            </dl>
            <hr className="mb-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
