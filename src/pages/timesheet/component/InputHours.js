import React from "react";

export default function InputHours({
  fieldData,
  handleTaskSelect,
  activeTask,
}) {
  return (
    <input
      type="number"
      name={fieldData.hour}
      className="form-control rounded-0 hoursinput"
      placeholder="Hours"
      min="0"
      max="10"
      step="1"
      autoComplete="off"
      style={{
        backgroundColor:
          activeTask && fieldData.hour === activeTask?.hour
            ? "#f6faf6"
            : "#fff",
      }}
      onInput={(event) => {
        event.target.value =
          Math.abs(Math.floor(event.target.value)) > 24
            ? "0"
            : Math.abs(Math.floor(event.target.value));
      }}
      onChange={(event) => handleTaskSelect(event, fieldData)}
      onFocus={() => handleTaskSelect(null, fieldData)}
    />
  );
}
