import { useEffect, useState } from "react"
import axios from "axios"
import { Route, Routes } from "react-router-dom"
import SignupPage from "./pages/SignupPage"
import ProtectedRoute from "./components/ProtectedRoute"

export default function App() {

  return (
    <div>
      <Routes>
        <Route path="/signup" element={<SignupPage/>}/>
        <Route path="/boards" element={
          <ProtectedRoute><div>You are loggin IN!</div></ProtectedRoute>
        }/>
      </Routes>
    </div>
  )
}
