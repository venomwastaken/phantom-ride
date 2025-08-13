"use client";

import Navbar from "@/components/shared/Navbar";
import BusLayout from "@/components/BusLayout";
import BookForm from "@/components/BookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useBusContext } from "@/components/BusContext";
import { useEffect, useState } from "react";
import { formSchema, paymentFormSchema } from "@/lib/validator";
import { z } from "zod";
import { getSeats } from "@/lib/actions/bus.action";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PayDialog from "@/components/PayDialog";
import { initializePayment } from "@/lib/actions/paymentPayaza.actions";
import LuggageForm from "@/components/LuggageForm";
import { set } from "mongoose";

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

  const router = useRouter();
  const searchParams = useSearchParams();
  const pickup = searchParams.get("pickup") || "";
  const date = searchParams.get("date") || "";

  const initialVals = {
    pickup: pickup ? pickup : "Accra",
    date: date ? date : "Friday (05/09/2025)",
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
  const totalSteps = 4;
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

  const luggageList = [
  {
    id: "extraBags",
    label: "3 or more bags (+ GHS 30.00)",
    price: 30,
  },
  {
    id: "fridge",
    label: "Fridge (+ GHS 70.00)",
    price: 70,
  },
  {
    id: "fridgeSmall",
    label: "Table Top Fridge (+ GHS 50.00)",
    price: 50,
  },
  {
    id: "tv",
    label: "TV (+ GHS 50.00)",
    price: 50,
  },
  {
    id: "microwave",
    label: "Microwave (+ GHS 30.00)",
    price: 30,
  },
  {
    id: "gasStove",
    label: "Gas Stove (+ GHS 20.00)",
    price: 20,
  },
  {
    id: "fan",
    label: "Standiing Fan (+ GHS 70.00)",
    price: 70,
  },
  {
    id: "cylinder",
    label: "Gas Cylinder (+ GHS 70.00)",
    price: 70,
  },
  {
    id: "soundSystem",
    label: "Sound System (+ GHS 200.00)",
    price: 60,
  },
  {
    id: "tableAndChair",
    label: "Study Table and Chair (+ GHS 200.00)",
    price: 100,
  },
] as const;

  function generateReference() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let ref = "";
    for (let i = 0; i < 12; i++) {
      ref += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return ref;
  }

  const fetchSeats = async (pickup: string, date: string, location: string) => {
    setIsLoadingSeats(true); // Start loading
    try {
      const bus = await getSeats({
        pickup: pickup,
        date: date,
        location: location
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
    const locationValue = form.watch("location");
    setSelectedSeats([]);
    if (pickupValue && dateValue && locationValue) {
      fetchSeats(pickupValue, dateValue, locationValue);
    }
  }, [form.watch("pickup"), form.watch("date"), form.watch("location")]);

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
    } else if (step === 1) {
      setStep(step + 1);
      setData({
        ...data,
        ...values
      });

      setLuggagePrice(0);
      (values.luggage ?? []).map((item) => {
        const luggageItem = luggageList.find((l) => l.id === item);
        if (luggageItem) {
          setLuggagePrice((prev) => prev + luggageItem.price);
        }
      }
      );

    } else if (step === 2) {
      setStep(step + 1);
      setData({
        ...data,
        busId: busId,
        seats: selectedSeats.toString(),
      });
    } else {
      setIsSubmitting(true);
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
        
        form.reset();
        paymentForm.reset();
        setIsSubmitting(false);
        setSelectedSeats([]);
        setTakenSeats([]);
        setBusId("");
        setData({});
        setStep(0);
        setLuggagePrice(0);
        setIsOther(false);
        setOtherLocation("");
        setPrice(0);
        
        router.push("/redirect");
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
            <LuggageForm
              isSubmitting={isSubmitting}
              form={form}
              onSubmit={onSubmit}
              handleBack={handleBack}
            />
          </div>
        )}
        {step === 2 && (
          <div className="px-auto py-0 w-full">
            <BusLayout
              price={price}
              luggagePrice={luggagePrice}
              handleBack={handleBack}
              data={data}
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        )}
        {step === 3 && (
          <div className="px-auto py-0 w-full">
            <PayDialog
              paymentForm={paymentForm}
              onSubmit={onSubmit}
              selectedSeats={selectedSeats}
              luggagePrice={luggagePrice}
              price={price}
              handleBack={handleBack}
            />
          </div>
        )}
      </div>
    </>
  );
}
