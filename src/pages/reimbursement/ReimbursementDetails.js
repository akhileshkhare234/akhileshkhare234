import React, { useState, useCallback, useEffect } from "react";
import { APIUrl } from "../../auth/constants.js";
import { dateFormate } from "../util.js";
import { useNavigate } from "react-router-dom";

export default function ReimbursementDetails({
  detailsPopUp,
  detailsPopUpClose,
  itemData,
}) {
  const [reimbursementHistory, setreimbursementHistory] = useState([]);
  const navigate = useNavigate();
  const getUsers = useCallback(() => {
    let tokenValue = window.localStorage.getItem("am_token");

    if (Object.keys(itemData).length > 0) {
      fetch(APIUrl + "api/reimbursement/history/" + itemData.id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokenValue,
        },
      })
        .then((res) => {
          if (res.status === 401) {
            window.localStorage.removeItem("am_token");
            navigate("/");
          } else return res.json();
        })
        .then((res) => {
          setreimbursementHistory([...res]);
          console.log("Reimbursement History List : ", res);
        })
        .catch((err) => {
          console.log("User Not Get : ", err);
        });
    } else {
      setreimbursementHistory([]);
    }
  }, [itemData, navigate]);
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
      <div className="modal-dialog modal-xl" role="document">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header p-4 pb-4 border-bottom-0 headercolor bgColor">
            <h1 className="fw-bold mb-0 fs-2">Reimbursement history</h1>
            <button
              onClick={() => detailsPopUpClose(true)}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body px-0 pt-0">
            <hr className="mb-3" />
            {/* <dl className="row">
              <dt className="col-sm-3">Reimbursement type</dt>
              <dd className="col-sm-3">{itemData.type}</dd>
              <dt className="col-sm-3">Amount</dt>
              <dd className="col-sm-3">{itemData.submitAmount}</dd>
            </dl>
            <dl className="row">
              <dt className="col-sm-3">Approve Amount</dt>
              <dd className="col-sm-3">{itemData.approveAmount}</dd>
              <dt className="col-sm-3">Difference Amount</dt>
              <dd className="col-sm-3">{itemData.differenceAmount}</dd>
            </dl>
            <dl className="row">
              <dt className="col-sm-3">Spent Date</dt>
              <dd className="col-sm-3"> {dateFormate(itemData.spentDate)}</dd>
              <dt className="col-sm-3">Submit Date</dt>
              <dd className="col-sm-3"> {dateFormate(itemData.submitDate)}</dd>
            </dl>
            <dl className="row">
              <dt className="col-sm-3">Submit By</dt>
              <dd className="col-sm-3">{itemData.username}</dd>
              <dt className="col-sm-3">Status</dt>
              <dd className="col-sm-3">{itemData.status}</dd>
            </dl>
            <dl className="row">
              <dt className="col-sm-3">Description</dt>
              <dd className="col-sm-9">{itemData.description}</dd>
            </dl>
            <hr className="mb-3" />
            <div className="p-2 pb-2  headercolor bgColor">
              <h1 className="fw-bold mb-0 fs-2">Reimbursement history</h1>
            </div> */}
            <div className="container-fulid">
              <div className="row">
                <div className="col mt-3">
                  <table className="table tabletext">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Type</th>
                        <th scope="col">Description</th>
                        <th scope="col">Status</th>
                        <th scope="col">Submit By</th>
                        <th scope="col">Approved By</th>
                        <th scope="col">Submit Date</th>
                        <th scope="col">Modified Date</th>
                        <th scope="col">Spent Date</th>
                        <th scope="col">Submit Amount</th>
                        <th scope="col">Approve Amount</th>
                        <th scope="col">Difference Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reimbursementHistory.map((user, index) => (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>{user.type}</td>
                          <td>{user.description}</td>
                          <td>{user.status}</td>
                          <td>{user.username}</td>
                          <td>{user.admin}</td>
                          <td>{dateFormate(user.submitDate)}</td>
                          <td>{dateFormate(user.lastModifiedDate)}</td>
                          <td>{dateFormate(user.spentDate)}</td>
                          <td>{user.submitAmount}</td>
                          <td>{user.approveAmount}</td>
                          <td>{user.differenceAmount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <hr className="mb-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
