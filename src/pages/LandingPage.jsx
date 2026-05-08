import Home from "./Home"
import AboutUs from "./AboutUs"
import Testimonials from "./Testimonials"
import ContactUs from "./ContactUs"


function LandingPage() {
  return (
    <>
      <section id="home"><Home /></section>
      <section id="about"><AboutUs /></section>
      <section id="testimonials"><Testimonials /></section>
      <section id="contact"><ContactUs /></section>
    </>
  )
}

export default LandingPage