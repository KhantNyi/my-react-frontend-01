import { Routes, Route } from "react-router-dom";
import { Items } from "./Items";
import { ItemDetail } from "./ItemDetail";
import { Users } from "./Users";
import { UserProfile } from "./UserProfile";
import TestApi from "./TestApi";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Items />} />
      <Route path="/items" element={<Items />} />
      <Route path="/items/:id" element={<ItemDetail />} />

      {/* User management routes */}
      <Route path="/users" element={<Users />} />
      <Route path="/users/:id/profile" element={<UserProfile />} />

      {/* Existing test route */}
      <Route path="/test_api" element={<TestApi />} />
    </Routes>
  );
}

export default App;