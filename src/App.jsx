import MainHomePage from "./Views/MainPage/MainHomePage";
import Interview from "./Views/AiInterview/AiInterview"; 
import DashBoard from "./Views/DashBoard/DashBoard";
import Schedule from "./Views/Schedule/Schedule";
import Profile from "./Views/Profile/Profile";
import MockInterview from "./Views/MockInterview/MockInterview";
import {Routes, Route } from "react-router-dom";
import InterviewResultDashboard from "./Views/InterviewResultDashboard/InterviewResultDashboard";
import Register from "./Views/Register/Register";
import Login from "./Views/Login/Login";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute"


function App(){

  return(
    <>
     <Routes>
      <Route path="/" element={<MainHomePage/>}/>
      <Route path="/interview" 
         element={
        <ProtectedRoute>
        <Interview/>
        </ProtectedRoute>}/>
      <Route path="/dashboard" 
      element={
       <ProtectedRoute>
        <DashBoard/>
        </ProtectedRoute>}/>
      <Route path="/schedule" 
      element={
      <ProtectedRoute>
        <Schedule/>
        </ProtectedRoute>}/>
      <Route path="/profile" 
      element={
      <ProtectedRoute>
        <Profile/>
        </ProtectedRoute>}/>
       <Route path="/mockinterview"
        element={
        <ProtectedRoute>
          <MockInterview/>
          </ProtectedRoute>}/>
       <Route path="/mockinterview/interviewResult" element={<InterviewResultDashboard/>}/>
       <Route path="/register" element={<Register/>}/>
       <Route path="/login" element={<Login/>}/>
     </Routes>
    </>
  )
}


export default App;