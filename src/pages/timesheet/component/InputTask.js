import React from "react";

export default function InputTask({ fieldData, activeTask }) {
  return (
    <textarea
      multiline="true"
      type="text"
      autoComplete="off"
      name={fieldData.task}
      className="form-control rounded-1"
      placeholder={
        "Task Details for - " +
        fieldData.dayOfWeek +
        " " +
        fieldData.day +
        "/" +
        fieldData.month
      }
      style={{
        display: fieldData.task === activeTask.task ? "block" : "none",
        backgroundColor: "#f6faf6",
      }}
    />
  );
}
