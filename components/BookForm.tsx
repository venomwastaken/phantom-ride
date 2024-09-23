"use client";
import styles from "../app/book/bs.module.css";

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
import { useEffect, useState } from "react";
import { getSeats } from "@/lib/actions/bus.action";
import { booking } from "@/lib/actions/book.action";
import { initializeTransaction } from "@/lib/actions/payment.action";

type bookFormProps = {
  pickup?: string;
  date?: string;
  selectedSeats: string[];
  onSeatSelectionChange: (seats: string[]) => void;
  sendTakenSeats: (takenSeats: string[]) => void;
};

export default function BookForm({
  pickup,
  date,
  selectedSeats,
  onSeatSelectionChange,
  sendTakenSeats,
}: bookFormProps) {
  const [price, setPrice] = useState<number>(0);
  const initialVals = {
    pickup: pickup ? pickup : "Accra",
    destination: "KNUST(Main Campus)",
    date: date ? date : "Saturday",
    fullName: "",
    email: "",
    phone: "",
    seats: "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialVals,
  });

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        onSeatSelectionChange([]);
        const bus = await getSeats({
          pickup: form.getValues("pickup"),
          date: form.getValues("date"),
        });
        
        sendTakenSeats(bus?.takenSeats);
        setPrice(bus?.price);
      } catch (error) {
        console.error("Error fetching seats:", error);
      }
    };
    fetchSeats();
  }, [form.watch("date"), form.watch("pickup")]);

  // 1. Define your form.

  useEffect(() => {
    form.setValue("seats", selectedSeats.join(", "));
  }, [selectedSeats]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Initialize the transaction with Paystack
      const result = await initializeTransaction(
        values.email,
        (price! * selectedSeats.length * 100).toString()
      );

      if (typeof window !== "undefined" && result && result.data) {
        const { default: PaystackPop } = await import("@paystack/inline-js");

        // Create the booking on your server before payment
        const bookingData = {
          ...values,
          reference: result.data.data.reference, // Store Paystack reference
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
        console.log(result)
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
    <>
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
    </>
  );
}
