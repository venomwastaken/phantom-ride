'use client';

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
import LoadingSpinner from "@/components/LoadingSpinner"; // Import the spinner component

export default function ProfileForm() {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [price, setPrice] = useState<number>(0);
  const [takenSeats, setTakenSeats] = useState<string[]>([]);
  const [busId, setBusId] = useState<string | undefined>();
  const router = useRouter();

  // Loading state variables
  const [isLoadingSeats, setIsLoadingSeats] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
  ];

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
      setIsLoadingSeats(true); // Start loading
      try {
        const bus = await getSeats({
          pickup: form.getValues("pickup"),
          date: form.getValues("date"),
        });
        setSelectedSeats([]);
        setTakenSeats(bus?.takenSeats || []);
        setPrice(bus?.price || 0);
        setBusId(bus?.busId);
      } catch (error) {
        console.error("Error fetching seats:", error);
      } finally {
        setIsLoadingSeats(false); // End loading
      }
    };

    fetchSeats();
  }, [form.watch("date"), form.watch("pickup")]);

  function selectHandler(id: string) {
    if (!takenSeats.includes(id)) {
      setSelectedSeats((prevSelectedSeats) =>
        prevSelectedSeats.includes(id)
          ? prevSelectedSeats.filter((seat) => seat !== id)
          : [...prevSelectedSeats, id]
      );
    }
  }

  useEffect(() => {
    form.setValue("seats", selectedSeats.join(", "));
  }, [selectedSeats, form]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true); // Start submitting
    try {
      // Initialize the transaction with Paystack
      const result = await initializeTransaction(
        values.email,
        price!, 
        selectedSeats
      );

      if (typeof window !== "undefined" && result && result.data) {
        const { default: PaystackPop } = await import("@paystack/inline-js");

        // Create the booking on your server before payment
        const bookingData = {
          ...values,
          reference: result.data.data.reference,
          busId: busId,
        };

        // Send booking data to the server to create a pending booking via the API route
        const response = await fetch("/api/book", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        });

        if (!response.ok) {
          throw new Error("Booking creation failed");
        }

        const bookingResponse = await response.json();
        console.log("Booking Response:", bookingResponse);

        // Open Paystack popup for payment
        const popup = new PaystackPop();
        popup.resumeTransaction(result.data.data.access_code);
        
      } else {
        throw new Error("Transaction initialization failed");
      }
    } catch (error: any) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false); // End submitting
    }
    form.reset();
    console.log(values);
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Navbar />
      <div className={`${styles.bookingContainer} wrapper`}>
        {isLoadingSeats ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <div className={`${styles.busSeats} ${styles.cardForm}`}>
            {/* Column 1 */}
            <div className={styles.col}>
              {col1.map((seat) => (
                <div
                  key={seat}
                  onClick={() => selectHandler(seat)}
                  className={`${styles.seats} ${
                    takenSeats.includes(seat)
                      ? styles.taken
                      : selectedSeats.includes(seat)
                      ? styles.selected
                      : ""
                  }`}
                >
                  {seat}
                </div>
              ))}
            </div>
            {/* Column 2 */}
            <div className={styles.col}>
              {col2.map((seat) => (
                <div
                  key={seat}
                  onClick={() => selectHandler(seat)}
                  className={`${styles.seats} ${
                    takenSeats.includes(seat)
                      ? styles.taken
                      : selectedSeats.includes(seat)
                      ? styles.selected
                      : ""
                  }`}
                >
                  {seat}
                </div>
              ))}
            </div>
            {/* Column 3 */}
            <div className={`${styles.col} ${styles.middle}`}>
              {col3.map((seat) => (
                <div
                  key={seat}
                  onClick={() => selectHandler(seat)}
                  className={`${styles.seats} ${
                    takenSeats.includes(seat)
                      ? styles.taken
                      : selectedSeats.includes(seat)
                      ? styles.selected
                      : ""
                  }`}
                >
                  {seat}
                </div>
              ))}
            </div>
            {/* Column 4 */}
            <div className={styles.col}>
              {col4.map((seat) => (
                <div
                  key={seat}
                  onClick={() => selectHandler(seat)}
                  className={`${styles.seats} ${
                    takenSeats.includes(seat)
                      ? styles.taken
                      : selectedSeats.includes(seat)
                      ? styles.selected
                      : ""
                  }`}
                >
                  {seat}
                </div>
              ))}
            </div>
          </div>
        )}

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
                        disabled={isSubmitting} // Disable during submission
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
                        disabled={isSubmitting} // Disable during submission
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
                        disabled={isSubmitting} // Disable during submission
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
                        disabled={isSubmitting} // Disable during submission
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
                        disabled={isSubmitting} // Disable during submission
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
                Price: GHS {price !== null ? price * selectedSeats.length : 0}.00
              </p>
              <button
                type="submit"
                className={
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Book Ride"}
              </button>
            </form>
          </div>
        </Form>
      </div>
    </Suspense>
  );
}
