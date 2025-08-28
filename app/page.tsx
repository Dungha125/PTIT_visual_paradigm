"use client"

import Link from 'next/link';
import { Shapes, ArrowRight, Code2, Users, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="pt-8 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Thiết kế 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> UML </span>
            chuyên nghiệp
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Công cụ thiết kế sơ đồ UML trực tuyến với giao diện thân thiện, 
            hỗ trợ đầy đủ các loại diagram và export code chuyên nghiệp.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/uml-designer"
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <span>Bắt đầu thiết kế</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            
            <Link 
              href="/features"
              className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-200"
            >
              Tìm hiểu thêm
            </Link>
          </div>

          {/* Demo Preview */}
          <div className="mt-20">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-w-4xl mx-auto">
              <div className="bg-gray-800 px-4 py-3 flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-400 text-sm ml-4">UML Designer</span>
              </div>
              <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 min-h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <Shapes className="h-24 w-24 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">Giao diện thiết kế trực quan</h3>
                  <p className="text-gray-600">Kéo thả các thành phần để tạo sơ đồ UML chuyên nghiệp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Tính năng nổi bật</h2>
            <p className="text-xl text-gray-600">Được thiết kế để tối ưu hóa trải nghiệm thiết kế UML</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-blue-100 rounded-2xl p-4 w-16 h-16 mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Shapes className="h-8 w-8 text-blue-600 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">UML Designer</h3>
              <p className="text-gray-600">Tạo các sơ đồ UML chuyên nghiệp với giao diện kéo thả trực quan</p>
            </div>

            <div className="text-center group">
              <div className="bg-green-100 rounded-2xl p-4 w-16 h-16 mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Code2 className="h-8 w-8 text-green-600 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Export Code</h3>
              <p className="text-gray-600">Xuất PlantUML code để sử dụng trong các công cụ khác</p>
            </div>

            <div className="text-center group">
              <div className="bg-purple-100 rounded-2xl p-4 w-16 h-16 mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <Zap className="h-8 w-8 text-purple-600 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time</h3>
              <p className="text-gray-600">Cập nhật và preview thay đổi trong thời gian thực</p>
            </div>
          </div>
        </div>
      </section>

      {/* Diagram Types */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Hỗ trợ đầy đủ các loại sơ đồ</h2>
            <p className="text-xl text-gray-600">Tạo mọi loại sơ đồ UML từ cơ bản đến nâng cao</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Class Diagram", desc: "Mô hình hóa cấu trúc lớp và mối quan hệ" },
              { name: "Use Case Diagram", desc: "Định nghĩa chức năng và tác nhân" },
              { name: "Sequence Diagram", desc: "Luồng tương tác theo thời gian" },
              { name: "Entity Relationship", desc: "Thiết kế cơ sở dữ liệu" },
              { name: "Activity Diagram", desc: "Quy trình và luồng hoạt động" },
              { name: "State Machine", desc: "Trạng thái và chuyển đổi" }
            ].map((diagram, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{diagram.name}</h3>
                <p className="text-gray-600">{diagram.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/uml-designer"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <span>Khám phá tất cả tính năng</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Sẵn sàng bắt đầu thiết kế?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Tạo sơ đồ UML chuyên nghiệp ngay hôm nay với công cụ miễn phí của chúng tôi
          </p>
          
          <Link 
            href="/uml-designer"
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-200 inline-flex items-center space-x-2 shadow-lg"
          >
            <span>Bắt đầu ngay</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shapes className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">UML Designer</span>
              </div>
              <p className="text-gray-400">
                Công cụ thiết kế sơ đồ UML hiện đại và dễ sử dụng, 
                giúp bạn tạo ra các diagram chuyên nghiệp.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Tính năng</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/uml-designer" className="hover:text-white transition-colors">Class Diagram</Link></li>
                <li><Link href="/uml-designer" className="hover:text-white transition-colors">Use Case</Link></li>
                <li><Link href="/uml-designer" className="hover:text-white transition-colors">Sequence</Link></li>
                <li><Link href="/uml-designer" className="hover:text-white transition-colors">ERD</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Liên kết</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/uml-designer" className="hover:text-white transition-colors">Bắt đầu thiết kế</Link></li>
                <li><a href="#features" className="hover:text-white transition-colors">Tính năng</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">Giới thiệu</a></li>
                <li><a href="mailto:support@umldesigner.com" className="hover:text-white transition-colors">Hỗ trợ</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 UML Designer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
