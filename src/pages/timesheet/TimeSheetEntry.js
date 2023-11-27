import React, {
  Fragment,
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { APIUrl } from "../../auth/constants";
import { getMonthDates, getWeekData, getYears } from "../util";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../inventory/Header";
import Loader from "../../util/Loader";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../App";
import TimeSheetInfo from "./TimeSheetInfo";
import { getCurrentWeek } from "../../util/weekinfo";
import InputHours from "./component/InputHours";
import InputTask from "./component/InputTask";
function TimeSheetEntry() {
  const userInfo = useContext(UserData);
  const [projects, setProjects] = useState([]);
  const [projectstatus, setProjectstatus] = useState(false);
  const [totalHour, setTotalHour] = useState({});
  const [totalHoursValue, setTotalHoursValue] = useState(0);
  const [timeSheetData, setTimeSheetData] = useState({});
  const [timesheetForm, setTimeSheetForm] = useState(null);
  const [selectedProject, setSelectedProject] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState({});
  const [activeTask, setActiveTask] = useState(null);
  const navigate = useNavigate();
  // Get Users List code
  const getUsers = useCallback(() => {
    if (
      userInfo.userProjectWithAssignedDate &&
      userInfo.userProjectWithAssignedDate.length > 0
    )
      setProjectstatus(false);
    else setProjectstatus(true);
    console.log("userInfo : ", userInfo);
  }, [userInfo]);
  useEffect(() => {
    getUsers();
  }, [getUsers]);
  //Active Task Handle
  const handleTaskSelect = (event, taskField) => {
    if (event) setHoursValue(event.target.name);
    setActiveTask(taskField);
    console.log(taskField);
  };
  //Save Timesheet code
  const saveTimeSheet = (e) => {
    e.preventDefault();
    let fieldFilled = [];
    let payloadData = projects.map((project) => {
      let payload = {
        projectId: project.projectId,
        projectName: project.name,
        detail: [],
        comment: "",
        status: "InProgress",
        totalHour: totalHoursValue,
      };
      let countHours = 0;
      let taskDetails = [];
      payload.detail = [...taskDetails];
      payload.totalHour = countHours;
      return payload;
    });
    let timeSheetPayload = {
      userName: userInfo?.userName,
      email: userInfo?.email,
      week: selectedWeek ? selectedWeek : getYears(),
      status: "InProgress",
      projectIds: selectedProject[0].id,
      submitDate: new Date(),
      totalHour: totalHoursValue,
      comment: "",
      data: [...payloadData],
    };
    console.log("timeSheetPayload : ", timeSheetPayload);
    if (fieldFilled.filter((field) => !field).length === 0) {
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
      console.log("Valid data : ", fieldFilled);
      toast.success("Save TimeSheet Successfully.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "colored",
        toastId: "customId1",
      });
    } else {
      toast.warn(
        "Fill the details of both task and hours for the respective date.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          theme: "colored",
          toastId: "customId2",
        }
      );
    }
  };
  //Update Timesheet code
  const updateTimeSheet = (e) => {
    e.preventDefault();
    let fieldFilled = [];
    console.log("TimeSheet Data ", e.target, projects);
    let timeSheetValue = null;
    projects.forEach((project) => {
      timeSheetValue = timeSheetData.data.filter(
        (row) => row.projectId === project.projectId
      )[0];
    });
    let countHours = 0;
    let payloadNewData = projects.map((project) => {
      // if (timeSheetData.projectIds?.includes(project.projectId)) {
      timeSheetValue = timeSheetData.data.filter(
        (row) => row.projectId === project.projectId
      )[0];
      console.log("timeSheetValue : ", timeSheetValue);
      let payload = null;
      if (timeSheetValue === undefined)
        payload = {
          projectId: project.projectId,
          projectName: project.name,
          detail: [],
          comment: project.comment,
          status: "InProgress",
          totalHour: 0,
        };
      else
        payload = {
          projectId: timeSheetValue.projectId,
          projectName: timeSheetValue.name,
          detail: [],
          id: timeSheetValue.id,
          comment: timeSheetValue.comment,
          status: timeSheetValue.status,
          totalHour: project.totalHour,
        };

      let taskDetails = [];
      payload.detail = [...taskDetails];
      countHours += parseInt(payload.totalHour);
      return payload;
    });
    console.log("updateTimeSheet payloadNewData : ", payloadNewData);
    let timeSheetPayload = {
      userName: timeSheetData.userName,
      email: timeSheetData.email,
      month: timeSheetData.month,
      year: timeSheetData.year,
      status: "InProgress",
      projectIds: timeSheetData.projectIds,
      submitDate: new Date(),
      totalHour: countHours,
      comment: timeSheetData.comment,
      id: timeSheetData.id,
      data: [...payloadNewData.filter((data) => Object.keys(data).length > 0)],
    };
    console.log("Update payloadNewData : ", timeSheetPayload);
    if (fieldFilled.filter((field) => !field).length === 0) {
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
        toastId: "customId3",
      });
    }
  };
  //set Hours Value onChange Text code
  const setHoursValue = (fieldName) => {
    console.log("onChange Call ", projects);
    let colIndex = -1;
    // eslint-disable-next-line array-callback-return
    let hourRow = getMonthDates(
      selectedProject,
      selectedWeek,
      projects,
      "All"
    ).filter(
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
    getMonthDates(selectedProject, selectedWeek, projects, "All").forEach(
      (data) => {
        hourCol[data.details[colIndex].hour] =
          timesheet[data.details[colIndex].hour].value;
        if (timesheet[data.details[colIndex].hour].value > 0)
          totalHourValue += parseFloat(
            timesheet[data.details[colIndex].hour].value
          );
      }
    );
    let hoursValue = 0;
    let tempProjects = projects.map((row) => {
      if (row.projectId === parseInt(fieldName.split("_")[2])) {
        row.totalHour = totalHourValue;
        hoursValue += totalHourValue;
      }
      return row;
    });
    setTotalHoursValue(hoursValue);
    console.log("User Project List Data : ", projects, tempProjects);
    setProjects([...tempProjects]);
    if (hourRow.length > 0) {
      let sum = 0;
      hourRow[0].details.forEach((row) => {
        if (timesheet[row.hour].value > 0)
          sum += parseFloat(timesheet[row.hour].value);
        else sum += 0;
      });
      totalHour["day_" + hourRow[0].day] = sum;
      setTotalHour(totalHour);
    }
  };

  //get Timesheet Data from Selected Month and Year Values
  const getTimeSheet = useCallback(
    (projectName, weekValue) => {
      // let tokenValue = window.localStorage.getItem("am_token");
      let timesheet = document.forms["timesheet"];

      let projectData = userInfo?.userProjectWithAssignedDate?.map((row) => {
        row["totalHour"] = 0;
        return row;
      });
      if (projectData && projectData?.length > 0) setProjects([...projectData]);
      console.log(
        "timesheet Form : ",
        timesheet,
        projectData,
        weekValue,
        projectName.length === 0 ? projectData[0] : projectName
      );
      getWeekData(
        Object.keys(weekValue).length === 0 ? getCurrentWeek() : weekValue,
        projectName.length === 0 ? projectData[0] : projectName
      );
    },
    [userInfo]
  );
  useEffect(() => {
    console.log(selectedWeek, selectedProject, projects);
    if (selectedProject?.length === 0) setSelectedProject(projects[0]);
    // getTimeSheet(selectedProject, selectedWeek);
    // getWeekData(selectedWeek, selectedProject);
  }, [getTimeSheet, projects, selectedProject, selectedWeek]);
  useEffect(() => {
    console.log("totalHour Change ", totalHour);
  }, [totalHour]);
  const getSelectedProject = useCallback(
    (project) => {
      console.log("Selected project : ", project, selectedWeek);
      setSelectedProject(project);
      getTimeSheet(project, selectedWeek);
      getWeekData(selectedWeek, project);
    },
    [getTimeSheet, selectedWeek]
  );
  const getWeeks = useCallback(
    (weeks) => {
      console.log("Selected weeks : ", weeks, selectedProject);
      setSelectedWeek(weeks);
      getTimeSheet(selectedProject, weeks);
      getWeekData(weeks, selectedProject);
    },
    [getTimeSheet, selectedProject]
  );
  return userInfo?.userProjectWithAssignedDate?.length > 0 ? (
    <>
      <Header title="Time Sheet Details" />
      <ToastContainer id="toastmsgTimeSheet" />
      <div>
        <form
          name="timesheet"
          id="timesheetentry"
          onSubmit={
            timeSheetData.month === null ? saveTimeSheet : updateTimeSheet
          }
        >
          <div className="container">
            <div className="row">
              <TimeSheetInfo
                projects={projects}
                getSelectedProject={(value) => getSelectedProject(value)}
                getWeeks={(value) => getWeeks(value)}
              />
              <div className="col-sm-3 d-flex align-items-center justify-content-center mt-1">
                <button type="submit" className="btn btn-primary saveBtn">
                  {timeSheetData.month === null ? "Save" : "Update"}
                </button>
              </div>
            </div>
          </div>
          {projects.length > 0 ? (
            <>
              <div className="timesheet">
                <table className="table table-bordered">
                  <tbody>
                    <tr className="bg-info">
                      <td
                        className="bg-dark"
                        colSpan={2}
                        style={{
                          color: "#fff",
                          verticalAlign: "middle",
                          width: "30%",
                        }}
                      >
                        Project Details
                      </td>
                      {getWeekData(selectedWeek, selectedProject)?.map(
                        (data, index) => (
                          <td key={data.day + index}>
                            {data.dayOfWeek}
                            <br /> {data.day}/{data.month}
                          </td>
                        )
                      )}
                    </tr>
                    <tr>
                      <th
                        className="text-start align-middle"
                        style={{ width: "45px" }}
                      >
                        Project
                      </th>
                      <td className="text-center align-middle">
                        {" "}
                        {selectedProject?.length > 0
                          ? selectedProject[0]?.name
                          : "-"}
                      </td>
                      {getWeekData(selectedWeek, selectedProject)?.length >
                      0 ? (
                        getWeekData(selectedWeek, selectedProject)?.map(
                          (data, index) => (
                            <td
                              key={index + data.day}
                              className="inputSize inputSize-1"
                            >
                              <InputHours
                                fieldData={data}
                                handleTaskSelect={handleTaskSelect}
                                activeTask={activeTask}
                              />
                            </td>
                          )
                        )
                      ) : (
                        <td colSpan={7}>
                          <div
                            className="col-12 text-center"
                            style={{ color: "#0eb593" }}
                          >
                            No project selected.
                          </div>
                        </td>
                      )}
                    </tr>
                    <tr style={{ height: "40px" }}>
                      <th className="text-start align-middle">Manager</th>
                      <td className="text-center align-middle">
                        {selectedProject?.length > 0
                          ? selectedProject[0]?.manager
                          : "-"}
                      </td>
                      <td colSpan={7} className="inputSize ">
                        {activeTask ? (
                          getWeekData(selectedWeek, selectedProject)?.length >
                          0 ? (
                            getWeekData(selectedWeek, selectedProject)?.map(
                              (data, index) => (
                                <InputTask
                                  fieldData={data}
                                  activeTask={activeTask}
                                />
                              )
                            )
                          ) : (
                            <></>
                          )
                        ) : (
                          <></>
                        )}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr style={{ height: "40px" }}>
                      <th className="text-start align-middle">Detail</th>
                      <td className="text-center align-middle">
                        {selectedProject?.length > 0
                          ? selectedProject[0]?.projectDetail
                          : "-"}
                      </td>

                      <td className="bg-info" colSpan={5}>
                        Total
                      </td>
                      <td colSpan={2}>0 Hrs</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          ) : (
            <div className="row">
              <div className="col-12 text-center" style={{ color: "#0eb593" }}>
                No projects have been assigned in the {selectedWeek.startWeek}/
                {selectedWeek.endWeek}.
              </div>
            </div>
          )}
        </form>
      </div>
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
export default memo(TimeSheetEntry);
