import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../App";

function ChefSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [form, setForm] = useState({
    subscriptionName: "",
    mealSlot: "",
    mealType: "",
    daysIncluded: "",
    duration: "",
    price: "",
    maxSubscribers: ""
  });

  const fetchSubscriptions = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/subscription/chef`,
        { withCredentials: true }
      );
      setSubscriptions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${serverUrl}/api/subscription/chef/create`,
        form,
        { withCredentials: true }
      );

      setForm({
        subscriptionName: "",
        mealSlot: "",
        mealType: "",
        daysIncluded: "",
        duration: "",
        price: "",
        maxSubscribers: ""
      });

      fetchSubscriptions();
    } catch (err) {
      console.log(err);
    }
  };

  const toggleSubscription = async (id, isEnabled) => {
    try {
      await axios.patch(
        `${serverUrl}/api/subscription/chef/toggle/${id}`,
        { isEnabled: !isEnabled },
        { withCredentials: true }
      );
      fetchSubscriptions();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📦 Subscriptions</h1>

      {/* CREATE FORM */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input
          placeholder="Subscription Name"
          value={form.subscriptionName}
          onChange={e => setForm({ ...form, subscriptionName: e.target.value })}
          className="border p-2 w-full"
        />

        <input
          placeholder="Meal Slot (Breakfast/Lunch/Dinner)"
          value={form.mealSlot}
          onChange={e => setForm({ ...form, mealSlot: e.target.value })}
          className="border p-2 w-full"
        />

        <input
          placeholder="Meal Type (Veg/Non-Veg)"
          value={form.mealType}
          onChange={e => setForm({ ...form, mealType: e.target.value })}
          className="border p-2 w-full"
        />

        <input
          placeholder="Days Included (Mon-Fri / All days)"
          value={form.daysIncluded}
          onChange={e => setForm({ ...form, daysIncluded: e.target.value })}
          className="border p-2 w-full"
        />

        <input
          placeholder="Duration (Weekly / Monthly)"
          value={form.duration}
          onChange={e => setForm({ ...form, duration: e.target.value })}
          className="border p-2 w-full"
        />

        <input
          placeholder="Price"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
          className="border p-2 w-full"
        />

        <input
          placeholder="Max Subscribers"
          value={form.maxSubscribers}
          onChange={e => setForm({ ...form, maxSubscribers: e.target.value })}
          className="border p-2 w-full"
        />

        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Subscription
        </button>
      </form>

      {/* LIST */}
      {subscriptions.map(sub => (
        <div key={sub._id} className="border p-4 rounded mb-3">
          <h2 className="font-semibold">{sub.subscriptionName}</h2>
          <p>{sub.mealSlot} • {sub.mealType}</p>
          <p>₹{sub.price}</p>
          <button
            onClick={() => toggleSubscription(sub._id, sub.isEnabled)}
            className="mt-2 px-3 py-1 rounded bg-gray-200"
          >
            {sub.isEnabled ? "Disable" : "Enable"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default ChefSubscriptions;
