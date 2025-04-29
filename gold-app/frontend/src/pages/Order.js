import { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Select, MenuItem, Box, Typography } from "@mui/material";
import ThemeToggle from "../components/ThemeToggle";

const Order = () => {
  const [markets, setMarkets] = useState([]);
  const [marketId, setMarketId] = useState("");
  const [type, setType] = useState("buy");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/markets");
        setMarkets(data.filter(market => market.isActive));
      } catch (error) {
        alert("خطا: " + error.response.data.error);
      }
    };
    fetchMarkets();
  }, []);

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:3000/orders",
        { marketId, type, amount: Number(amount) },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("سفارش ثبت شد");
      setAmount("");
      setError("");
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const selectedMarket = markets.find(market => market._id === marketId);

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 5, p: 3, bgcolor: "background.default" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">ثبت سفارش</Typography>
        <ThemeToggle />
      </Box>
      <Select
        value={marketId}
        onChange={e => setMarketId(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        displayEmpty
      >
        <MenuItem value="" disabled>
          انتخاب بازار
        </MenuItem>
        {markets.map(market => (
          <MenuItem key={market._id} value={market._id}>
            {market.name}
          </MenuItem>
        ))}
      </Select>
      <Select
        value={type}
        onChange={e => setType(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      >
        <MenuItem value="buy">خرید</MenuItem>
        <MenuItem value="sell">فروش</MenuItem>
      </Select>
      <TextField
        label={`مقدار (${selectedMarket?.type === "gold" ? "گرم" : "عدد"})`}
        value={amount}
        onChange={e => setAmount(e.target.value)}
        type="number"
        fullWidth
        margin="normal"
        helperText={
          selectedMarket
            ? `حداقل: ${selectedMarket.minAmount}، حداکثر: ${selectedMarket.maxAmount}`
            : ""
        }
      />
      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      <Button variant="contained" onClick={handleSubmit} fullWidth sx={{ mt: 2 }}>
        ثبت سفارش
      </Button>
    </Box>
  );
};

export default Order;