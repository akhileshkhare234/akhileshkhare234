import React from "react";
import { APIUrl } from "../auth/constants";
import Header from "./Header";

export default function UploadCSV() {
  const uploadCSVData = (event) => {
    event.preventDefault();
    let csvfile = event.target.file.files[0];
    console.log(csvfile);
    let tokenValue = window.localStorage.getItem("am_token");
    const formData = new FormData();
    formData.append("file", csvfile, csvfile.name);
    fetch(APIUrl + "api/assets/uploadAssetCsv", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "Bearer " + tokenValue,
      },
    })
      .then((res) => {
        console.log("Upload CSV File : ", res);
      })
      .catch((err) => {
        console.log("CSV File Not Upload : ", err);
      });
  };
  return (
    <>
      <Header title="Upload CSV File" />
      <div className="container">
        <div className="row mx-5">
          <div className="offset-3 col-6 mt-4">
            <div className="col-md bgColor textColor py-3 mb-4">
              <h4 className="text-center">Upload CSV Form</h4>
            </div>
            <form className="row g-3" onSubmit={uploadCSVData}>
              <div className="col-md">
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
