import { formSchema } from "@/lib/validator";
import React from "react";
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
} from "./ui/form";
import { Checkbox } from "./ui/checkbox";
import styles from "../app/book/bs.module.css";

type luggageFormProps = {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  handleBack: () => void;
  form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
  isSubmitting: boolean;
};

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
    label: "Sound System (+ GHS 100.00)",
    price: 100,
  },
  {
    id: "tableAndChair",
    label: "Study Table and Chair (+ GHS 100.00)",
    price: 100,
  },
] as const;

export default function LuggageForm({
  onSubmit,
  handleBack,
  form,
  isSubmitting,
}: luggageFormProps) {
  return (
    <>
      <Form {...form}>
        <div className={`${styles.cardForm}`}>
          <h2 className="bold text-xl">Luggage</h2>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="form-container"
          >
            <FormField
              control={form.control}
              name="luggage"
              render={() => (
                <FormItem className="mt-[15px] ">
                  <div className="mb-4">
                    <FormDescription className="mt-[-10px] mb-5">
                      Select (if any) amongst these which best describe your
                      luggage
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
                            className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mb-2"
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

            <div className="flex justify-between mt-[35px]">
              <button
                type="button"
                className={`${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                } button button-outlin`}
                onClick={handleBack}
                disabled={isSubmitting}
              >
                Back
              </button>

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
