"use client";

import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { addMail } from "@/lib/actions/mail.action";

const mailFormSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

const MailForm = () => {
  const form = useForm<z.infer<typeof mailFormSchema>>({
    resolver: zodResolver(mailFormSchema),
    defaultValues: {
      email: "",
    },
  });


  async function onSubmit(values: z.infer<typeof mailFormSchema>) {
    await addMail(values.email)
    console.log(values)
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input className={`input`} placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button type="submit">Book Ride</button>
        </form>
      </Form>
    </div>
  );
};

export default MailForm;
