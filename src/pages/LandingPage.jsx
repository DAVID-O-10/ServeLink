import React, { Suspense } from "react"
import Home from "./Home"
import AboutUs from "./AboutUs"
import Testimonials from "./Testimonials"
import FeaturedCarousel from "../components/FeaturedCarousel"

const ContactUs = React.lazy(() => import("./ContactUs"))

function ContactSkeleton() {
  return (
    <section className="w-full min-h-[500px] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-5xl px-6 space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        </div>
        <div className="flex gap-4 pt-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
        </div>
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-10 bg-emerald-200 dark:bg-emerald-800 rounded w-1/3 mx-auto" />
      </div>
    </section>
  )
}

function LandingPage() {
  return (
    <>
      <section id="home"><Home /></section>
      <section id="about"><AboutUs /></section>
      <section id="featured"><FeaturedCarousel /></section>
      <section id="testimonials"><Testimonials /></section>
      <Suspense fallback={<ContactSkeleton />}>
        <ContactUs />
      </Suspense>
    </>
  )
}

export default LandingPage
