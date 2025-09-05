"use client";

import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Dropdown from "@/components/Dropdown";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const HomeForm = () => {
  type HomeFormParams = {
    pickup: string;
    date: string;
  };

  const [dateDisable, setDateDisable] = useState<boolean>(false);

  const router = useRouter();
  const form = useForm<HomeFormParams>();
  const [dateList, setDateList] = useState<string[]>([]);
  const [isPickUpDisabled, setIsPickUpDisabled] = useState<boolean>(true);

  const temaDate = ["Saturday (06/09/2025)", "Sunday (07/09/2025)"];
  const accraDate = ["Saturday (06/09/2025)", "Sunday (07/09/2025)"];

  useEffect(() => {
    const pickupValue = form.watch("pickup");
    if (pickupValue === "Adenta" || pickupValue === "Cape Coast/Takoradi") {
      form.setValue("date", "Saturday (06/09/2025)");
      setDateDisable(true);
    } else if (pickupValue === "Tema") {
      setDateList(temaDate);
      setDateDisable(false);
    }else {
      setDateList(accraDate);
      setDateDisable(false);
    }
  }, [form.watch("pickup")]);

  function onSubmit(values: HomeFormParams) {
    console.log(values);

    const query = [];

    // Check if 'pickup' is present and push it to the query array
    if (values.pickup) {
      query.push(`pickup=${values.pickup}`);
    }

    // Check if 'date' is present and push it to the query array
    if (values.date) {
      query.push(`date=${values.date}`);
    }

    // Build the final query string (join the query array with '&')
    const queryString = query.length > 0 ? `?${query.join("&")}` : "";

    // Navigate to the final URL
    return router.push(`/book${queryString}`);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                    placeholder="Select a bus"
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
                    items={dateList}
                    placeholder="Select a Date"
                    disabled={dateDisable}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button className="button mt-[15px]" type="submit">
            Book Ride
          </button>
        </form>
      </Form>
    </div>
  );
};

export default HomeForm;
