import { useState, useEffect } from "react";
import axiosInstance from "../Axios/axiosInstance.js";

const useFetch = (url, params = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axiosInstance({ url, params });
      setData(response.data);
      setLoading(false);
    } catch (error) {
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

export default useFetch
