import { formSchema } from "@/lib/validator";
import { MinusIcon, PlusIcon } from "lucide-react";
import React, { use, useCallback, useState } from "react";
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
import { ButtonGroup } from "./ui/button-group";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type luggageFormProps = {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  handleBack: () => void;
  form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
  isSubmitting: boolean;
};

const luggageList = [
  {
    id: "extraBags",
    label: "3 or more bags",
    price: 30,
  },
  {
    id: "fridge",
    label: "Fridge",
    price: 70,
  },
  {
    id: "fridgeSmall",
    label: "Table Top Fridge",
    price: 50,
  },
  {
    id: "tv",
    label: "TV",
    price: 50,
  },
  {
    id: "microwave",
    label: "Microwave",
    price: 30,
  },
  {
    id: "gasStove",
    label: "Gas Stove",
    price: 20,
  },
  {
    id: "fan",
    label: "Standiing Fan",
    price: 70,
  },
  {
    id: "cylinder",
    label: "Gas Cylinder",
    price: 70,
  },
  {
    id: "soundSystem",
    label: "Sound System",
    price: 100,
  },
  {
    id: "tableAndChair",
    label: "Study Table and Chair",
    price: 100,
  },
] as const;

export default function LuggageForm({
  onSubmit,
  handleBack,
  form,
  isSubmitting,
}: luggageFormProps) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const handleCountAdjustment = useCallback(
    (itemId: string, adjustment: number) => {
      setCounts((prevCounts) => ({
        ...prevCounts,
        [itemId]: Math.max(
          itemId === "extraBags" ? 3 : 1,
          Math.min(9, (prevCounts[itemId] || 1) + adjustment)
        ),
      }));
    },
    []
  );

  const handleCountChange = React.useCallback(
    (itemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value) && value >= 1 && value <= 9) {
        setCounts((prevCounts) => ({
          ...prevCounts,
          [itemId]: value,
        }));
      }
    },
    []
  );

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
                            className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 mb-2"
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
                            <FormLabel className="text-sm font-normal ">
                              {item.label}
                              <span className="text-[10px] font-bold bg-[#E0E0E0] ml-2 py-1 px-2 rounded-full text-[#3D3D3D]">+{item.price}</span>
                            </FormLabel>
                            <div className="flex flex-1 justify-end">
                              <ButtonGroup
                                className={`${
                                  field.value?.includes(item.id)
                                    ? ""
                                    : "opacity-0"
                                }`}
                              >
                                <Input
                                  id={`${item.id}-quantity`}
                                  value={counts[item.id] || 1}
                                  onChange={(e) =>
                                    handleCountChange(item.id, e)
                                  }
                                  size={3}
                                  className="h-8 !w-12 text-sm"
                                  maxLength={2}
                                />
                                <Button
                                  variant="outline"
                                  className="h-8 w-10"
                                  type="button"
                                  aria-label="Decrement"
                                  onClick={() =>
                                    handleCountAdjustment(item.id, -1)
                                  }
                                  disabled={(counts[item.id] || 1) <= 1}
                                >
                                  <MinusIcon />
                                </Button>
                                <Button
                                  variant="outline"
                                  className="h-8 w-10"
                                  type="button"
                                  aria-label="Increment"
                                  onClick={() =>
                                    handleCountAdjustment(item.id, 1)
                                  }
                                  disabled={(counts[item.id] || 1) >= 9}
                                >
                                  <PlusIcon />
                                </Button>
                              </ButtonGroup>
                            </div>
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
