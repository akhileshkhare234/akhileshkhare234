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
              <div className="container-fulid view-timesheet">
                <div className="row">
                  <div className="col mt-3">
                    <table className="table tabletext2 ">
                      <thead className="sticky-header">
                        <tr>
                          <th
                            scope="col"
                            style={{ width: "35px", textAlign: "center" }}
                          >
                            #
                          </th>
                          <th
                            scope="col"
                            style={{ width: "100px", textAlign: "center" }}
                          >
                            Date
                          </th>
                          <th
                            style={{ width: "60px", textAlign: "center" }}
                            scope="col"
                          >
                            Day{" "}
                          </th>
                          <th
                            style={{ width: "60px", textAlign: "center" }}
                            scope="col"
                          >
                            Hours
                          </th>
                          <th scope="col">Task</th>
                        </tr>
                      </thead>
                      <tbody>
                        {timeSheetData.data &&
                        timeSheetData?.data.length > 0 ? (
                          timeSheetData?.data[0]?.detail
                            .sort((a, b) => b.id - a.id)
                            .filter(
                              (item, index, self) =>
                                index ===
                                self.findIndex((t) => t.day === item.day)
                            )
                            .sort((a, b) => a.day - b.day)
                            .map((user, index) => (
                              <tr key={index}>
                                <th className="text-center" scope="row">
                                  {index + 1}
                                </th>
                                <td className="text-center">{`${
                                  user.day < 10 ? "0" + user.day : user.day
                                }-${timeSheetData.month}-${
                                  timeSheetData.year
                                }`}</td>
                                <td className="text-center">
                                  {getDayName(
                                    `${getMonthValue(timeSheetData.month)}/${
                                      user.day
                                    }/${timeSheetData.year}`
                                  )}
                                </td>
                                <td className="text-center">{user.hour}</td>
                                <td>{user.task}</td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <th colSpan="5" className="text-center">
                              Timesheet is not filled yet.
                            </th>
                          </tr>
                        )}
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
