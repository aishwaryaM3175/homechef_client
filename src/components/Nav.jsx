import React, { useEffect, useState } from 'react'
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { setSearchItems, setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import styles from './Nav.module.css';
import { useTheme } from "../context/ThemeContext";


function Nav() {
    const { userData, cartItems } = useSelector(state => state.user);

    const [showInfo, setShowInfo] = useState(false);
    const [query, setQuery] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();


    const handleLogOut = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true });
            dispatch(setUserData(null));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (query) handleSearchItems();
        else dispatch(setSearchItems(null));
    }, [query]);

    const handleSearchItems = async () => {
        try {
            const result = await axios.get(
                `${serverUrl}/api/item/search-items?query=${query}`,
                { withCredentials: true }
            );
            dispatch(setSearchItems(result.data));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={styles.navRoot}>

            <div className={styles.navInner}
                 style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                
                {/* LEFT SIDE */}
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>

                    {/* HomeChef redirect */}
                    <h1
                        className={styles.logo}
                        onClick={() => navigate('/', { state: { fromLogo: true } })}
                        style={{ cursor: "pointer" }}
                    >
                        HomeChef
                    </h1>

                    {/* ❌ REMOVED: Choose City dropdown */}
                    {/* ❌ REMOVED: Location button */}
                </div>

                {/* RIGHT SIDE */}
                <div className={styles.actions}
                    style={{ display: "flex", alignItems: "center", gap: "18px" }}>


{/* THEME TOGGLE */}
<button
  onClick={toggleTheme}
  style={{
    border: "1px solid var(--primary)",
    background: "transparent",
    borderRadius: "999px",
    padding: "6px 10px",
    cursor: "pointer",
    fontSize: "16px"
  }}
  title="Toggle theme"
>
  {theme === "light" ? "🌙" : "☀️"}
</button>


                    {/* CART */}
                    {userData?.role === "user" && (
                        <div
                            style={{ position: "relative", cursor: "pointer" }}
                            onClick={() => navigate('/cart')}
                        >
                            <FiShoppingCart size={20} style={{ color: "var(--primary)" }} />
                            <span
                                style={{
                                    position: 'absolute',
                                    right: -8,
                                    top: -10,
                                    color: 'var(--primary)',
                                    fontSize: 12
                                }}
                            >
                                {cartItems.length}
                            </span>
                        </div>
                    )}

                    {/* AVATAR */}
                    {userData && (
                        <div
                            className={styles.avatar}
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowInfo(prev => !prev)}
                        >
                            {userData.fullName?.slice(0, 1)}
                        </div>
                    )}

                    {/* MENU */}
                    {showInfo && userData && (
                        <div
                            style={{
                                position: 'fixed',
                                top: 80,
                                right: 10,
                                width: 180,
                                background: 'var(--card-bg)',
                                boxShadow: 'var(--shadow)',
                                borderRadius: '12px',
                                padding: 18,
                                zIndex: 9999
                            }}
                        >
                            <div style={{ fontSize: 16, fontWeight: 700 }}>
                                {userData.fullName}
                            </div>



{userData.role === "user" && (
<div
    style={{
      color: 'var(--primary)',
      marginTop: 8,
      cursor: 'pointer'
    }}
    onClick={() => navigate('/my-orders')}
  >
    My Orders
  </div>
)}

{userData.role === "owner" && (
  <div
    style={{
      color: 'var(--primary)',
      marginTop: 8,
      cursor: 'pointer'
    }}
    onClick={() => navigate('/my-orders')}
  >
    Orders
  </div>
)}


                            {/* Logout */}
                            <div
                                style={{
                                    color: 'var(--primary)',
                                    marginTop: 8,
                                    cursor: 'pointer'
                                }}
                                onClick={handleLogOut}
                            >
                                Log Out
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default Nav;
