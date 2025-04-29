
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Divider,
  Toolbar,
  CssBaseline,
  Card,
  CardContent
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  People as PeopleIcon,
  Storefront as StorefrontIcon,
  Assignment as AssignmentIcon,
  Delete as DeleteIcon,
  Dashboard as DashboardIcon
} from "@mui/icons-material";
import ThemeToggle from "../components/ThemeToggle";

const Admin = () => {
  const [section, setSection] = useState("dashboard");
  const [newUser, setNewUser] = useState({ phone: "", password: "", name: "" });
  const [users, setUsers] = useState([]);
  const [newMarket, setNewMarket] = useState({ name: "", type: "gold", minAmount: 1, maxAmount: 1000 });
  const [markets, setMarkets] = useState([]);
  const [priceData, setPriceData] = useState({ marketId: "", buyPrice: "", sellPrice: "" });
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [dashboardData, setDashboardData] = useState({ users: 0, orders: 0, markets: 0 });

  const fetchData = async () => {
    try {
      const [usersRes, marketsRes, ordersRes] = await Promise.all([
        axios.get("http://localhost:3000/users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }),
        axios.get("http://localhost:3000/markets"),
        axios.get("http://localhost:3000/orders", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
      ]);
      setUsers(usersRes.data);
      setMarkets(marketsRes.data);
      setOrders(ordersRes.data);
      setDashboardData({
        users: usersRes.data.length,
        orders: ordersRes.data.length,
        markets: marketsRes.data.length
      });
    } catch (error) {
      setSnackbar({ open: true, message: "خطا در دریافت داده‌ها", severity: "error" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateUser = async e => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/users", newUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setNewUser({ phone: "", password: "", name: "" });
      fetchData();
      setSnackbar({ open: true, message: "کاربر جدید با موفقیت ساخته شد", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "خطا در ساخت کاربر", severity: "error" });
    }
  };

  const handleDeleteUser = async userId => {
    try {
      await axios.delete(`http://localhost:3000/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchData();
      setSnackbar({ open: true, message: "کاربر با موفقیت حذف شد", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "خطا در حذف کاربر", severity: "error" });
    }
  };

  const handleCreateMarket = async e => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/markets", newMarket, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setNewMarket({ name: "", type: "gold", minAmount: 1, maxAmount: 1000 });
      fetchData();
      setSnackbar({ open: true, message: "بازار جدید با موفقیت ساخته شد", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "خطا در ساخت بازار", severity: "error" });
    }
  };

  const handleDeleteMarket = async marketId => {
    try {
      await axios.delete(`http://localhost:3000/markets/${marketId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchData();
      setSnackbar({ open: true, message: "بازار با موفقیت حذف شد", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "خطا در حذف بازار", severity: "error" });
    }
  };

  const handleSetPrice = async e => {
    e.preventDefault();
    try {
      console.log("Sending price data:", priceData);
      await axios.post("http://localhost:3000/prices", priceData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setPriceData({ marketId: "", buyPrice: "", sellPrice: "" });
      fetchData();
      setSnackbar({ open: true, message: "نرخ با موفقیت ثبت شد", severity: "success" });
    } catch (error) {
      console.error("Error setting price:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setSnackbar({
        open: true,
        message: error.response?.data?.message || `خطا در ثبت نرخ: ${error.message}`,
        severity: "error"
      });
    }
  };

  const handleUpdateLimits = async (marketId, minAmount, maxAmount) => {
    try {
      await axios.put(
        `http://localhost:3000/markets/${marketId}`,
        { minAmount, maxAmount },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      fetchData();
      setSnackbar({ open: true, message: "محدودیت‌ها با موفقیت به‌روزرسانی شد", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "خطا در به‌روزرسانی محدودیت‌ها", severity: "error" });
    }
  };

  const handleOrderAction = async (orderId, action) => {
    try {
      await axios.put(
        `http://localhost:3000/orders/${orderId}`,
        { status: action },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      fetchData();
      setSnackbar({
        open: true,
        message: `سفارش با موفقیت ${action === "approved" ? "تأیید" : "رد"} شد`,
        severity: "success"
      });
    } catch (error) {
      setSnackbar({ open: true, message: "خطا در مدیریت سفارش", severity: "error" });
    }
  };

  const filteredOrders = filterStatus === "all" ? orders : orders.filter(o => o.status === filterStatus);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        anchor="right"
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            bgcolor: "background.paper",
            borderLeft: "1px solid",
            borderColor: "divider"
          }
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            پنل مدیریت
          </Typography>
          <ThemeToggle />
        </Toolbar>
        <Divider />
        <List>
          {[
            { text: "داشبورد", section: "dashboard", icon: <DashboardIcon /> },
            { text: "ساخت کاربر جدید", section: "createUser", icon: <PersonAddIcon /> },
            { text: "لیست کاربران", section: "listUsers", icon: <PeopleIcon /> },
            { text: "ساخت بازار جدید", section: "createMarket", icon: <StorefrontIcon /> },
            { text: "مدیریت سفارشات و نرخ", section: "manageOrders", icon: <AssignmentIcon /> }
          ].map(item => (
            <ListItem key={item.section} disablePadding>
              <ListItemButton
                selected={section === item.section}
                onClick={() => setSection(item.section)}
                sx={{
                  "&.Mui-selected": {
                    bgcolor: "primary.light",
                    color: "primary.contrastText"
                  }
                }}
              >
                {item.icon}
                <ListItemText primary={item.text} sx={{ mr: 2 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          maxWidth: "calc(100% - 240px)",
          bgcolor: "background.default"
        }}
      >
        <Toolbar />
        <Typography variant="h4" gutterBottom>
          مدیریت
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {section === "dashboard" && (
          <Box sx={{ bgcolor: "background.paper", p: 3, borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" gutterBottom>
              داشبورد
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Card sx={{ flex: 1 }}>
                <CardContent>
                  <Typography variant="h6">تعداد کاربران</Typography>
                  <Typography variant="h4">{dashboardData.users}</Typography>
                </CardContent>
              </Card>
              <Card sx={{ flex: 1 }}>
                <CardContent>
                  <Typography variant="h6">تعداد سفارشات</Typography>
                  <Typography variant="h4">{dashboardData.orders}</Typography>
                </CardContent>
              </Card>
              <Card sx={{ flex: 1 }}>
                <CardContent>
                  <Typography variant="h6">تعداد بازارها</Typography>
                  <Typography variant="h4">{dashboardData.markets}</Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        )}

        {section === "createUser" && (
          <Box sx={{ maxWidth: 400, bgcolor: "background.paper", p: 3, borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" gutterBottom>
              ساخت کاربر جدید
            </Typography>
            <form onSubmit={handleCreateUser}>
              <TextField
                label="شماره تلفن"
                value={newUser.phone}
                onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="رمز عبور"
                type="password"
                value={newUser.password}
                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="نام"
                value={newUser.name}
                onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                ایجاد
              </Button>
            </form>
          </Box>
        )}

        {section === "listUsers" && (
          <Box sx={{ bgcolor: "background.paper", p: 3, borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" gutterBottom>
              لیست کاربران
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>نام</TableCell>
                    <TableCell>شماره تلفن</TableCell>
                    <TableCell>نقش</TableCell>
                    <TableCell>تاریخ ایجاد</TableCell>
                    <TableCell>عملیات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.phone || user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString("fa-IR")}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={user.role === "admin"}
                        >
                          حذف
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {section === "createMarket" && (
          <Box sx={{ maxWidth: 400, bgcolor: "background.paper", p: 3, borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" gutterBottom>
              ساخت بازار جدید
            </Typography>
            <form onSubmit={handleCreateMarket}>
              <TextField
                label="نام بازار"
                value={newMarket.name}
                onChange={e => setNewMarket({ ...newMarket, name: e.target.value })}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>نوع</InputLabel>
                <Select
                  value={newMarket.type}
                  onChange={e => setNewMarket({ ...newMarket, type: e.target.value })}
                >
                  <MenuItem value="gold">طلا</MenuItem>
                  <MenuItem value="coin">سکه</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="حداقل مقدار"
                type="number"
                value={newMarket.minAmount}
                onChange={e => setNewMarket({ ...newMarket, minAmount: Number(e.target.value) })}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="حداکثر مقدار"
                type="number"
                value={newMarket.maxAmount}
                onChange={e => setNewMarket({ ...newMarket, maxAmount: Number(e.target.value) })}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                ایجاد
              </Button>
            </form>
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              لیست بازارها
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>نام</TableCell>
                    <TableCell>نوع</TableCell>
                    <TableCell>حداقل مقدار</TableCell>
                    <TableCell>حداکثر مقدار</TableCell>
                    <TableCell>عملیات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {markets.map(market => (
                    <TableRow key={market._id}>
                      <TableCell>{market.name}</TableCell>
                      <TableCell>{market.type === "gold" ? "طلا" : "سکه"}</TableCell>
                      <TableCell>{market.minAmount}</TableCell>
                      <TableCell>{market.maxAmount}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteMarket(market._id)}
                        >
                          حذف
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {section === "manageOrders" && (
          <Box sx={{ bgcolor: "background.paper", p: 3, borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" gutterBottom>
              مدیریت سفارشات و نرخ
            </Typography>
            <Box sx={{ maxWidth: 400, mb: 4 }}>
              <Typography variant="subtitle1" gutterBottom>
                ثبت نرخ
              </Typography>
              <form onSubmit={handleSetPrice}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>بازار</InputLabel>
                  <Select
                    value={priceData.marketId}
                    onChange={e => setPriceData({ ...priceData, marketId: e.target.value })}
                  >
                    {markets.map(market => (
                      <MenuItem key={market._id} value={market._id}>
                        {market.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="نرخ خرید (تومان)"
                  type="number"
                  value={priceData.buyPrice}
                  onChange={e => setPriceData({ ...priceData, buyPrice: e.target.value })}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  label="نرخ فروش (تومان)"
                  type="number"
                  value={priceData.sellPrice}
                  onChange={e => setPriceData({ ...priceData, sellPrice: e.target.value })}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                  ثبت نرخ
                </Button>
              </form>
            </Box>
            <Box>
              <FormControl sx={{ minWidth: 120, mb: 2 }}>
                <InputLabel>فیلتر وضعیت</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">همه</MenuItem>
                  <MenuItem value="pending">در انتظار</MenuItem>
                  <MenuItem value="approved">تأیید شده</MenuItem>
                  <MenuItem value="rejected">رد شده</MenuItem>
                </Select>
              </FormControl>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>کاربر</TableCell>
                      <TableCell>بازار</TableCell>
                      <TableCell>نوع</TableCell>
                      <TableCell>مقدار</TableCell>
                      <TableCell>نرخ</TableCell>
                      <TableCell>وضعیت</TableCell>
                      <TableCell>عملیات</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredOrders.map(order => (
                      <TableRow key={order._id}>
                        <TableCell>{order.userId?.name || "نامشخص"}</TableCell>
                        <TableCell>{order.marketId?.name || "نامشخص"}</TableCell>
                        <TableCell>{order.type === "buy" ? "خرید" : "فروش"}</TableCell>
                        <TableCell>{order.amount}</TableCell>
                        <TableCell>{order.price || "نامشخص"}</TableCell>
                        <TableCell>
                          {order.status === "pending"
                            ? "در انتظار"
                            : order.status === "approved"
                            ? "تأیید شده"
                            : "رد شده"}
                        </TableCell>
                        <TableCell>
                          {order.status === "pending" && (
                            <>
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleOrderAction(order._id, "approved")}
                                sx={{ mr: 1 }}
                              >
                                تأیید
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleOrderAction(order._id, "rejected")}
                              >
                                رد
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Admin;
