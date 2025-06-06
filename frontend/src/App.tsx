

import type React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"
import TransferForm from "./components/TransferForm"
import CreateAccount from "./components/CreateAccount"
import Transactions from "./components/Transactions"
import Accounts from "./components/Accounts"
import SinpeForm from "./components/SinpeForm"
import { AuthProvider, useAuth } from "./context/AuthContext"
import PhoneLinkForm from "./components/PhoneLinkForm"


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transfer"
              element={
                <ProtectedRoute>
                  <TransferForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-account"
              element={
                <ProtectedRoute>
                  <CreateAccount />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/accounts"
              element={
                <ProtectedRoute>
                  <Accounts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sinpeForm"
              element={
                <ProtectedRoute>
                  <SinpeForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/phone-link"
              element={
                <ProtectedRoute>
                  <PhoneLinkForm />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
