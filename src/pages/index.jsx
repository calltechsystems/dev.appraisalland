"use client";

import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import HomeMain from "../components/home";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../components/common/ErrorFallback";

const IndexPage = () => {
  return (
    <>
      <Seo pageTitle="Homepage" />
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={(error, info) => {
          console.error("Error caught by ErrorBoundary:", error);
        }}
      >
        <HomeMain />
      </ErrorBoundary>
    </>
  );
};

export default dynamic(() => Promise.resolve(IndexPage), { ssr: false });
