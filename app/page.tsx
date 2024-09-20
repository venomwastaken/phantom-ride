import HomeForm from "@/components/HomeForm";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import SubToMail from "@/components/SubToMail";
import Image from "next/image";
import Link from "next/link";
const date = new Date();


export default function Home() {
  return (
    <>
      <Navbar color="black" />
      <section className="hero-section">
        <div className="hero-content wrapper">
          <div className="form-container">
            <h1 className="bold h2">Your journey starts here.</h1>
            <p className="w-3/4 text-neutral-300 heroText">
              Book a ride, experience comfort on wheels. We take you to and from
              KNUST safely.
            </p>
            <HomeForm />
          </div>
          <div>
            <Image
              src="/assets/herophoto.png"
              alt="Picture of the author"
              sizes="100vw"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "8px",
              }}
              width={373}
              height={412}
              quality={100}
            />
          </div>
        </div>
      </section>
      <section className="wrapper section">
        <div className="flex flex-col justify-center max-w-lg">
          <h2 className="h2 bold">We prioritize your saftey and comfort</h2>
          <p>
            From home to school and back home, we take you safely without
            compromising your comfort and convenience. Book straight from home
            and we pick you up at your terminal. Check out our pickup points.
          </p>
          <button type="button" className="w-fit mt-1">
            <Link href="/pickups">Pickup Point</Link>
          </button>
        </div>
        <Image
          src="/assets/bus_seats_photo_crop.jpg"
          alt="Picture of the author"
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "8px",
          }}
          width={960}
          height={1280}
          quality={100}
        />
      </section>
      <section className="wrapper section sec-section">
        <Image
          src="/assets/pic3_crop.png"
          alt="Picture of the author"
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "8px",
          }}
          width={576}
          height={837}
          quality={100}
          className=" order-2 lg:order-1"
        />
        <div className="flex flex-col justify-center max-w-lg order-1 lg:order-2">
          <h2 className="h2 bold">How it works</h2>
          <ul className=" list-disc  pl-5">
            <li className="pb-1">
              <span className="font-medium">Step 1 :</span> Choose your pick-up
              point and destination.
            </li>
            <li className="pb-1">
              <span className="font-medium">Step 2 :</span> Select your
              preferred seat and complete the booking.
            </li>
            <li className="pb-1">
              <span className="font-medium">Step 3 :</span> Receive your
              confirmation and enjoy the ride.
            </li>
          </ul>
          <button type="button" className="w-fit mt-3">
            <Link href="/book">Book Ride</Link>
          </button>
        </div>
      </section>
      <section className="subToMail">
        <div className="wrapper">
          <SubToMail />
        </div>
      </section>
      <Footer />
    </>
  );
}
