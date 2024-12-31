"use client";
import styles from "../app/book/bs.module.css";
import { Checkbox } from "@/components/ui/checkbox";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formSchema } from "@/lib/validator";
import Dropdown from "@/components/Dropdown";
import { useEffect, useState } from "react";
import { getSeats } from "@/lib/actions/bus.action";
import { initializeTransaction } from "@/lib/actions/payment.action";
import { useBusContext } from "./BusContext";
import { useRouter } from "next/navigation";


type bookFormProps = {
  pickup?: string;
  date?: string;
};

export default function BookForm({ pickup, date}: bookFormProps) {

  const [price, setPrice] = useState<number>(0);
  const initialVals = {
    pickup: pickup ? pickup : "Accra",
    destination: "KNUST(Main Campus)",
    date: date ? date : "Saturday (11/01/2025)",
    fullName: "",
    email: "",
    phone: "",
    seats: "",
    agent: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    luggage: [],
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialVals,
  });

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

  const luggageList = [
    {
      id: "fridge",
      label: "Fridge",
    },
    {
      id: "tv",
      label: "TV",
    },
    {
      id: "microwave",
      label: "Microwave",
    },
  ] as const;

  const router= useRouter()


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

  // 1. Define your form.

  useEffect(() => {
    form.setValue("seats", selectedSeats.join(", "));
  }, [selectedSeats]);

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
    setSelectedSeats([]);
    router.push("/redirect")
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
                      items={["Saturday (11/01/2025)", "Sunday (12/01/2025)"]}
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
            <FormField
              control={form.control}
              name="agent"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Dropdown
                      onChangeHandler={field.onChange}
                      value={field.value}
                      items={["Daniel", "Thelma", "Derrick"]}
                      placeholder="Agent"
                      disabled={isSubmitting} // Disable during submission
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emergencyContactName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className={`${styles.whitebgInput} input`}
                      placeholder="Emergency Contact Name"
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
              name="emergencyContactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className={`${styles.whitebgInput} input`}
                      placeholder="Emergency Contact Phone (eg. 054XXXXXXX)"
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
              name="luggage"
              render={() => (
                <FormItem className="mt-[15px]">
                  <div className="mb-4">
                    <FormLabel className="text-base">Luggage</FormLabel>
                    <FormDescription className="mt-1">
                      Which of these do you have in addition to as luggage?<br/> (Leave empty if none)
                    </FormDescription>
                  </div>
                  {luggageList.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="luggage"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox 
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />

            <p className="mt-[15px] text-xs text-gray-500 bold">
              Price to pay: GHS {price !== null ? price * selectedSeats.length : 0}.00
            </p>
            <button
              type="submit"
              className={`${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              } button`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Book Ride"}
            </button>
          </form>
        </div>
      </Form>
    </>
  );
}
