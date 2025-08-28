# UML Designer - Công cụ thiết kế sơ đồ UML chuyên nghiệp

## 🎯 Giới thiệu

UML Designer là một ứng dụng web hiện đại cho phép thiết kế các sơ đồ UML một cách trực quan và chuyên nghiệp. Được xây dựng với Next.js, TypeScript và Tailwind CSS.

## ✨ Tính năng chính

- **🎨 Giao diện Drag & Drop**: Kéo thả các thành phần để tạo sơ đồ
- **🔗 6 Loại Relationship**: Association, Inheritance, Composition, Aggregation, Dependency, Realization
- **📱 Responsive Design**: Hoạt động tốt trên mọi thiết bị
- **💾 Export PlantUML**: Xuất code PlantUML để sử dụng trong các công cụ khác
- **⚡ Real-time Preview**: Xem trước kết quả ngay lập tức
- **🔄 Undo/Redo**: Hệ thống hoàn tác mạnh mẽ

## 🏗️ Cấu trúc dự án

```
app/
├── page.tsx                 # Trang chủ
├── layout.tsx              # Layout chung
├── globals.css             # CSS toàn cục
├── components/             # Shared components
│   └── Navigation.tsx      # Navigation component
├── uml-designer/          # Route UML Designer
│   └── page.tsx           # Ứng dụng chính
├── features/              # Trang tính năng
│   └── page.tsx
├── about/                 # Trang giới thiệu
│   └── page.tsx
└── favicon.ico
```

## 🚀 Cài đặt và chạy

1. **Clone repository**:
```bash
git clone <repository-url>
cd qr-scanner-frontend
```

2. **Cài đặt dependencies**:
```bash
npm install
```

3. **Cấu hình Google OAuth**:
- Xem hướng dẫn chi tiết trong `GOOGLE_OAUTH_SETUP.md`
- Tạo `.env.local` và cập nhật credentials

4. **Setup database**:
```bash
npx prisma generate
npx prisma db push
```

5. **Chạy development server**:
```bash
npm run dev
```

6. **Build cho production**:
```bash
npm run build
npm start
```

## 📋 Các Routes có sẵn

| Route | Mô tả |
|-------|-------|
| `/` | Trang chủ với giới thiệu và CTA |
| `/uml-designer` | Ứng dụng thiết kế UML chính |
| `/dashboard` | Dashboard quản lý dự án (yêu cầu đăng nhập) |
| `/features` | Trang chi tiết tính năng |
| `/about` | Trang giới thiệu về dự án |
| `/api/auth/*` | NextAuth.js authentication endpoints |
| `/api/projects/*` | API để quản lý dự án UML |

## 🎨 Các loại sơ đồ UML được hỗ trợ

1. **Class Diagram** - Mô hình hóa cấu trúc lớp
2. **Use Case Diagram** - Định nghĩa chức năng hệ thống
3. **Entity Relationship** - Thiết kế cơ sở dữ liệu
4. **Sequence Diagram** - Luồng tương tác theo thời gian
5. **Activity Diagram** - Quy trình và luồng hoạt động
6. **State Machine** - Trạng thái và chuyển đổi

## 🔧 Công nghệ sử dụng

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- **State Management**: React Hooks
- **Canvas**: HTML5 Canvas + SVG

## 📖 Hướng dẫn sử dụng

### Tạo sơ đồ mới:
1. Truy cập `/uml-designer`
2. Chọn loại sơ đồ từ dropdown
3. Kéo thả các elements từ palette
4. Kết nối các elements bằng connection handles
5. Chỉnh sửa properties trong inspector panel

### Tạo kết nối:
1. Chọn loại relationship trong palette
2. Click vào connection handle của node nguồn
3. Kéo đến node đích
4. Thả để tạo kết nối

### Export code:
1. Click nút "Generate PlantUML" trong toolbar
2. Code sẽ được copy vào clipboard
3. Paste vào công cụ PlantUML khác

## 🎯 Roadmap

- [ ] Thêm hỗ trợ collaborative editing
- [ ] Export PNG/SVG
- [ ] Import từ PlantUML
- [ ] Templates và examples
- [ ] Dark mode
- [ ] Mobile optimization

## 🤝 Đóng góp

Chúng tôi rất hoan nghênh các đóng góp từ cộng đồng! Hãy tạo issue hoặc pull request.

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.

## 📧 Liên hệ

- Email: support@umldesigner.com
- Website: [UML Designer](/)

---

**Được tạo với ❤️ bởi UML Designer Team**