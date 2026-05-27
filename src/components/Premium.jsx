import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { BASE_URL } from "../utils/const";

const membershipPlans = [
  {
    type: "silver",
    title: "Silver Membership",
    price: 500,
    duration: "3 Months",
    buttonClass: "btn-secondary",
    features: [
      "Chat with other developers",
      "100 connection requests per day",
      "Blue Tick",
    ],
  },
  {
    type: "gold",
    title: "Gold Membership",
    price: 700,
    duration: "6 Months",
    buttonClass: "btn-primary",
    features: [
      "Chat with other developers",
      "Unlimited connection requests",
      "Blue Tick",
    ],
  },
];

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    verifyUserPremium();
  }, []);

  // VERIFY USER PREMIUM STATUS
  const verifyUserPremium = async () => {
    try {
      const { data } = await axios.get(BASE_URL + "/premium/verify", {
        withCredentials: true,
      });
      setIsUserPremium(data.isPremium);
    } catch (err) {
      console.error(err);
      toast.error("Failed to verify premium status", {
        duration: 3000,
      });
    }
  };

  // VERIFY PAYMENT
  const verifyPremiumUser = async (response) => {
    try {
      setLoading(true);
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        response;

      await axios.post(
        BASE_URL + "/payment/verify",
        {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        },
        {
          withCredentials: true,
        },
      );

      toast.success("Your payment was successful 🎉", {
        duration: 3000,
      });
      setIsUserPremium(true);
    } catch (err) {
      console.error(err);
      toast.error("Your payment failed ❌", {
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // CREATE ORDER + OPEN RAZORPAY
  const handleBuyClick = async (membershipType) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        BASE_URL + "/payment/create",
        {
          membershipType,
        },
        {
          withCredentials: true,
        },
      );

      const { amount, keyId, currency, notes, orderId } = data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "Dev Tinder",
        description: "Connect with developers worldwide",
        order_id: orderId,
        prefill: {
          name: `${notes.firstName} ${notes.lastName}`,
          email: notes.emailId,
          contact: "9999999999",
        },
        theme: {
          color: "#F37254",
        },
        handler: verifyPremiumUser,
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function () {
        toast.error("Your payment failed ❌", {
          duration: 3000,
        });
      });
      razorpay.open();
    } catch (err) {
      console.error(err);
      toast.error("Unable to initiate payment", {
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // PREMIUM USER UI
  if (isUserPremium) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="bg-base-300 p-10 rounded-3xl shadow-xl text-center">
          <h1 className="text-4xl font-bold mb-4">🎉 Premium Active</h1>
          <p className="text-lg">You already have premium access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold">Upgrade to Premium</h1>
        <p className="mt-4 text-lg opacity-70">
          Unlock better networking and premium developer features.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {membershipPlans.map((plan) => (
          <div
            key={plan.type}
            className="bg-base-300 rounded-3xl p-8 shadow-xl flex flex-col justify-between hover:scale-105 transition duration-300"
          >
            <div>
              <h2 className="text-3xl font-bold">{plan.title}</h2>
              <div className="mt-4">
                <span className="text-5xl font-bold">₹{plan.price}</span>
                <span className="ml-2 opacity-70">/ {plan.duration}</span>
              </div>
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    ✅ {feature}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => handleBuyClick(plan.type)}
              disabled={loading}
              className={`btn mt-10 ${plan.buttonClass}`}
            >
              {loading ? "Processing..." : `Buy ${plan.title}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Premium;
