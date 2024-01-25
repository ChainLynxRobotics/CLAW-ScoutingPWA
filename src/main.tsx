import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import Layout from './pages/Layout'
import NoPage from './pages/NoPage';
import ScoutPage from './pages/ScoutPage';
import DataPage from './pages/DataPage';
import SettingsPage from './pages/SettingsPage';
import IndexPage from './pages/IndexPage';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<IndexPage />} />

        <Route path="/" element={<Layout />}>
          <Route path="scout" element={<ScoutPage />} />
          <Route path="data" element={<DataPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
