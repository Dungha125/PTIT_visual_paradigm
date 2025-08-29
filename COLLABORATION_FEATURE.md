# Tính năng Collaboration - Chia sẻ file real-time

## Tổng quan

Tính năng collaboration cho phép người dùng chia sẻ project UML với nhau và làm việc cùng nhau trong thời gian thực, tương tự như Google Docs hoặc Canva.

## Các tính năng chính

### 1. Hệ thống quyền (Permission System)

- **OWNER (Chủ sở hữu)**: Toàn quyền với project
- **EDIT (Có thể chỉnh sửa)**: Xem, nhận xét và chỉnh sửa project
- **COMMENT (Chỉ nhận xét)**: Xem và nhận xét project, không thể chỉnh sửa
- **VIEW (Chỉ xem)**: Chỉ xem project, không thể chỉnh sửa hoặc nhận xét

### 2. Real-time Collaboration

- **Đồng bộ thời gian thực**: Thay đổi được cập nhật ngay lập tức
- **User presence**: Biết ai đang online và đang làm gì
- **Typing indicator**: Hiển thị khi ai đó đang gõ
- **Live comments**: Nhận xét được hiển thị real-time

### 3. Chia sẻ Project

- Chia sẻ qua email
- Quản lý quyền truy cập
- Theo dõi hoạt động
- Lịch sử thay đổi

## Cách sử dụng

### Chia sẻ Project

1. **Mở project** cần chia sẻ
2. **Click nút "Chia sẻ"** (Share button)
3. **Nhập email** người muốn chia sẻ
4. **Chọn quyền** phù hợp
5. **Click "Chia sẻ"**

### Tham gia Collaboration

1. **Nhận email** chia sẻ (sẽ được implement sau)
2. **Đăng nhập** vào hệ thống
3. **Truy cập project** được chia sẻ
4. **Bắt đầu làm việc** theo quyền được cấp

### Sử dụng Comments

1. **Mở panel Collaboration** (bên phải)
2. **Nhập nhận xét** vào ô input
3. **Click "Gửi"** để đăng nhận xét
4. **Reply** để trả lời nhận xét khác

## Kiến trúc kỹ thuật

### Backend

- **Prisma**: Database ORM với schema mở rộng
- **Socket.IO**: Real-time communication
- **Next.js API Routes**: RESTful API endpoints
- **NextAuth.js**: Authentication và authorization

### Frontend

- **React Hooks**: State management
- **Socket.IO Client**: Real-time client connection
- **Tailwind CSS**: Styling
- **TypeScript**: Type safety

### Database Schema

```prisma
// Project sharing
model ProjectShare {
  id        String         @id @default(cuid())
  projectId String
  userId    String
  permission PermissionLevel
  invitedBy String
  invitedAt DateTime       @default(now())
  acceptedAt DateTime?
  isActive  Boolean        @default(true)
}

// Comments
model ProjectComment {
  id        String   @id @default(cuid())
  projectId String
  userId    String
  content   String
  parentId  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Activity tracking
model ProjectActivity {
  id        String   @id @default(cuid())
  projectId String
  userId    String
  action    String
  details   String?
  createdAt DateTime @default(now())
}
```

## API Endpoints

### Project Sharing

- `POST /api/projects/[id]/share` - Chia sẻ project
- `GET /api/projects/[id]/share` - Lấy danh sách chia sẻ
- `PATCH /api/projects/[id]/share/[shareId]` - Cập nhật quyền
- `DELETE /api/projects/[id]/share/[shareId]` - Xóa chia sẻ

### Comments

- `GET /api/projects/[id]/comments` - Lấy comments
- `POST /api/projects/[id]/comments` - Thêm comment

### Socket Events

- `join-project` - Tham gia project
- `project-update` - Cập nhật project
- `add-comment` - Thêm comment
- `user-typing` - Typing indicator
- `user-cursor` - Cursor position

## Cài đặt và cấu hình

### 1. Environment Variables

```bash
# Socket.IO
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000

# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```

### 2. Dependencies

```bash
npm install socket.io socket.io-client @types/socket.io @types/socket.io-client
```

### 3. Database Migration

```bash
npx prisma generate
npx prisma db push
```

## Bảo mật

### Permission Validation

- Tất cả API endpoints đều validate quyền truy cập
- Socket events cũng được validate trước khi xử lý
- User chỉ có thể thực hiện hành động theo quyền được cấp

### Data Isolation

- User chỉ thấy projects mình sở hữu hoặc được chia sẻ
- Comments và activities được filter theo project access

## Troubleshooting

### Socket Connection Issues

1. **Kiểm tra environment variables**
2. **Verify server đang chạy**
3. **Check CORS configuration**
4. **Review network connectivity**

### Permission Errors

1. **Verify user authentication**
2. **Check project ownership**
3. **Validate share permissions**
4. **Review database records**

### Performance Issues

1. **Monitor socket connections**
2. **Check database queries**
3. **Review real-time updates frequency**
4. **Optimize data payload size**

## Roadmap

### Phase 1 (Current)
- ✅ Basic sharing functionality
- ✅ Permission system
- ✅ Real-time collaboration
- ✅ Comments system

### Phase 2 (Next)
- Email notifications
- Advanced permissions
- File versioning
- Conflict resolution

### Phase 3 (Future)
- Team workspaces
- Advanced analytics
- Integration APIs
- Mobile app support

## Contributing

Để đóng góp vào tính năng collaboration:

1. Fork repository
2. Tạo feature branch
3. Implement changes
4. Add tests
5. Submit pull request

## Support

Nếu gặp vấn đề với tính năng collaboration:

1. Kiểm tra documentation
2. Review error logs
3. Test với minimal setup
4. Create issue với detailed description
