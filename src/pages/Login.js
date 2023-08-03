import React, { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GOOGLE_AUTH_URL } from "../auth/constants";

export default function Login() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const checkUser = useCallback(() => {
    console.log("user checking...");
    let tokenValue = window.localStorage.getItem("am_token");
    if (tokenValue && tokenValue !== "undefined") {
      console.log("Login Page:User already login!", tokenValue);
      navigate("/dashboard/userprofile");
    } else {
      const token = new URLSearchParams(search).get("token");
      if (token) {
        console.log("Login Page:User logedin !token value : ", search, token);
        window.localStorage.setItem("am_token", token);
        navigate("/dashboard/userprofile");
      } else {
        console.log("Login Page:User not logedin ! ", token);
      }
    }

    // if (tokenValue) {
    //   console.log("Login Page:User Already login!", tokenValue);
    //   navigate("/dashboard/userprofile");
    // } else
  }, [search, navigate]);
  useEffect(() => {
    checkUser();
  }, [checkUser]);
  return (
    <div
      className="container-fulid"
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${process.env.PUBLIC_URL + "/images/back1.jpg"})`,
        backgroundSize: "cover",
      }}
    >
      <img
        src={process.env.PUBLIC_URL + "/images/logo-1.png"}
        className="logo"
        alt="Lirisoft"
      />
      <div className="projectTitle">
        <h3>Lirisoft Inventory Management</h3>
      </div>
      <div className="loginpage">
        <h4>User Login</h4>

        <div className="text-center mt-5">
          <img
            src={process.env.PUBLIC_URL + "/images/back2.png"}
            className="back2"
            alt="Lirisoft"
          />
          {/* <span
            onClick={() => {
              window.localStorage.setItem(
                "am_token",
                "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzIiwiaWF0IjoxNjg5ODMwNDUwLCJleHAiOjE2OTA2OTQ0NTB9.Wy6kTdW6hFw3CQO_yk2Tgi570HNG4TI26hQLi4mNZ8-lULYeYu4DCXJCi8bFy3pu0lAVunyt8yZkjBisfz3-DA"
              );
            }}
            style={{ marginRight: 8, fontWeight: "bold" }}
          >
            Login
          </span> */}
          <a
            className="btn btn-sm btn-primary mt-5 logo2"
            style={{
              backgroundImage: `url(${
                process.env.PUBLIC_URL + "/images/logo-1.png"
              })`,
            }}
            href={GOOGLE_AUTH_URL}
          >
            <span style={{ marginRight: 8, fontWeight: "bold" }}>Login</span>
          </a>
          <h6 className="mt-3">Note : Accept only Lirisoft Email id!</h6>
        </div>
      </div>
    </div>
  );
}
