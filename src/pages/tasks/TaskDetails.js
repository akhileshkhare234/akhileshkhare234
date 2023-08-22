import React, { useCallback, useEffect } from "react";
import { APIUrl } from "../../auth/constants.js";
import { dateFormate } from "../util.js";

export default function TaskDetails({
  detailsPopUp,
  detailsPopUpClose,
  itemData,
}) {
  // const [userArray, setuserArray] = useState([]);
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
        let users = res.map((user) => {
          return { name: user.displayName, email: user.email, id: user.id };
        });
        let defaultUser = users
          .filter((row) => itemData.emails.split(",").includes(row.email))
          .map((row) => row.name);
        // setuserArray([...defaultUser]);
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
            <h1 className="fw-bold mb-0 fs-2">Task Details</h1>
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
              <dt className="col-sm-3">Task Description</dt>
              <dd className="col-sm-9">{itemData.taskDetail}</dd>
            </dl>
            <dl className="row">
              <dt className="col-sm-3">Start Date</dt>
              <dd className="col-sm-9">{dateFormate(itemData.startDate)}</dd>
            </dl>
            <dl className="row">
              <dt className="col-sm-3">Due Date</dt>
              <dd className="col-sm-9">{dateFormate(itemData.dueDate)}</dd>
            </dl>
            <dl className="row">
              <dt className="col-sm-3">Assigned To</dt>
              <dd className="col-sm-9">{itemData.assignedTo}</dd>
            </dl>
            <dl className="row">
              <dt className="col-sm-3">Assigned By</dt>
              <dd className="col-sm-9">{itemData.assignedBy}</dd>
            </dl>
            <hr className="mb-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
