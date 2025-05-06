import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import MyPlans from "./plans";
import { useState } from "react";
import { useRouter } from "next/router";
import OneTimePaymentModal from "../../components/common/paypalGateway/OneTimePaymentModal";
import SubscriptionModal from "../../components/common/paypalGateway/SubscriptionModal";
import CancelSubscriptionModal from "../../components/common/paypalGateway/CancelSubscriptionModal";
import ReviseSubscriptionModal from "../../components/common/paypalGateway/ReviseSubscriptionModal";
import NoPlanModal from "../../components/common/NoPlanModal/page";

const Index = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const [currentSubscription, setcurrentSubscription] = useState({});
  const [price, setPrice] = useState({
    title: "Basic",
    price: 0,
    type: "plan",
    item: {},
  });

  const [canUpgrade, setCanUpgrade] = useState(true);
  const [userDetailField, setUserDetailsField] = useState("brokerDetail");
  const [userData, setUserData] = useState({});

  const [isSubscriptionDetailsEmpty, setIsSubscriptionDetailsEmpty] =
    useState(false);

  const closeModal = () => {
    setModalOpen(false);
  };

  const onCloseHandler = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <>
      <Seo pageTitle="My Plans" />
      {isSubscriptionDetailsEmpty ? (
        <NoPlanModal onCloseHandler={onCloseHandler} />
      ) : (
        <>
          <MyPlans
            currentSubscription={currentSubscription}
            setModalOpen={setModalOpen}
            setPrice={setPrice}
            userData={userData}
            modalOpen={modalOpen}
            setcurrentSubscription={setcurrentSubscription}
            setCanUpgrade={setCanUpgrade}
            canUpgrade={canUpgrade}
            userDetailField={userDetailField}
            setIsSubscriptionDetailsEmpty={setIsSubscriptionDetailsEmpty}
          />
          {price?.type == "plan" ? (
            <SubscriptionModal
              currentSubscription={currentSubscription}
              modalOpen={modalOpen}
              closeModal={closeModal}
              price={price}
              userDetailField={userDetailField}
            />
          ) : price?.type == "cancel_plan" ? (
            <CancelSubscriptionModal
              currentSubscription={currentSubscription}
              modalOpen={modalOpen}
              closeModal={closeModal}
              price={price}
              userDetailField={userDetailField}
            />
          ) : price?.type == "upgrade_plan" ? (
            <ReviseSubscriptionModal
              currentSubscription={currentSubscription}
              modalOpen={modalOpen}
              closeModal={closeModal}
              price={price}
              userDetailField={userDetailField}
            />
          ) : (
            <OneTimePaymentModal
              currentSubscription={currentSubscription}
              modalOpen={modalOpen}
              closeModal={closeModal}
              price={price}
              userDetailField={userDetailField}
            />
          )}
        </>
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(Index), { ssr: false });
