import { Routes, Route } from "react-router-dom";
import { Items } from "./Items";
import { ItemDetail } from "./ItemDetail";
import { Users } from "./Users";
import TestApi from "./TestApi";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Items />} />
      <Route path="/items" element={<Items />} />
      <Route path="/items/:id" element={<ItemDetail />} />

      {/* User management route */}
      <Route path="/users" element={<Users />} />

      {/* Existing test route */}
      <Route path="/test_api" element={<TestApi />} />
    </Routes>
  );
}

export default App;