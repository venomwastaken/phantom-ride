"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { addMail } from "@/lib/actions/mail.action";

// Define the schema
const mailFormSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export default function MailForm() {
  // Define the useState hook inside the component body
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof mailFormSchema>>({
    resolver: zodResolver(mailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof mailFormSchema>) {
    setIsSubmitting(true);
    await addMail(values.email);
    console.log(values);
  }

  return (
    <>
      {isSubmitting ? (
        <div>
          <h2 className="h2 bold opacity-50 py-14">Thank You :)</h2>
        </div>
      ) : (
        <Form {...form}>
          <h2 className="h2 bold">Subscribe to our newsletter</h2>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-grow gap-3"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <input
                      placeholder="Enter your email"
                      className="max-w-full w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button className="button" type="submit">Submit</button>
          </form>
        </Form>
      )}
    </>
  );
}
