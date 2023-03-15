import React, { useState, useCallback, useEffect } from "react";
import { APIUrl } from "../../auth/constants.js";
import { dateFormate } from "../util.js";

export default function ProjectDetails({
  detailsPopUp,
  detailsPopUpClose,
  itemData,
}) {
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
        let users = res.users.map((user) => {
          return { name: user.displayName, email: user.email, id: user.id };
        });
        let defaultUser = users
          .filter((row) => itemData.emails.split(",").includes(row.email))
          .map((row) => row.name);
        setuserArray([...defaultUser]);
        console.log("Users List : ", defaultUser);
      })
      .catch((err) => {
        console.log("User Not Get : ", err);
      });
  }, [itemData.emails]);
  useEffect(() => {
    getUsers();
  }, [getUsers]);
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
            <h1 className="fw-bold mb-0 fs-2">Project Details</h1>
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
              <dt className="col-sm-3">Project Name</dt>
              <dd className="col-sm-3">{itemData.name}</dd>
              <dt className="col-sm-3">Manager</dt>
              <dd className="col-sm-3">{itemData.manager}</dd>
            </dl>
            <dl className="row">
              <dt className="col-sm-3">Start Date</dt>
              <dd className="col-sm-3">{dateFormate(itemData.startDate)}</dd>
              <dt className="col-sm-3">Completion Date</dt>
              <dd className="col-sm-3">
                {dateFormate(itemData.completionDate)}
              </dd>
            </dl>
            <dl className="row">
              <dt className="col-sm-3">Client Name</dt>
              <dd className="col-sm-3">{itemData.clientContactName}</dd>
              <dt className="col-sm-3">Client Contact</dt>
              <dd className="col-sm-3">{itemData.clientContactNumber}</dd>
            </dl>
            <dl className="row">
              <dt className="col-sm-3">Project Detail</dt>
              <dd className="col-sm-9">{itemData.projectDetail}</dd>
            </dl>
            <dl className="row">
              <dt className="col-sm-3">Assigned Users</dt>
              {userArray.map((user, index) => (
                <dd className="col-sm-3" key={index}>
                  <i
                    className="bi bi-person"
                    style={{
                      backgroundColor: "#0eb493",
                      color: "#fff",
                      padding: "2px 5px",
                      borderRadius: "5px",
                      boxShadow: "2px 1px 3px 0px #eae8e8",
                      marginRight: "5px",
                    }}
                  ></i>{" "}
                  {user}
                </dd>
              ))}
            </dl>

            <hr className="mb-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
