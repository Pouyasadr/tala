
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
  const [prices, setPrices] = useState([]);
  const [orderData, setOrderData] = useState({
    marketId: "",
    type: "buy",
    amount: ""
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchPrices = async () => {
    try {
      const response = await axios.get("http://localhost:3000/prices");
      setPrices(response.data);
      // تنظیم بازار پیش‌فرض به اولین بازار
      if (response.data.length > 0) {
        setOrderData(prev => ({ ...prev, marketId: response.data[0].marketId?._id || "" }));
      }
    } catch (error) {
      setSnackbar({ open: true, message: "خطا در دریافت نرخ‌ها", severity: "error" });
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const handleOrderChange = e => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (event, newType) => {
    if (newType) {
      setOrderData({ ...orderData, type: newType });
    }
  };

  const handleOrderSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/orders",
        orderData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );
      setOrderData({ marketId: prices[0]?.marketId?._id || "", type: "buy", amount: "" });
      setSnackbar({ open: true, message: "سفارش با موفقیت ثبت شد", severity: "success" });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "خطا در ثبت سفارش",
        severity: "error"
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        بازار طلای آب‌شده
      </Typography>
      
      {/* نمایش نرخ‌ها */}
      <Typography variant="h6" gutterBottom>
        نرخ‌های فعلی
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>بازار</TableCell>
              <TableCell>نرخ خرید (تومان)</TableCell>
              <TableCell>نرخ فروش (تومان)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prices.map(price => (
              <TableRow key={price._id}>
                <TableCell>{price.marketId?.name || "طلای آب‌شده"}</TableCell>
                <TableCell>{price.buyPrice}</TableCell>
                <TableCell>{price.sellPrice}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* فرم ثبت سفارش */}
      {localStorage.getItem("token") ? (
        <Box sx={{ bgcolor: "background.paper", p: 3, borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h6" gutterBottom>
            ثبت سفارش
          </Typography>
          <form onSubmit={handleOrderSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel>بازار</InputLabel>
              <Select
                name="marketId"
                value={orderData.marketId}
                onChange={handleOrderChange}
              >
                {prices.map(price => (
                  <MenuItem key={price._id} value={price.marketId?._id}>
                    {price.marketId?.name || "طلای آب‌شده"}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                نوع سفارش
              </Typography>
              <ToggleButtonGroup
                value={orderData.type}
                exclusive
                onChange={handleTypeChange}
                fullWidth
              >
                <ToggleButton value="buy">خرید</ToggleButton>
                <ToggleButton value="sell">فروش</ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <TextField
              label="مقدار (گرم)"
              name="amount"
              type="number"
              value={orderData.amount}
              onChange={handleOrderChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              ثبت سفارش
            </Button>
          </form>
        </Box>
      ) : (
        <Typography variant="body1" color="text.secondary">
          برای ثبت سفارش، لطفاً <Link to="/login">وارد شوید</Link>.
        </Typography>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;
