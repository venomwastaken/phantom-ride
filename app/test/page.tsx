"use client";
import Navbar from "@/components/shared/Navbar";
import { Suspense, useEffect, useState } from "react";
import BusLayout from "@/components/BusLayout";
import BookForm from "@/components/BookForm";
import styles from "@/app/book/bs.module.css";
import { useSearchParams } from "next/navigation";

export default function Test() {
  const searchParams = useSearchParams();
  const pickup = searchParams.get("pickup") || "";
  const date = searchParams.get("date") || "";
  const [takenSeats, setTakenSeats] = useState<string[]>([]); // Example of taken seats
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  function handleSeatSelectionChange(newSelectedSeats: string[]) {
    setSelectedSeats(newSelectedSeats);
  }

  function handleTakenSeats(takenSeats: string[]) {
    setTakenSeats(takenSeats);
  }

  return (
    <>
      <Navbar />
      <Suspense>
        <div className={`${styles.bookingContainer} wrapper`}>
          <BusLayout
            takenSeats={takenSeats}
            selectedSeats={selectedSeats}
            onSeatSelectionChange={handleSeatSelectionChange} // Pass the callback function
          />

          <BookForm
            pickup={pickup}
            date={date}
            selectedSeats={selectedSeats}
            onSeatSelectionChange={handleSeatSelectionChange}
            sendTakenSeats={handleTakenSeats}
          />
        </div>
      </Suspense>
    </>
  );
}
