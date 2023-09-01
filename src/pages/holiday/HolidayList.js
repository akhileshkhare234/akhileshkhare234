import React, { useCallback, useEffect, useState } from "react";
import { APIUrl } from "../../auth/constants";
import Loader from "../../util/Loader";
import Header from "../inventory/Header";
import { dateFormate, getYears } from "../util.js";
import { useNavigate } from "react-router-dom";

const tableData = {
  month: "Month",
  day: "Day",
  holidayDate: "Holiday Date",
  occasion: "Occasion",
  location: "Location",
  description: "Description",
};
export default function HolidayList({ token, itemStatus }) {
  const [holidays, setHolidays] = useState([]);
  const [start, setStart] = useState(0);
  const navigate = useNavigate();
  const setHolidaysData = useCallback(() => {
    setStart(0);
    token &&
      fetch(APIUrl + "api/holiday/" + getYears(), {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => {
          if (res.status === 401) {
            window.localStorage.removeItem("am_token");
            navigate("/");
          } else return res.json();
        })
        .then((res) => {
          if (res?.length > 0) {
            setHolidays([...res]);
          }
        });
  }, [token]);
  useEffect(() => {
    setHolidaysData();
  }, [setHolidaysData, itemStatus]);

  return (
    <>
      <Header title="Holiday List" />
      <div className="container">
        <div className="row">
          <div className="col">
            {holidays && holidays.length > 0 ? (
              <table className="table tabletext2 mt-4">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    {Object.values(tableData).map((field, index) => (
                      <th scope="col" key={field}>
                        {field}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {holidays.map((item, index) => (
                    <tr
                      key={index}
                      style={{
                        color:
                          item.holidayDate < new Date().toISOString()
                            ? "#ccc"
                            : "#000",
                      }}
                    >
                      <th scope="row">{start + index + 1}</th>
                      {Object.keys(tableData).map((field, index) => (
                        <td key={field}>
                          {field.includes("Date")
                            ? dateFormate(item[field])
                            : item[field]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <Loader msg="Holidays loading" />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
