import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';  // Import cors
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import orderRoutes from './routes/orderRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Cấu hình EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Cấu hình CORS
app.use(cors());  // Sử dụng cors với cấu hình mặc định

// Cấu hình thư mục chứa các file tĩnh (CSS, JS, hình ảnh)
app.use(express.static('public'));

// Middleware cho form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware cho JSON payload
app.use(bodyParser.json());  // Thêm dòng này để xử lý request với JSON payload

// Định nghĩa route chính
app.get('/', (req, res) => {
  const orders = [
    { name: "Josh", email: "josh@gmail.com", status: "Đang chờ", date: "5/4/2024", cost: "22.000 VND" },
    { name: "Nam", email: "hello@gmail.com", status: "Đang chờ", date: "5/4/2024", cost: "22.000 VND" },
    { name: "Yu", email: "have@gmail.com", status: "Đang chờ", date: "5/4/2024", cost: "22.000 VND" },
  ];

  const dailyRevenue = 5004000;
  const dailyTarget = 6000000;
  const monthlyRevenue = 39106000;
  const monthlyTarget = 112000000;

  res.render('index', { orders, dailyRevenue, dailyTarget, monthlyRevenue, monthlyTarget });
});

// Sử dụng các route khác
app.use('/products', productRoutes);  // Đường dẫn cho sản phẩm
app.use('/categories', categoryRoutes);  // Đường dẫn cho danh mục
app.use('/orders', orderRoutes);  // Đường dẫn cho đơn hàng

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
