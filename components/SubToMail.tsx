"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"

const subFormSchema = z.object({
  email: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

export default function ProfileForm() {
    // 1. Define your form.
    const form = useForm<z.infer<typeof subFormSchema>>({
        resolver: zodResolver(subFormSchema),
        defaultValues: {
          email: "",
        },
      })
     
      // 2. Define a submit handler.
      function onSubmit(values: z.infer<typeof subFormSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
      }

  return (
    <Form {...form}>
        <h2 className="h2 bold">Subscribe to our newsletter</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-grow gap-3">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <input placeholder="Enter your email" className="max-w-full w-full" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </Form>
  )
}
