import { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

const Auth = ({ type }) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post("http://localhost:3000/auth/login", {
        phone,
        password
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      navigate("/");
    } catch (error) {
      alert("خطا: " + error.response.data.error);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 5, p: 3, bgcolor: "background.default" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" color="text.primary">
          ورود کاربر
        </Typography>
        <ThemeToggle />
      </Box>
      <TextField
        label="شماره موبایل"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        fullWidth
        margin="normal"
        inputProps={{ pattern: "[0-9]{11}", title: "شماره موبایل باید ۱۱ رقم باشد" }}
      />
      <TextField
        label="رمز عبور"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" onClick={handleSubmit} fullWidth sx={{ mt: 2 }}>
        ورود
      </Button>
    </Box>
  );
};

export default Auth;