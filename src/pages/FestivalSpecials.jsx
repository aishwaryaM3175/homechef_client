import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

function FestivalSpecials() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

const [quantities, setQuantities] = useState({});

  const [festivals, setFestivals] = useState([]);

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/festival`);
        setFestivals(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchFestivals();
  }, []);


const isFestivalActive = (startDate, endDate) => {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  return today >= start && today <= end;
};

const handleAddToCart = (festival) => {
  const qty = quantities[festival._id] || 1;

  dispatch(
    addToCart({
      _id: festival._id,
      name: festival.festivalName,
       itemName: festival.menuItems[0],
       chefName: festival.chefName,
    city: festival.city,
      price: festival.price,
      quantity: qty,
      orderType: "FESTIVAL",
      festivalId: festival._id,
   //   shop: festival.chefId,
   shop: {
  _id: festival.shopId   // MUST be shop _id
},

        image: festival.image || ""
    })
  );
};


  return (
   <div className="min-h-screen px-4">

      <h1 className="text-2xl font-bold mb-6">🎉 Festival Specials</h1>

      <div className="grid gap-6">

      <button
  onClick={() => navigate("/")}
  className="mb-6 px-6 py-2 bg-orange-500 text-white rounded-lg inline-flex items-center"
      >
  ← Back
</button>


        {festivals.length === 0 && (
          <p>No festival specials available right now.</p>

        )}

        {festivals.map(festival => (
          <div
            key={festival._id}
            className="p-4 border rounded-xl shadow-sm"
          >
            <h2 className="text-xl font-semibold">
              {festival.festivalName}
            </h2>
<p className="text-sm text-gray-500">
  👨‍🍳 {festival.chefName}
</p>

<p className="text-sm text-gray-500">
  📍 {festival.city}
</p>

            <p className="text-sm text-gray-600">
              Available from {new Date(festival.startDate).toDateString()}
            </p>
                
             {festival.endDate && (
                <p className="text-sm text-gray-600">
           Ends on {new Date(festival.endDate).toDateString()}
             </p>
               )}





            <ul className="mt-2 list-disc list-inside">
              {festival.menuItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <p className="mt-2 font-semibold">₹{festival.price}</p>





              {festival.quantityLimit !== undefined && festival.quantityLimit !== null && (
            <p className="text-sm text-gray-500 mt-1">
              Limited to {festival.quantityLimit} orders
            </p>
              )}

{isFestivalActive(festival.startDate, festival.endDate) ? (
  <>
    {/* Quantity Selector */}
    <div className="flex items-center gap-3 mt-3">
      <label className="text-sm">Qty:</label>
      <input
        type="number"
        min="1"
        max={festival.quantityLimit}
        value={quantities[festival._id] || 1}
        onChange={(e) =>
          setQuantities({
            ...quantities,
            [festival._id]: Number(e.target.value),
          })
        }
        className="w-20 border px-2 py-1 rounded"
      />
     

    </div>

    {/* Order Button */}
    <button
      onClick={() => handleAddToCart(festival)}
      className="mt-3 px-4 py-2 bg-orange-500 text-white rounded-lg"
    >
      Order
    </button>
  </>
) : (
  <button
    className="mt-3 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
    disabled
  >
    Not Available
  </button>
)}

          

            
              
          </div>
        ))}
      </div>
    </div>
  );
}

export default FestivalSpecials;
