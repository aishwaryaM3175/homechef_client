import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/subscription/user`);
        setSubscriptions(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSubscriptions();
  }, []);

  return (
    <div className="w-full min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">📦 Subscriptions</h1>

      <div className="grid gap-6">
        {subscriptions.length === 0 && (
          <p>No subscriptions available.</p>
        )}

        {subscriptions.map(sub => (
          <div
            key={sub._id}
            className="p-4 border rounded-xl shadow-sm"
          >
            <h2 className="text-lg font-semibold">
              {sub.subscriptionName}
            </h2>

            <p>{sub.mealSlot} • {sub.mealType}</p>
            <p>{sub.daysIncluded}</p>
            <p>{sub.duration}</p>

            <p className="mt-2 font-semibold">₹{sub.price}</p>

            <button
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg"
              disabled
            >
              Subscribe (Coming Soon)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Subscriptions;
