import React, { memo, useCallback, useEffect, useState } from "react";
import { APIUrl } from "../../auth/constants";
import Header from "../inventory/Header";
import { useNavigate } from "react-router-dom";
import { getWeekValue } from "../../util/weekinfo";

function TimeSheetInfo({ projects, getSelectedProject, getWeeks }) {
  const [userInfo, setUserInfo] = useState([]);
  const [number, setNumber] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [weekValues, setweekValues] = useState({});
  const navigate = useNavigate();
  const getUsers = useCallback(() => {
    // let tokenValue = window.localStorage.getItem("am_token");
    // fetch(APIUrl + "api/user/me", {
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: "Bearer " + tokenValue,
    //   },
    // })
    //   .then((res) => {
    //     if (res.status === 401) {
    //       window.localStorage.removeItem("am_token");
    //       navigate("/");
    //     } else return res.json();
    //   })
    //   .then((res) => {
    //     setUserInfo(res);
    //     console.log("User Profile : ", res, projects, selectedProject);
    //   });
    if (projects?.length > 0) setSelectedProject(projects[0]);
    // getSelectedProject(projects[0]);
  }, [projects]);
  useEffect(() => {
    getUsers();
    if (Object.keys(weekValues).length === 0) {
      setweekValues(getWeekValue(0));
      getWeeks(getWeekValue(0));
    }
  }, [getUsers, getWeeks, weekValues]);
  // Function to handle incrementing the number
  const incrementNumber = () => {
    setNumber(number + 1);
    setweekValues(getWeekValue(number + 1));
    getWeeks(getWeekValue(number + 1));
  };

  // Function to handle decrementing the number
  const decrementNumber = () => {
    setNumber(number - 1);
    setweekValues(getWeekValue(number - 1));
    getWeeks(getWeekValue(number - 1));
  };
  return (
    <div className="col-sm-9">
      <dl className="row mb-1 mt-2">
        <dt className="col-sm-1 d-flex align-items-center">Week</dt>
        <dd className="form-inline col-sm-6 d-flex">
          <button
            onClick={decrementNumber}
            className="border border-dark bg-success"
            style={{ color: "#fff" }}
          >
            Pre
          </button>
          {/* </dd>
          <dd className="col-sm-3"> */}
          <input
            type="text"
            name="startWeek"
            disabled={true}
            defaultValue={weekValues.startWeek}
            className="form-control rounded-0 border border-dark"
            placeholder="Start Week"
          />
          {/* </dd>
          <dd className="col-sm-3"> */}
          <input
            type="text"
            name="endWeek"
            disabled={true}
            defaultValue={weekValues.endWeek}
            className="form-control rounded-0 border border-dark"
            placeholder="End Week"
          />
          {/* </dd>
          <dd className="col-sm-1"> */}
          <button
            onClick={incrementNumber}
            className="border border-dark bg-success"
            style={{ color: "#fff" }}
          >
            Next
          </button>
        </dd>
        <dt className="col-sm-1 d-flex mt-1">Project</dt>
        <dd className="form-inline col-sm-4 d-flex">
          <select
            className="form-select rounded-3"
            name="years"
            defaultValue={
              selectedProject
                ? selectedProject
                : projects && projects[0]?.projectId
            }
            onChange={(e) => {
              setSelectedProject(e.target.value);
              console.log(
                e.target.value,
                projects?.filter(
                  (project) => project.projectId === parseInt(e.target.value)
                )
              );
              getSelectedProject(
                projects?.filter(
                  (project) => project.projectId === parseInt(e.target.value)
                )
              );
            }}
          >
            <option value="">Select project</option>
            {projects?.map((project, index) => (
              <option key={index} value={project.projectId}>
                {project.name}
              </option>
            ))}
          </select>
        </dd>
      </dl>
    </div>
  );
}
export default memo(TimeSheetInfo);
