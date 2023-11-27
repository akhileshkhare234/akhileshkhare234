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
        {projects.length > 0 ? (
          <>
            {projects.map((pro, index) => (
              <li
                key={index}
                className="list-item"
                title={`${pro.name + ", " + pro.totalHour} hrs Working`}
                id={"project" + index}
              >
                <span className="badge-pill" id={"count" + index}>
                  {index + 1}
                </span>
                <span id={"projectname" + index}>
                  {" "}
                  {projects?.length > 6 ? pro.name.substr(0, 9) : pro.name}
                </span>
                <span className="badge-pill-right" id={"hoursvalue" + index}>
                  {pro.totalHour ? pro.totalHour : "0"}
                </span>
              </li>
            ))}
            <li
              className="list-item "
              title={
                projects
                  .map(
                    (pro) => `${pro.name + ", " + pro.totalHour} hrs Working\n`
                  )
                  .join("") + `<b>Total</b> ${totalHours + " hrs Working"}`
              }
            >
              <span className="item-right">
                Total - <span id="totalHours">{totalHours}</span> {" hrs"}
              </span>
            </li>
          </>
        ) : (
          <li className="list-item" style={{ width: "100%", color: "#0eb593" }}>
            {/* No projects have been assigned in the selected month. */}
          </li>
        )}
      </ul>
    </>
  );
}
