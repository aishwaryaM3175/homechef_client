import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { ClipLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import bgImage from '../assets/bgimg.jpeg';


function SignIn() {
  const primaryColor = "#ff4d2d";
  const borderColor = "#ddd";

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const goToDashboard = (role) => {
    if (role === "user") return navigate("/user-dashboard");
    if (role === "owner") return navigate("/owner-dashboard");
    if (role === "deliveryBoy") return navigate("/delivery-dashboard");
    return navigate("/");
  };

  // helper to extract message from many shapes of error
  const extractErrorMsg = (error) => {
    if (!error) return "Unknown error";
    // axios error with response
    if (error.response) {
      // if backend returns { message: '...' }
      if (error.response.data && typeof error.response.data === "object") {
        return error.response.data.message || JSON.stringify(error.response.data) || "Server error";
      }
      // sometimes backend returns a string
      return error.response.data || error.response.statusText || "Server error";
    }
    // generic
    return error.message || String(error);
  };

  const handleSignIn = async () => {
    setErr("");
    if (!email || !password) {
      setErr("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password, role },
        { withCredentials: true }
      );

      console.log("SIGNIN response:", res); // <-- important for debugging

      // Accept multiple response shapes:
      // res.data could be { user, token }, or { message, data }, or user object, etc.
      const serverData = res.data;

      // prefer an object named 'user' or 'data', else use full res.data
      const userPayload = serverData.user || serverData.data || serverData;

      // If backend returns an explicit error flag
      if (serverData.error || serverData.success === false) {
        const msg = serverData.message || serverData.error || "Sign in failed";
        setErr(msg);
        setLoading(false);
        return;
      }

      // If there's obvious missing fields, show message
      if (!userPayload) {
        setErr("Invalid server response. Check console/network.");
        setLoading(false);
        return;
      }

      // Save to redux (adapt to your slice expectations)
      dispatch(setUserData(userPayload));

      setLoading(false);
      goToDashboard(role);

    } catch (error) {
      const message = extractErrorMsg(error);
      console.error("SignIn error:", error);
      setErr(message);
      setLoading(false);
    }
  };

  // Google login (keeps simple)
  const handleGoogleAuth = async () => {
    setErr("");
    if (!role) { setErr("Please select a role"); return; }

    try {
      const provider = new GoogleAuthProvider();
      const googleResult = await signInWithPopup(auth, provider);
      console.log("Google signin result:", googleResult);

      // call backend to create / sign in
      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        { email: googleResult.user.email, role },
        { withCredentials: true }
      );

      console.log("google-auth backend response:", data);
      const userPayload = data.user || data.data || data;
      dispatch(setUserData(userPayload));
      goToDashboard(role);
    } catch (error) {
      console.error("Google auth error:", error);
      setErr("Google login failed: " + (error.message || ""));
    }
  };

  return (
    <div
  className="min-h-screen w-full flex items-center justify-center p-4"
  style={{
    backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  }}
>

      <div className='bg-white rounded-xl shadow-lg w-full max-w-md p-8 border' style={{ border: `1px solid ${borderColor}` }}>
        <h1 className='text-3xl font-bold mb-2' style={{ color: primaryColor }}>HomeChef</h1>
        <p className='text-gray-600 mb-8'>Sign In to your account to get started with delicious food deliveries</p>

        <div className='mb-6'>
          <label className='block text-gray-700 font-medium mb-2'>Select Your Role</label>
          <div className='flex gap-3'>
            {["user", "owner", "deliveryBoy"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 rounded-lg font-medium transition ${role === r ? "text-white" : "text-gray-700 border-2"}`}
                style={{ backgroundColor: role === r ? primaryColor : "transparent", border: `2px solid ${role === r ? primaryColor : borderColor}` }}
              >
                {r === "deliveryBoy" ? "Delivery Boy" : r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className='mb-4'>
          <label className='block text-gray-700 font-medium mb-1'>Email</label>
          <input type="email" className='w-full border rounded-lg px-3 py-2' placeholder='Enter your Email' value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className='mb-4'>
          <label className='block text-gray-700 font-medium mb-1'>Password</label>
          <div className='relative'>
            <input type={showPassword ? "text" : "password"} className='w-full border rounded-lg px-3 py-2 pr-10' placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className='absolute right-3 top-[12px] text-gray-500' onClick={() => setShowPassword(prev => !prev)}>{showPassword ? <FaRegEyeSlash /> : <FaRegEye />}</button>
          </div>
        </div>

        <div className='text-right mb-4 text-[#ff4d2d] cursor-pointer' onClick={() => navigate("/forgot-password")}>Forgot Password</div>

        <button className='w-full font-semibold py-2 rounded-lg bg-[#ff4d2d] text-white hover:bg-[#e64323]' onClick={handleSignIn} disabled={loading}>
          {loading ? <ClipLoader size={20} color='white' /> : "Sign In"}
        </button>

        {err && <p className='text-red-500 text-center mt-3'>* {err}</p>}

        <button className='w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 hover:bg-gray-100' onClick={handleGoogleAuth}>
          <FcGoogle size={20} />
          <span>Sign In with Google</span>
        </button>

        <p className='text-center mt-6 cursor-pointer' onClick={() => navigate("/signup")}>Want to create a new account ? <span className='text-[#ff4d2d]'>Sign Up</span></p>
      </div>
    </div>
  );
}

export default SignIn;
