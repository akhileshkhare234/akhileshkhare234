import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserData } from "../../App";
import { APIUrl } from "../../auth/constants";
import Loader from "../../util/Loader";
import Header from "../inventory/Header";
import { dateFormate } from "../util.js";
const tableData = {
  type: "Reimbursement type",
  submitAmount: "Amount",
  approveAmount: "Approve Amount",
  differenceAmount: "Difference Amount",
  username: "Submit By",
  spentDate: "Spent Date",
  submitDate: "Submit Date",
  status: "Status",
  document: "Bill/Document",
  description: "Description",
};
const buttonStyle = {
  INITIATED: "statusBtn_I",
  APPROVED: "statusBtn_A",
  REJECTED: "statusBtn_R",
  PENDING: "statusBtn_P",
};
export default function ReimbursementList({
  entryPopUpOpen,
  editPopUpOpen,
  deletePopUpOpen,
  detailsPopUpOpen,
  token,
  itemStatus,
}) {
  const userInfo = useContext(UserData);
  const [Reimbursements, setReimbursement] = useState([]);
  const [ReimbursementData, setIReimbursements] = useState([]);
  const [pages, setPages] = useState([]);
  const [start, setStart] = useState(0);
  const [serachText, setSerachText] = useState("");
  const [searchStatus, setSerachStatus] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const setReimbursementData = useCallback(() => {
    setStart(0);
    setLoadingStatus(true);
    fetch(APIUrl + "api/reimbursement", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res?.length > 0) {
          let Reimbursement = res.filter((row, index) => index < 10);
          console.log("Reimbursements List ", Reimbursement);
          setReimbursement([...Reimbursement]);
          setIReimbursements([...res]);
          let pageSize = 10;
          let pages = [];
          for (let I = 1; I <= Math.ceil(res.length / pageSize); I++) {
            pages.push(I);
          }
          setPages(pages);
        } else {
          setReimbursement([]);
          setIReimbursements([]);
          setPages([]);
        }
        setLoadingStatus(false);
      })
      .catch((err) => {
        setReimbursement([]);
        setIReimbursements([]);
        setPages([]);
        setLoadingStatus(false);
      });
  }, [token]);
  useEffect(() => {
    setReimbursementData();
  }, [setReimbursementData, itemStatus]);
  const searchReimbursement = useCallback(() => {
    setSerachStatus(false);
    if (serachText) {
      let Reimbursement = ReimbursementData.filter(
        (row, index) =>
          Object.keys(row).filter((field) => {
            let text = row[field] + "";
            return text.toUpperCase().includes(serachText.toUpperCase());
          }).length > 0
      );
      console.log("serachText,Reimbursement ", serachText, Reimbursement);
      setReimbursement([...Reimbursement]);
      setSerachStatus(true);
      let pageSize = 10;
      let pages = [];
      for (let I = 1; I <= Math.ceil(Reimbursement.length / pageSize); I++) {
        pages.push(I);
      }
      setPages(pages);
    } else {
      let Reimbursement = ReimbursementData.filter((row, index) => index < 10);
      let pageSize = 10;
      let pages = [];
      for (
        let I = 1;
        I <= Math.ceil(ReimbursementData.length / pageSize);
        I++
      ) {
        pages.push(I);
      }
      setPages(pages);
      setReimbursement([...Reimbursement]);
      setSerachStatus(true);
    }
  }, [ReimbursementData, serachText]);
  useEffect(() => {
    const getData = setTimeout(() => {
      searchReimbursement(serachText);
    }, 1000);
    return () => clearTimeout(getData);
  }, [searchReimbursement, serachText]);
  const showNextInventory = (pos) => {
    let start = pos === 1 ? 0 : pos * 10 - 10;
    let inventory = ReimbursementData.filter(
      (row, index) => index >= start && index < pos * 10
    );
    console.log("start, pos,inventory ", start, pos, inventory);
    setReimbursement([...inventory]);
    setStart(start);
  };
  const documentLink = (items) => {
    console.log("documentLink ", items);
    return URL.createObjectURL(items?.data);
  };
  return (
    <>
      <Header title="Reimbursements List" />
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="row px-4 py-2">
              <div className="col justify-content-center">
                <div className="input-group" style={{ width: "300px" }}>
                  <input
                    className="form-control  border"
                    type="search"
                    placeholder="Search Reimbursement here..."
                    onChange={(event) => setSerachText(event.target.value)}
                    id="example-search-input"
                    onKeyUp={(event) => setSerachText(event.target.value)}
                  />
                </div>
              </div>
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
            </div>
            {Reimbursements && Reimbursements.length > 0 ? (
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
                      {userInfo && userInfo.role === 2 ? (
                        <th scope="col" className="text-center">
                          Action
                        </th>
                      ) : (
                        ""
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {Reimbursements.map((item, index) => (
                      <tr key={index}>
                        <th scope="row">{start + index + 1}</th>
                        {Object.keys(tableData).map((field, index) => (
                          <td key={field}>
                            <span
                              className={
                                field === "status"
                                  ? buttonStyle[item.status]
                                  : ""
                              }
                            >
                              {field.includes("Date") ? (
                                dateFormate(item[field])
                              ) : field.includes("Amonut") ? (
                                item[field] === null ? (
                                  "0"
                                ) : (
                                  <>
                                    <span style={{ fontSize: "15px" }}>
                                      &#8360;
                                    </span>
                                    {". "}
                                    {item[field]}
                                  </>
                                )
                              ) : field.includes("document") ? (
                                <a
                                  download
                                  href={
                                    "data:" +
                                    item["dataType"] +
                                    ";base64," +
                                    item["data"]
                                  }
                                >
                                  Download Doc
                                </a>
                              ) : (
                                item[field]
                              )}
                            </span>
                          </td>
                        ))}

                        <td className="text-center">
                          {userInfo && userInfo.role === 2 ? (
                            <>
                              <button
                                onClick={() => deletePopUpOpen(false, item.id)}
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
                            <i className="bi bi-clock-history"></i>
                          </button>
                        </td>

                        <td className="text-center"></td>
                      </tr>
                    ))}
                  </tbody>
                  {ReimbursementData.length > 10 && pages.length > 0 ? (
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
            ) : searchStatus && serachText?.length > 0 ? (
              <div className="row datanotfound">
                <div className="col-12 text-center">
                  <h4 className="datanotfound">
                    <i className="bi bi-search datanotfoundIcon"></i> Data not
                    found
                  </h4>
                </div>
              </div>
            ) : loadingStatus ? (
              <Loader msg="Reimbursement data loading" />
            ) : (
              <>
                <h5 className="text-center mt-4">
                  Reimbursement data not found.
                </h5>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
