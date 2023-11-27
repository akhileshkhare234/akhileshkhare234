import React, { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GOOGLE_AUTH_URL, envmode } from "../auth/constants";
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
      console.log("search Location : ", search);
      const token = new URLSearchParams(search).get("token");
      if (token) {
        console.log("Login Page:User logedin !token value : ", search, token);
        window.localStorage.setItem("am_token", token);
        navigate("/dashboard/userprofile");
      } else {
        console.log("Login Page:User not logedin ! ", token);
      }
    }
  }, [navigate, search]);
  useEffect(() => {
    checkUser();
  }, [checkUser]);
  return (
    <div className="container-fulid">
      <div
        className="row login-container"
        style={{ margin: "0", height: "100vh" }}
        id="login-containe"
      >
        <div className="col-sm-6">
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
          <div className="loginpage" id="loginpage">
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
                  id="loginbtn"
                  style={{
                    marginRight: 0,
                    fontWeight: "bold",
                    lineHeight: "30px",
                  }}
                >
                  {envmode.env === "testing" ? "Login by Gmail" : "Login"}
                </span>
              </a>

              <h6 className="mt-3">Note : Accept only Lirisoft Email id!</h6>
              {envmode.env === "testing" ? (
                <div className="row mt-3">
                  <div className="col-sm-6">
                    <button
                      id="adminbtn"
                      className="btn btn-sm btn-primary logo2"
                      onClick={() => {
                        window.localStorage.removeItem("am_token");
                        window.localStorage.setItem(
                          "am_token",
                          "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI3OCIsImlhdCI6MTcwMDIyMDc5OSwiZXhwIjoxNzAxMDg0Nzk5fQ.Vjb7bxXQKdohJy5Zl0YVLtwJl1vZX98p_Z3qPvn0FN1ysC6o5bfg4SLOvBVkm7xYffEvm4rrjicsjE8E6nAVJA"
                        );
                        navigate("/dashboard/userprofile");
                        window.location.reload();
                      }}
                    >
                      Admin Login
                    </button>
                  </div>
                  <div className="col-sm-6">
                    {" "}
                    <button
                      id="userbtn"
                      className="btn btn-sm btn-primary logo2"
                      onClick={() => {
                        window.localStorage.removeItem("am_token");
                        window.localStorage.setItem(
                          "am_token",
                          "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI2NiIsImlhdCI6MTcwMDIxNjc2MSwiZXhwIjoxNzAxMDgwNzYxfQ.t4tUaSev-VfXnwD62Tw3KCyEiFMGVLwaH6fJhGH7aL-qNBDl4kXKjYQxivmO1gi9KMaMJDQFmp_HE4W-OZqXhA"
                        );
                        navigate("/dashboard/userprofile");
                        window.location.reload();
                      }}
                    >
                      User Login
                    </button>
                  </div>
                </div>
              ) : (
                <></>
              )}
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
