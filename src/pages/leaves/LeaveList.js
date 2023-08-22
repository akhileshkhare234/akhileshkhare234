import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserData } from "../../App";
import { APIUrl } from "../../auth/constants";
import Loader from "../../util/Loader";
import Header from "../inventory/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { dateFormate, getMonthsFullName, getYears } from "../util.js";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css"; // You can choose different loading effects

const tableData = {
  email: "Name",
  leaveFrom: "Leave From",
  leaveTo: "Leave To",
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
  const [pageSizeStatus, setPageSizeStatus] = useState(false);
  const [pages, setPages] = useState([]);
  const [userArray, setuserArray] = useState([]);
  const [leaveStatus, setleaveStatus] = useState(false);
  const getUsers = useCallback(() => {
    let tokenValue = window.localStorage.getItem("am_token");
    if (userInfo && userInfo.role === 2) {
      fetch(APIUrl + "api/users", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokenValue,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          let users = res.map(
            (user) => user.displayName + "/" + user.email + "/" + user.imageUrl
          );
          setuserArray([...users]);
          console.log("Users List : ", users);
        })
        .catch((err) => {
          console.log("User Not Get : ", err, userInfo);
        });
    } else {
      setuserArray([]);
    }
  }, [userInfo]);
  useEffect(() => {
    getUsers();
  }, [getUsers]);
  const getUserInfo = (userinfo, index) => {
    // console.log("User Info Data : ", userinfo);
    return userinfo?.split("/")[index];
  };
  const getLeaves = useCallback(() => {
    setStart(0);
    console.log("itemStatus ", itemStatus);
    if (userInfo.email && token) {
      let urlValue = null;
      if (pageSizeStatus) {
        let leavesList = document.forms["leavesList"];
        console.log("payload Data: ", leavesList);
        console.log("payload Data: ", leavesList.users.value);
        let payload = {
          users: leavesList.users.value,
          years: leavesList.years.value,
          months: leavesList.months.value,
          status: leavesList.status.value,
        };
        console.log("payload Data: ", payload);
        urlValue = getURL(payload);
      } else {
        urlValue = `api/leave/data/${getYears()}?email=${userInfo.email}`;
        setleaveStatus(true);
      }
      fetch(APIUrl + urlValue, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => res.json())
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
  }, [itemStatus, userInfo.email, token, pageSizeStatus, pageSize]);
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
      .then((res) => res.json())
      .then((res) => {
        if (res?.length > 0) {
          res.sort((p, n) => {
            let date1 = new Date(n.leaveFrom);
            let date2 = new Date(p.leaveFrom);
            return date1 - date2;
          });
          let leavesData = res.filter((row, index) => index < pageSize);
          console.log("leavesData Info ", leavesData);

          console.log(
            "Sort data : ",
            res.sort((p, n) => {
              let date1 = new Date(n.leaveFrom);
              let date2 = new Date(p.leaveFrom);
              return date1 - date2;
            })
          );
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
  const checkDate = (fromdate) => {
    let curDate = new Date();
    let frmDate = new Date(fromdate);
    // console.log(
    //   curDate.getTime() <= frmDate.getTime(),
    //   curDate.toLocaleDateString(),
    //   frmDate.toLocaleDateString(),
    //   new Date(curDate.toLocaleDateString() + " 00:00").getTime(),
    //   new Date(frmDate.toLocaleDateString() + " 00:00").getTime()
    // );
    return (
      new Date(curDate.toLocaleDateString() + " 00:00").getTime() <=
      new Date(frmDate.toLocaleDateString() + " 00:00").getTime()
    );
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
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="row px-4 py-2">
              <div className="col justify-content-end text-end">
                <button
                  onClick={() => entryPopUpOpen(false)}
                  type="button"
                  className="btn btn-outline-primary"
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  <span className="ml-2">Apply for leave</span>
                </button>
              </div>
            </div>

            {userInfo && userInfo.role === 2 ? (
              <>
                <hr className="mb-3" />
                <form name="leavesList" onSubmit={getLeaveFilterData}>
                  <div className="row px-4 py-2">
                    <div className="col-md-3">
                      <label htmlFor="floatingInput" className="mb-1">
                        Users
                      </label>
                      <select className="form-select rounded-3" name="users">
                        <option value="All">All</option>
                        {userArray.map((user, index) => (
                          <option
                            value={getUserInfo(user, 1)}
                            selected={getUserInfo(user, 1).includes(
                              userInfo.email
                            )}
                            key={index}
                          >
                            {getUserInfo(user, 0)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-2">
                      <label htmlFor="floatingInput" className="mb-1">
                        Year
                      </label>
                      <select
                        className="form-select rounded-3"
                        name="years"
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
                      <label htmlFor="floatingInput" className="mb-1">
                        Month
                      </label>
                      <select className="form-select rounded-3" name="months">
                        <option value="All">All</option>
                        {getMonthsFullName().map((month, index) => (
                          <option value={month} key={index + month}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-2">
                      <label htmlFor="floatingInput" className="mb-1">
                        Status
                      </label>
                      <select className="form-select rounded-3" name="status">
                        {["All", "Submit", "Approve", "Reject"].map(
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
                        className="btn btn-outline-primary mt-2"
                      >
                        <span className="ml-2">View</span>
                      </button>
                    </div>
                  </div>
                </form>
              </>
            ) : null}
            <hr className="mb-3" />
            {items && items.length > 0 ? (
              <table className="table tabletext">
                <thead>
                  <tr>
                    <th scope="col" style={{ width: "35px" }}>
                      #
                    </th>
                    {/* <th></th> */}
                    <th scope="col" style={{ width: "210px" }}>
                      Name
                    </th>
                    <th scope="col" style={{ width: "120px" }}>
                      Leave From
                    </th>
                    <th scope="col" style={{ width: "120px" }}>
                      Leave To
                    </th>
                    <th scope="col" style={{ width: "120px" }}>
                      No. of Days
                    </th>
                    <th scope="col">Reason</th>
                    <th scope="col" style={{ width: "90px" }}>
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
                      {/* <td>
                        <LazyLoadImage
                          alt={item.displayName}
                          // onClick={() => showImage(false, user)}
                          className="profileimage3"
                          effect="blur" // You can use different loading effects like 'opacity', 'black-and-white', etc.
                          src={
                            item.imageUrl
                              ? item.imageUrl
                              : item.gender === "Female"
                              ? process.env.PUBLIC_URL + "/images/female.png"
                              : process.env.PUBLIC_URL + "/images/male.png"
                          }
                        />
                      </td> */}
                      {Object.keys(tableData).map((field, index) => (
                        <td key={field}>
                          {field.includes("leaveFrom") ||
                          field.includes("leaveTo") ? (
                            dateFormate(item[field])
                          ) : field.includes("status") ? (
                            userInfo && userInfo.role === 2 ? (
                              <span
                                className={
                                  item[field] === "Reject"
                                    ? "status_btn_reject"
                                    : "status_btn"
                                }
                                onClick={() => setApproveData(false, item)}
                              >
                                {item[field]}
                              </span>
                            ) : (
                              <>
                                <span
                                  className={
                                    item[field] === "Reject"
                                      ? "status_reject"
                                      : "status_normal"
                                  }
                                >
                                  {item[field]}
                                </span>
                                <ToastContainer />
                              </>
                            )
                          ) : field.includes("email") && item.email ? (
                            userInfo.role === 2 ? (
                              getUserInfo(
                                userArray.filter(
                                  (user, index) =>
                                    getUserInfo(user, 1) === item.email
                                )[0],
                                0
                              )
                            ) : (
                              userInfo.displayName
                            )
                          ) : (
                            item[field]
                          )}
                        </td>
                      ))}
                      <td className="text-start" style={{ width: "100px" }}>
                        {["Submit", "submitted"].includes(item.status) ? (
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
                              <i className="bi bi-pencil"></i>
                            </button>
                          </>
                        ) : null}
                        <button
                          onClick={() => detailsPopUpOpen(false, item)}
                          type="button"
                          className="btn btn-outline-primary me-1"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                      </td>
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
                            setPageSizeStatus(true);
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
                            {/* <li className="page-item disabled">
                            <span className="page-link">Previous</span>
                          </li> */}
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

                            {/* <li className="page-item">
                            <span className="page-link" href="#">
                              Next
                            </span>
                          </li> */}
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
