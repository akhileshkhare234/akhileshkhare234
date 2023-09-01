import React, { useCallback, useEffect, useState } from "react";
import { APIUrl } from "../../auth/constants";
import Loader from "../../util/Loader";
import Header from "../inventory/Header";
import ImagePreview from "./ImagePreview";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css"; // You can choose different loading effects
import { useNavigate } from "react-router-dom";

export default function UserList({
  userDetails,
  editPopUpOpen,
  itemStatus,
  projectDetails,
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
  const [activeStatus, setActiveStatus] = useState(true);
  const [sortStatus, setSortStatus] = useState(false);
  const showImage = (status, data) => {
    setImagePreviewPopUp(status);
    setItemdata(data);
  };
  const navigate = useNavigate();
  const getUsers = useCallback(() => {
    // let tokenValue = window.localStorage.getItem("am_token");
    token &&
      fetch(APIUrl + "api/users", {
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
          let users = res.filter((row, index) => index < pageSize);
          setUserPageArray([...users]);
          setuserArray([...res]);
          let pages = [];
          for (let I = 1; I <= Math.ceil(res.length / pageSize); I++) {
            pages.push(I);
          }
          setPages(pages);
          // console.log("Users : ", res);
        })
        .catch((err) => {
          setuserArray([]);
          console.log("User Not Get : ", err);
        });
  }, [navigate, pageSize, token]);
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
  const searchUsers = useCallback(() => {
    setSerachStatus(false);
    if (serachText) {
      let userData = userArray.filter(
        (row, index) =>
          Object.keys(row).filter((field) => {
            let text = row[field] + "";
            if (Array.isArray(row[field])) {
              return (
                row[field].filter((row) =>
                  row.name.toUpperCase().includes(serachText.toUpperCase())
                ).length > 0
              );
            } else return text.toUpperCase().includes(serachText.toUpperCase());
          }).length > 0
      );
      console.log("serachText,userData ", serachText, userData);
      setUserPageArray([...userData]);
      setSerachStatus(true);
      let pages = [];
      for (let I = 1; I <= Math.ceil(userData.length / pageSize); I++) {
        pages.push(I);
      }
      setPages(pages);
    } else {
      let userData = userArray.filter((row, index) => index < pageSize);
      let pages = [];
      for (let I = 1; I <= Math.ceil(userArray.length / pageSize); I++) {
        pages.push(I);
      }
      setPages(pages);
      setUserPageArray([...userData]);
    }
  }, [userArray, pageSize, serachText]);
  useEffect(() => {
    const getData = setTimeout(() => {
      searchUsers(serachText);
    }, 1000);
    return () => clearTimeout(getData);
  }, [searchUsers, serachText]);
  const sortBy = (field) => {
    let newArray = sortStatus
      ? userArray.sort((p, n) =>
          p[field].toUpperCase() < n[field].toUpperCase()
            ? 1
            : p[field].toUpperCase() === n[field].toUpperCase()
            ? 0
            : -1
        )
      : userArray.sort((p, n) =>
          p[field].toUpperCase() < n[field].toUpperCase()
            ? -1
            : p[field].toUpperCase() === n[field].toUpperCase()
            ? 0
            : 1
        );
    console.log(newArray, sortStatus);
    setSortStatus(!sortStatus);
    let users = newArray.filter((row, index) => index < pageSize);
    setUserPageArray([...users]);
    setuserArray([...newArray]);
  };
  const getActiveUsers = (userType) => {
    let userData = userArray.filter((row) => row.userStatus === userType);

    setActiveStatus(userData.length !== 0);

    setUserPageArray([...userData]);
    setSerachStatus(false);
    let pages = [];
    for (let I = 1; I <= Math.ceil(userData.length / pageSize); I++) {
      pages.push(I);
    }
    setPages(pages);
  };
  return (
    <>
      <Header title="Engineers List" />
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
          <div className="col">
            <select
              className="form-select rounded-3"
              style={{ width: "200px", float: "right" }}
              onChange={(e) => getActiveUsers(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col mt-3">
            {userPageArray && userPageArray.length > 0 ? (
              <table className="table tabletext userimage">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col" onClick={() => sortBy("displayName")}>
                      Name
                    </th>
                    <th scope="col" className="text-center">
                      Projects
                    </th>
                    <th scope="col">Email</th>
                    <th scope="col">Mobile No.</th>

                    {/* <th scope="col">City</th> */}

                    <th scope="col">Photo</th>
                    <th scope="col" className="text-center">
                      Role
                    </th>
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
                      <td className="text-center">
                        <div
                          onClick={() => projectDetails(false, user)}
                          className="prj-count"
                          style={{
                            backgroundColor:
                              user.projects?.length === 0
                                ? "#ff8d8d"
                                : "#51c6f6",
                          }}
                          title={
                            user.projects?.length > 0
                              ? user.projects
                                  ?.map(
                                    (prj, index) =>
                                      index + 1 + ". " + prj.name + "\n"
                                  )
                                  .join(" ")
                              : "No projects assigned yet."
                          }
                        >
                          {user.projects?.length}
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.mobileNumber}</td>
                      {/* <td>{user.city}</td> */}
                      <td>
                        <LazyLoadImage
                          alt={user.displayName}
                          onClick={() => showImage(false, user)}
                          className="profileimage3"
                          effect="blur" // You can use different loading effects like 'opacity', 'black-and-white', etc.
                          src={
                            user.imageUrl
                              ? user.imageUrl
                              : user.gender === "Female"
                              ? process.env.PUBLIC_URL + "/images/female.png"
                              : process.env.PUBLIC_URL + "/images/male.png"
                          }
                        />

                        {/* <img
                          onClick={() => showImage(false, user)}
                          className="profileimage3"
                          src={
                            user.imageUrl
                              ? user.imageUrl
                              : user.gender === "Female"
                              ? process.env.PUBLIC_URL + "/images/female.png"
                              : process.env.PUBLIC_URL + "/images/male.png"
                          }
                          alt=""
                        /> */}
                      </td>
                      <td className="text-center">
                        <span
                          onClick={() => updateUserRole(user)}
                          title="Click for user change Role!"
                          style={{ cursor: "pointer", fontSize: 15 }}
                          className={
                            "btn  py-0 rounded-1 textColor " +
                            (user.role === 1
                              ? "px-3 bg-primary"
                              : "px-2 bg-danger")
                          }
                        >
                          {user.role === 1 ? "User" : "Admin"}
                        </span>
                      </td>
                      {/* <td className="text-center">
                        <button
                          onClick={() => editPopUpOpen(false, user)}
                          type="button"
                          className="btn btn-outline-primary me-1"
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                        <button
                          onClick={() => userDetails(false, user)}
                          type="button"
                          className="btn btn-outline-primary"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                      </td> */}
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
                    <i className="bi bi-search datanotfoundIcon"></i>Employee
                    data not found
                  </h4>
                </div>
              </div>
            ) : activeStatus === false ? (
              <div className="row datanotfound">
                <div className="col-12 text-center">
                  <h4 className="datanotfound">
                    <i className="bi bi-search datanotfoundIcon"></i>Inactive
                    employee data not found
                  </h4>
                </div>
              </div>
            ) : (
              <Loader msg="Engineers data loading" />
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
