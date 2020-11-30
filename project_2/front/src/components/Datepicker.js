// import React, { useState } from "react";
// import { SingleDatePicker } from "react-dates";
// import "react-dates/initialize";
// import "react-dates/lib/css/_datepicker.css";

// // import format from "date-fns/format";
// // import parseISO from "date-fns/parseISO";
// import moment from "moment";


// export default function DatePicker({ date, onChange }) {
//     const [focused, setFocused] = useState(false);

//     return (
//         <SingleDatePicker
//             numberOfMonths={window.innerWidth < 600 ? 1 : 2}
//             onDateChange={date => onChange({ target: { value: date } })}
//             onFocusChange={({ focused }) => setFocused(focused)}
//             focused={focused}
//             date={date}
//             displayFormat="YYYY-MM-DD"
//             isDayBlocked={m => m.day() === 6 || m.day() === 0}
//             hideKeyboardShortcutsPanel
//             withPortal
//             withFullScreenPortal={window.innerWidth < 400}
//         />
//     );
// }

// const fixDateFns2Format = format =>
//     format
//         .replace("YYYY", "yyyy") // full year
//         .replace(/\bDD\b/, "dd") // day of month, short
//         .replace("dddd", "cccc"); // day of week, long


// export function DatePicker2({ date, onChange }) {
//     return (
//         <DatePicker
//             autoComplete="off"
//             className="rd2"
//             // selected={date && parseISO(date)}
//             selected={date.toDate()}
//             onChange={d => {
//                 onChange({ target: { value: moment(d) /*format(d, "yyyy-MM-dd")*/ } });
//             }}
//             dateFormat={fixDateFns2Format("YYYY-MM-DD")}
//             withPortal={window.innerWidth < 400}
//             filterDate={d => d.getDay() !== 6 && d.getDay() !== 0}
//         />
//     );
// }
