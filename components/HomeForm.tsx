"use client";

import { useForm } from "react-hook-form";

import {Form,FormControl,FormField,FormItem,FormMessage,} from "@/components/ui/form";
import Dropdown from "@/components/Dropdown";
import { useRouter } from "next/navigation";

const HomeForm = () => {
  type homeFormParams = {
    pickup: string;
    date: string;
  };


  const router = useRouter();
  const form = useForm<homeFormParams>();

  function onSubmit(values: homeFormParams) {
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
    const queryString = query.length > 0 ? `?${query.join('&')}` : '';
  
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
                    placeholder="Select a Pickup"
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
                    placeholder="Select a Date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button className="button" type="submit">Book Ride</button>
        </form>
      </Form>
    </div>
  );
};

export default HomeForm;
