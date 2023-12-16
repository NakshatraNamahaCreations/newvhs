import React, { useState, useEffect } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import Header from "../layout/Header";
import Surveynav from "../Surveynav";
import axios from "axios";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { NavLink } from "react-bootstrap";

const localizer = momentLocalizer(moment);

function Surveycategory() {
  const admin = JSON.parse(sessionStorage.getItem("admin"));
  const [categorydata, setcategorydata] = useState([]);
  const [category, setcategory] = useState([]);
  const [data, setenquiryflwdata] = useState([]);
  const [surveycatdata, setsurveycatdata] = useState([]);
  const localizer = momentLocalizer(moment);
  const navigate = useNavigate();
  const apiURL = process.env.REACT_APP_API_URL;
  const [surveycatagoryData, setsurveycatagoryData] = useState([]);

  console.log(surveycatdata);
  useEffect(() => {
    getcategory();
    // getenquiryadd();
    SurveyCatagory();
  }, []);

  useEffect(() => {
    postallajob();
  }, [category]);

  const postallajob = async () => {
    let res = await axios.post(apiURL + "/postsurveycat", {
      category: category,
    });
    if ((res.status = 200)) {
      setsurveycatdata(res.data?.enquiryfollowup);
    }
  };

  const getcategory = async () => {
    let res = await axios.get(apiURL + "/getcategory");
    if ((res.status = 200)) {
      setcategorydata(res.data?.category);
    }
  };

  const SurveyCatagory = async () => {
    let res = await axios.get(apiURL + "/getsurveydata");
    if (res.status === 200) {
      setsurveycatagoryData(res.data?.enquiryfollowup);
    }
  };

  const eventCounts = surveycatdata.reduce((counts, item) => {
    const date = item.nxtfoll;
    counts[date] = (counts[date] || 0) + 1;
    return counts;
  }, {});

  const myEventsList = Object.keys(eventCounts).map((date) => ({
    title: `${eventCounts[date]} Followup`,
    start: new Date(date),
    end: new Date(date),
    count: eventCounts[date],
  }));

  const handleSelectEvent = (event) => {
    const selectedDate = moment(event.start).format("YYYY-MM-DD");
    const selectedData = surveycatagoryData?.filter(
      (item) => item.date === selectedDate
    );
    console.log("selectedDatainsurveyCatagory", selectedData);
    navigate(`/surveydatatable/${selectedDate}/${category}`, {
      state: { data: selectedData },
    });
  };

  function calculateTotalCount(array) {
    let totalCount = 0;

    for (let i = 0; i < array.length; i++) {
      if (array[i].hasOwnProperty("nxtfoll")) {
        totalCount++;
      }
    }

    return totalCount;
  }

  const totalCount = calculateTotalCount(surveycatagoryData);
  // console.log("totalCount===", totalCount);

  return (
    <div className="web">
      <Header />
      {/* <Surveynav /> */}

      <div className="row m-auto">
        <div className="col-md-12">
          <div className="cansurvey" style={{ marginTop: "30px" }}>
            <Link to="/surveycancel">
              <button> Cancelled Survey</button>
            </Link>
          </div>

          <div className="card">
            <div className="card-body p-3">
              <div className="vhs-sub-heading pb-2">
                Category Selection Option
              </div>
              <form>
                <div className="row">
                  <div className="col-md-4">
                    <div className="vhs-input-label">
                      Survey Type <span className="text-danger"> *</span>
                    </div>
                    <div className="group pt-1">
                      <select
                        className="col-md-12 vhs-input-value"
                        onChange={(e) => setcategory(e.target.value)}
                      >
                        <option>-select-</option>
                        {admin?.category.map((category, index) => (
                          <option key={index} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                        {/* {categorydata.map((item) => (
                          <option value={item.category}>{item.category}</option>
                        ))} */}
                      </select>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div style={{ width: "94%", margin: "3%" }}>
            <Calendar
              localizer={localizer}
              events={myEventsList}
              startAccessor="start"
              endAccessor="end"
              selectable
              onSelectEvent={handleSelectEvent}
              style={{ height: 500 }}
            />
            <br />
            <div
              style={{
                backgroundColor: "rgb(169, 4, 46)",
                textAlign: "center",
              }}
            >
              <p class="header-text">Survey - {totalCount} </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Surveycategory;

// import React, { useState, useEffect } from "react";
// import { Scheduler } from "@aldabil/react-scheduler";
// import Header from "../layout/Header";
// import Surveynav from "../Surveynav";
// import axios from "axios";
// import { Calendar, momentLocalizer, Views } from "react-big-calendar";
// import moment from "moment";
// import { Link, useNavigate } from "react-router-dom";
// import { NavLink } from "react-bootstrap";

// function Surveycategory() {
//   const admin = JSON.parse(sessionStorage.getItem("admin"));

//   const [category, setcategory] = useState([]);
//   const [view, setView] = React.useState("month");
//   const [surveycatdata, setsurveycatdata] = useState([]);
//   const localizer = momentLocalizer(moment);
//   const navigate = useNavigate();
//   const apiURL = process.env.REACT_APP_API_URL;

//   const [totalCount, setTotalCount] = useState(0);

//   // Get the current date
//   const currentDate = new Date();

//   // Get the start of the current month
//   const startOfMonth = moment(currentDate)
//     .startOf("month")
//     .format("YYYY-MM-DD");

//   // Get the end of the current month
//   const endOfMonth = moment(currentDate).endOf("month").format("YYYY-MM-DD");

//   const [rstart, setrstart] = useState(startOfMonth);
//   const [rend, setrend] = useState(endOfMonth);
//   const handleRangeChange = (range) => {
//     const targetMonth = range.start.getMonth() + 1;

//     const newFilteredData = surveycatdata.filter((item) => {
//       return item.dividedDates.some((date) => {
//         const month = moment(date.date).month() + 1;
//         return month === targetMonth;
//       });
//     });

//     let count = 0;
//     newFilteredData.forEach((item) => {
//       count += item.dividedDates.length;
//     });

//     setTotalCount(count);

//     const convertedsDate = moment(range.start).format("YYYY-MM-DD");
//     const convertedeDate = moment(range.end).format("YYYY-MM-DD");

//     setrstart(convertedsDate);
//     setrend(convertedeDate);
//   };

//   useEffect(() => {
//     postallajob();
//   }, [category, rstart, rend]);

//   const postallajob = async () => {
//     try {
//       const res = await axios.post(apiURL + "/postsurveycat", {
//         category: category,
//         startDate: rstart,
//         endDate: rend,
//       });

//       if (res.status === 200) {
//         console.log("res.data?.enquiryfollowup", res.data?.enquiryfollowup);
//         setsurveycatdata(res.data?.enquiryfollowup);
//       } else {
//         setsurveycatdata([]);
//         console.error("Unexpected status code:", res.status);
//       }
//     } catch (error) {
//       console.error("Error:", error.message);
//       // Handle the error appropriately, e.g., show an error message to the user
//     }
//   };

//   const eventCounts = surveycatdata?.reduce((counts, item) => {
//     const date = item?.nxtfoll;
//     counts[date] = (counts[date] || 0) + 1;
//     return counts;
//   }, {});

//   const myEventsList = Object.keys(eventCounts).map((date) => ({
//     title: `${eventCounts[date]} Followup`,
//     start: new Date(date),
//     end: new Date(date),
//     count: eventCounts[date],
//   }));

//   const handleSelectEvent = (event) => {
//     const selectedDate = moment(event.start).format("YYYY-MM-DD");
//     const selectedData = surveycatdata?.filter(
//       (item) => item.date === selectedDate
//     );

//     navigate(`/surveydatatable/${selectedDate}/${category}`, {
//       state: { data: selectedData },
//     });
//   };

//   const handleViewChange = (newView) => {
//     setView(newView);
//   };

//   return (
//     <div className="web">
//       <Header />
//       {/* <Surveynav /> */}

//       <div className="row m-auto">
//         <div className="col-md-12">
//           <div className="cansurvey" style={{ marginTop: "30px" }}>
//             <Link to="/surveycancel">
//               <button> Cancelled Survey</button>
//             </Link>
//           </div>

//           <div className="card">
//             <div className="card-body p-3">
//               <div className="vhs-sub-heading pb-2">Category</div>
//               <form>
//                 <div className="row">
//                   <div className="col-md-4">
//                     <div className="group pt-1">
//                       <select
//                         className="col-md-12 vhs-input-value"
//                         onChange={(e) => setcategory(e.target.value)}
//                       >
//                         <option>-select-</option>
//                         {admin?.category.map((category, index) => (
//                           <option key={index} value={category.name}>
//                             {category.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>
//           <div style={{ width: "94%", margin: "3%" }}>
//             <Calendar
//               localizer={localizer}
//               // events={myEventsList}
//               startAccessor="start"
//               endAccessor="end"
//               selectable
//               onView={handleViewChange}
//               onSelectEvent={handleSelectEvent}
//               onRangeChange={handleRangeChange}
//               style={{ height: 500 }}
//             />
//             <br />
//             <div
//               style={{
//                 backgroundColor: "rgb(169, 4, 46)",
//                 textAlign: "center",
//               }}
//             >
//               <p class="header-text">Survey - {totalCount} </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default Surveycategory;
