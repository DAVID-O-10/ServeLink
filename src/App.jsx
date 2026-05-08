import { Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import Marketplace from "./pages/Marketplace"
import Footer from "./components/Footer"
import LandingPage from "./pages/LandingPage"
import CustomCursor from "./components/CustomCursor"




function App() {
  

  return (
    <>
    <CustomCursor/>
    <Navbar />

    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/marketplace" element={<Marketplace />} />
    </Routes>

    <Footer/>

    </>
  )
}

export default App
