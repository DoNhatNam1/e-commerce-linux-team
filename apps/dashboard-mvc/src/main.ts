import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import methodOverride from 'method-override';

const app = express();
const prisma = new PrismaClient();



// Cấu hình view engine và thư mục views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));

// Trang chủ (index.ejs)
app.get('/', (req: Request, res: Response) => {
  res.render('index');
});

// Hiển thị danh sách đơn hàng
app.get('/orders', async (req: Request, res: Response) => {
  try {
    const orders = await prisma.tbOrder.findMany(); // Không bao gồm user

    res.render('orders', { orders });
  } catch (error) {
    console.error('Error retrieving orders:', error); // Log lỗi để theo dõi
    res.status(500).send('Error retrieving orders');
  }
});

// Hiển thị chi tiết đơn hàng
app.get('/orders/:id', async (req: Request, res: Response) => {
  try {
    const order = await prisma.tbOrder.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!order) {
      return res.status(404).send('Order not found');
    }

    res.render('order-details', { order });
  } catch (error) {
    console.error('Error retrieving the order details:', error);
    res.status(500).send('Error retrieving the order details');
  }
});


// Hiển thị form chỉnh sửa đơn hàng
app.get('/orders/:id/edit', async (req: Request, res: Response) => {
  try {
    const order = await prisma.tbOrder.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!order) {
      return res.status(404).send('Order not found');
    }

    res.render('edit-order', { order });
  } catch (error) {
    console.error('Error retrieving the order for editing:', error);
    res.status(500).send('Error retrieving the order');
  }
});


// Cập nhật thông tin đơn hàng
app.post('/orders/:id/edit', async (req: Request, res: Response) => {
  const { status } = req.body;

  try {
    await prisma.tbOrder.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
    });

    res.redirect('/orders');
  } catch (error) {
    console.error('Error updating the order:', error);
    res.status(500).send('Error updating the order');
  }
});

// Hiển thị danh sách người dùng (TbUser)
app.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await prisma.tbUser.findMany();

    res.render('users', { users });
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).send('Error retrieving users');
  }
});

// Hiển thị form thêm người dùng
app.get('/users/new', (req: Request, res: Response) => {
  res.render('new-user');
});

// Xử lý thêm người dùng
app.post('/users/new', async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    await prisma.tbUser.create({
      data: {
        email,
      },
    });

    res.redirect('/users');
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Error creating user');
  }
});

// Hiển thị form chỉnh sửa người dùng
app.get('/users/:id/edit', async (req: Request, res: Response) => {
  try {
    const user = await prisma.tbUser.findUnique({
      where: { id: req.params.id },
    });

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.render('edit-user', { user });
  } catch (error) {
    console.error('Error retrieving the user for editing:', error);
    res.status(500).send('Error retrieving the user');
  }
});

// Cập nhật thông tin người dùng
app.post('/users/:id/edit', async (req: Request, res: Response) => {
  const { email, isActive } = req.body;

  try {
    await prisma.tbUser.update({
      where: { id: req.params.id },
      data: {
        email,
        IsActive: isActive === 'true',
      },
    });

    res.redirect('/users');
  } catch (error) {
    console.error('Error updating the user:', error);
    res.status(500).send('Error updating the user');
  }
});

// Hiển thị xác nhận xóa người dùng
app.get('/users/:id/delete', async (req: Request, res: Response) => {
  try {
    const user = await prisma.tbUser.findUnique({
      where: { id: req.params.id },
    });

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.render('delete-user', { user });
  } catch (error) {
    console.error('Error retrieving the user for deletion:', error);
    res.status(500).send('Error retrieving the user');
  }
});

// Xử lý xóa người dùng
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Route xử lý xoá
app.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    await prisma.tbUser.delete({
      where: { id: userId }
    });

    res.redirect('/users');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Server error');
  }
});




// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
