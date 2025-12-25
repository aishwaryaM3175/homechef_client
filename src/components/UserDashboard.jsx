import React, { useEffect, useRef, useState } from 'react'
import Nav from './Nav'
import { categories } from '../category'
import CategoryCard from './CategoryCard'
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { useSelector, useDispatch } from 'react-redux';
import FoodCard from './FoodCard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { setCurrentCity } from '../redux/userSlice';
import { setLocation, setFullAddress } from "../redux/mapSlice";
import bannerImg from '../assets/banner.jpg';
import { IoIosSearch } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";


function UserDashboard() {
  const { currentCity, shopInMyCity, itemsInMyCity, searchItems } = useSelector(state => state.user)
  const { fullAddress } = useSelector(state => state.map)

  const [query, setQuery] = useState("");

  // Location states
  const [locationInput, setLocationInput] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [invalidLocation, setInvalidLocation] = useState(false);
  //const [showLocationBox, setShowLocationBox] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  // food filter: "all" | "veg" | "non-veg"
const [foodFilter, setFoodFilter] = useState("all");




  //const SERVICE_AREAS = ["hubli", "dharwad"];

  const cateScrollRef = useRef()
  const shopScrollRef = useRef()
  const itemsRef = useRef(null)
  const searchResultsRef = useRef(null)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showLeftCateButton, setShowLeftCateButton] = useState(false)
  const [showRightCateButton, setShowRightCateButton] = useState(false)
  const [showLeftShopButton, setShowLeftShopButton] = useState(false)
  const [showRightShopButton, setShowRightShopButton] = useState(false)
  const [updatedItemsList, setUpdatedItemsList] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const AVAILABLE_CITIES = ["Hubli", "Dharwad"]

  useEffect(() => {
  if (!currentCity || !fullAddress) return;

  // If saved address does NOT belong to selected city
  if (!fullAddress.toLowerCase().includes(currentCity.toLowerCase())) {
    dispatch(setLocation({ lat: null, lon: null }));
    dispatch(setFullAddress(null));
    setInvalidLocation(true);
  } else {
    setInvalidLocation(false);
  }
}, [currentCity , fullAddress]);


  const handleCityChange = (e) => {
    const city = e.target.value
    dispatch(setCurrentCity(city));
    setShowLocationPopup(false);
  };

  const handleFilterByCategory = (category) => {
    setSelectedCategory(category)

    if (category === "All") {
      setUpdatedItemsList(itemsInMyCity)
    } else {
      const filteredList = itemsInMyCity?.filter(i => i.category === category)
      setUpdatedItemsList(filteredList)
    }

    setTimeout(() => {
      itemsRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  useEffect(() => {
    setUpdatedItemsList(itemsInMyCity)
  }, [itemsInMyCity])


  const updateButton = (ref, setLeftButton, setRightButton) => {
    const element = ref.current
    if (element) {
      setLeftButton(element.scrollLeft > 0)
      setRightButton(element.scrollLeft + element.clientWidth < element.scrollWidth)
    }
  }

  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth"
      })
    }
  }


