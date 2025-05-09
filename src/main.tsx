import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login.tsx'
import Profile from './components/Profile.tsx'
import EmployeesTable from './pages/EmployeesTable'
import ProtectedRoute from './components/ProtectedRoute'
import Clients from './pages/Clients'
import Smena from './pages/Smena'

createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<App />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/hodimlar' element={<EmployeesTable />} />
          <Route path='/clients' element={<Clients/>} />
          <Route path='/smena' element={<Smena/>} />
          <Route
            path="employees"
            element={
              <ProtectedRoute>
                <EmployeesTable />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
