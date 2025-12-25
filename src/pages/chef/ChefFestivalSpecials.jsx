import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../App";

function ChefFestivalSpecials() {
  const [festivals, setFestivals] = useState([]);
  const [shopId, setShopId] = useState(null);   // ✅ IMPORTANT

  const [form, setForm] = useState({
    festivalName: "",
    chefName: "",
    city: "",
    startDate: "",
    endDate: "",
    menuItems: "",
    price: "",
    quantityLimit: "",
    image: null,
  });

  // 🔹 Fetch chef shop (VERY IMPORTANT)
  const fetchMyShop = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/shop/my-shop`,
        { withCredentials: true }
      );
      if (res.data) {
        setShopId(res.data._id);
      } else {
        setShopId(null);
      }
    } catch (err) {
      console.log("Failed to fetch shop:", err);
      setShopId(null);
    }
  };

  // 🔹 Fetch festivals
  const fetchFestivals = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/festival/chef`,
        { withCredentials: true }
      );
      setFestivals(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMyShop();      // ✅ REQUIRED
    fetchFestivals();
  }, []);

  // 🔹 Create Festival
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!shopId) {
      alert("Shop not found. Please create your shop first.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("festivalName", form.festivalName);
      formData.append("chefName", form.chefName);
      formData.append("shopId", shopId);              // ✅ KEY FIX
      formData.append("city", form.city);
      formData.append("startDate", form.startDate);
      formData.append("endDate", form.endDate);
      formData.append("price", Number(form.price));
      formData.append("quantityLimit", Number(form.quantityLimit));

      formData.append(
        "menuItems",
        JSON.stringify(
          form.menuItems
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        )
      );

      if (form.image) {
        formData.append("image", form.image);
      }

      await axios.post(
        `${serverUrl}/api/festival/chef/create`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Reset form
      setForm({
        festivalName: "",
        chefName: "",
        city: "",
        startDate: "",
        endDate: "",
        menuItems: "",
        price: "",
        quantityLimit: "",
        image: null,
      });

      fetchFestivals();
      alert("Festival created successfully ✅");

    } catch (err) {
      console.log("Create festival error:", err.response?.data || err.message);
      alert("Failed to create festival");
    }
  };

  // 🔹 Enable / Disable festival
  const toggleFestival = async (id, isEnabled) => {
    try {
      await axios.patch(
        `${serverUrl}/api/festival/chef/toggle/${id}`,
        { isEnabled: !isEnabled },
        { withCredentials: true }
      );
      fetchFestivals();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🎉 Festival Specials</h1>

      {/* CREATE FORM */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">

        <input
          placeholder="Festival Name"
          value={form.festivalName}
          onChange={(e) =>
            setForm({ ...form, festivalName: e.target.value })
          }
          className="border p-2 w-full"
          required
        />

        <select
          value={form.city}
          onChange={(e) =>
            setForm({ ...form, city: e.target.value })
          }
          className="border p-2 w-full"
          required
        >
          <option value="">Select City</option>
          <option value="Hubli">Hubli</option>
          <option value="Dharwad">Dharwad</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setForm({ ...form, image: e.target.files[0] })
          }
          className="border p-2 w-full"
        />

        <input
          placeholder="Chef Name"
          value={form.chefName}
          onChange={(e) =>
            setForm({ ...form, chefName: e.target.value })
          }
          className="border p-2 w-full"
          required
        />

        <input
          type="date"
          value={form.startDate}
          onChange={(e) =>
            setForm({ ...form, startDate: e.target.value })
          }
          className="border p-2 w-full"
          required
        />

        <input
          type="date"
          value={form.endDate}
          onChange={(e) =>
            setForm({ ...form, endDate: e.target.value })
          }
          className="border p-2 w-full"
          required
        />

        <input
          placeholder="Menu Items (comma separated)"
          value={form.menuItems}
          onChange={(e) =>
            setForm({ ...form, menuItems: e.target.value })
          }
          className="border p-2 w-full"
          required
        />

        <input
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
          className="border p-2 w-full"
          required
        />

        <input
          placeholder="Quantity Limit"
          type="number"
          value={form.quantityLimit}
          onChange={(e) =>
            setForm({ ...form, quantityLimit: e.target.value })
          }
          className="border p-2 w-full"
          required
        />

        <button className="bg-orange-500 text-white px-4 py-2 rounded">
          Create Festival
        </button>
      </form>

      {/* FESTIVAL LIST */}
      {festivals.map((f) => (
        <div key={f._id} className="border p-4 rounded mb-3">
          <h2 className="font-semibold">{f.festivalName}</h2>
          <p>₹{f.price}</p>
          <button
            onClick={() => toggleFestival(f._id, f.isEnabled)}
            className="mt-2 px-3 py-1 rounded bg-gray-200"
          >
            {f.isEnabled ? "Disable" : "Enable"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default ChefFestivalSpecials;
