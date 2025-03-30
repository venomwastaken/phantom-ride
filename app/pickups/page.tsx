import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import styles from "./pickUps.module.css"
import Image from "next/image";
import Link from "next/link";

const pickUps = () => {
  return (
    <>
      <Navbar />
      <section className="wrapper flex flex-col items-center">
        <h2 className="text-3xl medium lg:mt-10 lg:text-4xl">
          End Points
        </h2>
        <p className={`mt-3 ${styles.p} text-center`}>We currently have three end points and more to be added...</p>
        <div className="flex flex-col md:flex-row mt-10 gap-7">
          <Link href="https://maps.app.goo.gl/NRnkCSmFAvS9C8hE8">
            <div className={styles.cardPickup}>
            <Image
                src="/assets/icons/pin_drop_green.png"
                alt="pin_drop"
                sizes="100vw"
                width={90}
                height={90}
              />
              <h3 className="text-xl font-semibold mt-4">Accra</h3>
              <p className="mt-2">Circle</p>
            </div>
          </Link>
          <Link href="https://maps.app.goo.gl/deaQjtD9Uodfu8VZ9">
            <div className={styles.cardPickup}>
            <Image
                src="/assets/icons/pin_drop_green.png"
                alt="pin_drop"
                sizes="100vw"
                width={90}
                height={90}
              />
              <h3 className="text-xl font-semibold mt-4">Tema</h3>
              <p className="mt-2">Community 1</p>
            </div>
          </Link>
          <Link href="https://maps.app.goo.gl/usWyKcdRAy83mWsE6">
            <div className={styles.cardPickup}>
            <Image
                src="/assets/icons/pin_drop_green.png"
                alt="pin_drop"
                sizes="100vw"
                width={90}
                height={90}
              />
              <h3 className="text-xl font-semibold mt-4">Adenta</h3>
              <p className="mt-2">KFC Adenta</p>
            </div>
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default pickUps;
