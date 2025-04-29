
   const express = require("express");
   const mongoose = require("mongoose");
   const cors = require("cors");
   const authRoutes = require("./routes/auth");
   const userRoutes = require("./routes/users");
   const orderRoutes = require("./routes/orders");
   const marketRoutes = require("./routes/markets");
   const priceRoutes = require("./routes/prices");

   const app = express();
   app.use(cors());
   app.use(express.json());

   mongoose
     .connect("mongodb://localhost:27017/gold-app", {
       useNewUrlParser: true,
       useUnifiedTopology: true
     })
     .then(() => console.log("Connected to MongoDB"))
     .catch(err => console.error("MongoDB connection error:", err));

   app.use("/auth", authRoutes);
   app.use("/users", userRoutes);
   app.use("/orders", orderRoutes);
   app.use("/markets", marketRoutes);
   app.use("/prices", priceRoutes);

   const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
   ``
