'use client'


import Navbar from "@/components/shared/Navbar";
import BusLayout from "@/components/BusLayout";
import BookForm from "@/components/BookForm";
import styles from "./bs.module.css";
import { useSearchParams } from "next/navigation";
import BusWrapper from "@/components/BusContext";
import Notice from "@/components/shared/Notice";

export default function Book() {
  const searchParams = useSearchParams();
  const pickup = searchParams.get("pickup") || "";
  const date = searchParams.get("date") || "";


  return (
    <BusWrapper>
      <Notice/>
      <Navbar />
        <div className={`${styles.bookingContainer} wrapper`}>
          <div><BusLayout/></div>
          <BookForm
            pickup={pickup}
            date={date}
          />
        </div>
    </BusWrapper>
  );
}
