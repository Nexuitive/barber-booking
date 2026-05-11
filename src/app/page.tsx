"use client";

import { useState } from "react";

import {
  collection,
  addDoc,
} from "firebase/firestore";

import { db } from "./firebase";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function Home() {

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

    <main className="bg-[#060707] text-[#F5F5F5] min-h-screen overflow-hidden">

      {/* NAVBAR */}

      <nav className="border-b border-[#433E3B] sticky top-0 z-50 bg-[#060707]/90 backdrop-blur-xl">

        <div className="max-w-7xl mx-auto px-4 md:px-12 py-5 flex items-center justify-center">

          <h1 className="text-2xl md:text-4xl font-black tracking-tight">
            Trim<span className="text-[#C0A790]">Book</span>
          </h1>

        </div>

      </nav>


      {/* HERO */}

      <section className="max-w-7xl mx-auto px-4 md:px-12 pt-10 pb-10 md:pt-20 md:pb-16 text-center">

        <p className="text-[#C0A790] uppercase tracking-[4px] font-semibold mb-4 text-[10px] md:text-sm">
          Premium Barber Booking
        </p>

        <h1 className="text-[42px] leading-[46px] md:text-7xl md:leading-[90px] font-black">

          Book Your
          <br />

          Appointment

        </h1>

        <p className="text-[#A8A29E] text-sm md:text-lg leading-7 md:leading-9 mt-5 max-w-3xl mx-auto">

          Select services, choose barber and confirm your booking instantly.

        </p>

      </section>


      {/* SERVICES */}

      <section className="max-w-5xl mx-auto px-4 md:px-12 pb-16 md:pb-20">

        <div className="mb-8">

          <p className="text-[#C0A790] uppercase tracking-[3px] font-semibold mb-3 text-[10px]">
            Services
          </p>

          <h2 className="text-[32px] leading-[36px] md:text-5xl font-black">
            Select Services
          </h2>

        </div>

        <div className="space-y-4">

          {services.map((service) => (

            <button
              key={service.name}
              onClick={() => toggleService(service.name)}
              className={`w-full rounded-[24px] md:rounded-[35px] border transition p-3 md:p-6 flex items-center justify-between gap-2 ${
                selectedServices.includes(service.name)
                  ? "bg-[#302E2D] border-[#C0A790]"
                  : "bg-[#1A1918] border-[#433E3B] hover:border-[#C0A790]"
              }`}
            >

              <div className="flex items-center gap-3">

                <div className="text-xl md:text-4xl">
                  {service.icon}
                </div>

                <div className="text-left">

                  <h3 className="text-[15px] leading-[18px] md:text-2xl font-black">
                    {service.name}
                  </h3>

                  <p className="text-[#A8A29E] mt-1 text-[11px] leading-[16px] md:text-base">
                    Premium Grooming Service
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-2">

                <p className="text-[14px] leading-[18px] md:text-2xl font-black text-[#C0A790]">
                  {service.price}
                </p>

                <div className={`w-7 h-7 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-xl font-black ${
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


      {/* BARBERS */}

      <section className="max-w-7xl mx-auto px-4 md:px-12 pb-16 md:pb-20">

        <div className="mb-8">

          <p className="text-[#C0A790] uppercase tracking-[3px] font-semibold mb-3 text-[10px]">
            Barbers
          </p>

          <h2 className="text-[32px] leading-[36px] md:text-5xl font-black">
            Choose Barber
          </h2>

        </div>

        <div className="space-y-4">

          {barbers.map((barber) => (

            <button
  key={barber.name}
  onClick={() => setSelectedBarber(barber.name)}
  className={`w-full rounded-[24px] border transition p-3 flex items-center justify-between ${
    selectedBarber === barber.name
      ? "bg-[#302E2D] border-[#C0A790]"
      : "bg-[#1A1918] border-[#433E3B] hover:border-[#C0A790]"
  }`}
>

  <div className="flex items-center gap-3">

    <img
      src={barber.image}
      alt={barber.name}
      className="w-20 h-20 rounded-2xl object-cover"
    />

    <div className="text-left">

      <h3 className="text-lg font-black">
        {barber.name}
      </h3>

      <p className="text-[#A8A29E] text-xs mt-1">
        Professional Barber
      </p>

      <div className="flex items-center gap-1 mt-2 text-[#C0A790] text-sm">
        ★★★★★
      </div>

    </div>

  </div>

  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${
    selectedBarber === barber.name
      ? "bg-[#E8D9BF] text-black"
      : "bg-[#302E2D]"
  }`}>

    {selectedBarber === barber.name
      ? "✓"
      : "+"}

  </div>

</button>

          ))}

        </div>

      </section>


      {/* DATE & TIME */}

      <section className="max-w-7xl mx-auto px-4 md:px-12 pb-16 md:pb-20">

        <div className="mb-8">

          <p className="text-[#C0A790] uppercase tracking-[3px] font-semibold mb-3 text-[10px]">
            Schedule
          </p>

          <h2 className="text-[32px] leading-[36px] md:text-5xl font-black">
            Select Date & Time
          </h2>

        </div>

        <div className="bg-[#1A1918] border border-[#433E3B] rounded-[24px] md:rounded-[35px] p-4 md:p-8">

          <div className="bg-[#060707] border border-[#433E3B] rounded-[24px] md:rounded-[30px] p-2 md:p-6">

            <Calendar
              onChange={(value) => setSelectedDate(value as Date)}
              value={selectedDate}
              className="w-full"
            />

          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">

            {timings.map((time) => (

              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`py-3 md:py-5 text-sm md:text-base rounded-2xl font-bold transition ${
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


      {/* BOOKING */}

      <section className="max-w-7xl mx-auto px-4 md:px-12 pb-16 md:pb-20">

        <div className="bg-[#1A1918] border border-[#433E3B] rounded-[24px] md:rounded-[35px] p-6 md:p-10 text-center">

          <p className="text-[#C0A790] uppercase tracking-[3px] font-semibold mb-4 text-[10px]">
            Ready To Book?
          </p>

          <h2 className="text-[32px] leading-[36px] md:text-6xl font-black">

            Confirm Your
            <br />

            Appointment

          </h2>

          <div className="mt-8">

            <p className="text-[#A8A29E] text-base md:text-lg">
              Total Amount
            </p>

            <h2 className="text-3xl md:text-5xl font-black text-[#C0A790] mt-3">
              Rs {totalAmount}
            </h2>

          </div>

          <button
            onClick={handleBooking}
            className="mt-8 md:mt-10 w-full md:w-auto bg-[#E8D9BF] hover:bg-[#C0A790] transition text-black px-8 py-4 rounded-2xl text-base md:text-xl font-black"
          >
            Confirm Booking
          </button>

        </div>

      </section>


      {/* OFFERS */}

      <section className="max-w-7xl mx-auto px-4 md:px-12 pb-16 md:pb-20">

        <div className="mb-8">

          <p className="text-[#C0A790] uppercase tracking-[3px] font-semibold mb-3 text-[10px]">
            Offers
          </p>

          <h2 className="text-[32px] leading-[36px] md:text-5xl font-black">
            Latest Offers
          </h2>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div className="bg-[#1A1918] border border-[#433E3B] rounded-[24px] md:rounded-[35px] p-5 md:p-10">

            <p className="text-[#C0A790] font-semibold text-sm">
              LIMITED OFFER
            </p>

            <h3 className="text-2xl md:text-4xl font-black mt-5">
              Hair Cut + Beard
            </h3>

            <p className="text-[#A8A29E] mt-5 text-sm md:text-lg leading-7 md:leading-8">
              Premium grooming package with discounted pricing.
            </p>

          </div>

          <div className="bg-[#1A1918] border border-[#433E3B] rounded-[24px] md:rounded-[35px] p-5 md:p-10">

            <p className="text-[#C0A790] font-semibold text-sm">
              PREMIUM PACKAGE
            </p>

            <h3 className="text-2xl md:text-4xl font-black mt-5">
              Full Grooming
            </h3>

            <p className="text-[#A8A29E] mt-5 text-sm md:text-lg leading-7 md:leading-8">
              Facial, massage and premium styling package.
            </p>

          </div>

        </div>

      </section>


      {/* REVIEWS */}

      <section className="max-w-7xl mx-auto px-4 md:px-12 pb-16 md:pb-20">

        <div className="mb-8">

          <p className="text-[#C0A790] uppercase tracking-[3px] font-semibold mb-3 text-[10px]">
            Reviews
          </p>

          <h2 className="text-[32px] leading-[36px] md:text-5xl font-black">
            Customer Reviews
          </h2>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {[
            {
    name: "Ahsan",
    stars: 5,
    review:
      "Excellent service and premium environment.",
  },

  {
    name: "Hamza",
    stars: 4,
    review:
      "Best barber experience in the city.",
  },

  {
    name: "Usman",
    stars: 5,
    review:
      "Professional staff and luxury feel.",
  },
].map((item, index) => (

            <div
              key={index}
  className="bg-[#1A1918] border border-[#433E3B] rounded-[24px] md:rounded-[35px] p-5 md:p-8"
>

  <div className="flex items-center justify-between">

    <div>

      <h3 className="text-lg md:text-2xl font-black">
        {item.name}
      </h3>

      <div className="flex items-center gap-1 mt-2 text-[#C0A790] text-sm md:text-base">

        {"★".repeat(item.stars)}

      </div>

    </div>

    <div className="w-12 h-12 rounded-full bg-[#302E2D] flex items-center justify-center text-[#C0A790] font-black text-lg">

      {item.name.charAt(0)}

    </div>

  </div>

  <p className="text-[#A8A29E] text-sm md:text-lg leading-7 md:leading-9 mt-5">

    {item.review}

  </p>

</div>

          ))}

        </div>

      </section>


      {/* CONTACT */}

      <section className="max-w-7xl mx-auto px-4 md:px-12 pb-20 md:pb-28">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-10">

          <div className="bg-[#1A1918] border border-[#433E3B] rounded-[24px] md:rounded-[35px] p-5 md:p-10">

            <p className="text-[#C0A790] uppercase tracking-[3px] font-semibold mb-3 text-[10px]">
              Contact
            </p>

            <h2 className="text-[32px] leading-[36px] md:text-4xl font-black">
              Contact Details
            </h2>

            <div className="space-y-5 mt-8 text-sm md:text-lg">

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

          <div className="overflow-hidden rounded-[24px] md:rounded-[35px] border border-[#433E3B]">

            <iframe
              src="https://maps.google.com/maps?q=karachi&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full min-h-[250px] md:min-h-[400px]"
              loading="lazy"
            ></iframe>

          </div>

        </div>

      </section>

    </main>

  );

}