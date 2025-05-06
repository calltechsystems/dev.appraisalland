import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import AcceptedProperty from "../../components/dashboard/appraiser-accepted-properties";

const index = () => {
  return (
    <>
      <Seo pageTitle="Appraiser Accepted Properties" />
      <AcceptedProperty />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
