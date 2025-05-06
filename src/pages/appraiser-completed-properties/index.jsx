import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import CompletedProperty from "../../components/dashboard/appraiser-completed-properties";

const index = () => {
  return (
    <>
      <Seo pageTitle="Appraiser Completed Properties" />
      <CompletedProperty />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
