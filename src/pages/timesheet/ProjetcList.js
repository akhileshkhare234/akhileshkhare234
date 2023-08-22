import React, { useCallback, useEffect, useState } from "react";

export default function ProjetcList({ projects }) {
  const [totalHours, setTotalHours] = useState(0);
  const totalHourCount = useCallback(() => {
    let sum = 0;
    projects.forEach((row) => {
      sum += parseFloat(row.totalHour ? row.totalHour : 0);
    });
    setTotalHours(sum);
    console.log("projects Data : ", projects);
  }, [projects]);
  useEffect(() => {
    totalHourCount();
  }, [totalHourCount]);
  return (
    <>
      <ul className="list">
        {projects.map((pro, index) => (
          <li
            key={index}
            className="list-item"
            title={`${pro.name + ", " + pro.totalHour} hrs Working`}
          >
            <span className="badge-pill">{index + 1}</span>
            {projects?.length > 10 ? pro.name.substr(0, 8) : pro.name}
            <span className="badge-pill-right">
              {pro.totalHour ? pro.totalHour : "0"}
            </span>
          </li>
        ))}
        <li
          className="list-item "
          title={
            projects
              .map((pro) => `${pro.name + ", " + pro.totalHour} hrs Working\n`)
              .join("") + `<b>Total</b> ${totalHours + " hrs Working"}`
          }
        >
          <span className="item-right">Total - {totalHours + " hrs"}</span>
        </li>
      </ul>
    </>
  );
}
