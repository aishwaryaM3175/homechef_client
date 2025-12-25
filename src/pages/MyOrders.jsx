import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import UserOrderCard from '../components/UserOrderCard';
import OwnerOrderCard from '../components/OwnerOrderCard';
import { setMyOrders, updateRealtimeOrderStatus } from '../redux/userSlice';

function MyOrders() {
  const { userData, myOrders, socket } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showDeliveredPopup, setShowDeliveredPopup] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);

  const [selectedOrderId, setSelectedOrderId] = useState(null);

  /* ---------------- SOCKET (ONLY STATUS UPDATE) ---------------- */
  useEffect(() => {
    if (!socket) return;

    const handleStatusUpdate = ({ orderId, shopId, status, userId }) => {
      if (userId === userData._id) {
        dispatch(updateRealtimeOrderStatus({ orderId, shopId, status }));
      }
    };

    socket.on("update-status", handleStatusUpdate);

    return () => {
      socket.off("update-status", handleStatusUpdate);
    };
  }, [socket, userData, dispatch]);

  /* ---------------- POPUP LOGIC (NO SOCKET) ---------------- */
 useEffect(() => {
  if (!socket || !userData) return;

  const handleStatusUpdate = ({ orderId, status, userId }) => {
    // 1️⃣ Update redux
    dispatch(updateRealtimeOrderStatus({ orderId, status }));

    // 2️⃣ Show popup ONLY for user
    if (
      status === "delivered" &&
      userId === userData._id &&
      userData.role === "user"
    ) {
      setSelectedOrderId(orderId);
      setShowDeliveredPopup(true);
    }
  };

  socket.on("update-status", handleStatusUpdate);

  return () => {
    socket.off("update-status", handleStatusUpdate);
  };
}, [socket, userData, dispatch]);


    










  

  /* ---------------- FILTERS ---------------- */
  const normalOrders = myOrders?.filter(
    o => !o.orderType || o.orderType === "NORMAL"
  );

  const subscriptionOrders = myOrders?.filter(
    o => o.orderType === "SUBSCRIPTION"
  );

  const festivalOrders = myOrders?.filter(
    o => o.orderType === "FESTIVAL"
  );

  /* ---------------- UI ---------------- */
  return (
    <div
      className="w-full min-h-screen flex justify-center px-4"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      {/* ✅ POPUP (CORRECT PLACE) */}


     

      {userData.role === "user" && showDeliveredPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[320px] text-center shadow-xl">
            <h2 className="text-xl font-bold text-green-600 mb-3">
              🎉 Order Delivered
            </h2>

            <p className="text-gray-600 mb-4">
              Would you like to rate your order?
            </p>

            <div className="flex gap-3 justify-center">
              <button
        onClick={() => {
         setShowDeliveredPopup(false);
       setPopupDismissed(true);
  }}
   >
      Skip
      </button>
  <button
  onClick={() => {
    setShowDeliveredPopup(false);

    requestAnimationFrame(() => {
      const el = document.getElementById(`rate-${selectedOrderId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }}
  className="bg-yellow-400 px-4 py-2 rounded-lg font-semibold"
>
  Rate Now ⭐
</button>


              

            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-[800px] p-4">
        <div className="flex items-center gap-5 mb-6">
          <IoIosArrowRoundBack
            size={35}
            className="text-[#ff4d2d] cursor-pointer"
            onClick={() => navigate("/")}
          />
          <h1 className="text-2xl font-bold">My Orders</h1>
        </div>

        <div className="space-y-10">
          {normalOrders?.length > 0 && (
            <>
              <h2 className="text-lg font-semibold">Normal Orders</h2>
              {normalOrders.map(order =>
                userData.role === "user" ? (
                  <UserOrderCard key={order._id} data={order} />
                ) : (
                  <OwnerOrderCard key={order._id} data={order} />
                )
              )}
            </>
          )}

          {subscriptionOrders?.length > 0 && (
            <>
              <h2 className="text-lg font-semibold">Subscription Orders</h2>
              {subscriptionOrders.map(order =>
                userData.role === "user" ? (
                  <UserOrderCard key={order._id} data={order} />
                ) : (
                  <OwnerOrderCard key={order._id} data={order} />
                )
              )}
            </>
          )}

          {festivalOrders?.length > 0 && (
            <>
              <h2 className="text-lg font-semibold">Festival Orders</h2>
              {festivalOrders.map(order =>
                userData.role === "user" ? (
                  <UserOrderCard key={order._id} data={order} />
                ) : (
                  <OwnerOrderCard key={order._id} data={order} />
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
