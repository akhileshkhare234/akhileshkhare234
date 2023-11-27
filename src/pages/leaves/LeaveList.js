import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserData } from "../../App";
import { APIUrl } from "../../auth/constants";
import Loader from "../../util/Loader";
import Header from "../inventory/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { dateFormate, getMonthsFullName, getYears } from "../util.js";
import "react-lazy-load-image-component/src/effects/blur.css"; // You can choose different loading effects
import { useNavigate } from "react-router-dom";

const tableData = {
  email: "Name",
  leaveFrom: "Leave From",
  leaveTo: "Leave To",
  leaveAppliedDate: "Apply Date",
  unit: "No. of Days",
  reason: "Reason",
  status: "Status",
};
export default function LeaveList({
  entryPopUpOpen,
  editPopUpOpen,
  deletePopUpOpen,
  detailsPopUpOpen,
  setApproveData,
  token,
  itemStatus,
}) {
  const userInfo = useContext(UserData);
  const [leaves, setLeaves] = useState([]);
  const [items, setItems] = useState([]);
  const [start, setStart] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pages, setPages] = useState([]);
  const [userArray, setuserArray] = useState([]);
  const [leaveStatus, setleaveStatus] = useState(false);
  const navigate = useNavigate();
  const getUsers = useCallback(() => {
    if (userInfo && userInfo?.role === 2) {
      let users = userInfo?.userList.map((user) => {
        return {
          name: user.displayName,
          email: user.email,
          imageUrl: user.imageUrl,
        };
      });
      setuserArray([...users]);
    } else {
      setuserArray([]);
    }
  }, [userInfo]);
  useEffect(() => {
    getUsers();
  }, [getUsers]);
  const getLeaves = useCallback(() => {
    setStart(0);
    console.log("itemStatus ", itemStatus);
    if (userInfo?.email && token) {
      let urlValue = null;
      //pageSizeStatus
      if (userInfo && userInfo?.role === 2) {
        let leavesList = document.forms["leavesList"];
        let payload = {
          users: leavesList.users.value,
          years: leavesList.years.value,
          months: leavesList.months.value,
          status: leavesList.status.value,
        };
        console.log("payload Data: ", payload);
        urlValue = getURL(payload);
      } else {
        urlValue = `api/leave/data/${getYears()}?email=${userInfo?.email}`;
        setleaveStatus(true);
      }
      fetch(APIUrl + urlValue, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => {
          if (res.status === 401) {
            window.localStorage.removeItem("am_token");
            navigate("/");
          } else return res.json();
        })
        .then((res) => {
          if (res?.length > 0) {
            res.sort((p, n) => {
              let date1 = new Date(n.leaveFrom);
              let date2 = new Date(p.leaveFrom);
              return date1 - date2;
            });
            let leavesData = res.filter((row, index) => index < pageSize);
            console.log("leavesData Info ", leavesData);
            setItems([...leavesData]);
            setLeaves([...res]);
            let pages = [];
            for (let I = 1; I <= Math.ceil(res.length / pageSize); I++) {
              pages.push(I);
            }
            setPages(pages);
          } else {
            setItems([]);
            setLeaves([]);
            setPages([]);
          }
          setleaveStatus(false);
        });
    } else {
      setLeaves([]);
      setleaveStatus(false);
    }
  }, [itemStatus, userInfo, token, navigate, pageSize]);
  useEffect(() => {
    getLeaves();
  }, [getLeaves]);
  const getURL = (payload) => {
    let url = `api/leave/data/${payload.years}`;
    let params = [];
    if (payload.months !== "All") params.push(`month=${payload.months}`);
    if (payload.users !== "All") params.push(`email=${payload.users}`);
    if (payload.status !== "All") params.push(`status=${payload.status}`);
    if (params.length > 0) url += "?" + params.join("&");
    console.log(url);
    return url;
  };
  const getLeaveFilterData = (e) => {
    e.preventDefault();
    setStart(0);
    setPageSize(10);
    let { users, years, months, status } = e.target;
    let payload = {
      users: users.value,
      years: years.value,
      months: months.value,
      status: status.value,
    };
    let urldata = getURL(payload);
    fetch(APIUrl + urldata, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          window.localStorage.removeItem("am_token");
          navigate("/");
        } else return res.json();
      })
      .then((res) => {
        if (res?.length > 0) {
          res.sort((p, n) => {
            let date1 = new Date(n.leaveFrom);
            let date2 = new Date(p.leaveFrom);
            return date1 - date2;
          });
          let leavesData = res.filter((row, index) => index < pageSize);
          setItems([...leavesData]);
          setLeaves([...res]);
          let pages = [];
          for (let I = 1; I <= Math.ceil(res.length / pageSize); I++) {
            pages.push(I);
          }
          setPages(pages);
        } else {
          setItems([]);
          setLeaves([]);
          setPages([]);
        }
      });
  };
  const showNextInventory = (pos) => {
    let start = pos === 1 ? 0 : pos * pageSize - pageSize;
    let leavesData = leaves.filter(
      (row, index) => index >= start && index < pos * pageSize
    );
    console.log("start, pos,leavesData ", start, pos, leavesData);
    setItems([...leavesData]);
    setStart(start);
  };
  return (
    <>
      <Header title="Leave List" />
      <ToastContainer id="toastmsgleavelist" />
      <div className="container" id="leavelist">
        <div className="row">
          <div className="col">
            <div className="row px-4 pt-2 mb-2">
              <div className="col justify-content-end text-end">
                <button
                  onClick={() => entryPopUpOpen(false)}
                  type="button"
                  className="btn btn-outline-primary"
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  <span className="ml-2" id="applyleave">
                    Apply for leave
                  </span>
                </button>
              </div>
            </div>

            {userInfo && userInfo?.role === 2 ? (
              <>
                <form name="leavesList" onSubmit={getLeaveFilterData}>
                  <div
                    className="row mx-1 py-3 leavetab"
                    style={{ backgroundColor: "#0eb593" }}
                  >
                    <div className="col-md-3">
                      <label htmlFor="" className="mb-1" id="userslable">
                        Users
                      </label>
                      <select
                        className="form-select rounded-3"
                        name="users"
                        id="usersfield"
                      >
                        <option value="All">All</option>
                        {userArray.map((user, index) => (
                          <option value={user.email} key={index}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-2">
                      <label htmlFor="" className="mb-1" id="yearslable">
                        Year
                      </label>
                      <select
                        className="form-select rounded-3"
                        name="years"
                        id="yearsfield"
                        defaultValue={getYears()}
                      >
                        {[getYears() - 1, getYears()].map((year, index) => (
                          <option value={year} key={index + year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-2">
                      <label htmlFor="" className="mb-1" id="monthslable">
                        Month
                      </label>
                      <select
                        className="form-select rounded-3"
                        name="months"
                        id="monthsfield"
                      >
                        <option value="All">All</option>
                        {getMonthsFullName().map((month, index) => (
                          <option value={month} key={index + month}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-2">
                      <label htmlFor="" className="mb-1" id="statuslabel">
                        Status
                      </label>
                      <select
                        className="form-select rounded-3"
                        name="status"
                        id="statusfield"
                      >
                        {["All", "Submitted", "Approved", "Rejected"].map(
                          (status, index) => (
                            <option value={status} key={index + status}>
                              {status}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <div className="col justify-content-center text-center mt-4">
                      <button
                        type="submit"
                        className="btn btn-outline-warning mt-2 px-4 py-1"
                        id="viewbtn"
                      >
                        <span className="ml-2">View</span>
                      </button>
                    </div>
                  </div>
                </form>
              </>
            ) : null}
            {items && items.length > 0 ? (
              <table className="table tabletext2">
                <thead>
                  <tr>
                    <th scope="col" style={{ width: "35px" }}>
                      #
                    </th>
                    {/* <th></th> */}
                    <th scope="col" style={{ width: "210px" }}>
                      Name
                    </th>
                    <th scope="col" style={{ width: "105px" }}>
                      Leave From
                    </th>
                    <th scope="col" style={{ width: "105px" }}>
                      Leave To
                    </th>
                    <th scope="col" style={{ width: "105px" }}>
                      Apply Date
                    </th>
                    <th scope="col" style={{ width: "70px" }}>
                      Days
                    </th>
                    <th scope="col">Reason</th>
                    <th scope="col" style={{ width: "120px" }}>
                      Status
                    </th>
                    <th scope="col" className="text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index + item["leaveFrom"]}>
                      <th scope="row">{start + index + 1}</th>
                      {Object.keys(tableData).map((field, index) => (
                        <td key={field}>
                          {field.includes("leaveFrom") ||
                          field.includes("leaveTo") ||
                          field.includes("leaveAppliedDate") ? (
                            item[field] ? (
                              dateFormate(item[field])
                            ) : (
                              "-"
                            )
                          ) : field.includes("status") ? (
                            userInfo && userInfo?.role === 2 ? (
                              <span
                                className={
                                  item[field] === "Rejected"
                                    ? "status-error"
                                    : item[field] === "Approved"
                                    ? "status-success"
                                    : "status-primary"
                                }
                              >
                                {item[field]}
                              </span>
                            ) : (
                              <>
                                <span
                                  className={
                                    item[field] === "Rejected"
                                      ? "status-error"
                                      : item[field] === "Approved"
                                      ? "status-success"
                                      : "status-primary"
                                  }
                                >
                                  {item[field] === "Submitted"
                                    ? "Pending"
                                    : item[field]}
                                </span>
                              </>
                            )
                          ) : field.includes("email") && item.email ? (
                            userInfo?.role === 2 ? (
                              userArray.filter(
                                (user) => user.email === item.email
                              )[0]?.name
                            ) : (
                              userInfo?.displayName
                            )
                          ) : (
                            item[field]
                          )}
                        </td>
                      ))}
                      {userInfo?.role === 2 ? (
                        <td className="text-center" style={{ width: "120px" }}>
                          {userArray.filter(
                            (user) => user.email === item.email
                          )[0]?.name === userInfo.displayName ? (
                            // <button
                            //   disabled
                            //   title="Click here for Approved/Rejected leave."
                            //   onClick={() => setApproveData(false, item)}
                            //   type="button"
                            //   style={{ width: "140px" }}
                            //   className="btn btn-primary me-1 py-1"
                            // >
                            //   {item.status === "Submitted"
                            //     ? "Approve/Reject"
                            //     : item.status === "Approved"
                            //     ? "Reject"
                            //     : "Approve"}
                            // </button>
                            <>
                              {item.status.toUpperCase() === "SUBMITTED" ? (
                                <>
                                  <button
                                    onClick={() =>
                                      deletePopUpOpen(false, item.id)
                                    }
                                    type="button"
                                    className="btn btn-outline-primary me-1"
                                  >
                                    <i
                                      className="bi bi-trash3"
                                      id="deletepopup"
                                    ></i>
                                  </button>
                                  <button
                                    onClick={() => editPopUpOpen(false, item)}
                                    type="button"
                                    className="btn btn-outline-primary me-1"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </button>
                                </>
                              ) : (
                                <></>
                              )}

                              <button
                                onClick={() => detailsPopUpOpen(false, item)}
                                type="button"
                                className="btn btn-outline-primary me-1"
                              >
                                <i className="bi bi-eye" id="detailspopup"></i>
                              </button>
                            </>
                          ) : (
                            <button
                              title="Click here for Approved/Rejected leave."
                              onClick={() => setApproveData(false, item)}
                              type="button"
                              style={{ width: "140px" }}
                              className="btn btn-primary me-1 py-1"
                              id="actionpopup"
                            >
                              {item.status === "Submitted"
                                ? "Approve/Reject"
                                : item.status === "Approved"
                                ? "Reject"
                                : "Approve"}
                            </button>
                          )}
                        </td>
                      ) : (
                        <td className="text-center" style={{ width: "100px" }}>
                          {item.status.toUpperCase() === "SUBMITTED" ? (
                            <>
                              <button
                                onClick={() => deletePopUpOpen(false, item.id)}
                                type="button"
                                className="btn btn-outline-primary me-1"
                              >
                                <i className="bi bi-trash3"></i>
                              </button>
                              <button
                                onClick={() => editPopUpOpen(false, item)}
                                type="button"
                                className="btn btn-outline-primary me-1"
                              >
                                <i className="bi bi-pencil" id="editpopup"></i>
                              </button>
                            </>
                          ) : (
                            <></>
                          )}

                          <button
                            onClick={() => detailsPopUpOpen(false, item)}
                            type="button"
                            className="btn btn-outline-primary me-1"
                          >
                            <i className="bi bi-eye" id="detailpopup"></i>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
                {leaves.length > pageSize && pages.length > 0 ? (
                  <tfoot>
                    <tr>
                      <td colSpan="2">
                        <select
                          style={{
                            width: "75px",
                            paddingLeft: "8px",
                            height: "35px",
                          }}
                          className="form-select rounded-3"
                          name="type"
                          onChange={(e) => {
                            setPageSize(e.target.value);
                          }}
                        >
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                        </select>
                      </td>
                      <td colSpan="12">
                        <nav aria-label="Page navigation example">
                          <ul className="pagination justify-content-end m-0">
                            {pages.map((page, index) => (
                              <li
                                className="page-item"
                                key={index}
                                onClick={() => showNextInventory(page)}
                              >
                                <span className="page-link" href="#">
                                  {page}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </nav>
                      </td>
                    </tr>
                  </tfoot>
                ) : (
                  ""
                )}
              </table>
            ) : leaveStatus ? (
              <Loader msg="Leave data loading" />
            ) : (
              <div
                className="row datanotfound"
                style={{ height: "calc(100vh - 360px)" }}
              >
                <div className="col-12 text-center">
                  <h4
                    className="datanotfound"
                    style={{ height: "calc(100vh - 360px)" }}
                  >
                    <i className="bi bi-search datanotfoundIcon"></i> Data not
                    found
                  </h4>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
