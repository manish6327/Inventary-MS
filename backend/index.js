import express from 'express'
import cors from 'cors'
import connectToDB from './db/connection.js';
import authRoutes from './routes/auth.js'
import categoryRoutes from './routes/category.js'
import supplierRoutes from './routes/supplier.js'
import productRoutes from './routes/product.js'
import userRoutes from "./routes/user.js";
import orderRoutes from "./routes/order.js"
import dashboardRoute from "./routes/dashboard.js"

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes)
app.use("/api/supplier", supplierRoutes);
app.use("/api/product", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/dashboard", dashboardRoute);


app.listen(process.env.PORT, () => {
    connectToDB();
    console.log("Server is running")
})
