"use client";
import styles from "../app/book/bs.module.css";
import { useBusContext } from "./BusContext";
import BusLoading from "./BusLoading";


export default function BusLayout() {
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

  const {takenSeats, selectedSeats, setSelectedSeats, isLoadingSeats} = useBusContext()



  function selectHandler(id: string) {
    if (!takenSeats.includes(id)) {
      setSelectedSeats(
        (prevSelectedSeats : string[]) =>
          prevSelectedSeats.includes(id)
            ? prevSelectedSeats.filter((seat) => seat !== id) // Deselect if already selected
            : [...prevSelectedSeats, id] // Select new seat
      );
    }
  }


  return (
    <> 
      {isLoadingSeats? <BusLoading/>:
      <div className={`${styles.busSeats} ${styles.cardForm}`}>
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
      }
    </>
  );
}
