import { z } from "zod"

export const formSchema = z.object({
  pickup: z.string().min(2, {
    message: "Select a pickup location.",
  }),
  destination: z.string().min(2, {
    message: "Select your destination.",
  }),
  date: z.string().min(2, {
    message: "Select a date.",
  }),
  fullName: z.string().min(2, {
    message: "Enter your fullname.",
  }),
  email: z.string().email().min(2, {
    message: "Enter a valid email.",
  }),
  phone: z.string().length(10, {
    message: "Phone number must be 10 characters.",
  }),
  seats: z.string().min(2, {
    message: "Select at least 1 seat.",
  }),
})

