"use client";
import styles from "../app/book/bs.module.css";
import { useBusContext } from "./BusContext";
import BusLoading from "./BusLoading";

export default function BusLayout({price, handleBack, onSubmit, data, luggagePrice, isSubmitting}: 
                                  {price: number, handleBack: () => void, onSubmit: (data: any) => void, data: any, luggagePrice: number, isSubmitting: boolean}) {
  const col1 = [
    "01",
    "04",
    "07",
    "10",
    "13",
    "16",
    "19",
    "22",
    "25",
    "28",
    "31",
  ];
  const col2 = [
    "02",
    "05",
    "08",
    "11",
    "14",
    "17",
    "20",
    "23",
    "26",
    "29",
    "32",
  ];
  const col3 = ["33"];
  const col4 = [
    "03",
    "06",
    "09",
    "12",
    "15",
    "18",
    "21",
    "24",
    "27",
    "30",
    "34",
  ];

  const { takenSeats, selectedSeats, setSelectedSeats, isLoadingSeats, busId } =
    useBusContext();

  function selectHandler(id: string) {
    if (!takenSeats.includes(id)) {
      setSelectedSeats(
        (prevSelectedSeats: string[]) =>
          prevSelectedSeats.includes(id)
            ? prevSelectedSeats.filter((seat) => seat !== id) // Deselect if already selected
            : [...prevSelectedSeats, id] // Select new seat
      );
    }
  }

  return (
    <>
      {isLoadingSeats ? (
        <BusLoading />
      ) : (
        <div className={`${styles.cardForm} ${styles.contain} align-center`}>
          <div>
            <h2 className="bold text-xl">Select a seat</h2>
            <p className="text-[12px] text-muted-foreground mt-1 mx-[2px] mb-[20px]">
              BusId: {busId !== null ? busId : "XXXXXXX"}
            </p>

            <div className={`${styles.busSeats}`}>
              <div className={styles.col}>
                {col1.map((seat) => (
                  <div
                    key={seat}
                    onClick={() => selectHandler(seat)}
                    className={`${styles.seats} ${
                      takenSeats.includes(seat)
                        ? styles.taken
                        : selectedSeats.includes(seat)
                        ? styles.selected
                        : ""
                    }`}
                  >
                    {seat}
                  </div>
                ))}
              </div>
              <div className={styles.col}>
                {col2.map((seat) => (
                  <div
                    key={seat}
                    onClick={() => selectHandler(seat)}
                    className={`${styles.seats} ${
                      takenSeats.includes(seat)
                        ? styles.taken
                        : selectedSeats.includes(seat)
                        ? styles.selected
                        : ""
                    }`}
                  >
                    {seat}
                  </div>
                ))}
              </div>
              <div className={`${styles.col} ${styles.middle}`}>
                {col3.map((seat) => (
                  <div
                    key={seat}
                    onClick={() => selectHandler(seat)}
                    className={`${styles.seats} ${
                      takenSeats.includes(seat)
                        ? styles.taken
                        : selectedSeats.includes(seat)
                        ? styles.selected
                        : ""
                    }`}
                  >
                    {seat}
                  </div>
                ))}
              </div>
              <div className={styles.col}>
                {col4.map((seat) => (
                  <div
                    key={seat}
                    onClick={() => selectHandler(seat)}
                    className={`${styles.seats} ${
                      takenSeats.includes(seat)
                        ? styles.taken
                        : selectedSeats.includes(seat)
                        ? styles.selected
                        : ""
                    }`}
                  >
                    {seat}
                  </div>
                ))}
              </div>
            </div>
          </div>
        
          <p className="mt-[15px] text-xs text-gray-500 bold">
              Price: GHS {price !== null ? (price * selectedSeats.length).toFixed(2): 0.00}
          </p>

          <div className="flex justify-between mt-3 w-full">
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
                type="button"
                className= {`button disabled:cursor-not-allowed disabled:opacity-50`}
                disabled={isSubmitting || selectedSeats.length === 0}
                onClick={() => onSubmit(data)} // Dummy argument to match the expected function signature
              >
                {/*isSubmitting ? "Submitting..." : "Book Ride"*/}Next
              </button>
            </div>
        
        </div>
      )}
    </>
  );
}
