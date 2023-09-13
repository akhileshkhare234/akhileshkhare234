import React, { memo } from "react";
import { envmode } from "../../auth/constants";
function Header({ title }) {
  return (
    <div className={`bgColor top-header`}>
      <div className="navbarbrand">
        <span>{title}</span>
      </div>
      {envmode.env === "testing" ? (
        <div className="testingmode">{envmode.title}</div>
      ) : (
        <></>
      )}
    </div>
  );
}
export default memo(Header);
