import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getMonthDates } from "../util";
import TimeSheetDetails from "./TimeSheetDetails";

export default function UserTimeSheet() {
  const [projects, setProjects] = useState([
    { name: "Praemia", projectId: 1, totalHour: 0 },
    { name: "HotSpots", projectId: 2, totalHour: 0 },
    { name: "Asset Management", projectId: 3, totalHour: 0 },
  ]);
  const [totalHour, setTotalHour] = useState({});
  const setDefaultHours = useCallback(() => {
    let hours = {};
    getMonthDates(2, 2023, projects).forEach((data) => {
      hours["day_" + data.day] = 0;
    });

    setTotalHour(hours);
  }, []);
  useEffect(() => {
    setDefaultHours();
  }, [setDefaultHours]);
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
        totalHour: 0,
      };
      let taskDetails = getMonthDates(2, 2023, projects).map((data) => {
        console.log(
          "task ID",
          data.details.filter((row) => row.projectId === project.projectId)[0][
            "hour"
          ]
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
      });
      payload.detail = [...taskDetails];
      return payload;
    });
    console.log("payloadData : ", payloadData);
  };
  const setHoursValue = (e) => {
    console.log(e.target.name);
    let colIndex = -1;
    // eslint-disable-next-line array-callback-return
    let hourRow = getMonthDates(2, 2023, projects).filter((data) => {
      if (
        data.details.filter((row, ind) => {
          if (row.hour === e.target.name) {
            colIndex = ind;
            return row;
          }
        }).length > 0
      )
        return data;
    });
    let timesheet = document.forms["timesheet"];
    let hourCol = {};
    let totalHourValue = 0;
    getMonthDates(2, 2023, projects).forEach((data) => {
      hourCol[data.details[colIndex].hour] =
        timesheet[data.details[colIndex].hour].value;
      if (timesheet[data.details[colIndex].hour].value > 0)
        totalHourValue += parseFloat(
          timesheet[data.details[colIndex].hour].value
        );
    });
    let tempProjects = projects.map((row) => {
      if (row.projectId === parseInt(e.target.name.split("_")[2]))
        row.totalHour = totalHourValue;
      console.log("Projetc ID : ", parseInt(e.target.name.split("_")[2]), row);
      return row;
    });
    setProjects([...tempProjects]);
    console.log("Col Index ", colIndex, hourCol);
    if (hourRow.length > 0) {
      let sum = 0;
      hourRow[0].details.forEach((row) => {
        console.log(timesheet[row.hour].value);
        if (timesheet[row.hour].value > 0)
          sum += parseFloat(timesheet[row.hour].value);
        else sum += 0;
      });
      totalHour["day_" + hourRow[0].day] = sum;
      timesheet["day_" + hourRow[0].day].value = sum + " hrs";
      setTotalHour(totalHour);
    }
    console.log("totalHour : ", totalHour);
  };
  useEffect(() => {
    console.log("totalHour Change");
  }, [totalHour]);
  return (
    <>
      <TimeSheetDetails projects={projects} />
      <form name="timesheet" onSubmit={saveTimeSheet}>
        <button type="submit" className="btn saveBtn">
          Save TimeSheet
        </button>
        <table className="table tabletext timesheettable">
          <thead>
            <tr>
              <th scope="col" colSpan={2}>
                Project name
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
              <th
                className="text-center"
                scope="col"
                style={{ width: "100px" }}
              >
                Total Hrs
              </th>
            </tr>
          </thead>
          <tbody>
            {getMonthDates(2, 2023, projects).map((data, index) => (
              <tr key={index + data.day}>
                <th
                  style={{ width: "70px" }}
                  className="text-center verticalAlign"
                >
                  {data.day}
                </th>
                <th className="text-start verticalAlign">{data.dayName}</th>
                {data.details.map((row) => (
                  <Fragment key={row.hour}>
                    <td>
                      <input
                        type="text"
                        name={row.hour}
                        onChange={setHoursValue}
                        className="form-control rounded-3 inputSize-1"
                        placeholder="Hrs"
                      />
                    </td>
                    <td>
                      <textarea
                        multiline="true"
                        type="text"
                        name={row.task}
                        className="form-control rounded-3 inputSize-2"
                        placeholder="Task Details"
                      />
                    </td>
                  </Fragment>
                ))}
                <th className="text-center verticalAlign">
                  <input
                    readOnly={true}
                    className="hrsinput"
                    type="text"
                    name={"day_" + data.day}
                    value={totalHour["day_" + data.day] + " hrs"}
                  />
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </form>
    </>
  );
}
