import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserData } from "../../App";
import { APIUrl } from "../../auth/constants";
import Header from "../inventory/Header";
import { dateFormate } from "../util.js";
const tableData = {
  name: "Project Name",
  manager: "Manager",
  teamSize: "Team Size",
  startDate: "Start Date",
  completionDate: "Completion Date",
  clientContactName: "Client Name",
  clientContactNumber: "Client Contact",
  projectDetail: "Project Detail",
};
export default function ProjectList({
  entryPopUpOpen,
  editPopUpOpen,
  deletePopUpOpen,
  detailsPopUpOpen,
  historyPopUpOpen,
  token,
  itemStatus,
}) {
  const userInfo = useContext(UserData);
  const [projects, setProject] = useState([]);
  const [projectData, setIProjects] = useState([]);
  const [pages, setPages] = useState([]);
  const [start, setStart] = useState(0);
  const [serachText, setSerachText] = useState("");
  const setProjectData = useCallback(() => {
    setStart(0);
    fetch(APIUrl + "api/project", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res?.length > 0) {
          let project = res.filter((row, index) => index < 10);
          console.log("projects List ", project);
          setProject([...project]);
          setIProjects([...res]);
          let pageSize = 10;
          let pages = [];
          for (let I = 1; I <= Math.ceil(res.length / pageSize); I++) {
            pages.push(I);
          }
          setPages(pages);
        } else {
          setProject([]);
          setIProjects([]);
          setPages([]);
        }
      });
  }, [token]);
  useEffect(() => {
    setProjectData();
  }, [setProjectData, itemStatus]);
  const searchProject = useCallback(() => {
    if (serachText) {
      let project = projectData.filter(
        (row, index) =>
          Object.keys(row).filter((field) => {
            let text = row[field] + "";
            return text.toUpperCase().includes(serachText.toUpperCase());
          }).length > 0
      );
      console.log("serachText,project ", serachText, project);
      setProject([...project]);
      let pageSize = 10;
      let pages = [];
      for (let I = 1; I <= Math.ceil(project.length / pageSize); I++) {
        pages.push(I);
      }
      setPages(pages);
    } else {
      let project = projectData.filter((row, index) => index < 10);
      let pageSize = 10;
      let pages = [];
      for (let I = 1; I <= Math.ceil(projectData.length / pageSize); I++) {
        pages.push(I);
      }
      setPages(pages);
      setProject([...project]);
    }
  }, [projectData, serachText]);
  useEffect(() => {
    const getData = setTimeout(() => {
      searchProject(serachText);
    }, 1000);
    return () => clearTimeout(getData);
  }, [searchProject, serachText]);
  const showNextInventory = (pos) => {
    let start = pos === 1 ? 0 : pos * 10 - 10;
    let inventory = projectData.filter(
      (row, index) => index >= start && index < pos * 10
    );
    console.log("start, pos,inventory ", start, pos, inventory);
    setProject([...inventory]);
    setStart(start);
  };
  return (
    <>
      <Header title="Projects List" />
      <div className="container">
        <div className="row">
          <div className="col">
            {projects && projects.length > 0 ? (
              <>
                <div className="row px-4 py-2">
                  <div className="col justify-content-center">
                    <div className="input-group" style={{ width: "300px" }}>
                      <input
                        className="form-control  border"
                        type="search"
                        placeholder="search"
                        onChange={(event) => setSerachText(event.target.value)}
                        id="example-search-input"
                        onKeyUp={(event) => setSerachText(event.target.value)}
                      />
                    </div>
                  </div>
                  {userInfo && userInfo.role === 2 ? (
                    <div className="col justify-content-end text-end">
                      <button
                        onClick={() => entryPopUpOpen(false)}
                        type="button"
                        className="btn btn-outline-primary"
                      >
                        <i className="bi bi-plus-circle me-2"></i>
                        <span className="ml-2">Add</span>
                      </button>
                    </div>
                  ) : null}
                </div>

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
                    {projects.map((item, index) => (
                      <tr key={index}>
                        <th scope="row">{start + index + 1}</th>
                        {Object.keys(tableData).map((field, index) => (
                          <td key={field}>
                            {field.includes("Date")
                              ? dateFormate(item[field])
                              : item[field]}
                          </td>
                        ))}
                        <td className="text-center">
                          {userInfo && userInfo.role === 2 ? (
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
                  {projectData.length > 10 && pages.length > 0 ? (
                    <tfoot>
                      <tr>
                        <td colSpan="14">
                          <nav aria-label="Page navigation example">
                            <ul className="pagination justify-content-end m-0">
                              <li className="page-item disabled">
                                <span className="page-link">Previous</span>
                              </li>
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
              </>
            ) : (
              <h5
                className="text-center mt-4 loadingbg  p-3"
                style={{ width: "max-content", margin: "auto" }}
              >
                Project data loading...
              </h5>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
