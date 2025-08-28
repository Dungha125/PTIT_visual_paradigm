"use client"

import Link from 'next/link';
import { 
  Shapes, 
  ArrowLeft, 
  Code2, 
  Download, 
  Palette, 
  Move, 
  Zap,
  Share2,
  FileText,
  Settings,
  CheckCircle
} from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      icon: Shapes,
      title: "Drag & Drop Interface",
      description: "Giao diện kéo thả trực quan cho việc tạo và chỉnh sửa các elements",
      color: "blue"
    },
    {
      icon: Palette,
      title: "6 Loại Relationship",
      description: "Hỗ trợ đầy đủ: Association, Inheritance, Composition, Aggregation, Dependency, Realization",
      color: "purple"
    },
    {
      icon: Move,
      title: "Real-time Connection",
      description: "Tạo kết nối giữa các node với visual feedback và preview real-time",
      color: "green"
    },
    {
      icon: Code2,
      title: "PlantUML Export",
      description: "Xuất code PlantUML để sử dụng trong documentation và các công cụ khác",
      color: "orange"
    },
    {
      icon: Settings,
      title: "Inspector Panel",
      description: "Chỉnh sửa chi tiết properties, attributes, methods của từng element",
      color: "red"
    },
    {
      icon: Zap,
      title: "Undo/Redo System",
      description: "Hệ thống undo/redo mạnh mẽ với history management",
      color: "yellow"
    }
  ];

  const diagramTypes = [
    {
      name: "Class Diagram",
      description: "Mô hình hóa cấu trúc class, interface, abstract class với attributes và methods",
      features: ["Classes & Interfaces", "Inheritance", "Composition & Aggregation", "Abstract Classes"]
    },
    {
      name: "Use Case Diagram", 
      description: "Định nghĩa các chức năng hệ thống và tương tác với actors",
      features: ["Actors", "Use Cases", "System Boundary", "Relationships"]
    },
    {
      name: "Entity Relationship",
      description: "Thiết kế cơ sở dữ liệu với entities, attributes và relationships",
      features: ["Entities", "Weak Entities", "Attributes", "Relationships"]
    },
    {
      name: "Sequence Diagram",
      description: "Mô tả luồng tương tác giữa các objects theo thời gian",
      features: ["Lifelines", "Messages", "Activation Boxes", "Time Flow"]
    },
    {
      name: "Activity Diagram",
      description: "Quy trình và luồng hoạt động của hệ thống",
      features: ["Activities", "Decision Points", "Start/End States", "Flows"]
    },
    {
      name: "State Machine",
      description: "Mô hình các trạng thái và chuyển đổi trạng thái",
      features: ["States", "Transitions", "Initial/Final States", "Composite States"]
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
                <span className="text-xl font-bold text-gray-900">Features</span>
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
            Tính năng 
            <span className="text-blue-600">toàn diện</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá tất cả các tính năng mạnh mẽ của UML Designer - từ giao diện kéo thả 
            đến export code chuyên nghiệp.
          </p>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Tính năng chính</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
                <div className={`bg-${feature.color}-100 rounded-lg p-3 w-12 h-12 mb-4`}>
                  <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diagram Types */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Các loại sơ đồ được hỗ trợ</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {diagramTypes.map((diagram, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{diagram.name}</h3>
                <p className="text-gray-600 mb-4">{diagram.description}</p>
                
                <h4 className="font-medium text-gray-800 mb-2">Tính năng:</h4>
                <ul className="space-y-1">
                  {diagram.features.map((feature, featIndex) => (
                    <li key={featIndex} className="flex items-center space-x-2 text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Sẵn sàng trải nghiệm?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Khám phá tất cả tính năng với UML Designer miễn phí
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/uml-designer"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Bắt đầu thiết kế
            </Link>
            <Link 
              href="/"
              className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Về trang chủ
            </Link>
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
