# DỰ ÁN E-COMMERCE TÙY CHỈNH VỎ ĐIỆN THOẠI (COMPLETED)

**Mô tả:** Tôi đã phát triển một nền tảng thương mại điện tử cho phép khách hàng tùy chỉnh vỏ điện thoại bằng cách tải lên hình ảnh cá nhân. Dự án bao gồm quy trình thiết kế trực quan, tích hợp thanh toán ZaloPay, và hệ thống quản lý đơn hàng đầy đủ, giúp doanh nghiệp mở rộng danh mục sản phẩm tùy chỉnh và tăng cường trải nghiệm khách hàng.

**Chi tiết chức năng:**
- Công cụ thiết kế vỏ điện thoại trực tuyến với tải lên và điều chỉnh hình ảnh.
- Tùy chọn đa dạng về màu sắc, vật liệu, và phiên bản điện thoại.
- Tích hợp xác thực người dùng thông qua Auth0.
- Xử lý thanh toán an toàn qua cổng ZaloPay.
- Quản lý địa chỉ giao hàng và theo dõi đơn hàng.
- Dashboard quản trị toàn diện để theo dõi và xử lý đơn hàng.
- Kiến trúc ứng dụng tối ưu với Nx monorepo để quản lý hiệu quả.

**Công nghệ cho B.E:** Node.js (xử lý thanh toán ZaloPay), Prisma ORM, PostgreSQL, EJS template engine.

**Công nghệ cho F.E:** Next.js, Tailwind CSS, Auth0, React hooks, Custom Design Tools, Nx workspace.

**Kiến trúc hệ thống:**
- Nx monorepo giúp quản lý code và phiên làm việc dev hiệu quả
- Frontend: Next.js application (auth0buy-step-product)
- Payment API: Node.js API trong cùng monorepo
- Admin Dashboard: Node.js với EJS
- Database: PostgreSQL với Prisma ORM

**GitHub:** https://github.com/yourusername/e-commerce-phone-case-customization.git
