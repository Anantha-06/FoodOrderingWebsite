import { useState, useEffect } from "react";
import axiosInstance from "../Axios/axiosInstance.js";

const useFetch = (url, params = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!url) return;
    try {
      const response = await axiosInstance({
        method: "GET",
        url,
        params,
      });

      setData(response.data);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err);
      setData(null);
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
