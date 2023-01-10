import React from "react";
import { Link, Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

export default function DashboardLayout() {
  return (
    <div className="container-fulid">
      <div className="row pagesize pageMargin">
        <div className="col-2 rowSpace">
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
                <span>Items List</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="users">
                <i className="bi bi-person-lines-fill"></i>
                <span>Users</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="userroles">
                <i className="bi bi-person-fill-check"></i>
                <span>User Roles</span>
              </Link>
            </li>
            <li className="nav-item buttons">
              <button>
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
        <div className="col-10 rowSpace">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}
