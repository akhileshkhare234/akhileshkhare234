import React, { useCallback, useEffect, useState } from "react";
import { APIUrl } from "../../auth/constants";
import { dateFormate } from "../util";
import { useNavigate } from "react-router-dom";

export default function ItemsHistory({
  itemid,
  historyPopUpOpen,
  historyPopUpClose,
}) {
  const [itemArray, setitemArray] = useState([]);
  const navigate = useNavigate();
  const getItems = useCallback(() => {
    if (itemid) {
      let tokenValue = window.localStorage.getItem("am_token");
      fetch(APIUrl + "api/assets/history/" + itemid, {
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
          setitemArray([...res]);
          console.log("Items History : ", res);
        })
        .catch((err) => {
          console.log("User Not Get : ", err);
        });
    } else setitemArray([]);
  }, [itemid]);
  useEffect(() => {
    console.log("itemid : ", itemid);
    getItems();
  }, [getItems, itemid]);
  return (
    <>
      <div
        className={
          "modal modal-signin position-static bg-secondary py-1 " +
          (historyPopUpOpen ? "closePopUp" : "displayPopUp")
        }
        tabIndex="-1"
        role="dialog"
        id="InventoryHistory"
      >
        <div
          className="modal-dialog modal-xl"
          style={{ maxWidth: "1400px !important" }}
          role="document"
        >
          <div className="modal-content rounded-4 shadow">
            <div className="modal-header p-4 pb-4 border-bottom-0 headercolor bgColor">
              <h1 className="fw-bold mb-0 fs-2">Inventory History</h1>
              <button
                onClick={() => historyPopUpClose(true)}
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body px-5 pt-0">
              <div className="container-fulid">
                <div className="row">
                  <div className="col mt-3">
                    <table className="table tabletext2">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Model</th>
                          <th scope="col">Brand</th>
                          <th scope="col">Assign To</th>
                          <th scope="col">Inventory</th>
                          <th scope="col">Location</th>
                          <th scope="col">Identity Type </th>
                          <th scope="col">Identity Value</th>
                          {/* <th scope="col">Validity From</th>
                          <th scope="col">Validity To</th> */}
                          <th scope="col">Assign Date</th>
                          <th scope="col" className="text-center">
                            Release Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {itemArray.map((user, index) => (
                          <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>{user.model}</td>
                            <td>{user.brand}</td>
                            <td>{user.assign}</td>
                            <td>{user.type}</td>
                            <td>{user.location}</td>
                            <td>{user.identityType}</td>
                            <td>{user.identity}</td>
                            {/* <td>{dateFormate(user.validityFrom)}</td>
                            <td>{dateFormate(user.validityTo)}</td> */}
                            <td>{dateFormate(user.assignDate)}</td>
                            <td className="text-center">
                              {dateFormate(user.releaseDate) === "01-JAN-1970"
                                ? "No"
                                : dateFormate(user.releaseDate)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      {itemArray.length > 10 ? (
                        <tfoot>
                          <tr>
                            <td colSpan="14">
                              <nav aria-label="Page navigation example">
                                <ul className="pagination justify-content-end m-0">
                                  <li className="page-item disabled">
                                    <span className="page-link">Previous</span>
                                  </li>
                                  <li className="page-item">
                                    <span className="page-link" href="#">
                                      1
                                    </span>
                                  </li>
                                  <li className="page-item">
                                    <span className="page-link" href="#">
                                      2
                                    </span>
                                  </li>
                                  <li className="page-item">
                                    <span className="page-link" href="#">
                                      3
                                    </span>
                                  </li>
                                  <li className="page-item">
                                    <span className="page-link" href="#">
                                      Next
                                    </span>
                                  </li>
                                </ul>
                              </nav>
                            </td>
                          </tr>
                        </tfoot>
                      ) : (
                        ""
                      )}
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
