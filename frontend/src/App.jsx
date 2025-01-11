import React, { useEffect, useState } from "react";
import { fetchTransactions } from "./api/transactionsAPI";
import Table from "./components/Table";
import SearchBar from "./components/SearchBar";
import Pagination from "./components/Pagination";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, Filler } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, Filler, ChartDataLabels);

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [month, setMonth] = useState("March");
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statistics, setStatistics] = useState({
    totalSales: 0,
    totalSold: 0,
    totalNotSold: 0,
  });
  const [barChartData, setBarChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [totalPieData, setTotalPieData] = useState(0); 

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchTransactions(month, searchQuery, currentPage);
      setTransactions(result.data);
      setTotalPages(result.totalPages);

      try {
        const statsResponse = await fetch(`http://localhost:5000/api/transactions/statistics?month=${month}`);
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStatistics(statsData);
        } else {
          throw new Error("Failed to fetch statistics");
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
        setStatistics({
          totalSales: 0,
          totalSold: 0,
          totalNotSold: 0,
        });
      }

      try {
        const barChartResponse = await fetch(`http://localhost:5000/api/transactions/bar-chart?month=${month}`);
        if (barChartResponse.ok) {
          const barChartData = await barChartResponse.json();
          const labels = barChartData.map(item => item.range);
          const counts = barChartData.map(item => item.count);

          setBarChartData({
            labels: labels,
            datasets: [{
              label: 'Item Count by Price Range',
              data: counts,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            }]
          });
        } else {
          throw new Error("Failed to fetch bar chart data");
        }
      } catch (error) {
        console.error("Error fetching bar chart data:", error);
        setBarChartData(null);
      }

      try {
        const pieChartResponse = await fetch(`http://localhost:5000/api/transactions/pie-chart?month=${month}`);
        if (pieChartResponse.ok) {
          const pieChartData = await pieChartResponse.json();
          const labels = pieChartData.map(item => item._id);
          const counts = pieChartData.map(item => item.count);

          const totalSum = counts.reduce((sum, count) => sum + count, 0);

          setTotalPieData(totalSum); 

          setPieChartData({
            labels: labels,
            datasets: [{
              label: 'Items per Category',
              data: counts,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
            }]
          });
        } else {
          throw new Error("Failed to fetch pie chart data");
        }
      } catch (error) {
        console.error("Error fetching pie chart data:", error);
        setPieChartData(null);
      }
    };

    fetchData();
  }, [month, searchQuery, currentPage]);

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); 
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Transaction Dashboard</h1>
      
      <div>
        <label htmlFor="month">Select Month: </label>
        <select id="month" value={month} onChange={handleMonthChange}>
          {"January February March April May June July August September October November December"
            .split(" ")
            .map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
        </select>
      </div>
      <div id="charts">
      <div>
        <h2>Statistics for {month}</h2>
        <ul>
          <li>Total Sales: ${statistics.totalSales.toFixed(2)}</li>
          <li>Total Sold: {statistics.totalSold}</li>
          <li>Total Not Sold: {statistics.totalNotSold}</li>
        </ul>
      </div>

      <div id="bar-chart">
        <h2>Price Range Bar Chart for {month}</h2>
        {barChartData ? (
          <Bar data={barChartData} />
        ) : (
          <p>Loading bar chart data...</p>
        )}
      </div>

      <div id="pie-chart">
        <h2>Category Distribution Pie Chart for {month}</h2>
        {pieChartData ? (
          <Pie
            data={pieChartData}
            options={{
              plugins: {
                datalabels: {
                  formatter: (value) => {
                    const percentage = ((value / totalPieData) * 100).toFixed(2);
                    return `${percentage}%`;
                  },
                  color: 'black',
                },
              },
            }}
          />
        ) : (
          <p>Loading pie chart data...</p>
        )}
      </div>
      </div>
      
      <SearchBar id="search" searchQuery={searchQuery} setSearchQuery={handleSearchChange} />

      
      <Table transactions={transactions} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default App;
