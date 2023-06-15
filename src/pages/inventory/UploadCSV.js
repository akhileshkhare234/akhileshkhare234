import React, { useState } from "react";
import { APIUrl } from "../../auth/constants";
import Header from "./Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function UploadCSV() {
  const [uploadbtn, setUploadbtn] = useState("Inventories");
  const uploadCSVData = (event) => {
    event.preventDefault();
    let csvfile = event.target.file.files[0];
    console.log(csvfile);
    let tokenValue = window.localStorage.getItem("am_token");
    const formData = new FormData();
    formData.append("file", csvfile, csvfile.name);

    fetch(
      uploadbtn === "Holidays"
        ? APIUrl + "api/holiday/uploadHolidayCsv"
        : APIUrl + "api/assets/uploadAssetCsv",
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: "Bearer " + tokenValue,
        },
      }
    )
      .then((res) => {
        console.log("Upload CSV File : ", res);
        toast.success(uploadbtn + " CSV file uploaded successfully.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          theme: "colored",
        });
      })
      .catch((err) => {
        console.log("CSV File Not Upload : ", err);
        toast.error(uploadbtn + " CSV not uploaded.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          theme: "colored",
        });
      });
  };
  return (
    <>
      <ToastContainer />
      <Header title="Upload CSV File" />
      <div className="container">
        <div className="row mx-5">
          <div className="offset-3 col-6 mt-4">
            <div className="col-md bgColor textColor py-3 mb-4">
              <h4 className="text-center">Upload {uploadbtn} CSV File</h4>
            </div>
            <form className="row g-3" onSubmit={uploadCSVData}>
              <div className="col-md-6">
                <button
                  onClick={() => setUploadbtn("Inventories")}
                  className={
                    uploadbtn === "Inventories" ? "csvbtnselected" : "csvbtn"
                  }
                >
                  <i
                    className={
                      uploadbtn === "Inventories"
                        ? "bi bi-check csvicon"
                        : "bi bi-check csviconnormal"
                    }
                  ></i>
                  Inventories
                </button>
              </div>
              <div className="col-md-6">
                <button
                  onClick={() => setUploadbtn("Holidays")}
                  className={
                    uploadbtn === "Holidays" ? "csvbtnselected" : "csvbtn"
                  }
                >
                  <i
                    className={
                      uploadbtn === "Holidays"
                        ? "bi bi-check csvicon"
                        : "bi bi-check csviconnormal"
                    }
                  ></i>
                  Holidays
                </button>
              </div>
              <div className="col-md-12">
                <label htmlFor="floatingInput" className="mb-1">
                  Select CSV File
                </label>
                <input
                  type="file"
                  name="file"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="Upload CSV"
                />
              </div>
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button
                  className="w-25 mb-2 btn btn-md rounded-3 btn-primary center"
                  type="submit"
                  style={{ width: "140px !important" }}
                >
                  Upload CSV
                </button>
              </div>
            </form>
            <hr className="mb-3" />
          </div>
        </div>
      </div>
    </>
  );
}
