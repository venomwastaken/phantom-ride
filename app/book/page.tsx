"use client";
import styles from "./bs.module.css";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";




import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formSchema } from "@/lib/validator";
import Dropdown from "@/components/Dropdown";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSeats } from "@/lib/actions/bus.action";
import { initializeTransaction } from "@/lib/actions/payment.action";
import Navbar from "@/components/shared/Navbar";

export default function ProfileForm() {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [price, setPrice] = useState<number>(0); // Initialize with null to indicate loading
  const [takenSeats, setTakenSeats] = useState<string[]>([]);

  const col1 = [
    "01",
    "04",
    "07",
    "10",
    "13",
    "16",
    "19",
    "22",
    "25",
    "28",
    "31",
  ];
  const col2 = [
    "02",
    "05",
    "08",
    "11",
    "14",
    "17",
    "20",
    "23",
    "26",
    "29",
    "32",
  ];
  const col3 = ["33"];
  const col4 = [
    "03",
    "06",
    "09",
    "12",
    "15",
    "18",
    "21",
    "24",
    "27",
    "30",
    "34",
  ]; // Example seat numbers

  const searchParams = useSearchParams();
  const pickup = searchParams.get("pickup");
  const date = searchParams.get("date");

  const initialVals = {
    pickup: pickup ? pickup : "Accra",
    destination: "KNUST(Main Campus)",
    date: date ? date : "Saturday",
    fullName: "",
    email: "",
    phone: "",
    seats: "",
  };

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialVals,
  });

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const bus = await getSeats({
          pickup: form.getValues("pickup"),
          date: form.getValues("date"),
        });
        setSelectedSeats([]);
        setTakenSeats(bus?.takenSeats);
        setPrice(bus?.price);
      } catch (error) {
        console.error("Error fetching seats:", error);
      }
    };
  
    fetchSeats();
  }, [form.watch("date"), form.watch("pickup")]);

  function selectHandler(id: string) {
    if (!takenSeats.includes(id)) {
      setSelectedSeats(
        (prevSelectedSeats) =>
          prevSelectedSeats.includes(id)
            ? prevSelectedSeats.filter((seat) => seat !== id) // Deselect if already selected
            : [...prevSelectedSeats, id] // Select new seat
      );
    }
  }

  // useEffect(() => {
  //   const pickup = searchParams.get('pickup');
  //   const date = searchParams.get('date');

  //   if (date) {
  //     form.setValue('date', date);
  //   }
  //   if (pickup) {
  //     form.setValue('pickup', pickup);
  //   }
  // }, []);

  useEffect(() => {
    form.setValue("seats", selectedSeats.join(", "));
  }, [selectedSeats]); // This will update the "seats" field whenever selectedSeats changes
  

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await initializeTransaction(
        values.email,
        (price! * selectedSeats.length * 100).toString()
      );
      if (typeof window !== 'undefined' && result && result.data) {
        const { default: PaystackPop } = await import("@paystack/inline-js");

        const popup = new PaystackPop();
        popup.resumeTransaction(result.data.data.access_code);
      } else {
        throw new Error("Transaction initialization failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    console.log(values);
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Navbar/>
      <div className={`${styles.bookingContainer} wrapper`}>
        <div className={`${styles.busSeats} ${styles.cardForm}`}>
          <div className={styles.col}>
            {col1.map((seat) => (
              <div
                className={styles.seats}
                key={seat}
                onClick={() => selectHandler(seat)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "45px",
                  height: "45px",
                  backgroundColor: takenSeats.includes(seat)
                    ? "rgba(255, 0, 0, 0.06)"
                    : selectedSeats.includes(seat)
                    ? "rgba(0, 255, 0, 0.06)"
                    : "rgba(127, 127, 127, 0.06)",
                  cursor: takenSeats.includes(seat) ? "not-allowed" : "pointer",
                  border: "solid #ebebeb 2px",
                  borderRadius: "8px",
                  justifyContent: "center",
                  margin: "2px",
                  borderColor: takenSeats.includes(seat)
                    ? "rgb(255, 127, 127)"
                    : selectedSeats.includes(seat)
                    ? "var(--mylime)"
                    : "#ebebeb",
                }}
              >
                {seat}
              </div>
            ))}
          </div>
          <div className={styles.col}>
            {col2.map((seat) => (
              <div
                className={styles.seats}
                key={seat}
                onClick={() => selectHandler(seat)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "45px",
                  height: "45px",
                  backgroundColor: takenSeats.includes(seat)
                    ? "rgba(255, 0, 0, 0.06)"
                    : selectedSeats.includes(seat)
                    ? "rgba(0, 255, 0, 0.06)"
                    : "rgba(127, 127, 127, 0.06)",
                  cursor: takenSeats.includes(seat) ? "not-allowed" : "pointer",
                  border: "solid #ebebeb 2px",
                  borderRadius: "8px",
                  justifyContent: "center",
                  margin: "2px",
                  borderColor: takenSeats.includes(seat)
                    ? "rgb(255, 127, 127)"
                    : selectedSeats.includes(seat)
                    ? "var(--mylime)"
                    : "#ebebeb",
                }}
              >
                {seat}
              </div>
            ))}
          </div>
          <div className={`${styles.col} ${styles.middle}`}>
            {col3.map((seat) => (
              <div
                className={styles.seats}
                key={seat}
                onClick={() => selectHandler(seat)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "45px",
                  height: "45px",
                  backgroundColor: takenSeats.includes(seat)
                    ? "rgba(255, 0, 0, 0.06)"
                    : selectedSeats.includes(seat)
                    ? "rgba(0, 255, 0, 0.06)"
                    : "rgba(127, 127, 127, 0.06)",
                  cursor: takenSeats.includes(seat) ? "not-allowed" : "pointer",
                  border: "solid #ebebeb 2px",
                  borderRadius: "8px",
                  justifyContent: "center",
                  margin: "2px",
                  borderColor: takenSeats.includes(seat)
                    ? "rgb(255, 127, 127)"
                    : selectedSeats.includes(seat)
                    ? "var(--mylime)"
                    : "#ebebeb",
                }}
              >
                {seat}
              </div>
            ))}
          </div>
          <div className={styles.col}>
            {col4.map((seat) => (
              <div
                className={styles.seats}
                key={seat}
                onClick={() => selectHandler(seat)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "45px",
                  height: "45px",
                  backgroundColor: takenSeats.includes(seat)
                    ? "rgba(255, 0, 0, 0.06)"
                    : selectedSeats.includes(seat)
                    ? "rgba(0, 255, 0, 0.06)"
                    : "rgba(127, 127, 127, 0.06)",
                  cursor: takenSeats.includes(seat) ? "not-allowed" : "pointer",
                  border: "solid #ebebeb 2px",
                  borderRadius: "8px",
                  justifyContent: "center",
                  margin: "2px",
                  borderColor: takenSeats.includes(seat)
                    ? "rgb(255, 127, 127)"
                    : selectedSeats.includes(seat)
                    ? "var(--mylime)"
                    : "#ebebeb",
                }}
              >
                {seat}
              </div>
            ))}
          </div>
        </div>

        <Form {...form}>
          <div className={styles.cardForm}>
            <h2 className="mb-5 bold text-xl">Book a ride</h2>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className=".form-container"
            >
              <FormField
                control={form.control}
                name="pickup"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Dropdown
                        onChangeHandler={field.onChange}
                        value={field.value}
                        items={["Accra", "Tema", "Adenta"]}
                        placeholder="Pickup Location"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className={`${styles.whitebgInput} input`}
                        placeholder="Destination"
                        {...field}
                        value={field.value}
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Dropdown
                        onChangeHandler={field.onChange}
                        value={field.value}
                        items={["Saturday", "Sunday"]}
                        placeholder="Date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className={`${styles.whitebgInput} input`}
                        placeholder="Fullname"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className={`${styles.whitebgInput} input`}
                        placeholder="Email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className={`${styles.whitebgInput} input`}
                        placeholder="Phone Number (eg. 054XXXXXXX)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="seats"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className={`${styles.whitebgInput} input`}
                        placeholder="(selected seats)"
                        {...field}
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="mt-2 text-xs text-gray-500 bold">
                Price: GHS {price !== null ? price * selectedSeats.length : 0}
                .00
              </p>
              <button type="submit">Book Ride</button>
            </form>
          </div>
        </Form>
      </div>
      </Suspense>
  );
}
