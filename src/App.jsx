// src/components/GoogleLoginButton.js
import React, { useState } from "react";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import axios from "axios";

// const baseUrl = "http://localhost:8000";
const baseUrl = "https://jobnisit-api-242560428f3b.herokuapp.com";

const App = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [profile, setProfile] = useState(null);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("tokenResponse", tokenResponse);
      try {
        const res = await axios.post(`${baseUrl}/auth/google`, {
          token: tokenResponse.access_token,
        });

        setProfile(res.data.googleData);
        setAccessToken(res.data.accessToken);
        // Save the user data to state or localStorage
      } catch (error) {
        console.error("Google login error:", error);
        alert("Server error. Please try again later.");
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
      alert("Google login was unsuccessful. Please try again.");
    },
  });

  const logout = async () => {
    googleLogout();

    setProfile(null);
    setAccessToken(null);
  };

  const getProfile = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("res", res);
      // setProfile(res.data.googleData);
    } catch (error) {
      console.error("Get Profile error:", error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div>
      <h1>Google Login</h1>
      {!profile ? (
        <button onClick={login}>Login with Google</button>
      ) : (
        <button onClick={logout}>Logout</button>
      )}
      {profile && (
        <div>
          <h2>Welcome, {profile.name}!</h2>
          <img src={profile.picture} alt={profile.name} />
          <p>Email: {profile.email}</p>

          <hr />
          <button onClick={getProfile}>GET GOOGLE PROFILE</button>
        </div>
      )}
    </div>
  );
};

export default App;
