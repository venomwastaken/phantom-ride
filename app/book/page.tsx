"use client";

import Navbar from "@/components/shared/Navbar";
import BusLayout from "@/components/BusLayout";
import BookForm from "@/components/BookForm";
import { useSearchParams } from "next/navigation";
import { useBusContext } from "@/components/BusContext";
import { useEffect, useState } from "react";
import { formSchema, paymentFormSchema } from "@/lib/validator";
import { z } from "zod";
import { getSeats } from "@/lib/actions/bus.action";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PayDialog from "@/components/PayDialog";
import { initializePayment } from "@/lib/actions/paymentPayaza.actions";

export default function Book() {
  const {
    setTakenSeats,
    selectedSeats,
    setSelectedSeats,
    isSubmitting,
    setIsSubmitting,
    setIsLoadingSeats,
    setBusId,
    busId,
  } = useBusContext();

  const searchParams = useSearchParams();
  const pickup = searchParams.get("pickup") || "";
  const date = searchParams.get("date") || "";

  const initialVals = {
    pickup: pickup ? pickup : "Accra",
    date: date ? date : "Saturday (24/05/2025)",
    fullName: "",
    email: "",
    phone: "",
    seats: "",
    agent: "",
    emergencyContactInfo: "",
    luggage: [],
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialVals,
  });

  const paymentForm = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      phoneNumber: "",
      network: "",
    },
  });

  const [step, setStep] = useState<number>(0);
  const totalSteps = 3;
  type BookingData = {
    pickup?: string;
    date?: string;
    location?: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    network?: string;
    busId?: string;
    seats?: string;
    agent?: string;
    emergencyContactInfo?: string;
    luggage?: string[];
    reference?: string;
    // add other fields as needed
  };

  const [data, setData] = useState<BookingData>({
    pickup: "",
    date: "",
    location: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    network: "",
    busId: "",
    seats: "",
    agent: "",
    emergencyContactInfo: "",
    luggage: [],
    reference: "",
  });
  const [isOther, setIsOther] = useState<boolean>(false);
  const [otherLocation, setOtherLocation] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
    const [luggagePrice, setLuggagePrice] = useState<number>(0);

  function generateReference() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let ref = "";
    for (let i = 0; i < 12; i++) {
      ref += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return ref;
  }

  const fetchSeats = async (pickup: string, date: string) => {
    setIsLoadingSeats(true); // Start loading
    try {
      const bus = await getSeats({
        pickup: pickup,
        date: date,
      });

      setTakenSeats(bus?.takenSeats || []);
      setPrice(bus?.price || 0);
      setBusId(bus?.busId);
    } catch (error) {
      console.error("Error fetching seats:", error);
    } finally {
      setIsLoadingSeats(false); // End loading
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  useEffect(() => {
    const pickupValue = form.watch("pickup");
    const dateValue = form.watch("date");
    setSelectedSeats([]);
    if (pickupValue && dateValue) {
      fetchSeats(pickupValue, dateValue);
    }
  }, [form.watch("pickup"), form.watch("date")]);

  const onSubmit = async (
    values: BookingData /*z.infer<typeof formSchema>*/
  ) => {
    values.location = isOther ? `Other: ${otherLocation}` : values.location;
    const reference = generateReference();

    if (step === 0) {
      setStep(step + 1);
      setData({
        ...values,
        reference: reference,
      });
      // await fetchSeats(values.pickup ?? "", values.date ?? "");

      setLuggagePrice(0);
      if (values.luggage?.includes("fridge")) {
        setLuggagePrice(prev => prev + 5);
      }
      if (values.luggage?.includes("microwave")) {
        setLuggagePrice(prev => prev + 5.5);
      }
      if (values.luggage?.includes("tv")) {
        setLuggagePrice(prev => prev + 6);
      }

    } else if (step === 1) {
      setStep(step + 1);
      setData({
        ...data,
        busId: busId,
        seats: selectedSeats.toString(),
      });
    } else {
      setData({
        ...data,
        busId: busId,
        seats: selectedSeats.toString(),
        phoneNumber: values.phoneNumber,
        network: values.network,
      });

      console.log("Final Data:", data);

      try {
        initializePayment({
          busId: busId,
          luggage: data.luggage ?? [],
          phoneNumber: values.phoneNumber ?? "",
          networkBankCode:
            values.network === "MTN"
              ? "MTN"
              : values.network === "Telecel Gh"
              ? "VOD"
              : "AIR",
          email: data.email ?? "",
          firstName: (data.fullName ?? "").split(" ")[0],
          lastName: (data.fullName ?? "").split(" ").slice(-1)[0],
          selectedSeats: data.seats ?? "",
          reference: data.reference ?? "",
        });

        // Send booking data to the server to create a pending booking via the API route
        const response = await fetch("/api/book", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Booking creation failed");
        }

        const bookingResponse = await response.json();
        console.log("Booking Response:", bookingResponse);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsSubmitting(false);
        setSelectedSeats([]);
        setTakenSeats([]);
        setBusId("");
        setData({});
        setStep(0);
      }
    }
  };

  return (
    <>
      <Navbar />

      <div className="mx-auto my-0 px-[5vw] py-[5vh] sm:max-w-3xl flex flex-col">
        {step === 0 && (
          <BookForm
            pickup={pickup}
            date={date}
            onSubmit={onSubmit}
            handleBack={handleBack}
            form={form}
          />
        )}
        {step === 1 && (
          <div className="px-auto py-0 w-full">
            <BusLayout
              price={price}
              luggagePrice={luggagePrice}
              handleBack={handleBack}
              data={data}
              onSubmit={onSubmit}
            />
          </div>
        )}
        {step === 2 && (
          <div className="px-auto py-0 w-full">
            <PayDialog
              paymentForm={paymentForm}
              onSubmit={onSubmit}
              data={data}
              price={price}
              handleBack={handleBack}
            />
          </div>
        )}
      </div>
    </>
  );
}
