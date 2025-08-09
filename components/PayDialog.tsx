'use client'

import styles from "../app/book/bs.module.css";
import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Dropdown from './Dropdown'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { initializePayment } from '@/lib/actions/paymentPayaza.actions'
import { useRouter } from "next/navigation";


export function PayDialog ({paymentForm, onSubmit, price, data, handleBack}: 
                            {paymentForm: any, onSubmit: (data: any) => void, price: number, data: any, handleBack: () => void}) {


// function onSubmit(values: z.infer<typeof formSchema>) {
//   try {
//       initializePayment({
//         price: price,
//         phoneNumber: values.phoneNumber,
//         networkBankCode: (values.network==="MTN")?"MTN":(values.network==="Telecel Gh")?"VOD":"AIR",
//         email: data.email,
//         firstName: data.fullName.split(" ")[0],
//         lastName: data.fullName.split(" ").slice(-1)[0],
//         selectedSeats: data.seats,
//         reference: data.reference,
//       })
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

  return (
    <div className={`${styles.cardForm}`}>
      <Form {...paymentForm}>
        <h2 className="bold text-xl">Make Payment</h2>
        <FormDescription className="mt-1 mb-5 ">
          Please ensure you have provided right information before you make payment.
        </FormDescription>
        <form onSubmit={paymentForm.handleSubmit(onSubmit)} className="space-y-[15px]">
          <FormField
            control={paymentForm.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-neutral-700">Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="024XXXXXXX" 
                    className={`${styles.whitebgInput} input`}
                    {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={paymentForm.control}
            name="network"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-neutral-700">Network</FormLabel>
                <FormControl>
                  <Dropdown
                    onChangeHandler={field.onChange}
                    value={field.value}
                    items={["MTN", "Vodafone", "AirtelTigo"]}
                    placeholder="Select a network"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          
          <div className="flex justify-between !mt-[35px]">
                <button
                  type="button"
                  className={"button"}
                  // {`${
                  //   isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  // } button`}
                  onClick={handleBack}
                  // disabled={isSubmitting}
                >
                  Back
                </button>

                <button
                  type="submit"
                  className= {"button"}
                  // {`${
                  //   isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  // } button`}
                  // disabled={isSubmitting}
                >
                  {/*isSubmitting ? "Submitting..." : "Book Ride"*/}Book
                </button>
              </div>

        </form>
      </Form>
    </div>
  )
}

export default PayDialog