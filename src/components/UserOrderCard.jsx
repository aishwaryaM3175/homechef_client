import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../App'

function UserOrderCard({ data }) {
  const navigate = useNavigate()
  const [selectedRating, setSelectedRating] = useState({}) // itemId: rating

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-GB', {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
  }

  const handleRating = async (itemId, rating) => {
    console.log("CLICKED STAR", itemId, rating)
    
    try {
      const result = await axios.post(
        `${serverUrl}/api/item/rating`,
        { itemId, rating },
        { withCredentials: true }
      )

      console.log("RATING API RESPONSE", result.data)

      setSelectedRating(prev => ({
        ...prev,
        [itemId]: rating
      }))
    } catch (error) {
      console.log("RATING ERROR", error.response?.data || error.message)
    }
  }

  return (
    /* 🔹 THIS IS THE IMPORTANT WRAPPER (FOR POPUP SCROLL) */
    <div id={`rate-${data._id}`}>

      <div className='bg-white rounded-lg shadow p-4 space-y-4'>

        {/* HEADER */}
        <div className='flex justify-between border-b pb-2'>
          <div>
            <p className='font-semibold'>
              order #{data._id.slice(-6)}
            </p>
            <p className='text-sm text-gray-500'>
              Date: {formatDate(data.createdAt)}
            </p>
          </div>

          <div className='text-right'>
            {data.paymentMethod === "cod" ? (
              <p className='text-sm text-gray-500'>
                {data.paymentMethod.toUpperCase()}
              </p>
            ) : (
              <p className='text-sm text-gray-500 font-semibold'>
                Payment: {data.payment ? "true" : "false"}
              </p>
            )}

            <p className='font-medium text-blue-600'>
              {data.shopOrders?.[0]?.status}
            </p>
          </div>
        </div>

        {/* SHOP ORDERS */}
        {data.shopOrders.map((shopOrder, index) => (
          <div
            key={index}
            className="border rounded-lg p-3 bg-[#fffaf7] space-y-3"
          >
            <p>{shopOrder.shop?.name || "Chef"}</p>

            {/* ITEMS */}
            <div className='flex space-x-4 overflow-x-auto pb-2'>
              {shopOrder.shopOrderItems?.map((oi, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-40 border rounded-lg p-2 bg-white"
                >
                  <img
                    src={oi.item?.image || "/placeholder-food.png"}
                    alt=""
                    className="w-full h-24 object-cover rounded"
                  />

                  <p className="text-sm font-semibold mt-1">
                    {oi.item?.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    Qty: {oi.quantity} × ₹{oi.price}
                  </p>

                  {/* ⭐ RATING (ONLY IF DELIVERED) */}
                  {shopOrder.status === "delivered" && (
                    <div className="flex space-x-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          className={`text-lg ${

                        
                         (selectedRating[oi.item?._id || oi._id] || 0) >= star
                              ? 'text-yellow-400'
                              : 'text-gray-400'
                          }`}
                          
                          onClick={() => handleRating(oi.item?._id || oi._id, star)}


                        >
                          ☆ 

                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* SUBTOTAL */}
            <div className='flex justify-between items-center border-t pt-2'>
              <p className='font-semibold'>
                Subtotal: ₹{shopOrder.subtotal}
              </p>
              <span className='text-sm font-medium text-blue-600'>
                {shopOrder.status}
              </span>
            </div>
          </div>
        ))}

        {/* TOTAL + TRACK */}
        <div className='flex justify-between items-center border-t pt-2'>
          <p className='font-semibold'>
            Total: ₹{data.totalAmount}
          </p>

          <button
            className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-4 py-2 rounded-lg text-sm'
            onClick={() => navigate(`/track-order/${data._id}`)}
          >
            Track Order
          </button>
        </div>

      </div>
    </div>
  )
}

export default UserOrderCard


