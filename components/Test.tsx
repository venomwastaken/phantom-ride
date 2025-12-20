import { formSchema } from "@/lib/validator";
import React from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import z from "zod";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLegend,
    FieldSet,
} from "./ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import { Minus, MinusIcon, Plus, PlusIcon } from "lucide-react";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { FormDescription } from "./ui/form";

type Props = {
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
        label: "Standing Fan",
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
];

export default function Test({
    handleBack,
    form,
    isSubmitting,
    onSubmit,
}: Props) {
    const { control, handleSubmit, setValue } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: "luggage",
    });

    // Watch the current list of selected item IDs for easy lookup
    const currentItemIds = useWatch({
        control,
        name: "luggage",
    }).map((item) => item.name);

    // Centralized default quantity logic
    const getDefaultQuantity = (itemId: string) =>
        itemId === "extraBags" ? 3 : 1;

    // Helper function to update the quantity of an existing item
    const updateQuantity = (index: number, delta: number) => {
        const currentQuantity = form.getValues(`luggage.${index}.quantity`);
        const currentItem = form.getValues(`luggage.${index}.name`);
        const newQuantity = Math.max(
            getDefaultQuantity(currentItem),
            currentQuantity + delta
        ); // Ensure quantity stays >= default
        setValue(`luggage.${index}.quantity`, newQuantity, {
            shouldDirty: true,
        });
    };

    // Handles adding/removing items when a checkbox is toggled
    const handleCheckboxChange = (
        checked: boolean,
        item: (typeof luggageList)[0]
    ) => {
        if (checked) {
            // Add the item to the form array with a default quantity
            append({
                name: item.id,
                quantity: item.id === "extraBags" ? 3 : 1,
            });
        } else {
            // Find the index of the item and remove it
            const indexToRemove = currentItemIds.findIndex(
                (id) => id === item.id
            );
            if (indexToRemove > -1) {
                remove(indexToRemove);
            }
        }
    };

    const watchedLuggage = useWatch({ control, name: "luggage" });

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                    <div>
                        <h2 className="bold text-xl mb-1">Luggage</h2>
                        <p className="mb-5 text-sm font-medium text-muted-foreground">
                            Select (if any) amongst these which best describe
                            your luggage
                        </p>
                    </div>

                    {luggageList.map((item) => {
                        const isSelected = currentItemIds.includes(item.id);
                        // Get the index in the form array if selected
                        const fieldIndex = isSelected
                            ? currentItemIds.findIndex((id) => id === item.id)
                            : -1;

                        return (
                            <div
                                key={item.id}
                                className="flex items-center justify-between p-3 border rounded-md"
                            >
                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id={item.id}
                                        checked={isSelected}
                                        onCheckedChange={(checked) =>
                                            handleCheckboxChange(
                                                !!checked,
                                                item
                                            )
                                        }
                                    />
                                    <Label
                                        htmlFor={item.id}
                                        className="text-sm font-medium leading-none"
                                    >
                                        {item.label}
                                        <span className="text-[10px] font-bold bg-[#E0E0E0] ml-2 py-1 px-2 rounded-full text-[#3D3D3D]">
                                            +{item.price}
                                        </span>
                                    </Label>
                                </div>

                                {/* Quantity Button Group (only visible when selected) */}
                                <div
                                    className={`flex items-center space-x-2 ${
                                        isSelected && fieldIndex !== -1
                                            ? ""
                                            : "opacity-0"
                                    }`}
                                >
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() =>
                                            updateQuantity(fieldIndex, -1)
                                        }
                                        className="h-8 w-8"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    {/* Note: Using form.getValues here will not trigger re-renders on value change.
                                                For reactive updates, consider using useWatch or Controller from react-hook-form. */}
                                    <Input
                                        value={
                                            fieldIndex !== -1
                                                ? watchedLuggage?.[fieldIndex]
                                                      ?.quantity ??
                                                  (item.id === "extraBags"
                                                      ? 3
                                                      : 1)
                                                : item.id === "extraBags"
                                                ? 3
                                                : 1
                                        }
                                        readOnly
                                        className="w-16 text-center h-8"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() =>
                                            updateQuantity(fieldIndex, 1)
                                        }
                                        className="h-8 w-8"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Display form-level error if no items are selected */}
                {form.formState.errors.luggage && (
                    <p className="text-sm font-medium text-destructive mt-2">
                        {form.formState.errors.luggage.message}
                    </p>
                )}

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
                        {/*isSubmitting ? "Submitting..." : "Book Ride"*/}
                        Next
                    </button>
                </div>
            </form>
        </div>
    );
}
