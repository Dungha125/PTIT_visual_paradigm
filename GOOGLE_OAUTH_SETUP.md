# Hướng dẫn cấu hình Google OAuth

## 1. Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Kích hoạt Google+ API (nếu chưa có)

## 2. Tạo OAuth 2.0 Credentials

1. Vào **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** > **OAuth client ID**
3. Chọn **Application type**: Web application
4. Thêm **Authorized redirect URIs**:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`

## 3. Cấu hình môi trường

Sao chép file `.env.local` và cập nhật các giá trị:

```bash
# NextAuth.js Configuration
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
NEXTAUTH_URL=http://localhost:3000

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Database Configuration
DATABASE_URL="file:./dev.db"
```

### Lấy Google OAuth Credentials:

1. **GOOGLE_CLIENT_ID**: Client ID từ Google Cloud Console
2. **GOOGLE_CLIENT_SECRET**: Client Secret từ Google Cloud Console
3. **NEXTAUTH_SECRET**: Generate bằng command:
   ```bash
   openssl rand -base64 32
   ```

## 4. Khởi tạo Database

Chạy các lệnh sau để setup database:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio để xem data
npx prisma studio
```

## 5. Test Authentication

1. Chạy development server: `npm run dev`
2. Truy cập `http://localhost:3000`
3. Click "Đăng nhập" và test Google OAuth
4. Kiểm tra dashboard tại `http://localhost:3000/dashboard`

## 6. Production Deployment

### Cập nhật môi trường production:

```bash
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
DATABASE_URL=your-production-database-url
```

### Google Cloud Console:

- Thêm production domain vào **Authorized JavaScript origins**
- Thêm production callback URL vào **Authorized redirect URIs**

## Troubleshooting

### Lỗi thường gặp:

1. **"redirect_uri_mismatch"**: 
   - Kiểm tra URL trong Google Console khớp với NEXTAUTH_URL
   
2. **"invalid_client"**:
   - Kiểm tra GOOGLE_CLIENT_ID và GOOGLE_CLIENT_SECRET
   
3. **Database connection failed**:
   - Kiểm tra DATABASE_URL và chạy `npx prisma db push`
   
4. **Session không persist**:
   - Kiểm tra NEXTAUTH_SECRET đã được set

## Security Notes

- **NEXTAUTH_SECRET** phải là random string dài ít nhất 32 ký tự
- Không commit credentials vào git
- Sử dụng HTTPS trong production
- Cân nhắc sử dụng production database thay vì SQLite
