import { formSchema } from "@/lib/validator";
import { MinusIcon, PlusIcon } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
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

  const {fields, append, remove} = useFieldArray({
    control: form.control,
    name: "luggage",
  });

  const currentItemIds = useWatch({
    control: form.control,
    name: "luggage",
  }).map(item => item.name);

  const handleCountAdjustment = useCallback(
    (itemId: string, adjustment: number) => {
      const currentQuantity = form.getValues(`luggage`).find((it: any) => it.name === itemId)?.quantity || (itemId === "extraBags" ? 3 : 1);
      const newQuantity =  Math.max(
          itemId === "extraBags" ? 3 : 1,
          Math.min(9, currentQuantity + adjustment)
        );
      form.setValue( "luggage",
        form.getValues("luggage").map((it: any) =>
          it.name === itemId ? { ...it, quantity: newQuantity } : it
        ),
        { shouldValidate: true, shouldDirty: true }
      )
    },
    []
  );
  // sync initial selected luggage quantities into local counts and keep form values in sync with counts
  React.useEffect(() => {
    const initial = form.getValues?.("luggage") || [];
    const initCounts = initial.reduce<Record<string, number>>((acc, it: any) => {
      acc[it.name] = it.quantity ?? (it.name === "extraBags" ? 3 : 1);
      return acc;
    }, {});
    if (Object.keys(initCounts).length) setCounts(prev => ({ ...prev, ...initCounts }));
  }, [form]);

  React.useEffect(() => {
    const luggage = form.getValues?.("luggage") || [];
    if (!luggage.length) return;
    const updated = luggage.map((it: any) => ({
      ...it,
      quantity: counts[it.name] ?? it.quantity ?? (it.name === "extraBags" ? 3 : 1),
    }));
    form.setValue("luggage", updated, { shouldValidate: true, shouldDirty: true });
  }, [counts, form]);


  return (
    <>
      <Form {...form}>
        <div className={`${styles.cardForm}`}>
          <h2 className="bold text-xl">Luggage</h2>
          <form
            onSubmit={form.handleSubmit((values) => onSubmit(values))}
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
                  {luggageList.map((item) => {
                    const isSelected = currentItemIds.includes(item.id)

                    return (
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
                                  checked={field.value?.some((item_obj: any) => item_obj.name === item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, { name: item.id, quantity: counts[item.id] || (item.id === "extraBags" ? 3 : 1) }])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value: any) => value.name !== item.id
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
                                    field.value?.some((item_obj: any) => item_obj.name === item.id)
                                      ? ""
                                      : "opacity-0"
                                  }`}
                                >
                                  <Button
                                    variant="outline"
                                    className="h-8 w-8"
                                    type="button"
                                    aria-label="Decrement"
                                    onClick={() =>
                                      handleCountAdjustment(item.id, -1)
                                    }
                                    disabled={(counts[item.id] || 1) <= 1}
                                  >
                                    <MinusIcon className="text-muted-foreground" style={{height: "14px", width: "14px"}} strokeWidth={2.5}/>
                                  </Button>
                                  <Input
                                    id={`${item.id}-quantity`}
                                    value={counts[item.id] || (item.id === "extraBags"? 3: 1)}
                                    size={3}
                                    className="h-8 !w-8 text-[13px] font-medium text-muted-foreground"
                                    maxLength={2}
                                    readOnly={true}
                                  />
                                  
                                  <Button
                                    variant="outline"
                                    className="h-8 w-8"
                                    type="button"
                                    aria-label="Increment"
                                    onClick={() =>
                                      handleCountAdjustment(item.id, 1)
                                    }
                                    disabled={(counts[item.id] || 1) >= 9}
                                  >
                                    <PlusIcon className="text-muted-foreground" style={{height: "14px", width: "14px"}} strokeWidth={2.5}/>
                                  </Button>
                                </ButtonGroup>
                              </div>
                            </FormItem>
                          );
                        }}
                      />
                    )
                  })}
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
