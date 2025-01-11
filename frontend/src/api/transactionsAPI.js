import axios from "axios";


const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchTransactions = async (month, searchQuery = "", page = 1, perPage = 10) => {
  if (!month) {
    console.warn("Month is required to fetch transactions.");
    return { data: [], totalPages: 0 };
  }

  try {
    const response = await apiClient.get("/transactions", {
      params: { 
        month, 
        search: searchQuery.trim(), 
        page, 
        perPage 
      },
    });


    return response.data || { data: [], totalPages: 0 };
  } catch (error) {
    console.error("Error fetching transactions:", error.response?.data || error.message);
    return { data: [], totalPages: 0 }; 
  }
};
