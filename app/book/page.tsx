'use client'


import Navbar from "@/components/shared/Navbar";
import { Suspense } from "react";
import BusLayout from "@/components/BusLayout";
import BookForm from "@/components/BookForm";
import styles from "./bs.module.css";
import { useSearchParams } from "next/navigation";
import BusWrapper from "@/components/BusContext";

export default function Test() {
  const searchParams = useSearchParams();
  const pickup = searchParams.get("pickup") || "";
  const date = searchParams.get("date") || "";


  return (
    <BusWrapper>
      <Navbar />
        <div className={`${styles.bookingContainer} wrapper`}>
          <BusLayout/>

          <BookForm
            pickup={pickup}
            date={date}
          />
        </div>
    </BusWrapper>
  );
}
