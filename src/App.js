import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Items from "./pages/Items";
import "./App.css";
import DashboardLayout from "./pages/DashboardLayout";
import UserList from "./pages/UserList";
import UserRoles from "./pages/UserRoles";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/:?token" element={<Login />}></Route>
        <Route path="/dashboard" exact element={<DashboardLayout />}>
          <Route path="items" exact element={<Items />} />
          <Route path="users" exact element={<UserList />} />
          <Route path="userroles" exact element={<UserRoles />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
