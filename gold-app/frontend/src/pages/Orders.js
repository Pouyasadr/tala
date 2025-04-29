import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import ThemeToggle from "../components/ThemeToggle";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/orders", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setOrders(data);
      } catch (error) {
        alert("خطا: " + error.response.data.error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 5, p: 3, bgcolor: "background.default" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">تاریخچه سفارشات</Typography>
        <ThemeToggle />
      </Box>
      {orders.length === 0 ? (
        <Typography>سفارشی یافت نشد</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>بازار</TableCell>
                <TableCell>نوع</TableCell>
                <TableCell>مقدار</TableCell>
                <TableCell>قیمت (تومان)</TableCell>
                <TableCell>وضعیت</TableCell>
                <TableCell>تاریخ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map(order => (
                <TableRow key={order._id}>
                  <TableCell>{order.marketId.name}</TableCell>
                  <TableCell>{order.type === "buy" ? "خرید" : "فروش"}</TableCell>
                  <TableCell>
                    {order.amount} {order.marketId.type === "gold" ? "گرم" : "عدد"}
                  </TableCell>
                  <TableCell>{order.price.toLocaleString()}</TableCell>
                  <TableCell>
                    {order.status === "pending"
                      ? "در انتظار"
                      : order.status === "approved"
                      ? "تأیید شده"
                      : "رد شده"}
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString("fa-IR")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Orders;