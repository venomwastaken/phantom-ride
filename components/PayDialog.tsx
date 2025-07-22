'use client'
import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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




const formSchema = z.object({
  phoneNumber: z.string().length(10, "Enter valid phone number"),
  network: z.string().min(2, "Select a network")
})



export function PayDialog ({open, onOpenChange, data, price}:{open:boolean, onOpenChange:(open:boolean)=>void, data:any, price:number}) {
const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    phoneNumber: "",
    network: "",
  },
})

const router= useRouter()

function onSubmit(values: z.infer<typeof formSchema>) {
  //console.log(values)
  //console.log("Booking Data:", data)"

  try {
      initializePayment({
        price: price,
        phoneNumber: values.phoneNumber,
        networkBankCode: (values.network==="MTN")?"MTN":(values.network==="Telecel Gh")?"VOD":"AIR",
        email: data.email,
        firstName: data.fullName.split(" ")[0],
        lastName: data.fullName.split(" ").slice(-1)[0],
        selectedSeats: data.seats,
        reference: data.reference,
      })
  } catch (error) {
    console.error("Error:", error);
  }
  router.push("/redirect");
}

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[425px] bg-white rounded-md">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            <DialogHeader>
              <DialogTitle>Make payment</DialogTitle>
              <DialogDescription>
                Enter your mobile money number to proceed.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                <FormItem>
                <Label htmlFor="name-1">Number</Label>
                <Input {...field} className="bg-[#ebebeb] m-0 max-w-full outline outline-1 outline-neutral-500"/>
                </FormItem>
                )}
                />

              </div>

              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="network"
                  render={({ field }) => (
                    <FormItem>
                    <Label htmlFor="network">Network</Label>
                    <Dropdown 
                    onChangeHandler={field.onChange}
                    value={field.value}
                    placeholder='network name' items={["MTN", "Telecel Gh", "AirtelTigo"]} className="dailog"/>
                  </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" className='mb-2'>Proceed</Button>
            </DialogFooter>
            </form>
          </Form>
        </DialogContent>
    </Dialog>
  )
}

export default PayDialog