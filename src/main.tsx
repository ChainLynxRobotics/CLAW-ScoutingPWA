import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import Layout from './pages/Layout'
import NoPage from './pages/NoPage';
import ScoutPage from './pages/scout/ScoutLayout';
import DataPage from './pages/DataPage';
import SettingsPage from './pages/SettingsPage';
import IndexPage from './pages/IndexPage';
import PreMatch from './pages/scout/PreMatch';
import PostMatch from './pages/scout/PostMatch';
import createTheme from '@mui/material/styles/createTheme';
import { ThemeProvider } from '@emotion/react';
import { DEFAULT_COMPETITION_ID } from './constants';
import SettingsContextProvider from './components/context/SettingsContextProvider';
import CurrentMatchContextProvider from './components/context/CurrentMatchContextProvider';
import ReloadPrompt from './components/ReloadPrompt';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import AnalyticsTeamPage from './pages/analytics/AnalyticsTeamPage';
import AnalyticsLayout from './pages/analytics/AnalyticsLayout';
import Teleop from './pages/scout/Teleop';
import Auto from './pages/scout/Auto';
import SchedulePage from './pages/SchedulePage';
import ScheduleContextProvider from './components/context/ScheduleContextProvider';
import AnalyticsSettingsContextProvider from './components/context/AnalyticsSettingsContextProvider';
import BluetoothContextProvider from './components/context/BluetoothContextProvider';
import PitFormPage from './pages/PitFormPage';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5B7FC5'
    },
    secondary: {
      main: '#696969'
    },
    success: {
      main: '#82ec7a'
    },
    warning: {
      main: '#f7b955'
    },
    error: {
      main: '#f77070'
    },
  },
});

export default function App() {

  return (
    <ThemeProvider theme={darkTheme}>
      <BrowserRouter>
        <SettingsContextProvider defaultCompetitionId={DEFAULT_COMPETITION_ID}>
          <Routes>
            <Route index element={<IndexPage />} />

            <Route path="/" element={<BluetoothContextProvider><Layout /></BluetoothContextProvider>}>
              <Route path="scout" element={<ScheduleContextProvider><CurrentMatchContextProvider><ScoutPage /></CurrentMatchContextProvider></ScheduleContextProvider>}>
                <Route index element={<PreMatch />} />
                <Route path="auto" element={<Auto />} />
                <Route path="teleop" element={<Teleop />} />
                <Route path="post" element={<PostMatch />} />
                <Route path="*" element={<NoPage />} />
              </Route>
              <Route path="pit" element={<PitFormPage />} />
              <Route path="data" element={<DataPage />} />
              <Route path="Schedule" element={<ScheduleContextProvider><SchedulePage /></ScheduleContextProvider>} />
              <Route path="analytics" element={<ScheduleContextProvider><AnalyticsSettingsContextProvider><AnalyticsLayout /></AnalyticsSettingsContextProvider></ScheduleContextProvider>}>
                <Route index element={<AnalyticsPage />} />
                <Route path="team/:teams" element={<AnalyticsTeamPage />} />
                <Route path="team/:teams/vs/:minusTeams" element={<AnalyticsTeamPage />} />
              </Route>
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<NoPage />} />
            </Route>
            <Route path="*" element={<NoPage />} />
          </Routes>
        </SettingsContextProvider>
      </BrowserRouter>
      <ReloadPrompt />
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)