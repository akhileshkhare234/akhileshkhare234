import React, { useCallback, useEffect, useState } from "react";

export default function ProjetcList({ projects }) {
  const [totalHours, setTotalHours] = useState(0);
  const totalHourCount = useCallback(() => {
    let sum = 0;
    projects.forEach((row) => {
      sum += parseFloat(row.totalHour);
    });
    setTotalHours(sum);
  }, [projects]);
  useEffect(() => {
    totalHourCount();
  }, [totalHourCount]);
  return (
    <>
      <ul className="list">
        {projects.map((pro, index) => (
          <li key={index} className="list-item">
            <span className="badge-pill">{index + 1}</span>
            {pro.name}
            <span className="badge-pill-right">{pro.totalHour + " hrs"}</span>
          </li>
        ))}
        <li className="list-item  mt-2">
          <span className="item-right">Total - {totalHours + " hrs"}</span>
        </li>
      </ul>
    </>
  );
}
