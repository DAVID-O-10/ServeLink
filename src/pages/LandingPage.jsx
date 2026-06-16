import Home from "./Home"
import AboutUs from "./AboutUs"
import Testimonials from "./Testimonials"
import ContactUs from "./ContactUs"
import FeaturedCarousel from "../components/FeaturedCarousel"


function LandingPage() {
  return (
    <>
      <section id="home"><Home /></section>
      <section id="about"><AboutUs /></section>
      <section id="featured"><FeaturedCarousel /></section>
      <section id="testimonials"><Testimonials /></section>
      <ContactUs />
    </>
  )
}

export default LandingPage