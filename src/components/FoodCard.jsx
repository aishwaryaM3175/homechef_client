import React, { useState } from 'react'
import { FaLeaf, FaDrumstickBite, FaStar, FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/userSlice';

function FoodCard({ data, shop }) {

  const [quantity, setQuantity] = useState(0)
  const dispatch = useDispatch()
  const { cartItems } = useSelector(state => state.user)
  const { location } = useSelector(state => state.map)

  const shopData =
    typeof data.shop === "object" && data.shop !== null
      ? data.shop
      : shop;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating
          ? <FaStar key={i} className="text-yellow-500 text-sm" />
          : <FaRegStar key={i} className="text-yellow-500 text-sm" />
      )
    }
    return stars;
  }

  const handleIncrease = () => setQuantity(quantity + 1)

  const handleDecrease = () => {
    if (quantity > 0) setQuantity(quantity - 1)
  }

  // Distance calculation (UNCHANGED)
  const getDistanceKm = () => {
    if (!location?.lat || !shopData?.location?.coordinates) return null;

    const toRad = (value) => (value * Math.PI) / 180;

    const lat1 = location.lat;
    const lon1 = location.lon;
    const [lon2, lat2] = shopData.location.coordinates;

    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1));
  };

  return (
    <div
      className="w-[290px] rounded-2xl border-2 shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--primary)",
        color: "var(--text)"
      }}
    >

      {/* IMAGE */}
      <div className="relative w-full h-[170px] bg-white">
        <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow">
          {data.foodType === "veg"
            ? <FaLeaf className="text-green-600" />
            : <FaDrumstickBite className="text-red-600" />
          }
        </div>

        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col p-4">

        {/* Dish Name */}
        <h1 className="font-semibold text-base truncate">
          {data.name}
        </h1>

        {/* Chef Name */}
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          👨‍🍳 {shopData?.name || "Chef"}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          {renderStars(data.rating?.average || 0)}
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            {data.rating?.count || 0}
          </span>
        </div>

        {/* Time & Distance */}
        {getDistanceKm() && (
          <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>
            ⏱ {Math.round(getDistanceKm() * 8)}–{Math.round(getDistanceKm() * 10)} min
            {" • "}
            📍 {getDistanceKm()} km
          </p>
        )}
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="px-4 pb-4 flex items-center justify-between">

        {/* Price - LEFT */}
        <span className="text-lg font-bold">
          ₹{data.price}
        </span>

        {/* Quantity + Cart - RIGHT */}
        <div className="flex items-center gap-2">

          {/* Quantity */}
          <div
            className="flex items-center rounded-full overflow-hidden"
            style={{
              border: "1px solid var(--border)",
              background: "var(--card-bg)"
            }}
          >
            <button onClick={handleDecrease} className="px-2 py-1">
              <FaMinus size={12} />
            </button>

            <span style={{ minWidth: "18px", textAlign: "center", fontWeight: 600 }}>
              {quantity}
            </span>

            <button onClick={handleIncrease} className="px-2 py-1">
              <FaPlus size={12} />
            </button>
          </div>

          {/* Add to Cart */}
          <button
            className={`px-3 py-2 rounded-full text-white transition
              ${cartItems.some(i => i.id === data._id)
                ? "bg-gray-700"
                : "bg-[#ff4d2d]"
              }`}
            onClick={() => {
              quantity > 0 &&
              dispatch(addToCart({
                _id: data._id,
                food: { _id: data._id },
                id: data._id,
                name: data.name,
                price: data.price,
                image: data.image,
                quantity,
                foodType: data.foodType,
                shop: {
                  _id: shopData._id,
                  city: shopData.city,
                  name: shopData.name
                }
              }))
            }}
          >
            <FaShoppingCart size={14} />
          </button>

        </div>
      </div>
    </div>
  )
}

export default FoodCard
