import LoadingSpinner from "@/components/LoadingSpinner";
import Navbar from "@/components/shared/Navbar";
import React from "react";

const loading = () => {
  return (
    <>
      <Navbar />
      <LoadingSpinner/>
    </>
  );
};

export default loading;
