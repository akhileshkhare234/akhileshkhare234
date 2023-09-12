import React, { useCallback, useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserData } from "../../App";
import { APIUrl } from "../../auth/constants";
import Header from "../inventory/Header";
import { getMonthName, getMonths, getYears } from "../util.js";
import ApproveTimeSheet from "./ApproveTimeSheet";
import { useNavigate } from "react-router-dom";

export default function TimeSheetList({ historyPopUpOpen, token, itemStatus }) {
  const userInfo = useContext(UserData);
  const [approvePopUp, setapprovePopUp] = useState(true);
  const [items, setItems] = useState([]);
  const [timeSheetData, setTimeSheetData] = useState([]);
  const [pages, setPages] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [start, setStart] = useState(0);
  const [payload, setPayload] = useState({});
  const [userArray, setuserArray] = useState([]);
  const [projects, setProject] = useState([]);
  const navigate = useNavigate();
  const getUsers = useCallback(() => {
    let users = userInfo?.userList?.map((user) => {
      return { name: user.displayName, email: user.email, id: user.id };
    });
    if (users) setuserArray([...users]);
    else setuserArray([]);
  }, [userInfo?.userList]);
  useEffect(() => {
    getUsers();
  }, [getUsers]);
  const getTimeSheet = useCallback(
    (e) => {
      setPageSize(10);
      e?.preventDefault();
      let userForm = document.forms["timesheetform"];
      if (userForm) {
        let { users, projects, years, months } = userForm;
        let payload = {
          users: users.value,
          projects: projects.value,
          years: years.value,
          months: months.value,
        };
        console.log(payload);
        setPayload(payload);
        // http://localhost:8080/api/timesheet?year=2023&email=shailendra.bardiya@lirisoft.com,abc.xyz@lirisoft.com&month=JAN&projectId=2&status=ReSubmitted
        let urldata =
          payload.users === "All"
            ? payload.projects === "All"
              ? `api/timesheet?year=${payload.years}&month=${payload.months}`
              : `api/timesheet?year=${payload.years}&month=${payload.months}&projectId=${payload.projects}`
            : payload.projects === "All"
            ? `api/timesheet?year=${payload.years}&email=${payload.users}&month=${payload.months}`
            : `api/timesheet?year=${payload.years}&email=${payload.users}&month=${payload.months}&projectId=${payload.projects}`;
        token &&
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
                let timeSheet = res.filter((row, index) => index < 10);
                console.log("timeSheet Info ", timeSheet);
                setItems([...timeSheet]);
                setTimeSheetData([...res]);
                let pageSize = 10;
                let pages = [];
                for (let I = 1; I <= Math.ceil(res.length / pageSize); I++) {
                  pages.push(I);
                }
                setPages(pages);
              } else {
                setItems([]);
                setTimeSheetData([]);
                setPages([]);
              }
            });
      }
    },
    [navigate, token]
  );
  const setProjectData = useCallback(() => {
    setStart(0);
    token &&
      fetch(APIUrl + "api/project", {
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
            let project = res.filter((row, index) => index < 10);
            console.log("projects List ", project);
            setProject([...res]);
            getTimeSheet();

            let pageSize = 10;
            let pages = [];
            for (let I = 1; I <= Math.ceil(res.length / pageSize); I++) {
              pages.push(I);
            }
            setPages(pages);
          } else {
            setProject([]);
            setPages([]);
          }
        });
  }, [navigate, token]);
  useEffect(() => {
    setProjectData();
  }, [setProjectData, itemStatus]);
  const showNextTimesheet = (pos) => {
    let start = pos === 1 ? 0 : pos * 10 - 10;
    let timeSheet = timeSheetData.filter(
      (row, index) => index >= start && index < pos * 10
    );
    console.log("start, pos,timeSheet ", start, pos, timeSheet);
    setItems([...timeSheet]);
    setStart(start);
  };
  // const getUserInfo = (user, index) => {
  //   return user?.split("/")[index];
  // };

  const exportFile = () => {
    let timesheetform = document.forms["timesheetform"];
    let payload = {
      users: timesheetform.users.value,
      projects: timesheetform.projects.value,
      years: timesheetform.years.value,
      months: timesheetform.months.value,
    };
    setPayload(payload);
    console.log("TimeSheet data : ", payload);
    if (payload.projects !== "All") {
      let data = projects.filter(
        (project) => project.projectId === parseInt(payload.projects)
      );
      let urldata =
        payload.users === "All" && payload.projects !== "All"
          ? `api/timesheet/export?year=${payload.years}&month=${payload.months}&projectId=${payload.projects}`
          : null;
      urldata
        ? fetch(APIUrl + urldata, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          })
            .then((res) => res.blob())
            .then((blob) => global.URL.createObjectURL(blob))
            .then((url) => {
              const a = document.createElement("a");
              a.href = url;
              a.download = `${data[0].name}_${payload.months}_${payload.years}.xlsx`;
              a.click();
              console.log(url);
            })
        : console.log("We can export only one project data.");
    } else {
      toast.warning("Please select a project to export timesheet.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "colored",
      });
    }
  };
  return (
    <>
      <ToastContainer />
      <Header title="TimeSheets List" />
      <div className="container">
        <div className="row">
          <div className="col">
            {userInfo && userInfo?.role === 2 ? (
              <form name="timesheetform" onSubmit={getTimeSheet}>
                <div className="row px-4 py-2">
                  <div className="col-md-3">
                    <label htmlFor="floatingInput" className="mb-1">
                      Users
                    </label>
                    <select className="form-select rounded-3" name="users">
                      <option value="All">All</option>
                      {userArray?.map((user, index) => (
                        <option value={user.email} key={index}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="floatingInput" className="mb-1">
                      Projects
                    </label>
                    <select className="form-select rounded-3" name="projects">
                      <option value="All">All</option>
                      {projects.map((project, index) => (
                        <option value={project.projectId} key={index}>
                          {project.name}
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
                    <select
                      className="form-select rounded-3"
                      name="months"
                      defaultValue={getMonthName()}
                    >
                      {getMonths().map((month, index) => (
                        <option value={month} key={index + month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col justify-content-center text-center mt-4">
                    <button
                      type="submit"
                      style={{ marginRight: "10px" }}
                      className="btn btn-outline-primary mt-2"
                    >
                      <span className="ml-2">View</span>
                    </button>
                    <button
                      type="button"
                      onClick={exportFile}
                      className="btn btn-outline-primary mt-2"
                    >
                      <span className="ml-2">Export</span>
                    </button>
                  </div>
                </div>
              </form>
            ) : null}
            <hr className="mb-3" />
            {items?.length > 0 ? (
              <table className="table tabletext2">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">User Name</th>
                    <th scope="col" className="text-center">
                      TimeSheet Details
                    </th>
                    {payload.projects === "All" ? null : (
                      <th scope="col" className="text-center">
                        Status
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <th scope="row">{start + index + 1}</th>
                      <td>
                        {
                          userArray.filter(
                            (user, index) => user.email === item.email
                          )[0]?.name
                        }
                      </td>
                      <td className="text-center">
                        {payload?.projects === "All" ? (
                          item.projectIds.split("|").map((id) => {
                            let data = projects.filter(
                              (project) => project.projectId === parseInt(id)
                            );
                            return data.length > 0 ? (
                              <span
                                onClick={() =>
                                  historyPopUpOpen(false, {
                                    data: item.data.filter(
                                      (row) => row.projectId === parseInt(id)
                                    ),
                                    projectName: data[0].name,
                                    month: item.month,
                                    year: item.year,
                                  })
                                }
                                title={"View " + data[0].name + " TimeSheet"}
                                key={data[0].projectId + data[0].name}
                                className="timesheetlink"
                              >
                                {data[0].name} {item.month} {item.year}
                              </span>
                            ) : null;
                          })
                        ) : (
                          <span
                            className="timesheetlink"
                            onClick={() =>
                              historyPopUpOpen(false, {
                                data: item.data.filter(
                                  (row) =>
                                    row.projectId === parseInt(payload.projects)
                                ),
                                projectName: projects?.filter(
                                  (project) =>
                                    project.projectId ===
                                    parseInt(payload.projects)
                                )[0]?.name,
                                month: item.month,
                                year: item.year,
                              })
                            }
                            title={
                              "View " + projects?.length > 0 &&
                              projects?.filter(
                                (project) =>
                                  project.projectId ===
                                  parseInt(payload.projects)
                              )[0]?.name + " TimeSheet"
                            }
                          >
                            {projects?.filter(
                              (project) =>
                                project.projectId === parseInt(payload.projects)
                            )[0].name + " "}
                            {item.month} {item.year}
                          </span>
                        )}
                      </td>
                      {payload.projects === "All" ? null : (
                        <td className="text-center">
                          {userInfo && userInfo?.role === 2 ? (
                            item?.data.length > 0 ? (
                              <span
                                className="status_btn"
                                onClick={() => setapprovePopUp(false)}
                              >
                                {
                                  item?.data.filter(
                                    (row) =>
                                      row.projectId ===
                                      parseInt(payload.projects)
                                  )[0]?.status
                                }
                              </span>
                            ) : (
                              <span className="status_btn">Not Filled</span>
                            )
                          ) : (
                            <span className="status_btn">
                              {
                                item?.data.filter(
                                  (row) =>
                                    row.projectId === parseInt(payload.projects)
                                )[0]?.status
                              }
                            </span>
                          )}
                        </td>
                      )}

                      {/* <td className="text-center">
                      <button
                        onClick={() => historyPopUpOpen(false, item.data)}
                        type="button"
                        className="btn btn-outline-primary"
                      >
                        <i className="bi bi-clock-history"></i>
                      </button>
                    </td> */}
                    </tr>
                  ))}
                </tbody>
                {timeSheetData.length > pageSize && pages.length > 0 ? (
                  <tfoot>
                    <tr>
                      <td>
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
                      <td colSpan="3">
                        <nav aria-label="Page navigation example">
                          <ul className="pagination justify-content-end m-0">
                            {/* <li className="page-item disabled">
                              <span className="page-link">Previous</span>
                            </li> */}
                            {pages.map((page, index) => (
                              <li
                                className="page-item"
                                key={index}
                                onClick={() => showNextTimesheet(page)}
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
            ) : (
              <div className="row datanotfound">
                <div className="col-12 text-center">
                  <h4 className="datanotfound">
                    <i className="bi bi-search datanotfoundIcon"></i>Timesheet
                    data not found
                  </h4>
                </div>
              </div>
            )}
          </div>
        </div>
        <ApproveTimeSheet
          approvePopUp={approvePopUp}
          approvePopUpClose={(status) => setapprovePopUp(status)}
        />
      </div>
    </>
  );
}
