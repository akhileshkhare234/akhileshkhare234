import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserData } from "../../App";
import { APIUrl } from "../../auth/constants";
import Header from "../inventory/Header";
import { dateFormate, getYears } from "../util.js";

const tableData = {
  month: "Month",
  day: "Day",
  holidayDate: "Holiday Date",
  occasion: "Occasion",
  location: "Location",
  description: "Description",
};
export default function HolidayList({ entryPopUpOpen, token, itemStatus }) {
  const userInfo = useContext(UserData);
  const [holidays, setHolidays] = useState([]);
  const [projectData, setIholidays] = useState([]);
  const [pages, setPages] = useState([]);
  const [start, setStart] = useState(0);
  const [serachText, setSerachText] = useState("");
  const setHolidaysData = useCallback(() => {
    setStart(0);
    fetch(APIUrl + "api/holiday/" + getYears(), {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res?.length > 0) {
          // let project = res.filter((row, index) => index < 10);
          // console.log("holidays List ", project);
          setHolidays([...res]);
          // let pageSize = 10;
          // let pages = [];
          // for (let I = 1; I <= Math.ceil(res.length / pageSize); I++) {
          //   pages.push(I);
          // }
          // setPages(pages);
        } else {
          // setHolidays([]);
          // setIholidays([]);
          // setPages([]);
        }
      });
  }, [token]);
  useEffect(() => {
    setHolidaysData();
  }, [setHolidaysData, itemStatus]);
  // const searchProject = useCallback(() => {
  //   if (serachText) {
  //     let project = projectData.filter(
  //       (row, index) =>
  //         Object.keys(row).filter((field) => {
  //           let text = row[field] + "";
  //           return text.toUpperCase().includes(serachText.toUpperCase());
  //         }).length > 0
  //     );
  //     console.log("serachText,project ", serachText, project);
  //     setHolidays([...project]);
  //     let pageSize = 10;
  //     let pages = [];
  //     for (let I = 1; I <= Math.ceil(project.length / pageSize); I++) {
  //       pages.push(I);
  //     }
  //     setPages(pages);
  //   } else {
  //     let project = projectData.filter((row, index) => index < 10);
  //     let pageSize = 10;
  //     let pages = [];
  //     for (let I = 1; I <= Math.ceil(projectData.length / pageSize); I++) {
  //       pages.push(I);
  //     }
  //     setPages(pages);
  //     setHolidays([...project]);
  //   }
  // }, [projectData, serachText]);
  // useEffect(() => {
  //   const getData = setTimeout(() => {
  //     searchProject(serachText);
  //   }, 1000);
  //   return () => clearTimeout(getData);
  // }, [searchProject, serachText]);
  // const showNextInventory = (pos) => {
  //   let start = pos === 1 ? 0 : pos * 10 - 10;
  //   let inventory = projectData.filter(
  //     (row, index) => index >= start && index < pos * 10
  //   );
  //   console.log("start, pos,inventory ", start, pos, inventory);
  //   setHolidays([...inventory]);
  //   setStart(start);
  // };
  return (
    <>
      <Header title="Holiday List" />
      <div className="container">
        <div className="row">
          <div className="col">
            {holidays && holidays.length > 0 ? (
              <table className="table tabletext">
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
                    <tr key={index}>
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
              <h5
                className="text-center mt-4 loadingbg  p-3"
                style={{ width: "max-content", margin: "auto" }}
              >
                Holidays data loading...
              </h5>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
