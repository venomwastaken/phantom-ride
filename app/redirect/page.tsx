import Navbar from "@/components/shared/Navbar";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const redirect = () => {
  return (
    <>
      <Navbar />

      <section className="wrapper">
        <div className="flex flex-col w-3/4 lg:w-2/3 mx-auto text-center items-center md:mt-20 mt-12">
          <Image
            src="/assets/logo.JPG"
            alt="Picture of the author"
            sizes="100vw"
            style={{
              width: "114px",
              height: "auto",
              borderRadius: "200px",
              border: "solid var(--mylime) 3px",
            }}
            width={914}
            height={914}
            quality={100}
          />
          <h2 className="text-3xl bold my-6">
            Your booking request is being proccessed.
          </h2>
          <p className="w-3/4">
            We have recieved your booking request and it will proccessed shortly.
            You will recieve a confirmation message containing your ticket code via email and sms.
            For now, check out our <Link href="/pickups" className = "underline">pickup points</Link>.
          </p>
        </div>
      </section>
    </>
  );
};

export default redirect;
