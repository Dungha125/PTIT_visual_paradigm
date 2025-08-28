"use client"

import Link from 'next/link';
import { 
  Shapes, 
  ArrowLeft, 
  Target, 
  Users, 
  Zap,
  Heart,
  Star,
  Globe,
  Code
} from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { number: "6+", label: "Loại sơ đồ UML" },
    { number: "100%", label: "Miễn phí" },
    { number: "∞", label: "Số lượng dự án" },
    { number: "24/7", label: "Khả dụng" }
  ];

  const team = [
    {
      name: "Development Team",
      role: "Full-stack Development",
      description: "Phát triển và duy trì ứng dụng với công nghệ hiện đại"
    },
    {
      name: "UX/UI Team", 
      role: "Design & Experience",
      description: "Thiết kế giao diện thân thiện và trải nghiệm người dùng tốt nhất"
    },
    {
      name: "Community",
      role: "Feedback & Support", 
      description: "Cộng đồng người dùng đóng góp ý kiến và hỗ trợ lẫn nhau"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Về trang chủ</span>
              </Link>
              <div className="border-l border-gray-300 h-6"></div>
              <div className="flex items-center space-x-2">
                <Shapes className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Giới thiệu</span>
              </div>
            </div>
            
            <Link 
              href="/uml-designer"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Thử ngay
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Về 
            <span className="text-blue-600">UML Designer</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chúng tôi tạo ra UML Designer với mục tiêu đơn giản hóa việc thiết kế sơ đồ UML, 
            giúp developers và analysts tập trung vào logic thay vì công cụ.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Target className="h-8 w-8 text-blue-600 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sứ mệnh</h3>
              <p className="text-gray-600">
                Làm cho việc thiết kế UML trở nên dễ dàng, nhanh chóng và 
                accessible cho mọi người
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Zap className="h-8 w-8 text-green-600 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tầm nhìn</h3>
              <p className="text-gray-600">
                Trở thành công cụ UML hàng đầu với tính năng mạnh mẽ 
                nhưng vẫn đơn giản sử dụng
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Heart className="h-8 w-8 text-purple-600 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Giá trị</h3>
              <p className="text-gray-600">
                Miễn phí, mã nguồn mở, và luôn lắng nghe feedback 
                từ cộng đồng người dùng
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Số liệu nổi bật</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Tại sao chọn UML Designer?</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <Globe className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Truy cập mọi lúc mọi nơi</h3>
              <p className="text-gray-600">
                Ứng dụng web hoạt động trên mọi thiết bị có trình duyệt. 
                Không cần cài đặt, không giới hạn hệ điều hành.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <Star className="h-8 w-8 text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hoàn toàn miễn phí</h3>
              <p className="text-gray-600">
                Không có phí ẩn, không có giới hạn số lượng dự án. 
                Tất cả tính năng đều miễn phí 100%.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <Code className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Export chuyên nghiệp</h3>
              <p className="text-gray-600">
                Xuất PlantUML code để tích hợp vào documentation, 
                wiki, hoặc các công cụ khác.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <Users className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cộng đồng hỗ trợ</h3>
              <p className="text-gray-600">
                Cộng đồng người dùng tích cực, sẵn sàng giúp đỡ 
                và chia sẻ kinh nghiệm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Đội ngũ phát triển</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-10 w-10 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Tham gia cộng đồng</h2>
          <p className="text-xl text-blue-100 mb-8">
            Hãy cùng xây dựng công cụ UML Designer tốt hơn
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/uml-designer"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Thử ngay
            </Link>
            <a 
              href="mailto:feedback@umldesigner.com"
              className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Gửi phản hồi
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shapes className="h-6 w-6 text-blue-400" />
            <span className="font-bold">UML Designer</span>
          </div>
          <p className="text-gray-400 text-sm">© 2024 UML Designer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
