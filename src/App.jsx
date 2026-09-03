import { HashRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import "./styles.css";

export default function App() {
  return <HashRouter><Routes><Route path="/" element={<HomePage />} /></Routes></HashRouter>;
}
