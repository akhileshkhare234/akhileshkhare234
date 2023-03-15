import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserData } from "../../App";
import { APIUrl } from "../../auth/constants";
import Header from "../inventory/Header";
import {
  dateFormate,
  getMonthName,
  getMonthsFullName,
  getYears,
} from "../util.js";
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
  const [userArray, setuserArray] = useState([]);
  const [payload, setPayload] = useState({});
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
        let users = res.users.map(
          (user) => user.displayName + "/" + user.email
        );
        setuserArray([...users]);
        console.log("Users List : ", users);
      })
      .catch((err) => {
        console.log("User Not Get : ", err);
      });
  }, []);
  useEffect(() => {
    getUsers();
  }, [getUsers]);
  const getUserInfo = (userinfo, index) => {
    return userinfo?.split("/")[index];
  };
  const getLeaves = useCallback(() => {
    console.log("itemStatus ", itemStatus);
    fetch(APIUrl + `api/leave/data/${getYears()}?email=${userInfo.email}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res?.length > 0) {
          console.log("Leaves data : ", res);
          setLeaves([...res]);
        }
      });
  }, [token, userInfo.email, itemStatus]);
  useEffect(() => {
    getLeaves();
  }, [getLeaves]);
  const getLeaveFilterData = (e) => {
    e.preventDefault();
    let { users, years, months } = e.target;
    let payload = {
      users: users.value,
      years: years.value,
      months: months.value,
    };
    console.log(payload);
    setPayload(payload);
    // http://localhost:8080/api/timesheet?year=2023&email=shailendra.bardiya@lirisoft.com,abc.xyz@lirisoft.com&month=JAN&projectId=2&status=ReSubmitted
    let urldata =
      payload.users === "All"
        ? payload.months === "All"
          ? `api/leave/data/${payload.years}`
          : `api/leave/data/${payload.years}?month=${payload.months}`
        : `api/leave/data/${payload.years}?month=${payload.months}&email=${payload.users}`;
    fetch(APIUrl + urldata, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res?.length > 0) {
          console.log("Leaves data : ", res);
          setLeaves([...res]);
        } else {
          setLeaves([]);
        }
      });
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
                <form onSubmit={getLeaveFilterData}>
                  <div className="row px-4 py-2">
                    <div className="col-md-3">
                      <label htmlFor="floatingInput" className="mb-1">
                        Users
                      </label>
                      <select className="form-control rounded-3" name="users">
                        <option value="All">All</option>
                        {userArray.map((user, index) => (
                          <option value={getUserInfo(user, 1)} key={index}>
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
                        className="form-control rounded-3"
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
                      <select
                        className="form-control rounded-3"
                        name="months"
                        defaultValue={getMonthName()}
                      >
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
                      <select className="form-control rounded-3" name="status">
                        {["Submit", "Approve", "Reject"].map(
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

            <table className="table tabletext">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  {Object.values(tableData).map((field, index) => (
                    <th scope="col" key={field}>
                      {field}
                    </th>
                  ))}
                  <th scope="col" className="text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((item, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    {Object.keys(tableData).map((field, index) => (
                      <td key={field}>
                        {field.includes("leaveFrom") ||
                        field.includes("leaveTo") ? (
                          dateFormate(item[field])
                        ) : field.includes("status") ? (
                          userInfo &&
                          userInfo.role === 2 &&
                          !["Approved", "Reject"].includes(item[field]) ? (
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
                            <span
                              className={
                                item[field] === "Reject"
                                  ? "status_btn_reject"
                                  : "status_btn"
                              }
                            >
                              {item[field]}
                            </span>
                          )
                        ) : field.includes("email") && item.email ? (
                          getUserInfo(
                            userArray.filter(
                              (user, index) =>
                                getUserInfo(user, 1) === item.email
                            )[0],
                            0
                          )
                        ) : (
                          item[field]
                        )}
                      </td>
                    ))}
                    <td className="text-center">
                      {item.status === "submitted" ? (
                        <>
                          <button
                            onClick={() =>
                              deletePopUpOpen(false, item.projectId)
                            }
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
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
