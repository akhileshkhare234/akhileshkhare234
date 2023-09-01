import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserData } from "../../App";
import { APIUrl } from "../../auth/constants";
import Loader from "../../util/Loader";
import Header from "../inventory/Header";
import { dateFormate } from "../util.js";
import { useNavigate } from "react-router-dom";
const tableData = {
  name: "Project Name",
  manager: "Manager",
  teamSize: "Team Size",
  startDate: "Start Date",
  // completionDate: "Completion Date",
  clientContactName: "Client Name",
  // clientContactNumber: "Client Contact",
  projectDetail: "Project Detail",
};
export default function ProjectList({
  entryPopUpOpen,
  editPopUpOpen,
  deletePopUpOpen,
  detailsPopUpOpen,
  token,
  itemStatus,
}) {
  const userInfo = useContext(UserData);
  const [projects, setProject] = useState([]);
  const [projectData, setIProjects] = useState([]);
  const [pages, setPages] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [start, setStart] = useState(0);
  const [serachText, setSerachText] = useState("");
  const [searchStatus, setSerachStatus] = useState(false);
  const navigate = useNavigate();
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
            let project = res.filter((row, index) => index < pageSize);
            console.log("projects List ", project);
            setProject([...project]);
            setIProjects([...res]);
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
  }, [pageSize, token]);
  useEffect(() => {
    setProjectData();
    console.log("setProjectData");
  }, [setProjectData, itemStatus]);
  const searchProject = useCallback(() => {
    setSerachStatus(false);
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
      setSerachStatus(true);
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
      setSerachStatus(true);
    }
  }, [projectData, serachText]);
  useEffect(() => {
    const getData = setTimeout(() => {
      searchProject(serachText);
    }, 1000);
    console.log("searchProject");
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
            <div className="row px-4 py-2">
              <div className="col justify-content-center">
                <div className="input-group" style={{ width: "300px" }}>
                  <input
                    className="form-control  border"
                    type="search"
                    placeholder="Search project here..."
                    onChange={(event) => setSerachText(event.target.value)}
                    id="example-search-input"
                    onKeyUp={(event) => setSerachText(event.target.value)}
                  />
                </div>
              </div>
              {userInfo && userInfo?.role === 2 ? (
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
            {projects && projects.length > 0 ? (
              <>
                <table className="table tabletext2">
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
                              ? field === "completionDate" &&
                                dateFormate(item[field]).includes("01-JAN-1970")
                                ? "-"
                                : dateFormate(item[field])
                              : field === "teamSize"
                              ? item[field] === null
                                ? item["emails"].split(",").length
                                : item[field]
                              : item[field]}
                          </td>
                        ))}
                        <td className="text-center">
                          {userInfo && userInfo?.role === 2 ? (
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
                        <td colSpan="2">
                          {/* <select
                            style={{
                              width: "75px",
                              paddingLeft: "8px",
                              height: "35px",
                            }}
                            className="form-select rounded-3"
                            name="type"
                            onChange={(e) => {
                              setStart(0);
                              setPageSize(e.target.value);
                            }}
                          >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                          </select> */}
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
              </>
            ) : searchStatus && serachText?.length > 0 ? (
              <div className="row datanotfound">
                <div className="col-12 text-center">
                  <h4 className="datanotfound">
                    <i className="bi bi-search datanotfoundIcon"></i> Data not
                    found
                  </h4>
                </div>
              </div>
            ) : (
              <Loader msg="Project data loading" />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
