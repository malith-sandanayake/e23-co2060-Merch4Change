import { useEffect, useState } from "react";
import "./UserProfile.css";
import test from "../../assets/test.jpg";
import Sidebar from "../../components/Sidebar/Sidebar";

function UserProfile() {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    fetch(`${apiUrl}/api/v1/profile/me`, {  
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProfileData(data.data);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Sidebar />
      <div className="profile-page">
        <div className="profile-head">
          <div className="profile-picture">
            <img src={test} alt="test image" className="avatar" />
          </div>
          <div className="profile-details">
            <div className="name">
              <h1
                style={{
                  fontSize: 25,
                  fontFamily: "sans-serif",
                  fontWeight: 600,
                }}
              >
                {profileData?.user?.fullName || "Temp Name"}
              </h1>
            </div>
            <div className="username">
              <h2
                style={{
                  fontSize: 13,
                  fontFamily: "sans-serif",
                  fontWeight: 500,
                }}
              >
                {profileData?.user?.email || "@temp_name"}
              </h2>
            </div>
            <div className="follow-details">
              <div className="sub-following">
                <span>5</span>
                <span>Products</span>
              </div>
              <div className="sub-following">
                <span>100 k</span>
                <span>followers</span>
              </div>
              <div className="sub-following">
                <span>0</span>
                <span>following</span>
              </div>
            </div>
            <div className="des">
              <p>
                I am the best celebrity ever....I am the best celebrity
                ever....I am the best celebrity ever....I am the best celebrity
                ever
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
