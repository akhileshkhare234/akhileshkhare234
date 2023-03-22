export const profileFileds = [
  { name: "displayName", title: "Name", type: "text" },
  {
    name: "ofcLocation",
    title: "Office Location",
    type: "select",
    values: [
      { value: "Indore", name: "Indore" },
      { value: "Bangalore", name: "Bangalore" },
    ],
  },
  { name: "tempAddress", title: "Temp Address", type: "text" },
  { name: "permanentAddress", title: "Permanent Address", type: "text" },
  { name: "city", title: "City", type: "text" },
  { name: "state", title: "State", type: "text" },
  { name: "pinCode", title: "PinCode", type: "text" },
  { name: "mobileNumber", title: "Mobile Number", type: "text" },
  {
    name: "emergencyMobileNumber",
    title: "Emergency Mobile Number",
    type: "text",
  },
  {
    name: "gender",
    title: "Gender",
    type: "select",
    values: [
      { value: "Male", name: "Male" },
      { value: "Female", name: "Female" },
    ],
  },
  { name: "dob", title: "Date of Birth", type: "date" },
];
