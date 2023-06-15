import React, { Fragment, memo, useCallback, useEffect, useState } from "react";
import { APIUrl } from "../../auth/constants";
import { getMonth, getMonthDates, getMonthName, getYears } from "../util";
import TimeSheetDetails from "./TimeSheetDetails";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../inventory/Header";
import Loader from "../../util/Loader";
function UserTimeSheet() {
  const [projects, setProjects] = useState([]);
  const [projectstatus, setProjectstatus] = useState(false);
  const [totalHour, setTotalHour] = useState({});
  const [totalHoursValue, setTotalHoursValue] = useState(0);
  const [timeSheetData, setTimeSheetData] = useState({});
  const [userInfo, setUserInfo] = useState([]);
  const [timesheetForm, setTimeSheetForm] = useState(null);
  const getUsers = useCallback(() => {
    let tokenValue = window.localStorage.getItem("am_token");
    fetch(APIUrl + "api/user/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokenValue,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("res.project : ", res.projects);
        // let projectData = res.projects.map((row) => {
        //   row["totalHour"] = 0;
        //   return row;
        // });
        // let hours = {};
        // getMonthDates(getMonth(), getYears(), projectData).forEach((data) => {
        //   hours["day_" + data.day] = 0;
        // });
        // setTotalHour(hours);
        // setProjects([...projectData]);
        setUserInfo(res);
        if (res.projects && res.projects.length > 0) setProjectstatus(false);
        else setProjectstatus(true);
        console.log("User Profile : ", res);
      })
      .catch((err) => {
        console.log("User Not Get : ", err);
      });
  }, []);
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const saveTimeSheet = (e) => {
    e.preventDefault();
    console.log("TimeSheet Data ", e.target);
    let payloadData = projects.map((project) => {
      let payload = {
        projectId: project.projectId,
        projectName: project.name,
        detail: [],
        comment: "",
        status: "InProgress",
        totalHour: totalHoursValue,
      };
      let taskDetails = getMonthDates(getMonth(), getYears(), projects).map(
        (data) => {
          console.log(
            "task ID",
            data.details.filter(
              (row) => row.projectId === project.projectId
            )[0]["hour"]
          );
          return {
            day: data.day,
            task: e.target[
              data.details.filter(
                (row) => row.projectId === project.projectId
              )[0]["task"]
            ].value,
            hour: e.target[
              data.details.filter(
                (row) => row.projectId === project.projectId
              )[0]["hour"]
            ].value,
            comment: "",
          };
        }
      );
      payload.detail = [...taskDetails];
      return payload;
    });
    console.log("payloadData : ", payloadData);
    let timeSheetPayload = {
      userName: userInfo.userName,
      email: userInfo.email,
      month: getMonthName(),
      year: getYears(),
      status: "InProgress",
      projectIds: projects.map((row) => row.projectId).join("|"),
      submitDate: new Date(),
      totalHour: totalHoursValue,
      comment: "",
      data: [...payloadData],
    };
    console.log("payloadData : ", timeSheetPayload);
    let tokenValue = window.localStorage.getItem("am_token");
    fetch(APIUrl + "api/timesheet/", {
      method: "POST",
      body: JSON.stringify(timeSheetPayload),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokenValue,
      },
    })
      .then((res) => {
        console.log("Update TimeSheet : ", res);
      })
      .catch((err) => {
        console.log("TimeSheet Not Update : ", err);
      });
    toast.success("Save TimeSheet Successfully.", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      theme: "colored",
    });
  };

  const updateTimeSheet = (e) => {
    e.preventDefault();
    console.log("TimeSheet Data ", e.target, projects);
    let timeSheetValue = null;
    projects.forEach((project) => {
      timeSheetValue = timeSheetData.data.filter(
        (row) => row.projectId === project.projectId
      )[0];
    });
    let payloadNewData = projects.map((project) => {
      timeSheetValue = timeSheetData.data.filter(
        (row) => row.projectId === project.projectId
      )[0];
      let payload = {
        projectId: timeSheetValue.projectId,
        projectName: timeSheetValue.name,
        detail: [],
        id: timeSheetValue.id,
        comment: timeSheetValue.comment,
        status: timeSheetValue.status,
        totalHour: project.totalHour,
      };
      let taskDetails = getMonthDates(getMonth(), getYears(), projects).map(
        (data) => {
          console.log(
            "task ID",
            data.details.filter(
              (row) => row.projectId === project.projectId
            )[0]["hour"]
          );
          return data.id > 0
            ? {
                id: data.id,
                day: data.day,
                task: e.target[
                  data.details.filter(
                    (row) => row.projectId === project.projectId
                  )[0]["task"]
                ].value,
                hour: e.target[
                  data.details.filter(
                    (row) => row.projectId === project.projectId
                  )[0]["hour"]
                ].value,
                comment: "",
              }
            : {
                day: data.day,
                task: e.target[
                  data.details.filter(
                    (row) => row.projectId === project.projectId
                  )[0]["task"]
                ].value,
                hour: e.target[
                  data.details.filter(
                    (row) => row.projectId === project.projectId
                  )[0]["hour"]
                ].value,
                comment: "",
              };
        }
      );
      payload.detail = [...taskDetails];
      return payload;
    });
    console.log("payloadNewData : ", payloadNewData);
    let timeSheetPayload = {
      userName: timeSheetData.userName,
      email: timeSheetData.email,
      month: timeSheetData.month,
      year: timeSheetData.year,
      status: "InProgress",
      projectIds: timeSheetData.projectIds,
      submitDate: new Date(),
      totalHour: totalHoursValue,
      comment: timeSheetData.comment,
      id: timeSheetData.id,
      data: [...payloadNewData],
    };
    console.log("Update payloadNewData : ", timeSheetPayload);
    let tokenValue = window.localStorage.getItem("am_token");
    fetch(APIUrl + "api/timesheet/" + timeSheetData.id, {
      method: "PUT",
      body: JSON.stringify(timeSheetPayload),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokenValue,
      },
    })
      .then((res) => {
        console.log("Update TimeSheet : ", res);
      })
      .catch((err) => {
        console.log("TimeSheet Not Update : ", err);
      });
    toast.success("TimeSheet Update Successfully.", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      theme: "colored",
    });
  };
  const setHoursValue = (fieldName) => {
    console.log("onChange Call ", projects);
    let colIndex = -1;
    // eslint-disable-next-line array-callback-return
    let hourRow = getMonthDates(getMonth(), getYears(), projects).filter(
      // eslint-disable-next-line array-callback-return
      (data) => {
        if (
          // eslint-disable-next-line array-callback-return
          data.details.filter((row, ind) => {
            if (row.hour === fieldName) {
              colIndex = ind;
              return row;
            }
          }).length > 0
        )
          return data;
      }
    );
    let timesheet = document.forms["timesheet"];
    let hourCol = {};
    let totalHourValue = 0;
    getMonthDates(getMonth(), getYears(), projects).forEach((data) => {
      hourCol[data.details[colIndex].hour] =
        timesheet[data.details[colIndex].hour].value;
      if (timesheet[data.details[colIndex].hour].value > 0)
        totalHourValue += parseFloat(
          timesheet[data.details[colIndex].hour].value
        );
    });
    let hoursValue = 0;
    let tempProjects = projects.map((row) => {
      if (row.projectId === parseInt(fieldName.split("_")[2])) {
        row.totalHour = totalHourValue;
        hoursValue += totalHourValue;
      }
      return row;
    });
    setTotalHoursValue(hoursValue);
    setProjects([...tempProjects]);
    if (hourRow.length > 0) {
      let sum = 0;
      hourRow[0].details.forEach((row) => {
        if (timesheet[row.hour].value > 0)
          sum += parseFloat(timesheet[row.hour].value);
        else sum += 0;
      });
      totalHour["day_" + hourRow[0].day] = sum;
      // timesheet["day_" + hourRow[0].day].value = sum + " hrs";
      setTotalHour(totalHour);
    }
  };
  useEffect(() => {
    console.log("totalHour Change ", totalHour);
  }, [totalHour]);
  const getTimeSheet = useCallback(() => {
    let tokenValue = window.localStorage.getItem("am_token");
    userInfo &&
      tokenValue &&
      fetch(APIUrl + `api/timesheet/${getYears()}/${getMonthName()}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokenValue,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          let timesheet = document.forms["timesheet"];
          setTimeSheetForm(timesheet);
          console.log(
            "timesheet Projects",
            res,
            userInfo.projects,
            timesheetForm
          );
          if (userInfo.projects && userInfo.projects.length > 0) {
            let projectData = userInfo.projects.map((row) => {
              row["totalHour"] = 0;
              return row;
            });
            let hours = {};
            getMonthDates(getMonth(), getYears(), projectData).forEach(
              (data) => {
                hours["day_" + data.day] = 0;
              }
            );
            setTotalHour(hours);
            setProjects([...projectData]);

            let projectIds = projectData.map((row) => row.projectId);
            console.log(
              "projectIds and projectData : ",
              projectIds,
              projectData,
              timesheet
            );
            if (res.month !== null) {
              res?.data?.forEach((row) => {
                console.log("row.projectId Value ", row.projectId);
                row.detail.forEach((data) => {
                  console.log("Project Details : ", data, row.projectId);
                  if (`hour_${data.day}_${row.projectId}` in timesheet) {
                    timesheet[`hour_${data.day}_${row.projectId}`].value =
                      data.hour;
                    let hourfiled =
                      timesheet[`hour_${data.day}_${row.projectId}`];
                    console.log(
                      "Hour Details :",
                      hourfiled,
                      timesheet[`hour_${data.day}_${row.projectId}`].value
                    );
                    let sum = 0;
                    let myarrays = projectIds.map((ids) =>
                      timesheet[`hour_${data.day}_${ids}`].value > 0
                        ? parseFloat(timesheet[`hour_${data.day}_${ids}`].value)
                        : 0
                    );
                    if (myarrays.length > 0) myarrays.reduce((p, n) => p + n);

                    hours["day_" + data.day] = sum;
                    // timesheet["day_" + data.day].value = sum + " hrs";
                  }
                  if (timesheet[`task_${data.day}_${row.projectId}`])
                    timesheet[`task_${data.day}_${row.projectId}`].value =
                      data.task;
                });
              });
              let tempProjects = projectData.map((row, index) => {
                row.totalHour = res.data[index].totalHour;
                return row;
              });
              console.log("tempProjects ", tempProjects);
              setProjects([...tempProjects]);
            }
          }
          setTimeSheetData(res);
        })
        .catch((err) => console.log("TimeSheet Data Not Get : ", err));
  }, [timesheetForm, userInfo]);
  useEffect(() => {
    getTimeSheet();
  }, [getTimeSheet, userInfo]);
  return userInfo?.projects?.length > 0 ? (
    <>
      <TimeSheetDetails projects={projects} />
      <ToastContainer />
      <form
        name="timesheet"
        onSubmit={
          timeSheetData.month === null ? saveTimeSheet : updateTimeSheet
        }
      >
        <button type="submit" className="btn saveBtn">
          {timeSheetData.month === null ? "Save" : "Update"}
        </button>
        <table className="table tabletext timesheettable">
          <thead>
            <tr>
              <th scope="col" colSpan={1}>
                Projects
              </th>
              {projects.map((project, index) => (
                <th
                  scope="col"
                  key={project.name + index}
                  colSpan="2"
                  className="text-center"
                >
                  {project.name}
                </th>
              ))}
              {/* <th
                className="text-center"
                scope="col"
                style={{ width: "100px" }}
              >
                Total Hrs
              </th> */}
            </tr>
          </thead>
          <tbody>
            {getMonthDates(getMonth(), getYears(), projects).map(
              (data, index) => (
                <tr key={index + data.day}>
                  <th
                    style={{ width: "70px" }}
                    className="text-center verticalAlign"
                  >
                    <div className="bgColor textColor dateStyle">
                      <div>{data.day}</div>
                      <div>{data.dayName}</div>
                    </div>
                  </th>
                  {data.details.map((row) => (
                    <Fragment key={row.hour}>
                      <td className="inputSize inputSize-1">
                        <input
                          type="text"
                          name={row.hour}
                          onChange={(event) => setHoursValue(event.target.name)}
                          className="form-control rounded-3 "
                          placeholder="Hrs"
                        />
                      </td>
                      <td className="inputSize textareaSize-1">
                        <textarea
                          multiline="true"
                          type="text"
                          name={row.task}
                          className="form-control rounded-3"
                          placeholder="Task Details"
                        />
                      </td>
                    </Fragment>
                  ))}
                  {/* <th className="text-center verticalAlign">
                    <input
                      readOnly={true}
                      className="hrsinput"
                      type="text"
                      name={"day_" + data.day}
                      value={totalHour["day_" + data.day] + " hrs"}
                    />
                  </th> */}
                </tr>
              )
            )}
          </tbody>
        </table>
      </form>
    </>
  ) : projectstatus ? (
    <>
      <Header title="Time Sheet Details" />
      <div className="container">
        <div className="row">
          <div className="col text-center">
            <h5 className="mt-4">No projects have been assigned to you.</h5>
          </div>
        </div>
      </div>
    </>
  ) : (
    <Loader msg="TimeSheet loading" />
  );
}
export default memo(UserTimeSheet);
