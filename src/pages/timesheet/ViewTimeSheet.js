import React, { useCallback, useEffect } from "react";
import { getDayName, getMonthValue } from "../util";
export default function ViewTimeSheet({
  timeSheetData,
  historyPopUpOpen,
  historyPopUpClose,
}) {
  const getTimeSheet = useCallback(() => {
    console.log("timeSheetData ", timeSheetData);
  }, [timeSheetData]);
  useEffect(() => {
    console.log("timeSheetData : ", timeSheetData);
    getTimeSheet();
  }, [getTimeSheet, timeSheetData]);
  return (
    <>
      <div
        className={
          "modal modal-signin position-static bg-secondary py-1 " +
          (historyPopUpOpen ? "closePopUp" : "displayPopUp")
        }
        tabIndex="-1"
        role="dialog"
        id="modalSignin"
      >
        <div
          className="modal-dialog modal-xl"
          style={{ maxWidth: "1400px !important" }}
          role="document"
        >
          <div className="modal-content rounded-4 shadow">
            <div className="modal-header p-4 pb-4 border-bottom-0 headercolor bgColor">
              <h1 className="fw-bold mb-0 fs-2">
                {timeSheetData.projectName} TimeSheet
              </h1>
              <button
                onClick={() => historyPopUpClose(true)}
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body px-5 pt-0">
              <div className="container-fulid">
                <div className="row">
                  <div className="col mt-3">
                    <table className="table tabletext">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Date</th>
                          <th scope="col">Day </th>
                          <th scope="col">Hours</th>
                          <th scope="col">Task</th>
                        </tr>
                      </thead>
                      <tbody>
                        {timeSheetData.data &&
                          timeSheetData?.data[0]?.detail.map((user, index) => (
                            <tr key={index}>
                              <th scope="row">{index + 1}</th>
                              <td>{`${
                                user.day < 10 ? "0" + user.day : user.day
                              }-${timeSheetData.month}-${
                                timeSheetData.year
                              }`}</td>
                              <td>
                                {getDayName(
                                  `${getMonthValue(timeSheetData.month)}/${
                                    user.day
                                  }/${timeSheetData.year}`
                                )}
                              </td>
                              <td>{user.hour}</td>
                              <td>{user.task}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
