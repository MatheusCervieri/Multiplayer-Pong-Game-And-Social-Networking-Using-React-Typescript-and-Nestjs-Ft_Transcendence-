import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CheckLogin: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("../");
    }
  }, [navigate]);

  return null;
};

export default CheckLogin;





