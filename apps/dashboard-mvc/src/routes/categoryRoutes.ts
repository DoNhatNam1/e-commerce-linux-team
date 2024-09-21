// src/routes/categoryRoutes.ts
import { Router } from 'express';
import { getAllCategories, createCategory } from '../controllers/categoryController';

const router = Router();

router.get('/', getAllCategories); // Lấy tất cả danh mục
router.post('/', createCategory); // Tạo danh mục mới

export default router;
