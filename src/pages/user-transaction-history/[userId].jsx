import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Seo from "../../components/common/seo";
import TransactionHistory from "../../components/dashboard-admin/user-transaction-history";

const Index = () => {
  const router = useRouter();
  const { userId } = router.query;

  return (
    <>
      <Seo pageTitle="User Plan Details" />
        <TransactionHistory userId={userId}/>
    </>
  );
};

export default dynamic(() => Promise.resolve(Index), { ssr: false });
