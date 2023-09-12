import React, { useCallback, useEffect, useState } from "react";
import { APIUrl } from "../../auth/constants";
import { useNavigate } from "react-router-dom";
export default function AssignProject({
  projectPopUp,
  projectPopUpClose,
  itemData,
  changeStatus,
  shouldFetchData,
}) {
  const [projects, setProject] = useState([]);
  const [assignedProjects, setAssignedProject] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const navigate = useNavigate();
  const setProjectData = useCallback(() => {
    if (!shouldFetchData) {
      let tokenValue = window.localStorage.getItem("am_token");
      fetch(APIUrl + "api/project", {
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
          setProject([...res]);
          setSelectedProject("");
        });
    }
  }, [navigate, shouldFetchData]);
  useEffect(() => {
    setProjectData();
    console.log("itemData ", itemData);
    if (
      Object.keys(itemData).length > 0 &&
      Object.keys(itemData).includes("userProjectWithAssignedDate")
    )
      setAssignedProject([...itemData?.userProjectWithAssignedDate]);
    setSelectedProject("");
  }, [itemData, setProjectData, projectPopUp]);
  const deleteProject = (row) => {
    let tempProjects = assignedProjects.filter(
      (proj) => proj.projectId !== row.projectId
    );
    setAssignedProject(tempProjects);
  };
  const updateProjects = () => {
    let tokenValue = window.localStorage.getItem("am_token");
    console.log("Update New Projects : ");
    fetch(APIUrl + "api/user", {
      method: "PUT",
      body: JSON.stringify({
        id: itemData.id,
        projectUpdate: true,
        projects: assignedProjects,
      }),
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
        console.log("Update User : ", res);
        changeStatus(true);
        projectPopUpClose(true);
        window.location.reload();
      })
      .catch((err) => {
        console.log("User Not Get : ", err);
        changeStatus(false);
      });
  };
  return (
    <div
      className={
        "modal modal-signin position-static bg-secondary py-1 " +
        (projectPopUp ? "closePopUp" : "displayPopUp")
      }
      tabIndex="-1"
      role="dialog"
      id="modalSignin"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header p-4 pb-4 border-bottom-0 headercolor bgColor">
            <h1 className="fw-bold mb-0 fs-2">Project Details</h1>
            <button
              onClick={() => {
                setSelectedProject("");
                projectPopUpClose(true);
              }}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body px-5 pt-0">
            <dl className="row mb-1 mt-3">
              <dt className="col-sm-12">Assigned Projects </dt>
            </dl>
            <hr className="mb-3" />

            <dl className="row mb-1">
              {assignedProjects?.length === 0 ? (
                <dd className="col-sm">
                  <span
                    style={{
                      backgroundColor: "#f1eed2",
                      color: "#333",
                      padding: "5px 10px",
                    }}
                  >
                    No projects assigned yet.
                  </span>
                </dd>
              ) : (
                <div className="row mt-3">
                  {assignedProjects?.map((row) => (
                    <dd
                      className="col-sm mb-4"
                      key={row.projectId}
                      onClick={() => deleteProject(row)}
                      title={
                        "Click here to unassign the " + row.name + " project.!"
                      }
                      onMouseOver={(e) => {
                        const icon =
                          e.currentTarget.querySelector("#projectIcon");
                        icon.classList = "bi bi-trash3";
                        icon.style.color = "#fff";
                        icon.style.backgroundColor = "red";
                        icon.style.padding = "5px 8px";
                        icon.style.borderRadius = "50%";
                        let tab = e.currentTarget.querySelector(".no-wrap");
                        tab.style.backgroundColor = "#fff";
                        tab.style.boxShadow = "1px 1px 6px 0px #9d9d9d";
                      }}
                      onMouseLeave={(e) => {
                        const icon =
                          e.currentTarget.querySelector("#projectIcon");
                        icon.classList = "bi bi-person-vcard";
                        icon.style.color = "#333";
                        icon.style.backgroundColor = "#f1eed2";
                        icon.style.padding = "5px 8px";
                        icon.style.borderRadius = "50%";
                        let tab = e.currentTarget.querySelector(".no-wrap");
                        tab.style.backgroundColor = "#f1eed2";
                        tab.style.boxShadow = "none";
                      }}
                    >
                      <span
                        className="no-wrap"
                        style={{
                          backgroundColor: "#f1eed2",
                          color: "#333",
                          padding: "7px 10px",
                          cursor: "pointer",
                        }}
                      >
                        <i
                          id="projectIcon"
                          className="bi bi-person-vcard "
                          style={{
                            color: "#333",
                            marginRight: "10px",
                            padding: "5px 8px",
                          }}
                        ></i>{" "}
                        {row.name}
                      </span>
                    </dd>
                  ))}
                </div>
              )}
            </dl>

            {/* <dl className="row mb-0">
              <dt className="col-sm-12">Assign New Project</dt>
            </dl> */}
            <hr className="mb-3" />
            <dl className="row mb-1 mt-3">
              <dt className="col-sm-12">Assign New Project</dt>
            </dl>
            <dl className="row mb-1">
              <dd className="col-sm-8">
                <select
                  className="form-select rounded-3"
                  value={selectedProject}
                  // defaultValue={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                >
                  <option value="">Select Project</option>
                  {projects
                    ?.filter(
                      (proj) =>
                        assignedProjects?.filter((oldProj) =>
                          oldProj.name.includes(proj.name)
                        ).length === 0
                    )
                    ?.map((val, index) => (
                      <option key={index} value={JSON.stringify(val)}>
                        {val.name}
                      </option>
                    ))}
                </select>
              </dd>
              <dd className="col-sm-4">
                <button
                  className="mb-0 btn btn-md rounded-3 btn-success center profilebtn2"
                  type="button"
                  onClick={() => {
                    if (selectedProject) {
                      setAssignedProject([
                        ...assignedProjects,
                        JSON.parse(selectedProject),
                      ]);
                      setSelectedProject("");
                    }
                  }}
                >
                  Add Project
                </button>
              </dd>
            </dl>
            <dl className="row mb-1">
              <hr className="mb-3 mt-2" />
              <dd className="col-sm-12 d-flex justify-content-center">
                <button
                  className="mb-0 btn btn-md rounded-3 btn-primary center profilebtn2"
                  type="button"
                  onClick={updateProjects}
                >
                  Update
                </button>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
