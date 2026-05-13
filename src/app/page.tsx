"use client";

import { useEffect, useState } from "react";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

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
  "10:30 AM",

  "11:00 AM",
  "11:30 AM",

  "12:00 PM",
  "12:30 PM",

  "1:00 PM",
  "1:30 PM",

  "2:00 PM",
  "2:30 PM",

  "3:00 PM",
  "3:30 PM",

  "4:00 PM",
  "4:30 PM",

  "5:00 PM",
  "5:30 PM",

  "6:00 PM",
  "6:30 PM",

  "7:00 PM",
  "7:30 PM",

  "8:00 PM",
  "8:30 PM",

  "9:00 PM",
  "9:30 PM",

  "10:00 PM",

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

        const bookingDateTime = new Date(
          `${booking.date} ${booking.time}`
        );

        const now = new Date();

        if (

          booking.barber === selectedBarber &&

          booking.date ===
            selectedDate.toDateString() &&

          bookingDateTime > now

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

    if (selectedServices.length === 0) {

      setSuccessMessage(
        "Please select at least one service."
      );

      return;
    }

    if (!selectedBarber) {

      setSuccessMessage(
        "Please choose a barber."
      );

      return;
    }

    if (!selectedTime) {

      setSuccessMessage(
        "Please select appointment time."
      );

      return;
    }

    if (!customerName) {

      setSuccessMessage(
        "Please enter your name."
      );

      return;
    }

    if (!customerPhone) {

  setSuccessMessage(
    "Please enter phone number."
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

    <main className="bg-[#050505] text-white min-h-screen overflow-hidden">


      {/* NAVBAR */}

      <nav className="border-b border-[#2B2825] sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-2xl">

        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-center">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#E4BE88] to-[#8B5E34] flex items-center justify-center shadow-[0_0_30px_rgba(228,190,136,0.25)]">

              <Scissors
                className="w-5 h-5 text-black"
                strokeWidth={2.5}
              />

            </div>

            <div className="text-left">

              <h1 className="text-[24px] leading-none font-black tracking-wide text-white">

                Trim<span className="text-[#E4BE88]">Book</span>

              </h1>

              <p className="text-[8px] uppercase tracking-[4px] text-[#8B7355] mt-1">

                Premium Barber Booking

              </p>

            </div>

          </div>

        </div>

      </nav>


      {/* HERO */}

      <section
  className="relative overflow-hidden bg-cover bg-center"
  style={{
    backgroundImage:
      "url('/barber-bg.jpg')",
  }}
>

        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative max-w-7xl mx-auto px-5 pt-14 pb-14 text-center">

          <div className="w-20 h-20 mx-auto rounded-full border border-[#E4BE88]/40 bg-[#111111]/70 backdrop-blur-xl flex items-center justify-center shadow-[0_0_40px_rgba(228,190,136,0.15)] mb-6">

            <Scissors
              className="w-8 h-8 text-[#E4BE88]"
              strokeWidth={2.2}
            />

          </div>

          <p className="text-[#E4BE88] uppercase tracking-[5px] font-semibold text-[9px] mb-5">

            Premium Barber Booking

          </p>

          <h1 className="text-[40px] leading-[42px] md:text-[52px] md:leading-[52px] font-black tracking-tight text-white">

            Book Your

            <span className="block text-[#E4BE88] mt-1">

              Appointment

            </span>

          </h1>

          <div className="w-16 h-[2px] bg-[#E4BE88] mx-auto mt-6 mb-6 rounded-full"></div>

          <p className="text-[#A1A1AA] text-[14px] leading-7 max-w-md mx-auto font-medium">

            Select services, choose barber and confirm your booking instantly.

          </p>

        </div>

      </section>


      {/* SERVICES */}

      <section className="max-w-5xl mx-auto px-4 pb-14">

        <div className="text-center mb-8">

          <p className="text-[#E4BE88] uppercase tracking-[5px] font-semibold text-[9px] mb-3">

            Services

          </p>

          <h2 className="text-[24px] leading-[28px] md:text-[38px] md:leading-[40px] font-black text-white">

            Select Services

          </h2>

          <div className="w-14 h-[2px] bg-[#E4BE88] mx-auto mt-4 rounded-full"></div>

        </div>

        <div className="space-y-4">

          {services.map((service) => (

            <button
              key={service.name}
              onClick={() => toggleService(service.name)}
              className={`w-full rounded-[26px] border transition-all duration-300 p-4 flex items-center justify-between shadow-2xl

              ${
                selectedServices.includes(service.name)

                  ? "bg-gradient-to-br from-[#2A241D] to-[#141414] border-[#E4BE88] scale-[1.01]"

                  : "bg-gradient-to-br from-[#161616] to-[#0E0E0E] border-[#2B2825] hover:border-[#E4BE88]"
              }`}
            >

              <div className="flex items-center gap-3 min-w-0">

                <div className="w-14 h-14 rounded-full border border-[#3A332B] bg-[#1C1B1A] flex items-center justify-center shrink-0 shadow-inner">

                  <service.icon
                    className="w-6 h-6 text-[#E4BE88]"
                    strokeWidth={2.2}
                  />

                </div>

                <div className="text-left min-w-0">

                  <h3 className="text-[18px] md:text-[24px] leading-none font-black text-white truncate">

                    {service.name}

                  </h3>

                  <p className="text-[#A1A1AA] mt-2 text-[12px] truncate">

                    Premium Grooming

                  </p>

                </div>

              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">

                <p className="text-[15px] md:text-[18px] leading-[20px] font-black text-[#E4BE88] whitespace-nowrap text-right">

                  {service.price}

                </p>

                <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-base font-black transition-all

                ${
                  selectedServices.includes(service.name)

                    ? "bg-[#E4BE88] border-[#E4BE88] text-black"

                    : "border-[#6B5A45] text-[#E4BE88]"
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

      <section className="max-w-5xl mx-auto px-4 pb-14">

        <div className="text-center mb-8">

          <p className="text-[#E4BE88] uppercase tracking-[5px] font-semibold text-[9px] mb-3">

            Barbers

          </p>

          <h2 className="text-[24px] leading-[28px] md:text-[38px] md:leading-[40px] font-black text-white">

            Choose Your Barber

          </h2>

          <div className="w-14 h-[2px] bg-[#E4BE88] mx-auto mt-4 rounded-full"></div>

        </div>

        <div className="space-y-4">

          {barbers.map((barber) => (

            <button
              key={barber.name}
              onClick={() => setSelectedBarber(barber.name)}
              className={`w-full rounded-[26px] border transition-all duration-300 p-4 flex items-center justify-between shadow-2xl

              ${
                selectedBarber === barber.name

                  ? "bg-gradient-to-br from-[#2A241D] to-[#141414] border-[#E4BE88] scale-[1.01]"

                  : "bg-gradient-to-br from-[#161616] to-[#0E0E0E] border-[#2B2825] hover:border-[#E4BE88]"
              }`}
            >

              <div className="flex items-center gap-3 min-w-0">

                <img
                  src={barber.image}
                  alt={barber.name}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border border-[#E4BE88]/40"
                />

                <div className="text-left min-w-0">

                  <h3 className="text-[18px] md:text-[24px] leading-none font-black text-white">

                    {barber.name}

                  </h3>

                  <p className="text-[#A1A1AA] mt-2 text-[12px]">

                    Senior Barber

                  </p>

                  <div className="flex items-center gap-2 mt-2 text-[#E4BE88] text-xs font-semibold">

                    ★ 4.9 (120+)

                  </div>

                </div>

              </div>

              <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-base font-black transition-all

              ${
                selectedBarber === barber.name

                  ? "bg-[#E4BE88] border-[#E4BE88] text-black"

                  : "border-[#6B5A45] text-[#E4BE88]"
              }`}>

                {selectedBarber === barber.name
                  ? "✓"
                  : "+"}

              </div>

            </button>

          ))}

        </div>

      </section>


      {/* DATE */}

      <section className="max-w-5xl mx-auto px-4 pb-14">

        <div className="text-center mb-8">

          <p className="text-[#E4BE88] uppercase tracking-[5px] font-semibold text-[9px] mb-3">

            Schedule

          </p>

          <h2 className="text-[24px] leading-[28px] md:text-[38px] md:leading-[40px] font-black text-white">

            Select Date & Time

          </h2>

          <div className="w-14 h-[2px] bg-[#E4BE88] mx-auto mt-4 rounded-full"></div>

        </div>

        <div className="bg-gradient-to-br from-[#161616] to-[#0D0D0D] border border-[#2B2825] rounded-[26px] p-4">

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

              const now = new Date();

              const convertTo24Hour = (time12h: string) => {

                const [time, modifier] =
                  time12h.split(" ");

                let [hours, minutes] =
                  time.split(":");

                if (hours === "12") {
                  hours = "00";
                }

                if (modifier === "PM") {
                  hours =
                    (
                      parseInt(hours, 10) + 12
                    ).toString();
                }

                return `${hours}:${minutes}`;

              };

              const slotTime =
                convertTo24Hour(time);

              const currentTime =
                `${String(now.getHours()).padStart(2, "0")}:${String(
                  now.getMinutes()
                ).padStart(2, "0")}`;

              const isPastTime =

                selectedDate.toDateString() ===
                  now.toDateString() &&

                slotTime < currentTime;

              return (

                <button
                  key={time}
                  disabled={isBooked || isPastTime}
                  onClick={() =>
                    setSelectedTime(time)
                  }
                  className={`py-4 text-[13px] rounded-2xl font-bold transition border

                  ${
                    isBooked || isPastTime

                      ? "bg-[#302E2D] text-[#666] border-[#302E2D] opacity-40 cursor-not-allowed"

                      : selectedTime === time

                      ? "bg-[#E4BE88] text-black border-[#E4BE88]"

                      : "border-[#433E3B] hover:border-[#E4BE88]"
                  }`}
                >

                  {isBooked
                    ? `${time} • Booked`

                    : isPastTime
                    ? `${time} • Closed`

                    : time}

                </button>

              );

            })}

          </div>

        </div>

      </section>


      {/* DETAILS */}

      <section className="max-w-5xl mx-auto px-4 pb-14">

        <div className="text-center mb-8">

          <p className="text-[#E4BE88] uppercase tracking-[5px] font-semibold text-[9px] mb-3">

            Customer

          </p>

          <h2 className="text-[24px] leading-[28px] md:text-[38px] md:leading-[40px] font-black text-white">

            Your Details

          </h2>

          <div className="w-14 h-[2px] bg-[#E4BE88] mx-auto mt-4 rounded-full"></div>

        </div>

        <div className="bg-gradient-to-br from-[#161616] to-[#0D0D0D] border border-[#2B2825] rounded-[26px] p-4 space-y-4">

          <input
            type="text"
            placeholder="Your Name"
            value={customerName}
            onChange={(e) =>
              setCustomerName(e.target.value)
            }
            className="w-full bg-[#090909] border border-[#2B2825] rounded-2xl px-5 py-4 outline-none focus:border-[#E4BE88]"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={customerPhone}
            onChange={(e) =>
              setCustomerPhone(
                e.target.value.replace(/[^0-9]/g, "")
              )
            }
            className="w-full bg-[#090909] border border-[#2B2825] rounded-2xl px-5 py-4 outline-none focus:border-[#E4BE88]"
          />

          <textarea
            placeholder="Notes (Optional)"
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
            className="w-full bg-[#090909] border border-[#2B2825] rounded-2xl px-5 py-4 outline-none focus:border-[#E4BE88] min-h-[110px]"
          />

        </div>

      </section>


      {/* BOOKING */}

      <section className="max-w-5xl mx-auto px-4 pb-20">

        <div className="bg-gradient-to-br from-[#161616] to-[#0D0D0D] border border-[#2B2825] rounded-[26px] p-5 text-center">

          <p className="text-[#E4BE88] uppercase tracking-[5px] font-semibold mb-4 text-[9px]">

            Ready To Book?

          </p>

          <h2 className="text-[34px] leading-[36px] md:text-[42px] md:leading-[44px] font-black text-white">

            Confirm Your
            <br />

            Appointment

          </h2>

          <div className="mt-7">

            <p className="text-[#A1A1AA] text-sm">
              Total Amount
            </p>

            <h2 className="text-4xl md:text-5xl font-black text-[#E4BE88] mt-3">
              Rs {totalAmount}
            </h2>

          </div>

          <button
            onClick={handleBooking}
            disabled={loading}
            className="mt-7 w-full bg-[#E4BE88] hover:bg-[#D6A96A] transition-all duration-300 text-black px-8 py-4 rounded-2xl text-base font-black flex items-center justify-center gap-3 disabled:opacity-60"
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

            <div className="mt-5 bg-[#090909] border border-[#E4BE88] rounded-2xl p-5 text-center">

              <h3 className="text-[#E4BE88] font-black text-base mb-3">

                Appointment Status

              </h3>

              <p className="text-[#F5F5F5] leading-7 whitespace-pre-line text-sm">

                {successMessage}

              </p>

            </div>

          )}

        </div>

      </section>
    {/* CONTACT */}

<section className="max-w-5xl mx-auto px-4 pb-20">

  <div className="bg-gradient-to-br from-[#161616] to-[#0D0D0D] border border-[#2B2825] rounded-[26px] overflow-hidden">

    <div className="p-6 text-center">

      <p className="text-[#E4BE88] uppercase tracking-[5px] font-semibold text-[9px] mb-4">

        Contact & Location

      </p>

      <h2 className="text-[26px] leading-[30px] md:text-[40px] md:leading-[42px] font-black text-white">

        Visit Our Studio

      </h2>

      <div className="w-14 h-[2px] bg-[#E4BE88] mx-auto mt-5 rounded-full"></div>

    </div>

    <div className="px-6 pb-6 space-y-5">

      <div className="bg-[#090909] border border-[#2B2825] rounded-2xl p-5">

        <p className="text-[#E4BE88] text-sm font-bold mb-2">

          Address

        </p>

        <p className="text-[#A1A1AA] leading-7 text-sm">

          Tariq Road, Karachi, Pakistan

        </p>

      </div>

      <div className="bg-[#090909] border border-[#2B2825] rounded-2xl p-5">

        <p className="text-[#E4BE88] text-sm font-bold mb-2">

          Contact

        </p>

        <p className="text-[#A1A1AA] leading-7 text-sm">

          +92 334 3447256

        </p>

      </div>

      <div className="rounded-2xl overflow-hidden border border-[#2B2825]">

        <iframe
          src="https://www.google.com/maps?q=Tariq+Road+Karachi&output=embed"
          width="100%"
          height="260"
          loading="lazy"
          className="w-full"
        ></iframe>

      </div>

    </div>

  </div>

</section>


</main>
    
  );

}