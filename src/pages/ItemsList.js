import React, { useCallback, useEffect, useState } from "react";
import Header from "./Header";
import { dateFormate } from "./util";

export default function ItemsList({
  entryPopUpOpen,
  editPopUpOpen,
  deletePopUpOpen,
  detailsPopUpOpen,
  token,
  itemStatus,
}) {
  const [items, setItems] = useState([]);
  const setItemsData = useCallback(() => {
    fetch("http://localhost:8080/api/assets", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("Items Info ", res);
        setItems([...res.assets]);
      });
  }, [token]);
  useEffect(() => {
    setItemsData();
    console.log("setItemsData itemStatus ", itemStatus);
  }, [setItemsData, itemStatus]);

  return (
    <>
      <Header title="Inventory List" />
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="row justify-content-between px-4 py-3">
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

            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Model</th>
                  <th scope="col">Brand</th>
                  <th scope="col">Purchase Date</th>
                  <th scope="col">Validity From</th>
                  <th scope="col">Validity To</th>
                  <th scope="col">Assign</th>
                  <th scope="col">Assign Date</th>
                  <th scope="col">Release Date</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{item.model}</td>
                    <td>{item.brand}</td>
                    <td>{dateFormate(item.purchaseDate)}</td>
                    <td>{dateFormate(item.validityFrom)}</td>
                    <td>{dateFormate(item.validityTo)}</td>
                    <td>{item.assign}</td>
                    <td>{dateFormate(item.assignDate)}</td>
                    <td>{dateFormate(item.releaseDate)}</td>
                    <td>
                      <button
                        onClick={() => deletePopUpOpen(false, item.id)}
                        type="button"
                        className="btn btn-outline-primary me-2"
                      >
                        <i className="bi bi-trash3"></i>
                      </button>
                      <button
                        onClick={() => editPopUpOpen(false, item)}
                        type="button"
                        className="btn btn-outline-primary me-2"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        onClick={() => detailsPopUpOpen(false, item)}
                        type="button"
                        className="btn btn-outline-primary"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="10">
                    <nav aria-label="Page navigation example">
                      <ul className="pagination justify-content-end">
                        <li className="page-item disabled">
                          <span className="page-link">Previous</span>
                        </li>
                        <li className="page-item">
                          <span className="page-link" href="#">
                            1
                          </span>
                        </li>
                        <li className="page-item">
                          <span className="page-link" href="#">
                            2
                          </span>
                        </li>
                        <li className="page-item">
                          <span className="page-link" href="#">
                            3
                          </span>
                        </li>
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
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
