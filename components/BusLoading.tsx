import styles from "../app/book/bs.module.css";
import { Skeleton } from "./ui/skeleton";

export default function BusLoading() {
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

  return (
    <>
      <div className={`${styles.cardForm} justify-self-end ${styles.contain}`}>
        <div>
          <Skeleton className="h-5 w-28 mt-2 mb-2 mx-[2px]" />
          <Skeleton className="h-5 w-[118px] mt-1 mb-2 mx-[2px]" />
          <div className={`${styles.busSeats}`}>
            <div className={styles.col}>
              {col1.map((seat) => (
                <Skeleton
                  key={seat}
                  className="h-[47px] w-[47px] m-[2px] rounded-[8px]"
                />
              ))}
            </div>
            <div className={styles.col}>
              {col2.map((seat) => (
                <Skeleton
                  key={seat}
                  className="h-[47px] w-[47px] m-[2px] rounded-[8px]"
                />
              ))}
            </div>
            <div className={`${styles.col} ${styles.middle}`}>
              {col3.map((seat) => (
                <Skeleton
                  key={seat}
                  className="h-[47px] w-[47px] m-[2px] rounded-[8px]"
                />
              ))}
            </div>
            <div className={styles.col}>
              {col4.map((seat) => (
                <Skeleton
                  key={seat}
                  className="h-[47px] w-[47px] m-[2px] rounded-[8px]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
