import React from "react";

export default function Loader({ msg }) {
  return (
    <div className="row datanotfound">
      <h5
        className="text-center mt-4 loadingbg "
        style={{ width: "max-content", margin: "auto" }}
      >
        {msg}...<span className="loader"></span>
      </h5>
    </div>
  );
}
