
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, TextField, Button, Typography, Snackbar, Alert } from "@mui/material";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/auth/admin-login", formData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      setSnackbar({ open: true, message: "ورود مدیر با موفقیت انجام شد", severity: "success" });
      setTimeout(() => navigate("/admin"), 1000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "خطا در ورود مدیر",
        severity: "error"
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        p: 3,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 1
      }}
    >
      <Typography variant="h5" gutterBottom>
        ورود مدیر
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="ایمیل"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="رمز عبور"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          ورود
        </Button>
      </form>
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

export default AdminLogin;