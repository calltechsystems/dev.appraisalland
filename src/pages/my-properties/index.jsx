import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import MyProperties from "../../components/dashboard/my-properties-new";

const index = () => {
  return (
    <>
      <Seo pageTitle="My Properties" />
      <MyProperties />
    </>
  );
};

export default index;
