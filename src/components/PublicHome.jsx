import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PublicHome.module.css";
import heroImg from "../assets/landingpage.jpeg";

// images (you can replace later)
import missionImg from "../assets/mission.jpg";
import visionImg from "../assets/image1.jpg";
import valuesImg from "../assets/image1.jpg";
import dailyImg from "../assets/image3.jpg";
import tiffinImg from "../assets/image4.jpg";
import festiveImg from "../assets/image5.jpg";
import snacksImg from "../assets/image6.jpg";

import {
  FaSearch,
  FaShoppingCart,
  FaTruck,
  FaStar
} from "react-icons/fa";

function PublicHome() {
  const navigate = useNavigate();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // 🔐 ROLE BASED NAVIGATION
  const handleBecomeChef = () => {
    const role = localStorage.getItem("userRole"); // "customer" | "owner"

    if (role === "owner") {
      navigate("/owner-dashboard"); // OwnerDashboard.jsx route
    } else {
      navigate("/signup"); // customer or not logged in
    }
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🍳</span>
          <span>HomeChef</span>
        </div>

        <ul className={styles.navLinks}>
          <li onClick={() => scrollTo("about")}>About Us</li>
          <li onClick={() => scrollTo("offer")}>What We Offer</li>
          <li onClick={() => scrollTo("how")}>How It Works</li>
          <li onClick={() => scrollTo("why")}>Why HomeChef</li>
          <li onClick={() => scrollTo("contact")}>Contact Us</li>
        </ul>

        <button
          className={styles.orderBtn}
          onClick={() => navigate("/signin")}
        >
          Order Now
        </button>
      </nav>

      {/* ================= HERO ================= */}
      <section
        className={styles.hero}
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className={styles.heroOverlay}></div>

        <div className={styles.heroContent}>
          <h1>
            HOMECHEF<br />
          </h1>
        
          <p>
          Fresh, Homemade Meals from Local Chefs
          <br/>
            Get authentic homemade food delivered fresh from trusted home chefs.
          </p>
<br></br>
<br></br>
          <div className={styles.heroBtns}>
            <button
              className={styles.primaryBtn}
              onClick={() => navigate("/signin")}
            >
              Order Now
            </button>

            <button
              className={styles.secondaryBtn}
              onClick={handleBecomeChef}
            >
              Become a Chef
            </button>
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className={styles.section}>
        {/* ===== ABOUT HEADER ===== */}
<div className={styles.aboutHeader}>
  <span className={styles.sectionTag}>GET TO KNOW US</span>
  <h2 className={styles.centerTitle}>About Us</h2>
  <p className={styles.centerText}>
    Discover our story, mission, and values
  </p>
</div>
<div className={styles.aboutRow}>
  <img src={missionImg} alt="mission" />
  <div>
    <h2>Our Mission</h2>
    <p className={styles.highlight}>"Jo Khao, Wahi Khilao"</p>
    <ul>
      <li>Delivering trustworthy homemade meals</li>
      <li>Empowering neighbourhood home chefs</li>
      <li>Making healthy food accessible to all</li>
    </ul>
  </div>
</div>

        <div className={styles.aboutRowReverse}>
          
          <div>
            <h2>Our Vision</h2>
            <p className={styles.highlight}>"Healthy Meals"</p>
            <ul>
              <li>Connecting India through homemade food</li>
              <li>Promoting healthy eating habits</li>
            </ul>
          </div>
          <img src={visionImg} alt="vision" />
        </div>

        <div className={styles.aboutRow}>
          <img src={valuesImg} alt="values" />
          <div>
            <h2>Our Values</h2>
            <p className={styles.highlight}>"Cooking with Love"</p>
            <ul>
              <li>Hygiene & trust first</li>
              <li>Fresh food made daily</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= WHAT WE OFFER ================= */}
      <section id="offer" className={styles.sectionAlt}>
        <h2 className={styles.centerTitle}>What We Offer</h2>
        <p className={styles.centerText}>
          Delicious homemade meals for every occasion
        </p>

        <div className={styles.offerGrid}>
          <div className={styles.offerCard}>
            <img src={dailyImg} alt="Daily Meals" />
            <h3>Daily Meals</h3>
            <p>Breakfast, lunch & dinner</p>
          </div>

          <div className={styles.offerCard}>
            <img src={tiffinImg} alt="Tiffin" />
            <h3>Tiffin Services</h3>
            <p>Weekly & monthly plans</p>
          </div>

          <div className={styles.offerCard}>
            <img src={festiveImg} alt="Festive" />
            <h3>Festive Specials</h3>
            <p>Special occasion meals</p>
          </div>

          <div className={styles.offerCard}>
            <img src={snacksImg} alt="Snacks" />
            <h3>Healthy Snacks</h3>
            <p>Nutritious homemade snacks</p>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how" className={styles.section}>
        <h2 className={styles.centerTitle}>How It Works</h2>

        <div className={styles.steps}>
          <div className={styles.stepCard}>
            <FaSearch />
            <h4>Browse</h4>
            <p>Explore nearby home chefs</p>
          </div>

          <div className={styles.stepCard}>
            <FaShoppingCart />
            <h4>Order</h4>
            <p>Select meals & place order</p>
          </div>

          <div className={styles.stepCard}>
            <FaTruck />
            <h4>Track</h4>
            <p>Track your delivery live</p>
          </div>

          <div className={styles.stepCard}>
            <FaStar />
            <h4>Enjoy</h4>
            <p>Enjoy & review your meal</p>
          </div>
        </div>
      </section>


{/* ================= WHY CHOOSE ================= */}
<section id="why" className={styles.sectionAlt}>
  <h2 className={styles.centerTitle}>Why Choose HomeChef?</h2>
  <p className={styles.centerText}>
    We’re transforming the way you enjoy homemade meals
  </p>

  <div className={styles.whyGrid}>
    <div className={styles.whyCard}>
      <span>🛡</span>
      <h4>Hygienic & Safe</h4>
      <p>Verified kitchens following hygiene standards</p>
    </div>

    <div className={styles.whyCard}>
      <span>💰</span>
      <h4>Affordable Pricing</h4>
      <p>Home-cooked meals at pocket-friendly prices</p>
    </div>

    <div className={styles.whyCard}>
      <span>❤️</span>
      <h4>Support Local Chefs</h4>
      <p>Empowering talented home chefs near you</p>
    </div>
  </div>
</section>


      {/* ================= FOOTER ================= */}
      <footer id="contact" className={styles.footer}>
        <div className={styles.footerGrid}>
          <div>
            <h3>🍳 HomeChef</h3>
            <p>
              Fresh, homemade food cooked with love by trusted home chefs.
            </p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <p onClick={() => scrollTo("about")}>About Us</p>
            <p onClick={() => scrollTo("offer")}>What We Offer</p>
            <p onClick={() => scrollTo("how")}>How It Works</p>
            <p onClick={() => scrollTo("why")}>Why HomeChef?</p>
            <p onClick={() => scrollTo("contact")}>Contact</p>
          </div>

          <div>
            <h4>Contact Us</h4>
            <p>support@homechef.com</p>
            <p>+91 98765 43210</p>
          </div>
        </div>

        <div className={styles.copy}>
          © 2025 HomeChef. All rights reserved.
        </div>
      </footer>
    </>
  );
}

export default PublicHome;
