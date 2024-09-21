import { Router } from 'express';
import {
    getAllOrders,
    createOrder,
    getOrderById,
    updateOrder,
    deleteOrder,
} from '../controllers/orderController';

const router = Router();

// Lấy danh sách tất cả đơn hàng
router.get('/', getAllOrders);

// Lấy thông tin chi tiết đơn hàng theo ID
router.get('/:id', getOrderById);

// Tạo mới đơn hàng
router.post('/', createOrder);

// Cập nhật thông tin đơn hàng
router.put('/:id', updateOrder);

// Xóa đơn hàng
router.delete('/:id', deleteOrder);

export default router;
