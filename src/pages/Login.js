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
      navigate("/dashboard");
    } else {
      const token = new URLSearchParams(search).get("token");
      console.log("token value : ", search, token);
      if (token) window.localStorage.setItem("am_token", token);
    }
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
