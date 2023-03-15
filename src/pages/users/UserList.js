import React, { useCallback, useEffect, useState } from "react";
import { APIUrl } from "../../auth/constants";
import Header from "../inventory/Header";
import { dateFormate } from "../util";

export default function UserList({
  userDetails,
  editPopUpOpen,
  itemStatus,
  token,
}) {
  const [userArray, setuserArray] = useState([]);
  const getUsers = useCallback(() => {
    let tokenValue = window.localStorage.getItem("am_token");
    fetch(APIUrl + "api/users", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokenValue,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setuserArray([...res.users]);
        console.log("Users : ", res);
      })
      .catch((err) => {
        setuserArray([]);
        console.log("User Not Get : ", err);
      });
  }, []);
  const updateUserRole = (user) => {
    let itemData = {
      id: parseInt(user.id),
      role: user.role === 1 ? 2 : 1,
    };
    fetch(APIUrl + "api/user", {
      method: "PUT",
      body: JSON.stringify(itemData),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }).then((res) => {
      console.log("Edit user : ", res);
      getUsers();
    });
  };
  useEffect(() => {
    getUsers();
  }, [getUsers, itemStatus]);
  return (
    <>
      <Header title="Users List" />
      <div className="container">
        <div className="row">
          <div className="col mt-3">
            {userArray && userArray.length > 0 ? (
              <table className="table tabletext">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Designation</th>
                    <th scope="col">Mobile No.</th>
                    <th scope="col" className="text-center">
                      Role
                    </th>
                    <th scope="col">City</th>
                    <th scope="col" className="text-center">
                      DOB
                    </th>
                    <th scope="col" className="text-center">
                      DOJ
                    </th>
                    <th scope="col">Gender</th>
                    <th scope="col" className="text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userArray.map((user, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{user.displayName}</td>
                      <td>{user.email}</td>
                      <td>{user.designation}</td>

                      <td>{user.mobileNumber}</td>
                      <td className="text-center">
                        <span
                          onClick={() => updateUserRole(user)}
                          title="Click for user change Role!"
                          style={{ cursor: "pointer", fontSize: 15 }}
                          className={
                            "px-2 btn  py-0 rounded-1 textColor " +
                            (user.role === 1 ? "bg-primary" : "bg-danger")
                          }
                        >
                          {user.role === 1 ? "User" : "Admin"}
                        </span>
                      </td>
                      <td>{user.city}</td>
                      <td className="text-center">{dateFormate(user.dob)}</td>
                      <td className="text-center">{dateFormate(user.doj)}</td>
                      <td>{user.gender}</td>
                      <td className="text-center">
                        <button
                          onClick={() => editPopUpOpen(false, user)}
                          type="button"
                          className="btn btn-outline-primary me-1"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          onClick={() => userDetails(false, user)}
                          type="button"
                          className="btn btn-outline-primary"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {userArray.length > 10 ? (
                  <tfoot>
                    <tr>
                      <td colSpan="14">
                        <nav aria-label="Page navigation example">
                          <ul className="pagination justify-content-end m-0">
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
                ) : (
                  ""
                )}
              </table>
            ) : (
              <h5
                className="text-center mt-4 bg-warning text-danger p-3"
                style={{ width: "max-content", margin: "auto" }}
              >
                User data not found or not allowed to be displayed!
              </h5>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
