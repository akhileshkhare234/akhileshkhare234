import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { UserData } from "../../App";
import Footer from "./Footer";

export default function DashboardLayout() {
  const userInfo = useContext(UserData);
  const navigate = useNavigate();
  const [logoutPopUp, setLogoutPopUp] = useState(true);
  const userLogout = () => {
    window.localStorage.removeItem("am_token");
    navigate("/");
  };
  const checkUser = useCallback(() => {
    let tokenValue = window.localStorage.getItem("am_token");
    if (tokenValue === null || tokenValue === "undefined") {
      navigate("/");
    }
  }, [navigate]);
  useEffect(() => {
    console.log("userInfo Context ", userInfo);
    checkUser();
  }, [checkUser, userInfo]);
  return (
    <div className="container-fulid">
      <div className="row pagesize pageMargin">
        <div className="col-2 rowSpace bgColor">
          <ul
            className="navbar-nav navbar-nav-side bgColor"
            id="accordionSidebar"
          >
            <img
              src={process.env.PUBLIC_URL + "/images/logo-1.png"}
              className="logo3"
              alt="Lirisoft"
            />
            <div className="navbarbrand2">
              <span>Inventory Management</span>
            </div>
            <li className="nav-item">
              <Link to="items">
                <i className="bi bi-list-ul"></i>
                <span>Inventory</span>
              </Link>
            </li>
            {userInfo && userInfo.role === 2 ? (
              <>
                <li className="nav-item">
                  <Link to="users">
                    <i className="bi bi-person-lines-fill"></i>
                    <span>Engineers</span>
                  </Link>
                </li>
              </>
            ) : null}
            {userInfo && userInfo.role === 2 ? (
              <>
                <li className="nav-item">
                  <Link to="project">
                    <i className="bi bi-person-lines-fill"></i>
                    <span>Project</span>
                  </Link>
                </li>
              </>
            ) : null}
            <li className="nav-item">
              <Link to="tasks">
                <i className="bi bi-person-vcard"></i>
                <span>Tasks</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="userprofile">
                <i className="bi bi-person-vcard"></i>
                <span>My Profile</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="holidays">
                <i className="bi bi-person-vcard"></i>
                <span>Holidays</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="reimbursement">
                <i className="bi bi-person-vcard"></i>
                <span>Reimbursement</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="leaves">
                <i className="bi bi-person-vcard"></i>
                <span>Leaves</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="timesheet">
                <i className="bi bi-person-vcard"></i>
                <span>Fill TimeSheet</span>
              </Link>
            </li>
            {userInfo && userInfo.role === 2 ? (
              <>
                <li className="nav-item">
                  <Link to="timesheets">
                    <i className="bi bi-person-vcard"></i>
                    <span>View TimeSheets</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="uploadcsv">
                    <i className="bi bi-person-lines-fill"></i>
                    <span>Upload CSV</span>
                  </Link>
                </li>
              </>
            ) : null}

            <li className="nav-item buttons">
              <button onClick={() => setLogoutPopUp(false)}>
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
        <div className="col-10" style={{ backgroundColor: "#fff", padding: 0 }}>
          <Outlet />
        </div>
      </div>
      <Footer />
      <div
        className={
          "modal modal-signin position-static d-block bg-secondary py-5 " +
          (logoutPopUp ? "closePopUp" : "displayPopUp")
        }
        role="dialog"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Logout
              </h1>
              <button
                onClick={() => setLogoutPopUp(true)}
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <h1 className="modal-title fs-6">
                <i className="bi bi-box-arrow-right iconBg"></i> Are you sure
                you want to logout ?
              </h1>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={userLogout}
                className="btn btn-primary btn-sm px-2"
              >
                YES
              </button>
              <button
                onClick={() => setLogoutPopUp(true)}
                type="button"
                className="btn btn-primary btn-sm px-2"
              >
                NO
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
