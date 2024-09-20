import Footer from "@/components/shared/Footer"
import Navbar from "@/components/shared/Navbar"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import Link from "next/link"
  

const faqs = () => {
  return (
    <>
        <Navbar/>
        <section className="wrapper lg:mt-16">
            <h2 className="text-3xl medium mb-6 lg:text-4xl">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger className="bg-white text-black px-0 bold mb-3">How do I book?</AccordionTrigger>
                    <AccordionContent>
                    Booking a bus is easy. Simply visit our website, choose your destination, select your preferred travel date, then hit "book ride"! From there, fill out the simple form and make payment by your preferred means.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger className="bg-white text-black px-0 bold mb-3">What are the payment options?</AccordionTrigger>
                    <AccordionContent>
                    We accept various payments only from mobile money at the moment. Other payment methods will be added soon.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger className="bg-white text-black px-0 bold mb-3">Can I change my booking?</AccordionTrigger>
                    <AccordionContent>
                    Yes, you can modify your booking up to a certain time before your scheduled departure. Please contact us on more information on how to do this.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger className="bg-white text-black px-0 bold mb-3">What is your cancellation policy?</AccordionTrigger>
                    <AccordionContent>
                    We have a flexible cancellation policy that allows you to cancel your booking and receive a refund, subject to certain terms and conditions. Please contact us for more info.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                    <AccordionTrigger className="bg-white text-black px-0 bold mb-3">Is Wi-Fi available onboard?</AccordionTrigger>
                    <AccordionContent>
                    Yes, we provide complimentary Wi-Fi onboard our buses. Stay connected and enjoy browsing the internet during your journey
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <div className="flex my-14">
                <h4 className=" font-medium ">Still have questions?</h4>  
                <p className="font-normal ml-2 underline hover:font-medium">
                    <Link href="/contact">Contact Us</Link>
                </p>
            </div>
            
        </section>
        <Footer/>
    </>

  )
}

export default faqs