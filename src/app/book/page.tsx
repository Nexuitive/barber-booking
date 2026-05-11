"use client";

import { useState } from "react";

import {
  collection,
  addDoc,
} from "firebase/firestore";

import { db } from "../firebase";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function BookingPage() {

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedBarber, setSelectedBarber] = useState("Ahmed");
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [bookingSuccess, setBookingSuccess] = useState(false);

  const services = [
    {
      name: "Hair Cut",
      price: 800,
      icon: "✂️",
      description: "Modern styling and premium finishing.",
    },

    {
      name: "Beard Trim",
      price: 500,
      icon: "🧔",
      description: "Sharp beard shaping and styling.",
    },

    {
      name: "Facial",
      price: 2500,
      icon: "✨",
      description: "Luxury skincare and glow treatment.",
    },

    {
      name: "Massage",
      price: 3000,
      icon: "💆",
      description: "Relaxing head and shoulder massage.",
    },
  ];

  const timeSlots = [
    { time: "10:00 AM", available: true },
    { time: "11:00 AM", available: true },
    { time: "12:00 PM", available: false },
    { time: "1:00 PM", available: true },
    { time: "2:00 PM", available: false },
    { time: "3:00 PM", available: true },
    { time: "4:00 PM", available: true },
    { time: "5:00 PM", available: false },
    { time: "6:00 PM", available: true },
    { time: "7:00 PM", available: true },
  ];

  const toggleService = (service: string) => {

    if (selectedServices.includes(service)) {

      setSelectedServices(
        selectedServices.filter((item) => item !== service)
      );

    } else {

      setSelectedServices([...selectedServices, service]);

    }
  };

  const totalPrice = services
    .filter((service) =>
      selectedServices.includes(service.name)
    )
    .reduce((total, service) => total + service.price, 0);

  const handleBooking = async () => {

    if (
      selectedServices.length === 0 ||
      !customerName ||
      !customerPhone
    ) {
      alert("Please complete all booking details.");
      return;
    }

    try {

      await addDoc(collection(db, "bookings"), {

        customerName,
        customerPhone,

        selectedServices,

        selectedBarber,

        selectedDate:
          selectedDate.toDateString(),

        selectedTime,

        totalPrice,

        createdAt:
          new Date().toISOString(),

      });

      setBookingSuccess(true);

      alert("Booking Saved Successfully!");

    } catch (error) {

      console.log(error);

      alert("Something went wrong");

    }

  };

  return (
    <main className="min-h-screen bg-[#f4f5f7] px-4 sm:px-6 py-10 sm:py-14">

      <div className="max-w-7xl mx-auto">

        {/* Success Popup */}
        {bookingSuccess && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">

            <div className="bg-white rounded-[35px] p-8 sm:p-10 max-w-md w-full text-center shadow-2xl">

              <div className="w-24 h-24 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-5xl mx-auto">
                ✓
              </div>

              <h2 className="text-3xl font-black text-[#111] mt-6">
                Booking Confirmed
              </h2>

              <p className="text-[#555] mt-4 leading-8">
                Your appointment has been successfully booked.
              </p>

              <button
                onClick={() => setBookingSuccess(false)}
                className="w-full mt-8 bg-purple-600 hover:bg-purple-700 transition text-white py-4 rounded-2xl font-bold"
              >
                Close
              </button>

            </div>

          </div>

        )}

        {/* Header */}
        <div className="text-center">

          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-5 py-2 rounded-full text-sm font-semibold mb-6">
            Premium Booking Experience
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#111] leading-tight">
            Book Your Appointment
          </h1>

          <p className="text-[#555] mt-5 text-base sm:text-lg max-w-3xl mx-auto leading-8">
            Choose services, barber, date and available time slot instantly.
          </p>

        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-12">

          {/* Left Side */}
          <div className="xl:col-span-2 space-y-8">

            {/* Services */}
            <div className="bg-white rounded-[35px] border border-gray-200 p-6 sm:p-8 shadow-lg">

              <div className="flex items-center justify-between flex-wrap gap-4 mb-8">

                <h2 className="text-3xl font-black text-[#111]">
                  Select Services
                </h2>

                <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
                  Multi Select Enabled
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {services.map((service) => (

                  <button
                    key={service.name}
                    onClick={() => toggleService(service.name)}
                    className={`rounded-3xl p-6 text-left transition border-2 hover:-translate-y-1 ${
                      selectedServices.includes(service.name)
                        ? "border-purple-600 bg-purple-50 shadow-lg shadow-purple-100"
                        : "border-gray-200 bg-white hover:border-purple-400"
                    }`}
                  >

                    <div className="flex items-center justify-between">

                      <div className="text-4xl">
                        {service.icon}
                      </div>

                      {selectedServices.includes(service.name) && (

                        <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                          ✓
                        </div>

                      )}

                    </div>

                    <h3 className="text-2xl font-bold text-[#111] mt-5">
                      {service.name}
                    </h3>

                    <p className="text-[#555] mt-3 leading-7">
                      {service.description}
                    </p>

                    <p className="text-purple-600 font-black text-2xl mt-6">
                      Rs {service.price}
                    </p>

                  </button>

                ))}

              </div>

            </div>

            {/* Barber */}
            <div className="bg-white rounded-[35px] border border-gray-200 p-6 sm:p-8 shadow-lg">

              <h2 className="text-3xl font-black text-[#111] mb-8">
                Choose Barber
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

                {["Ahmed", "Ali", "Danish"].map((barber) => (

                  <div
                    key={barber}
                    onClick={() => setSelectedBarber(barber)}
                    className={`rounded-3xl p-6 cursor-pointer transition border-2 hover:-translate-y-1 ${
                      selectedBarber === barber
                        ? "border-purple-600 bg-purple-50 shadow-lg shadow-purple-100"
                        : "border-gray-200 bg-white hover:border-purple-400"
                    }`}
                  >

                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 mb-5"></div>

                    <h3 className="text-2xl font-bold text-[#111]">
                      {barber}
                    </h3>

                    <p className="text-[#555] mt-2">
                      Professional Barber
                    </p>

                  </div>

                ))}

              </div>

            </div>

            {/* Calendar */}
            <div className="bg-white rounded-[35px] border border-gray-200 p-6 sm:p-8 shadow-lg">

              <h2 className="text-3xl font-black text-[#111] mb-8">
                Select Date
              </h2>

              <div className="bg-[#f8f8fa] rounded-[30px] p-6">

                <Calendar
                  onChange={(value) => setSelectedDate(value as Date)}
                  value={selectedDate}
                  className="rounded-3xl w-full"
                />

              </div>

            </div>

            {/* Time Slots */}
            <div className="bg-white rounded-[35px] border border-gray-200 p-6 sm:p-8 shadow-lg">

              <div className="flex items-center justify-between flex-wrap gap-4 mb-8">

                <h2 className="text-3xl font-black text-[#111]">
                  Time Slots
                </h2>

                <div className="flex items-center gap-4 text-sm">

                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-purple-600"></div>

                    <span className="text-[#555]">
                      Available
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gray-300"></div>

                    <span className="text-[#555]">
                      Unavailable
                    </span>
                  </div>

                </div>

              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">

                {timeSlots.map((slot) => (

                  <button
                    key={slot.time}
                    disabled={!slot.available}
                    onClick={() =>
                      slot.available && setSelectedTime(slot.time)
                    }
                    className={`rounded-2xl py-5 font-bold transition ${
                      !slot.available
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                        : selectedTime === slot.time
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                        : "bg-white border border-gray-300 text-[#111] hover:border-purple-500"
                    }`}
                  >
                    {slot.time}
                  </button>

                ))}

              </div>

            </div>

            {/* Customer Details */}
            <div className="bg-white rounded-[35px] border border-gray-200 p-6 sm:p-8 shadow-lg">

              <h2 className="text-3xl font-black text-[#111] mb-8">
                Your Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <input
                  type="text"
                  placeholder="Full Name"
                  value={customerName}
                  onChange={(e) =>
                    setCustomerName(e.target.value)
                  }
                  className="border border-gray-300 rounded-2xl px-5 py-5 outline-none focus:border-purple-500 text-base text-[#111] placeholder:text-gray-400 bg-white"
                />

                <input
                  type="text"
                  placeholder="Phone Number"
                  value={customerPhone}
                  onChange={(e) =>
                    setCustomerPhone(e.target.value)
                  }
                  className="border border-gray-300 rounded-2xl px-5 py-5 outline-none focus:border-purple-500 text-base text-[#111] placeholder:text-gray-400 bg-white"
                />

              </div>

            </div>

          </div>

          {/* Right Summary */}
          <div>

            <div className="bg-white rounded-[35px] border border-gray-200 p-6 sm:p-8 shadow-xl sticky top-28">

              <h2 className="text-3xl font-black text-[#111] mb-8">
                Booking Summary
              </h2>

              <div className="space-y-6">

                <div>

                  <p className="text-sm text-[#777] font-semibold uppercase tracking-wide">
                    Services
                  </p>

                  <p className="text-lg font-bold text-[#111] mt-2 leading-8">
                    {selectedServices.length > 0
                      ? selectedServices.join(", ")
                      : "No Service Selected"}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-[#777] font-semibold uppercase tracking-wide">
                    Barber
                  </p>

                  <p className="text-lg font-bold text-[#111] mt-2">
                    {selectedBarber}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-[#777] font-semibold uppercase tracking-wide">
                    Date
                  </p>

                  <p className="text-lg font-bold text-[#111] mt-2">
                    {selectedDate.toDateString()}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-[#777] font-semibold uppercase tracking-wide">
                    Time
                  </p>

                  <p className="text-lg font-bold text-[#111] mt-2">
                    {selectedTime}
                  </p>

                </div>

                <div className="border-t border-gray-200 pt-6">

                  <div className="flex items-center justify-between">

                    <p className="text-xl font-bold text-[#111]">
                      Total
                    </p>

                    <p className="text-3xl font-black text-purple-600">
                      Rs {totalPrice}
                    </p>

                  </div>

                </div>

                <button
                  onClick={handleBooking}
                  className="w-full bg-purple-600 hover:bg-purple-700 transition text-white py-5 rounded-2xl text-lg font-black shadow-xl shadow-purple-200 mt-4"
                >
                  Confirm Booking
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}