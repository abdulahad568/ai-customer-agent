import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Submit from "./pages/Submit";
import Result from "./pages/Result";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Submit />} />
        <Route path="/result" element={<Result />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Layout>
  );
}
