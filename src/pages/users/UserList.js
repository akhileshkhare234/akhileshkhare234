import React, { useCallback, useEffect, useState } from "react";
import { APIUrl } from "../../auth/constants";
import Loader from "../../util/Loader";
import Header from "../inventory/Header";
import { dateFormate } from "../util";
import ImagePreview from "./ImagePreview";

export default function UserList({
  userDetails,
  editPopUpOpen,
  itemStatus,
  token,
}) {
  const [userArray, setuserArray] = useState([]);
  const [userPageArray, setUserPageArray] = useState([]);
  const [pages, setPages] = useState([]);
  const [start, setStart] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [itemData, setItemdata] = useState(null);
  const [imagePreviewPopUp, setImagePreviewPopUp] = useState(true);
  const [serachText, setSerachText] = useState("");
  const [searchStatus, setSerachStatus] = useState(false);
  const showImage = (status, data) => {
    setImagePreviewPopUp(status);
    setItemdata(data);
  };
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
        let users = res.filter((row, index) => index < pageSize);
        setUserPageArray([...users]);
        setuserArray([...res]);
        let pages = [];
        for (let I = 1; I <= Math.ceil(res.length / pageSize); I++) {
          pages.push(I);
        }
        setPages(pages);
        console.log("Users : ", res);
      })
      .catch((err) => {
        setuserArray([]);
        console.log("User Not Get : ", err);
      });
  }, [pageSize]);
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
  const showNextUsers = (pos) => {
    let start = pos === 1 ? 0 : pos * pageSize - pageSize;
    let users = userArray.filter(
      (row, index) => index >= start && index < pos * pageSize
    );
    console.log("start, pos,users ", start, pos, users);
    setUserPageArray([...users]);
    setStart(start);
  };
  const searchInventory = useCallback(() => {
    setSerachStatus(false);
    if (serachText) {
      let inventory = userArray.filter(
        (row, index) =>
          Object.keys(row).filter((field) => {
            let text = row[field] + "";
            return text.toUpperCase().includes(serachText.toUpperCase());
          }).length > 0
      );
      console.log("serachText,inventory ", serachText, inventory);
      setUserPageArray([...inventory]);
      setSerachStatus(true);
      let pages = [];
      for (let I = 1; I <= Math.ceil(inventory.length / pageSize); I++) {
        pages.push(I);
      }
      setPages(pages);
    } else {
      let inventory = userArray.filter((row, index) => index < pageSize);
      let pages = [];
      for (let I = 1; I <= Math.ceil(userArray.length / pageSize); I++) {
        pages.push(I);
      }
      setPages(pages);
      setUserPageArray([...inventory]);
    }
  }, [userArray, pageSize, serachText]);
  useEffect(() => {
    const getData = setTimeout(() => {
      searchInventory(serachText);
    }, 1000);
    return () => clearTimeout(getData);
  }, [searchInventory, serachText]);
  return (
    <>
      <Header title="Users List" />
      <div className="container">
        <div className="row px-4 py-2">
          <div className="col justify-content-center">
            <div className="input-group" style={{ width: "300px" }}>
              <input
                className="form-control  border"
                type="search"
                placeholder="Search user here..."
                defaultValue={serachText}
                onChange={(event) => setSerachText(event.target.value)}
                id="example-search-input"
                onKeyUp={(event) => setSerachText(event.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col mt-3">
            {userPageArray && userPageArray.length > 0 ? (
              <table className="table tabletext userimage">
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
                    <th scope="col">Photo</th>
                    <th scope="col" className="text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userPageArray.map((user, index) => (
                    <tr key={index}>
                      <th scope="row">{start + index + 1}</th>
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
                      <td className="text-center">
                        {user.dob ? dateFormate(user.dob) : "-"}
                      </td>
                      <td className="text-center">
                        {user.doj ? dateFormate(user.doj) : "-"}
                      </td>
                      <td>
                        <img
                          onClick={() => showImage(false, user)}
                          className="profileimage3"
                          src={
                            user.data
                              ? "data:image/png;base64," + user.data
                              : user.gender === "Female"
                              ? process.env.PUBLIC_URL + "/images/female.png"
                              : process.env.PUBLIC_URL + "/images/male.png"
                          }
                          alt=""
                        />
                      </td>
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
                      <td colSpan="2">
                        <select
                          style={{
                            width: "50px",
                            paddingLeft: "8px",
                            height: "35px",
                          }}
                          className="rounded-3"
                          name="type"
                          onChange={(e) => {
                            setStart(0);
                            setPageSize(e.target.value);
                          }}
                        >
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                        </select>
                      </td>
                      <td colSpan="9">
                        <nav aria-label="Page navigation example">
                          <ul className="pagination justify-content-end m-0">
                            {pages.map((page, index) => (
                              <li
                                className="page-item"
                                key={index}
                                onClick={() => showNextUsers(page)}
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
              <Loader msg="User data loading" />
            )}
          </div>
        </div>
      </div>
      <ImagePreview
        imageData={itemData}
        imagePreviewPopUp={imagePreviewPopUp}
        imagePreviewPopUpClose={(status) => setImagePreviewPopUp(status)}
      ></ImagePreview>
    </>
  );
}