const handleLocationSubmit = async () => {
  try {
    if (!currentCity) {
  alert("Please select your city first!");
  return;
}



  const apiKey = import.meta.env.VITE_GEOAPIKEY;

  const fullSearchText = `${locationInput}, ${currentCity}, Karnataka`;

  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
  fullSearchText
  )}&apiKey=${apiKey}`;




    const result = await fetch(url);
    const data = await result.json();

    if (!data?.features?.length) {
      setInvalidLocation(true);
      return;
    }

    const { lat, lon, city } = data.features[0].properties;

    if (!city || !city.toLowerCase().includes(currentCity.toLowerCase())) {
  setInvalidLocation(true);
  return;
}
    setInvalidLocation(false);

    setUserLocation({ lat, lon, city });
    dispatch(setLocation({ lat, lon }));
    dispatch(setFullAddress(data.features[0].properties.formatted));
    setShowLocationPopup(false);
    setLocationInput("");


  } catch (error) {
    console.log(error);
    setInvalidLocation(true);
  }
};



     const handleGPSLocation = () => {
  if (!currentCity) {
    alert("Please select your city first!");
    return;
  }
    setInvalidLocation(false);

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;
      console.log("Latitude:", latitude, "Longitude:", longitude);

      const apiKey = import.meta.env.VITE_GEOAPIKEY;

      const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();

      console.log("Reverse Result:", data);

      if (!data?.features?.length) {
        setInvalidLocation(true);
        return;
      }

      const { city } = data.features[0].properties;

      // Validate delivery city
      if (!city || !city.toLowerCase().includes(currentCity.toLowerCase())) {
        setInvalidLocation(true);
        return;
      }
      setInvalidLocation(false);

      // Save to Redux
      dispatch(setLocation({ lat: latitude, lon: longitude }));
      dispatch(setFullAddress(data.features[0].properties.formatted));
      setShowLocationPopup(false);
      setLocationInput("");


      console.log("📍 Location saved to Redux!");
    },

    (err) => {
      console.log("❌ GPS Error:", err);
      alert("Unable to fetch GPS location");
    }
  );
};




  useEffect(() => {
    if (cateScrollRef.current) {
      updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton)
      updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton)

      cateScrollRef.current.addEventListener('scroll', () => {
        updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton)
      })

      shopScrollRef.current.addEventListener('scroll', () => {
        updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton)
      })
    }

    return () => {
      cateScrollRef?.current?.removeEventListener("scroll", () => {
        updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton)
      })
      shopScrollRef?.current?.removeEventListener("scroll", () => {
        updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton)
      })
    }
  }, [categories])


  useEffect(() => {
    if (!query.trim()) {
      dispatch({
        type: "user/setSearchItems",
        payload: [],
      });
      return;
    }

    const fetchSearch = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/item/search-items?query=${query}&city=${currentCity}`,
          { withCredentials: true }
        );

        dispatch({
          type: "user/setSearchItems",
          payload: res.data,
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchSearch();
  }, [query, currentCity, dispatch]);


  return (
  <div
  className="w-screen min-h-screen flex flex-col gap-3 overflow-y-auto"
  style={{
    background: "var(--bg)",
    color: "var(--text)",
  }}
>


      <Nav />


    {/* --------------------------------------------------
           TOP RIGHT (City + Location)
           NO CHANGES TO YOUR EXISTING CODE
      -------------------------------------------------- */}
      <div className="w-full flex justify-start gap-4 px-6 mt-4">

        {/* Choose City */}
        <select
          value={currentCity || ""}
          onChange={handleCityChange}
          //className="px-3 py-2 border rounded-lg shadow-sm bg-white"
          className="px-3 py-2 border rounded-lg shadow-sm"
          style={{
          background: "var(--card-bg)",
          color: "var(--text)",
          borderColor: "var(--muted)"
          }}

        >
          <option value="">Choose City</option>
          <option value="Hubli">Hubli</option>
          <option value="Dharwad">Dharwad</option>
        </select>

        {/* Location Button */}
        <div
          //className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 border rounded-lg shadow-sm"
          className="flex items-center gap-2 cursor-pointer px-4 py-2 border rounded-lg shadow-sm"
          style={{
          background: "var(--card-bg)",
          color: "var(--text)",
          borderColor: "var(--muted)"
          }}

          onClick={() => {
          setShowLocationPopup(!showLocationPopup);
          setInvalidLocation(false);
          }}

        >
          <FaLocationDot className="text-red-500" />
          <span className="max-w-[300px] truncate">
          {fullAddress || "Location"}
          </span>

        </div>
      </div>

      {/* --------------------------------------------------
           LOCATION POPUP (LEFT CORNER LIKE NAV)
      -------------------------------------------------- */}
      {showLocationPopup && (
        <div
          //className="absolute left-6 top-32 bg-white p-4 rounded-xl shadow-lg w-64 z-50"
          className="absolute left-6 top-32 p-4 rounded-xl shadow-lg w-64 z-50"
          style={{
          background: "var(--card-bg)",
          color: "var(--text)"
          }}
        >
          <input
            type="text"
            placeholder="Search area..."
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg mb-3"
          />

          <button
            onClick={handleLocationSubmit}
            className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold mb-2"
          >
            Set Location
          </button>

          <p
            onClick={handleGPSLocation}
            className="text-orange-500 font-semibold text-center cursor-pointer"
          >
            Locate me using GPS
          </p>

          {invalidLocation && (
            <p className="text-red-500 text-sm mt-2">
              ❌ Can't deliver to this location
            </p>
          )}
        </div>
      )}


{/* Banner */}
<div 
  className="w-full h-[380px] rounded-xl mt-1 mb-4 relative flex flex-col items-center justify-center"
  style={{
    backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${bannerImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }}
>


  {/* SEARCH BAR OVER BANNER */}
  <div
  className="flex items-center gap-2 shadow-lg rounded-xl px-4 py-3 w-[80%] max-w-2xl absolute top-10"
  style={{
    background: "var(--card-bg)",
    color: "var(--text)"
  }}
>
  <IoIosSearch size={22} style={{ color: "var(--primary)" }} />
  <input
    type="text"
    placeholder="Search for delicious food..."
    className="flex-1 border-none outline-none text-lg bg-transparent"
    style={{ color: "var(--text)" }}
    value={query}
    onChange={(e) => setQuery(e.target.value)}
  />
</div>


  {/* HEADING BELOW SEARCH BAR */}
  <h1 
    style={{
      marginTop: "90px",
      color: '#fff',
      fontFamily: "'Playfair Display', serif",
      fontSize: '32px',
      fontWeight: '700',
      maxWidth: '800px',
      lineHeight: '1.4',
      textShadow: '0px 2px 10px rgba(0,0,0,0.5)',
      textAlign: "center"
    }}
  >
    DISCOVER HOMEMADE HAPPINESS🍽 <br />
    Every Craving Just One Click Away!
  </h1>
</div>

{/* Search Results */}
 {searchItems && (
  <div
    ref={searchResultsRef}
    //className='w-full flex flex-col gap-5 items-start p-5 bg-white shadow-md rounded-2xl mt-4'
    className='w-full flex flex-col gap-5 items-start p-5 shadow-md rounded-2xl mt-4'
    style={{
    background: "var(--card-bg)",
    color: "var(--text)"
    }}

  >

          <h1 className='text-2xl sm:text-3xl font-semibold border-b pb-2'
          style={{
          color: "var(--text)",
          borderColor: "var(--muted)"
          }}
          >
            Search Results
          </h1>
          <div className='w-full h-auto flex flex-wrap gap-6 justify-center'>
            {searchItems.length > 0 ? (
              searchItems.map((item) => (
                <FoodCard data={item} key={item._id} />
              ))
            ) : (
              <p className='text-center w-full' style={{ color: "var(--muted)" }}>
              </p>
            )}
          </div>
        </div>
      )}


      {/* Categories */}
      <div className="w-full flex flex-col gap-5 items-start p-[10px]">
        <h1 className='text-2xl sm:text-3xl' style={{ color: "var(--text)" }}>Explore Food Categories</h1>

        <div className='w-full relative'>
          {showLeftCateButton && (
            <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10'
              onClick={() => scrollHandler(cateScrollRef, "left")}
            >
              <FaCircleChevronLeft />
            </button>
          )}

          <div className='w-full flex overflow-x-auto gap-4 pb-2' ref={cateScrollRef}>
            {categories.map((cate, index) => (
              <CategoryCard 
                name={cate.category} 
                image={cate.image} 
                key={index}
                onClick={() => handleFilterByCategory(cate.category)}
              />
            ))}
          </div>

          {showRightCateButton && (
            <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10'
              onClick={() => scrollHandler(cateScrollRef, "right")}
            >
              <FaCircleChevronRight />
            </button>
          )}
        </div>
      </div>

{/* ===============================
     EXCLUSIVE OFFERS SECTION
=============================== */}
<div className="w-full px-6 mt-6">
  <h2
    className="text-2xl font-semibold mb-4"
    style={{ color: "var(--text)" }}
  >
    Exclusive Offers
  </h2>

  <div className="flex gap-4 flex-wrap">
    {/* Festival Specials */}
    <div
  onClick={() => navigate("/festival-specials")}
  className="exclusive-card cursor-pointer flex-1 min-w-[220px] hover:shadow-lg transition"
>
      <h3 className="text-lg font-bold">🎉 Festival Specials</h3>
      <p className="text-sm mt-1" 
      >
        Limited-time homemade festival meals & sweets
      </p>
    </div>

    {/* Subscriptions */}
    <div
  onClick={() => navigate("/subscriptions")}
  className="exclusive-card cursor-pointer flex-1 min-w-[220px] hover:shadow-lg transition"
>

      <h3 className="text-lg font-bold">📦 Subscriptions</h3>
      <p className="text-sm mt-1" 
      >
        Daily, weekly & monthly home food plans
      </p>
    </div>
  </div>
</div>



      {/* Best Shops */}
      <div className='w-full flex flex-col gap-5 items-start p-[10px]'>
        <h1 className='text-2xl sm:text-3xl' style={{ color: "var(--text)" }}>
          Chefs in {currentCity || "Your City"}</h1>

        <div className='w-full relative'>
          {showLeftShopButton && (
            <button classNa
            me='absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10'
              onClick={() => scrollHandler(shopScrollRef, "left")}
            >
              <FaCircleChevronLeft />
            </button>
          )}

          <div className='w-full flex overflow-x-auto gap-4 pb-2' ref={shopScrollRef}>
            {shopInMyCity && shopInMyCity.length > 0 ? (
              shopInMyCity.map((shop, index) => (
                <CategoryCard 
                  name={shop.name} 
                  image={shop.image} 
                  key={index}
                  onClick={() => navigate(`/shop/${shop._id}`)}
                />
              ))
            ) : (
              <div className='w-full text-center py-8'>
              <p style={{ color: "var(--muted)" }}>
              No shops available in your city yet. Check back later!
              </p>
              </div>

            )}
          </div>

          {showRightShopButton && (
            <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10'
              onClick={() => scrollHandler(shopScrollRef, "right")}
            >
              <FaCircleChevronRight />
            </button>
          )}
        </div>
      </div>

      {/* Suggested Items */}
      <div className='w-full flex flex-col gap-5 items-start p-[10px]'>
        <h1 className='text-2xl sm:text-3xl' style={{ color: "var(--text)" }}>
          Available Food Items
        </h1>

{/* PURE VEG TOGGLE */}
<div className="flex items-center gap-3 mt-3 mb-4">

    {/* ALL (DEFAULT) */}
  <button
    onClick={() => setFoodFilter("all")}
    className={`px-4 py-1 rounded-full border text-sm
      ${foodFilter === "all"
        ? "bg-gray-200 border-gray-400 text-gray-800"
        : "border-gray-300 text-gray-500"}
    `}
  >
    All
  </button>

  <span
    className={`text-sm font-medium ${
      foodFilter === "veg" ? "text-green-700" : "text-solid black-600"
    }`}
  >
    Pure Veg
  </span>

<button
  type="button"
  onClick={() =>
    setFoodFilter(foodFilter === "veg" ? "all" : "veg")
  }
  className="relative w-[46px] h-[24px] rounded-full transition-all duration-300"
  style={{
    backgroundColor: foodFilter === "veg" ? "#16a34a" : "#d1d5db" // green / grey
  }}
>
<span
  className="absolute top-[2px] left-[2px] w-[20px] h-[20px] bg-white rounded-full transition-transform duration-300"
  style={{
    transform: foodFilter === "veg" ? "translateX(22px)" : "translateX(0px)"
  }}
/>
  </button>

</div>


        <div ref={itemsRef} className='w-full h-auto flex flex-wrap gap-[20px] justify-center'>
          {updatedItemsList && updatedItemsList.length > 0 ? (
   updatedItemsList
  .filter(item => {
    if (foodFilter === "all") return true;
    return item.foodType === foodFilter;
  })
  .map((item, index) => (
    <FoodCard key={item._id || index} data={item} />
  ))
          ) : (
            <div className='w-full text-center py-8'>
  <p style={{ color: "var(--muted)" }}>
    No items found in this category.
  </p>
</div>

          )}
        </div>
      </div>


    </div>
  )
}

export default UserDashboard




















