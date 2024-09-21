import { Request, Response } from 'express';
import { prisma } from "@e-com-linux-team/config"; // Đảm bảo đã tạo prismaClient.ts theo hướng dẫn trước đó

// Lấy danh sách tất cả các đơn hàng
export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                orderItems: {
                    include: {
                        product: true, // Bao gồm thông tin sản phẩm trong orderItems
                    },
                },
            },
        });
        res.json(orders);
    } catch (error) {
        console.error('Error getting orders:', error);
        res.status(500).json({ message: 'Error retrieving orders' });
    }
};

// Tạo mới một đơn hàng
export const createOrder = async (req: Request, res: Response) => {
    const { customerId, orderItems } = req.body;

    try {
        const order = await prisma.order.create({
            data: {
                customerId,
                orderItems: {
                    create: orderItems.map((item: { productId: number; quantity: number }) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                },
            },
        });
        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order' });
    }
};

// Lấy thông tin chi tiết của một đơn hàng
export const getOrderById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const order = await prisma.order.findUnique({
            where: { id: Number(id) },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error getting order by ID:', error);
        res.status(500).json({ message: 'Error retrieving order' });
    }
};

// Cập nhật đơn hàng
export const updateOrder = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { customerId, orderItems } = req.body;

    try {
        const existingOrder = await prisma.order.findUnique({
            where: { id: Number(id) },
        });

        if (!existingOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Xóa tất cả orderItems cũ và tạo mới
        const updatedOrder = await prisma.order.update({
            where: { id: Number(id) },
            data: {
                customerId,
                orderItems: {
                    deleteMany: {}, // Xóa tất cả orderItems cũ
                    create: orderItems.map((item: { productId: number; quantity: number }) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                },
            },
        });

        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Error updating order' });
    }
};

// Xóa đơn hàng
export const deleteOrder = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const existingOrder = await prisma.order.findUnique({
            where: { id: Number(id) },
        });

        if (!existingOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await prisma.order.delete({
            where: { id: Number(id) },
        });

        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Error deleting order' });
    }
};
