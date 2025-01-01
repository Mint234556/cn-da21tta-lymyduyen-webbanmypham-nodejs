import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const DashboardAdmin = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [topFiveBestSellers, setTopFiveBestSellers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const api = process.env.REACT_APP_URL_SERVER; // Đổi thành URL API của bạn

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRes = await axios.get(`${api}/thong-ke/orders`);
        setTotalOrders(ordersRes.data.DT.total_orders);

        const revenueRes = await axios.get(`${api}/thong-ke/revenue`);
        setTotalRevenue(revenueRes.data.DT.total_revenue);

        const customersRes = await axios.get(`${api}/thong-ke/customers`);
        setTotalCustomers(customersRes.data.DT.total_customers);

        const bestSellersRes = await axios.get(`${api}/thong-ke/best-seller`);
        setTopFiveBestSellers(bestSellersRes.data.DT);

        const onlineUsersRes = await axios.get(`${api}/thong-ke/online-users`);
        setOnlineUsers(onlineUsersRes.data.DT.online_users);
      } catch (error) {
        console.error("Error fetching statistics data:", error);
      }
    };

    fetchData();
  }, []);

  const bestSellersChartData = {
    labels: topFiveBestSellers.map((item) => item.TENSANPHAM),
    datasets: [
      {
        label: "Số lượng bán",
        data: topFiveBestSellers.map((item) => item.total_sold),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Thống kê</h1>

      {/* Doanh thu */}
      <div style={{ marginBottom: "20px" }}>
        <h2>Doanh thu</h2>
        <p>
          <strong>Tổng doanh thu:</strong>{" "}
          {totalRevenue ? totalRevenue.toLocaleString() : "0"} VND
        </p>{" "}
        {/* Thống kê chung */}
        <div style={{ marginBottom: "20px" }}>
          <h2>Thống kê chung</h2>
          <p>
            <strong>Đơn hàng:</strong>{" "}
            {totalOrders ? totalOrders.toLocaleString() : "0"} <br />
            <strong>Khách hàng:</strong>{" "}
            {totalCustomers ? totalCustomers.toLocaleString() : "0"} <br />
            <strong>Số lượng người dùng thanh toán online:</strong>{" "}
            {onlineUsers ? onlineUsers.toLocaleString() : "0"}
          </p>
        </div>
      </div>

      {/* 5 sản phẩm bán chạy nhất */}
      <div style={{ marginBottom: "20px" }}>
        <h2>5 sản phẩm bán chạy nhất</h2>
        <Bar data={bestSellersChartData} />
      </div>
    </div>
  );
};

export default DashboardAdmin;
