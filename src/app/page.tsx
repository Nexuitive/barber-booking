"use client";

import { useEffect, useState } from "react";

import {
  Loader2,
  Scissors,
  Sparkles,
  SprayCan,
  VenetianMask,
  BadgeCent,
} from "lucide-react";

import {
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";

import { db } from "./firebase";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function Home() {

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedBarber, setSelectedBarber] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [bookedSlots, setBookedSlots] =
    useState<string[]>([]);

  const services = [
    {
      name: "Hair Cut",
      price: "Rs 800",
      icon: Scissors,
    },

    {
      name: "Shaving",
      price: "Rs 500",
      icon: VenetianMask,
    },

    {
      name: "Treatment",
      price: "Rs 2500",
      icon: SprayCan,
    },

    {
      name: "Beard Care",
      price: "Rs 1200",
      icon: BadgeCent,
    },

    {
      name: "Hair Style",
      price: "Rs 1800",
      icon: Sparkles,
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

  useEffect(() => {

    const fetchBookings = async () => {

      if (!selectedBarber) return;

      const snapshot = await getDocs(
        collection(db, "bookings")
      );

      const slots: string[] = [];

      snapshot.forEach((doc) => {

        const booking = doc.data();

        if (

          booking.barber === selectedBarber &&

          booking.date ===
            selectedDate.toDateString()

        ) {

          slots.push(booking.time);

        }

      });

      setBookedSlots(slots);

    };

    fetchBookings();

  }, [selectedBarber, selectedDate]);

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
      !selectedTime ||
      !customerName ||
      !customerPhone
    ) {

      setSuccessMessage(
        "Please complete all booking details."
      );

      return;
    }

    if (customerPhone.length < 11) {

      setSuccessMessage(
        "Please enter a valid phone number."
      );

      return;

    }

    setLoading(true);

    try {

      await addDoc(collection(db, "bookings"), {

        customerName,
        customerPhone,
        notes,

        services: selectedServices,

        barber: selectedBarber,

        date:
          selectedDate.toDateString(),

        time: selectedTime,

        total: totalAmount,

        createdAt:
          new Date().toISOString(),

      });

      await fetch("/api/send-whatsapp", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({

          customerName,
          customerPhone,
          notes,

          services: selectedServices,

          barber: selectedBarber,

          date: selectedDate.toDateString(),

          time: selectedTime,

          total: totalAmount,

        }),

      });

      setSuccessMessage(

`Thank you ${customerName}!

Your appointment has been booked successfully.

Please reach at least 5 minutes before the appointment.`

      );

      setSelectedServices([]);
      setSelectedBarber("");
      setSelectedTime("");
      setCustomerName("");
      setCustomerPhone("");
      setNotes("");

    } catch (error) {

      console.log(error);

      setSuccessMessage(
        "Booking failed. Please try again."
      );

    } finally {

      setLoading(false);

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
              className={`w-full rounded-[24px] border transition-all duration-300 p-4 flex items-center justify-between ${
                selectedServices.includes(service.name)
                  ? "bg-[#302E2D] border-[#C0A790] scale-[1.01]"
                  : "bg-[#1A1918] border-[#433E3B] hover:border-[#C0A790]"
              }`}
            >

              <div className="flex items-center gap-3">

                <div className="w-14 h-14 rounded-2xl bg-[#302E2D] border border-[#433E3B] flex items-center justify-center">

                  <service.icon
                    className="w-7 h-7 text-[#C0A790]"
                    strokeWidth={2.2}
                  />

                </div>

                <div className="text-left">

                  <h3 className="text-[16px] md:text-2xl font-black">
                    {service.name}
                  </h3>

                  <p className="text-[#A8A29E] mt-1 text-xs md:text-base">
                    Premium Grooming Service
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <p className="text-lg md:text-2xl font-black text-[#C0A790]">
                  {service.price}
                </p>

                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-xl font-black transition ${
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

      <section className="max-w-5xl mx-auto px-4 md:px-12 pb-16 md:pb-20">

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
              className={`w-full rounded-[24px] border transition-all duration-300 p-3 flex items-center justify-between ${
                selectedBarber === barber.name
                  ? "bg-[#302E2D] border-[#C0A790] scale-[1.01]"
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

      <section className="max-w-5xl mx-auto px-4 md:px-12 pb-16 md:pb-20">

        <div className="mb-8">

          <p className="text-[#C0A790] uppercase tracking-[3px] font-semibold mb-3 text-[10px]">
            Schedule
          </p>

          <h2 className="text-[32px] leading-[36px] md:text-5xl font-black">
            Select Date & Time
          </h2>

        </div>

        <div className="bg-[#1A1918] border border-[#433E3B] rounded-[24px] p-4">

          <Calendar
            minDate={new Date()}
            onChange={(value) =>
              setSelectedDate(value as Date)
            }
            value={selectedDate}
          />

          <div className="grid grid-cols-2 gap-3 mt-6">

            {timings.map((time) => {

              const isBooked =
                bookedSlots.includes(time);

              return (

                <button
                  key={time}

                  disabled={isBooked}

                  onClick={() =>
                    setSelectedTime(time)
                  }

                  className={`py-3 text-sm rounded-2xl font-bold transition border

                  ${
                    isBooked
                      ? "bg-[#302E2D] text-[#666] border-[#302E2D] opacity-40 cursor-not-allowed"

                      : selectedTime === time

                      ? "bg-[#E8D9BF] text-black border-[#E8D9BF]"

                      : "border-[#433E3B] hover:border-[#C0A790]"
                  }`}
                >

                  {isBooked
                    ? `${time} • Booked`
                    : time}

                </button>

              );

            })}

          </div>

        </div>

      </section>


      {/* CUSTOMER DETAILS */}

      <section className="max-w-5xl mx-auto px-4 md:px-12 pb-16 md:pb-20">

        <div className="mb-8">

          <p className="text-[#C0A790] uppercase tracking-[3px] font-semibold mb-3 text-[10px]">
            Customer
          </p>

          <h2 className="text-[32px] leading-[36px] md:text-5xl font-black">
            Your Details
          </h2>

        </div>

        <div className="bg-[#1A1918] border border-[#433E3B] rounded-[24px] p-5 space-y-5">

          <input
            type="text"
            placeholder="Your Name"
            value={customerName}
            onChange={(e) =>
              setCustomerName(e.target.value)
            }
            className="w-full bg-[#060707] border border-[#433E3B] rounded-2xl px-5 py-4 outline-none focus:border-[#C0A790]"
          />

          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9+ ]*"
            placeholder="Phone Number"
            value={customerPhone}
            onChange={(e) => {

              const value =
                e.target.value.replace(/[^0-9+]/g, "");

              setCustomerPhone(value);

            }}
            className="w-full bg-[#060707] border border-[#433E3B] rounded-2xl px-5 py-4 outline-none focus:border-[#C0A790]"
          />

          <textarea
            placeholder="Notes (Optional)"
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
            className="w-full bg-[#060707] border border-[#433E3B] rounded-2xl px-5 py-4 outline-none focus:border-[#C0A790] min-h-[120px]"
          />

        </div>

      </section>


      {/* BOOKING */}

      <section className="max-w-5xl mx-auto px-4 md:px-12 pb-16 md:pb-20">

        <div className="bg-[#1A1918] border border-[#433E3B] rounded-[24px] p-6 text-center">

          <p className="text-[#C0A790] uppercase tracking-[3px] font-semibold mb-4 text-[10px]">
            Ready To Book?
          </p>

          <h2 className="text-[32px] leading-[36px] md:text-6xl font-black">

            Confirm Your
            <br />

            Appointment

          </h2>

          <div className="mt-8">

            <p className="text-[#A8A29E] text-base">
              Total Amount
            </p>

            <h2 className="text-3xl md:text-5xl font-black text-[#C0A790] mt-3">
              Rs {totalAmount}
            </h2>

          </div>

          <button
            onClick={handleBooking}
            disabled={loading}
            className="mt-8 w-full bg-[#E8D9BF] hover:bg-[#C0A790] transition-all duration-300 text-black px-8 py-4 rounded-2xl text-base font-black flex items-center justify-center gap-3 disabled:opacity-60 hover:scale-[1.02]"
          >

            {loading ? (

              <>

                <Loader2 className="animate-spin w-5 h-5" />

                Processing Booking...

              </>

            ) : (

              "Confirm Booking"

            )}

          </button>

          {successMessage && (

            <div className="mt-6 bg-[#060707] border border-[#C0A790] rounded-2xl p-5 text-center">

              <h3 className="text-[#C0A790] font-black text-lg mb-3">

                Appointment Status

              </h3>

              <p className="text-[#F5F5F5] leading-7 whitespace-pre-line">

                {successMessage}

              </p>

            </div>

          )}

        </div>

      </section>

    </main>

  );

}