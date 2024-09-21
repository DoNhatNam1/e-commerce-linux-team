// src/routes/productRoutes.ts
import { Router } from 'express';
import { getAllProducts, createProduct } from '../controllers/productController';

const router = Router();

router.get('/', getAllProducts); // Lấy tất cả sản phẩm
router.post('/', createProduct); // Tạo sản phẩm mới

export default router;
