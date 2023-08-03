import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserData } from "../../App";
import { APIUrl } from "../../auth/constants";
import Loader from "../../util/Loader";
import Header from "../inventory/Header";
import { dateFormate } from "../util.js";
const tableData = {
  taskDetail: "Task Details",
  assignedTo: "Assign To",
  startDate: "Start Date",
  dueDate: "Due Date",
  status: "Status",
};
export default function TaskList({
  entryPopUpOpen,
  editPopUpOpen,
  deletePopUpOpen,
  detailsPopUpOpen,
  token,
  itemStatus,
}) {
  const userInfo = useContext(UserData);
  const [Tasks, setTask] = useState([]);
  const [TaskData, setITasks] = useState([]);
  const [pages, setPages] = useState([]);
  const [start, setStart] = useState(0);
  const [serachText, setSerachText] = useState("");
  const [searchStatus, setSerachStatus] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const setTaskData = useCallback(() => {
    setStart(0);
    setLoadingStatus(true);
    fetch(APIUrl + "api/task/getAll", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res?.length > 0) {
          let Task = res.filter((row, index) => index < 10);
          console.log("Tasks List ", Task);
          setTask([...Task]);
          setITasks([...res]);
          let pageSize = 10;
          let pages = [];
          for (let I = 1; I <= Math.ceil(res.length / pageSize); I++) {
            pages.push(I);
          }
          setPages(pages);
          setLoadingStatus(false);
        } else {
          setTask([]);
          setITasks([]);
          setPages([]);
          console.log("Tasks not found");
          setLoadingStatus(false);
        }
      });
  }, [token]);
  useEffect(() => {
    setTaskData();
  }, [setTaskData, itemStatus]);
  const searchTask = useCallback(() => {
    setSerachStatus(false);
    if (serachText) {
      let Task = TaskData.filter(
        (row, index) =>
          Object.keys(row).filter((field) => {
            let text = row[field] + "";
            return text.toUpperCase().includes(serachText.toUpperCase());
          }).length > 0
      );
      console.log("serachText,Task ", serachText, Task);
      setTask([...Task]);
      setSerachStatus(true);
      let pageSize = 10;
      let pages = [];
      for (let I = 1; I <= Math.ceil(Task.length / pageSize); I++) {
        pages.push(I);
      }
      setPages(pages);
    } else {
      let Task = TaskData.filter((row, index) => index < 10);
      let pageSize = 10;
      let pages = [];
      for (let I = 1; I <= Math.ceil(TaskData.length / pageSize); I++) {
        pages.push(I);
      }
      setPages(pages);
      setTask([...Task]);
      setSerachStatus(true);
    }
  }, [TaskData, serachText]);
  useEffect(() => {
    const getData = setTimeout(() => {
      searchTask(serachText);
    }, 1000);
    return () => clearTimeout(getData);
  }, [searchTask, serachText]);
  const showNextInventory = (pos) => {
    let start = pos === 1 ? 0 : pos * 10 - 10;
    let inventory = TaskData.filter(
      (row, index) => index >= start && index < pos * 10
    );
    console.log("start, pos,inventory ", start, pos, inventory);
    setTask([...inventory]);
    setStart(start);
  };
  return (
    <>
      <Header title="Tasks List" />
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="row px-4 py-2">
              <div className="col justify-content-center">
                <div className="input-group" style={{ width: "300px" }}>
                  <input
                    className="form-control  border"
                    type="search"
                    placeholder="Search Task here..."
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
            {Tasks && Tasks.length > 0 ? (
              <>
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
                    {Tasks.map((item, index) => (
                      <tr key={index}>
                        <th scope="row">{start + index + 1}</th>
                        {Object.keys(tableData).map((field, index) => (
                          <td key={field}>
                            {field.includes("Date")
                              ? dateFormate(item[field])
                              : field === "teamSize"
                              ? item[field] === null
                                ? item["emails"].split(",").length
                                : item[field]
                              : item[field]}
                          </td>
                        ))}
                        <td className="text-center">
                          {userInfo && userInfo.role === 2 ? (
                            <>
                              <button
                                onClick={() =>
                                  deletePopUpOpen(false, item.taskId)
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
                  {TaskData.length > 10 && pages.length > 0 ? (
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
            ) : !loadingStatus && searchStatus && serachText?.length > 0 ? (
              <div className="row datanotfound">
                <div className="col-12 text-center">
                  <h4 className="datanotfound">
                    <i className="bi bi-search datanotfoundIcon"></i> Data not
                    found
                  </h4>
                </div>
              </div>
            ) : (
              <Loader msg="Task data loading" />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
