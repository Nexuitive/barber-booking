"use client";

import { useState } from "react";

import {
  collection,
  addDoc,
} from "firebase/firestore";

import { db } from "./firebase";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function BookingPage() {

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedBarber, setSelectedBarber] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const services = [
    {
      name: "Hair Cut",
      price: "Rs 800",
      icon: "✂️",
    },

    {
      name: "Shaving",
      price: "Rs 500",
      icon: "🪒",
    },

    {
      name: "Treatment",
      price: "Rs 2500",
      icon: "🧴",
    },

    {
      name: "Beard Care",
      price: "Rs 1200",
      icon: "🧔",
    },

    {
      name: "Hair Style",
      price: "Rs 1800",
      icon: "💈",
    },
  ];

  const barbers = [
    {
      name: "Ahmed",
      image: "/images/barber1.jpg",
    },

    {
      name: "Ali",
      image: "/images/barber2.jpg",
    },

    {
      name: "Danish",
      image: "/images/barber3.jpg",
    },
  ];

  const timings = [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ];

  const toggleService = (service: string) => {

    if (selectedServices.includes(service)) {

      setSelectedServices(
        selectedServices.filter((item) => item !== service)
      );

    } else {

      setSelectedServices([
        ...selectedServices,
        service,
      ]);

    }

  };

  const totalAmount = selectedServices.reduce(
    (total, serviceName) => {

      const service = services.find(
        (s) => s.name === serviceName
      );

      return total + Number(
        service?.price.replace("Rs ", "")
      );

    },
    0
  );

  const handleBooking = async () => {

    if (
      selectedServices.length === 0 ||
      !selectedBarber ||
      !selectedTime
    ) {
      alert("Please complete your booking.");
      return;
    }

    try {

      await addDoc(collection(db, "bookings"), {

        services: selectedServices,

        barber: selectedBarber,

        date:
          selectedDate.toDateString(),

        time: selectedTime,

        total: totalAmount,

        createdAt:
          new Date().toISOString(),

      });

      alert("Booking Confirmed Successfully!");

    } catch (error) {

      console.log(error);

      alert("Booking Failed");

    }

  };

  return (

    <main className="bg-[#060707] text-[#F5F5F5] min-h-screen">

      {/* Navbar */}
      <nav className="border-b border-[#433E3B]">

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-center">

          <h1 className="text-3xl md:text-4xl font-black">
            Trim<span className="text-[#C0A790]">Book</span>
          </h1>

        </div>

      </nav>


      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-16 text-center">

        <p className="text-[#C0A790] uppercase tracking-[4px] font-semibold mb-5">
          Premium Barber Booking
        </p>

        <h1 className="text-5xl md:text-7xl font-black leading-tight">

          Book Your
          <br />

          Appointment

        </h1>

        <p className="text-[#A8A29E] text-lg leading-9 mt-8 max-w-3xl mx-auto">

          Select services, choose barber and confirm your booking instantly.

        </p>

      </section>


      {/* Services */}
      <section className="max-w-5xl mx-auto px-6 md:px-12 pb-20">

        <div className="mb-10">

          <p className="text-[#C0A790] uppercase tracking-[3px] font-semibold mb-3">
            Services
          </p>

          <h2 className="text-4xl md:text-5xl font-black">
            Select Services
          </h2>

        </div>

        <div className="space-y-5">

          {services.map((service) => (

            <button
              key={service.name}
              onClick={() => toggleService(service.name)}
              className={`w-full rounded-[28px] border transition p-6 flex items-center justify-between ${
                selectedServices.includes(service.name)
                  ? "bg-[#302E2D] border-[#C0A790]"
                  : "bg-[#1A1918] border-[#433E3B] hover:border-[#C0A790]"
              }`}
            >

              <div className="flex items-center gap-5">

                <div className="text-4xl">
                  {service.icon}
                </div>

                <div className="text-left">

                  <h3 className="text-2xl font-black">
                    {service.name}
                  </h3>

                  <p className="text-[#A8A29E] mt-2">
                    Premium Grooming Service
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-5">

                <p className="text-[#C0A790] text-2xl font-black">
                  {service.price}
                </p>

                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-black ${
                  selectedServices.includes(service.name)
                    ? "bg-[#E8D9BF] text-black"
                    : "bg-[#302E2D]"
                }`}>

                  {selectedServices.includes(service.name)
                    ? "✓"
                    : "+"}

                </div>

              </div>

            </button>

          ))}

        </div>

      </section>


      {/* Barbers */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-20">

        <div className="mb-10">

          <p className="text-[#C0A790] uppercase tracking-[3px] font-semibold mb-3">
            Barbers
          </p>

          <h2 className="text-4xl md:text-5xl font-black">
            Choose Barber
          </h2>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {barbers.map((barber) => (

            <div
              key={barber.name}
              onClick={() => setSelectedBarber(barber.name)}
              className={`rounded-[35px] overflow-hidden border cursor-pointer transition ${
                selectedBarber === barber.name
                  ? "border-[#C0A790]"
                  : "border-[#433E3B] hover:border-[#C0A790]"
              }`}
            >

              <img
                src={barber.image}
                alt={barber.name}
                className="w-full h-[380px] object-cover"
              />

              <div className="bg-[#1A1918] p-7">

                <h3 className="text-3xl font-black">
                  {barber.name}
                </h3>

                <p className="text-[#A8A29E] mt-3">
                  Professional Barber
                </p>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* Date & Time */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-20">

        <div className="mb-10">

          <p className="text-[#C0A790] uppercase tracking-[3px] font-semibold mb-3">
            Schedule
          </p>

          <h2 className="text-4xl md:text-5xl font-black">
            Select Date & Time
          </h2>

        </div>

        <div className="bg-[#1A1918] border border-[#433E3B] rounded-[35px] p-8">

          {/* Calendar */}
          <div className="bg-[#060707] border border-[#433E3B] rounded-[30px] p-6">

            <Calendar
              onChange={(value) => setSelectedDate(value as Date)}
              value={selectedDate}
              className="w-full"
            />

          </div>

          {/* Time */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

            {timings.map((time) => (

              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`py-5 rounded-2xl font-bold transition ${
                  selectedTime === time
                    ? "bg-[#E8D9BF] text-black"
                    : "border border-[#433E3B] hover:border-[#C0A790]"
                }`}
              >
                {time}
              </button>

            ))}

          </div>

        </div>

      </section>


      {/* Booking */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-20">

        <div className="bg-[#1A1918] border border-[#433E3B] rounded-[35px] p-10 text-center">

          <p className="text-[#C0A790] uppercase tracking-[3px] font-semibold mb-4">
            Ready To Book?
          </p>

          <h2 className="text-4xl md:text-6xl font-black leading-tight">

            Confirm Your
            <br />

            Appointment

          </h2>

          <div className="mt-10">

            <p className="text-[#A8A29E] text-lg">
              Total Amount
            </p>

            <h2 className="text-5xl font-black text-[#C0A790] mt-3">
              Rs {totalAmount}
            </h2>

          </div>

          <button
            onClick={handleBooking}
            className="mt-10 bg-[#E8D9BF] hover:bg-[#C0A790] transition text-black px-12 py-5 rounded-2xl text-xl font-black"
          >
            Confirm Booking
          </button>

        </div>

      </section>


      {/* Offers */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-20">

        <div className="mb-10">

          <p className="text-[#C0A790] uppercase tracking-[3px] font-semibold mb-3">
            Offers
          </p>

          <h2 className="text-4xl md:text-5xl font-black">
            Latest Offers
          </h2>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-[#1A1918] border border-[#433E3B] rounded-[35px] p-10">

            <p className="text-[#C0A790] font-semibold">
              LIMITED OFFER
            </p>

            <h3 className="text-4xl font-black mt-5">
              Hair Cut + Beard
            </h3>

            <p className="text-[#A8A29E] mt-5 text-lg leading-8">
              Premium grooming package with discounted pricing.
            </p>

          </div>

          <div className="bg-[#1A1918] border border-[#433E3B] rounded-[35px] p-10">

            <p className="text-[#C0A790] font-semibold">
              PREMIUM PACKAGE
            </p>

            <h3 className="text-4xl font-black mt-5">
              Full Grooming
            </h3>

            <p className="text-[#A8A29E] mt-5 text-lg leading-8">
              Facial, massage and premium styling package.
            </p>

          </div>

        </div>

      </section>


      {/* Reviews */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-20">

        <div className="mb-10">

          <p className="text-[#C0A790] uppercase tracking-[3px] font-semibold mb-3">
            Reviews
          </p>

          <h2 className="text-4xl md:text-5xl font-black">
            Customer Reviews
          </h2>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {[
            "Excellent service and premium environment.",
            "Best barber experience in the city.",
            "Professional staff and luxury feel."
          ].map((review, index) => (

            <div
              key={index}
              className="bg-[#1A1918] border border-[#433E3B] rounded-[35px] p-8"
            >

              <p className="text-[#C0A790] text-2xl">
                ★★★★★
              </p>

              <p className="text-[#A8A29E] text-lg leading-9 mt-6">
                {review}
              </p>

            </div>

          ))}

        </div>

      </section>


      {/* Contact */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-28">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          <div className="bg-[#1A1918] border border-[#433E3B] rounded-[35px] p-10">

            <p className="text-[#C0A790] uppercase tracking-[3px] font-semibold mb-3">
              Contact
            </p>

            <h2 className="text-4xl font-black">
              Contact Details
            </h2>

            <div className="space-y-6 mt-10 text-lg">

              <p>
                📍 Karachi, Pakistan
              </p>

              <p>
                📞 +92 300 1234567
              </p>

              <p>
                ✉️ contact@trimbook.com
              </p>

            </div>

          </div>

          <div className="overflow-hidden rounded-[35px] border border-[#433E3B]">

            <iframe
              src="https://maps.google.com/maps?q=karachi&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full min-h-[400px]"
              loading="lazy"
            ></iframe>

          </div>

        </div>

      </section>

    </main>

  );

}