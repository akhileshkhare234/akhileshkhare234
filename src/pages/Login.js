import React, { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GOOGLE_AUTH_URL } from "../auth/constants";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css"; // You can choose different loading effects
export default function Login() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const checkUser = useCallback(() => {
    console.log("user checking...");
    let tokenValue = window.localStorage.getItem("am_token");
    if (tokenValue && tokenValue !== "undefined") {
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
    <div className="container-fulid">
      <div
        className="row login-container"
        style={{ margin: "0", height: "100vh" }}
      >
        <div
          className="col-sm-6"

          // style={{
          //   height: "100vh",
          //   display: "flex",
          //   justifyContent: "center",
          //   alignItems: "center",
          //   backgroundImage: `url(${
          //     process.env.PUBLIC_URL + "/images/Assetmanagement2.png"
          //   })`,
          //   backgroundSize: "cover",
          // }}
        >
          <img
            src={process.env.PUBLIC_URL + "/images/logo-1.png"}
            className="logo"
            alt="Lirisoft"
          />
          <LazyLoadImage
            alt="LiriSoft"
            className="profileimage4"
            effect="blur" // You can use different loading effects like 'opacity', 'black-and-white', etc.
            src={process.env.PUBLIC_URL + "/images/Assetmanagement2.png"}
          />
        </div>
        <div className="col-sm-6 login-pagecontainer">
          {" "}
          <div className="loginpage">
            <h4>User Login</h4>

            <div className="text-center mt-0">
              <LazyLoadImage
                alt="LiriSoft"
                className="back2"
                effect="blur" // You can use different loading effects like 'opacity', 'black-and-white', etc.
                src={process.env.PUBLIC_URL + "/images/back2.png"}
              />

              <a
                className="btn btn-sm btn-primary mt-2 logo2"
                href={GOOGLE_AUTH_URL}
              >
                <span
                  style={{
                    marginRight: 0,
                    fontWeight: "bold",
                    lineHeight: "30px",
                  }}
                >
                  Login
                </span>
              </a>
              <h6 className="mt-3">Note : Accept only Lirisoft Email id!</h6>
            </div>
          </div>
        </div>
      </div>
      {/* <img
        src={process.env.PUBLIC_URL + "/images/logo-1.png"}
        className="logo"
        alt="Lirisoft"
      /> */}
      {/* <div className="projectTitle">
        <h3>
          Lirisoft <span style={{ color: "#0eb593" }}>Asset</span> Management
        </h3>
      </div> */}
    </div>
  );
}
