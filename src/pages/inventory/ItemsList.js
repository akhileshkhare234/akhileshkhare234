import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserData } from "../../App";
import { APIUrl } from "../../auth/constants";
import Header from "./Header";
import { dateFormate } from "../util.js";
import Loader from "../../util/Loader";
import { useNavigate } from "react-router-dom";

export default function ItemsList({
  entryPopUpOpen,
  editPopUpOpen,
  deletePopUpOpen,
  detailsPopUpOpen,
  historyPopUpOpen,
  token,
  itemStatus,
}) {
  const userInfo = useContext(UserData);
  const [items, setItems] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [serachText, setSerachText] = useState("");
  const [start, setStart] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pages, setPages] = useState([]);
  const [searchStatus, setSerachStatus] = useState(false);
  const navigate = useNavigate();
  const setItemsData = useCallback(() => {
    setStart(0);
    token &&
      fetch(APIUrl + "api/assets", {
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
          if (res.assets?.length > 0) {
            let inventory = res.assets.filter((row, index) => index < pageSize);
            // console.log("inventory Info ", inventory);
            setItems([...inventory]);
            setInventories([...res.assets]);
            let pages = [];
            for (let I = 1; I <= Math.ceil(res.assets.length / pageSize); I++) {
              pages.push(I);
            }
            setPages(pages);
          } else {
            setItems([]);
            setInventories([]);
            setPages([]);
          }
        });
  }, [pageSize, token]);
  useEffect(() => {
    setItemsData();
  }, [setItemsData, itemStatus]);
  const searchInventory = useCallback(() => {
    setSerachStatus(false);
    if (serachText) {
      let inventory = inventories.filter(
        (row, index) =>
          Object.keys(row).filter((field) => {
            let text = row[field] + "";
            return text.toUpperCase().includes(serachText.toUpperCase());
          }).length > 0
      );
      console.log("serachText,inventory ", serachText, inventory);
      setItems([...inventory]);
      setSerachStatus(true);
      let pages = [];
      for (let I = 1; I <= Math.ceil(inventory.length / pageSize); I++) {
        pages.push(I);
      }
      setPages(pages);
    } else {
      let inventory = inventories.filter((row, index) => index < pageSize);
      let pages = [];
      for (let I = 1; I <= Math.ceil(inventories.length / pageSize); I++) {
        pages.push(I);
      }
      setPages(pages);
      setItems([...inventory]);
    }
  }, [inventories, pageSize, serachText]);
  useEffect(() => {
    const getData = setTimeout(() => {
      searchInventory(serachText);
    }, 1000);
    return () => clearTimeout(getData);
  }, [searchInventory, serachText]);
  const showNextInventory = (pos) => {
    let start = pos === 1 ? 0 : pos * pageSize - pageSize;
    let inventory = inventories.filter(
      (row, index) => index >= start && index < pos * pageSize
    );
    console.log("start, pos,inventory ", start, pos, inventory);
    setItems([...inventory]);
    setStart(start);
  };
  return (
    <>
      <Header title="Inventory List" />
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="row px-4 py-2">
              <div className="col justify-content-center">
                <div className="input-group" style={{ width: "300px" }}>
                  <input
                    className="form-control  border"
                    type="search"
                    placeholder="Search inventory here..."
                    defaultValue={serachText}
                    autoComplete="off"
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
            {items && items.length > 0 ? (
              <>
                <table className="table tabletext2">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Inventory</th>
                      <th scope="col">Assign To</th>
                      <th scope="col">Assign Date</th>
                      <th scope="col">Location</th>
                      <th scope="col">Type</th>
                      <th scope="col">Brand</th>
                      <th scope="col">Model</th>
                      {/* <th scope="col">Purchase Date</th> */}
                      {/* <th scope="col">Identity Type</th> */}
                      <th scope="col" style={{ width: "220px" }}>
                        Identity Value
                      </th>
                      {/* <th scope="col">Validity From</th>
                  <th scope="col">Validity To</th> */}
                      <th scope="col" className="text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index}>
                        <th scope="row">{start + index + 1}</th>
                        <td>{item.type}</td>
                        <td>{item.assign}</td>
                        <td>{dateFormate(item.assignDate)}</td>
                        <td>{item.location}</td>
                        <td>{item.type}</td>
                        <td>{item.brand}</td>
                        <td>{item.model}</td>
                        {/* <td>{dateFormate(item.purchaseDate)}</td> */}
                        {/* <td>{item.identityType}</td> */}
                        <td>{item.identity}</td>
                        {/* <td>{dateFormate(item.validityFrom)}</td>
                    <td>{dateFormate(item.validityTo)}</td> */}
                        <td className="text-center">
                          {userInfo && userInfo?.role === 2 ? (
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
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            onClick={() => historyPopUpOpen(false, item.id)}
                            type="button"
                            className="btn btn-outline-primary"
                          >
                            <i className="bi bi-clock-history"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {inventories.length > pageSize && pages.length > 0 ? (
                    <tfoot>
                      <tr>
                        <td colSpan="2">
                          <select
                            style={{
                              width: "75px",
                              paddingLeft: "8px",
                              height: "35px",
                            }}
                            className="form-select rounded-3"
                            name="type"
                            onChange={(e) => setPageSize(e.target.value)}
                          >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                          </select>
                        </td>
                        <td colSpan="12">
                          <nav aria-label="Page navigation example">
                            <ul className="pagination justify-content-end m-0">
                              {/* <li className="page-item disabled">
                            <span className="page-link">Previous</span>
                          </li> */}
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
              <Loader msg="Inventory loading" />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
