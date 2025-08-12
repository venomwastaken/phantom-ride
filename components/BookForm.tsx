"use client";
import styles from "../app/book/bs.module.css";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useEffect, useRef, useState } from "react";
import { useBusContext } from "./BusContext";
import { useRouter } from "next/navigation";

type bookFormProps = {
  pickup?: string;
  date?: string;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  handleBack: () => void;
  form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
};

export default function BookForm({
  pickup,
  date,
  onSubmit,
  handleBack,
  form,
}: bookFormProps) {
  // if(pickup && pickup !== "Accra(Circle)") {
  //   date = "Saturday (26/04/2025)";
  // }

  const [price, setPrice] = useState<number>(0);
  // const [dateDisable, setDateDisable] = useState<boolean>(false);
  const [isOther, setIsOther] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [list, setList] = useState<string[]>([]);
  const [data, setData] = useState<object>({});
  const [otherLocation, setOtherLocation] = useState<string>("");

  const { isSubmitting } = useBusContext();

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
      price: 200,
    },
    {
      id: "tableAndChair",
      label: "Study Table and Chair (+ GHS 200.00)",
      price: 200,
    },
  ] as const;

  const accraPickups = [
    "Achimota mall Bus Stop",
    "Accra mall Bus Stop",
    "Amasaman",
    "Pokuase (Frimps Oil Filling Station)",
    "Ofankor Barrier",
    "Circle (So Fresh Filling Station)",
    "Taifa Junction Bus Stop",
    "Nsawam (Total Filling Station)",
    "Medie",
    "Other",
  ];
  const temaPickups = ["Community 1 Station", "Ashaiman Overhead", "Other"];
  const adentaPickups = ["Adenta","Other"]
  const capeCoastPickups = ["Cape Coast", "Takoradi", "Other"];

  const prevPickupRef = useRef<string | undefined>(form.getValues("pickup"));

  useEffect(() => {
    const currentPickup = form.getValues("pickup");
    if (prevPickupRef.current !== currentPickup) {
      form.setValue("location", "");
      prevPickupRef.current = currentPickup;
    }
    if (currentPickup === "Accra") {
      setList(accraPickups);
    } else if (currentPickup === "Tema") {
      setList(temaPickups);
    }else if (currentPickup === "Adenta") {
      setList(adentaPickups);
    } else if (currentPickup === "Cape Coast/Takoradi") {
      setList(capeCoastPickups);
    }

  }, [form.watch("date"), form.watch("pickup")]);

  useEffect(() => {
    if (form.getValues("location") === "Other") {
      setIsOther(true);
    } else {
      setIsOther(false);
    }
  }, [form.watch("location")]);

  return (
    <>
      <Form {...form}>
        <div className={`${styles.cardForm}`}>
          <h2 className="mb-5 bold text-xl">Book a ride</h2>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="form-container"
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
                      items={["Accra", "Tema", "Adenta", "Cape Coast/Takoradi"]}
                      placeholder="Pickup"
                      disabled={isSubmitting} // Disable during submission
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Dropdown
                      onChangeHandler={field.onChange}
                      value={field.value}
                      items={list}
                      placeholder="Pickup Point"
                      disabled={isSubmitting} // Disable during submission
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isOther && (
              <Input
                className={`${styles.whitebgInput} input`}
                placeholder="Please specify"
                value={otherLocation}
                disabled={isSubmitting}
                onChange={(e) => setOtherLocation(e.target.value)}
              />
            )}

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Dropdown
                      onChangeHandler={field.onChange}
                      value={field.value}
                      items={["Saturday (24/05/2025)", "Sunday (25/05/2025)"]}
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
              name="agent"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Dropdown
                      onChangeHandler={field.onChange}
                      value={field.value}
                      items={[
                        "Daniel",
                        "Thelma",
                        "Derrick",
                        "Rodolphe",
                        "Desmond",
                        "Palba",
                        "Nana Banyin",
                        "Zerubabel",
                      ]}
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
              name="emergencyContactInfo"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className={`${styles.whitebgInput} input`}
                      placeholder="Emergency Contact Info"
                      {...field}
                      disabled={isSubmitting} // Disable during submission
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="luggage"
              render={() => (
                <FormItem className="mt-[15px]">
                  <div className="mb-4">
                    <FormLabel className="text-base font-medium">
                      Luggage
                    </FormLabel>
                    <FormDescription className="mt-1">
                      Which of these do you have in addition to as luggage?
                      <br /> (Leave empty if none)
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
            /> */}

            <div className="flex justify-between mt-[35px] flex-row-reverse">
              <button
                type="submit"
                className={`${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                } button`}
                disabled={isSubmitting}
              >
                {/*isSubmitting ? "Submitting..." : "Book Ride"*/}Next
              </button>
            </div>
          </form>
        </div>
      </Form>
    </>
  );
}
