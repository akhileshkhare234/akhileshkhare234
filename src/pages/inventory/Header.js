import React from "react";
export default function Header({ title }) {
  return (
    <div className="bgColor top-header" style={{ height: 81, width: "100%" }}>
      <div className="navbarbrand">
        <span>{title}</span>
      </div>
    </div>
  );
}
