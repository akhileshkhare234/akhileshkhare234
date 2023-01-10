import React from "react";
import { Link } from "react-router-dom";
export default function Header({ title }) {
  return (
    <div className="bgColor" style={{ height: 80, width: "100%" }}>
      <div className="navbarbrand">
        <span>{title}</span>
      </div>
    </div>
  );
}
