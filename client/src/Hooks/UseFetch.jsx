import { useState, useEffect } from "react";
import axiosInstance from "../Axios/axiosInstance.js";

const useFetch = (url, params = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      console.log("Fetching data from:", url); 
      const response = await axiosInstance({ url, params });
      console.log("API Response:", response);
      setData(response.data);
    } catch (error) {
      console.error("Fetch Error:", error); 
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url, JSON.stringify(params)]);

  return [data, isLoading, error, fetchData];
};

export default useFetch;