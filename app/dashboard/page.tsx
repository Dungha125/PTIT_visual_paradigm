"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Shapes, 
  Plus, 
  Folder, 
  Calendar, 
  Edit3, 
  Trash2, 
  Eye,
  ArrowLeft,
  FileText
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description?: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  };
  permission?: 'OWNER' | 'VIEW' | 'COMMENT' | 'EDIT';
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchProjects();
    }
  }, [session]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa dự án này?')) return;
    
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setProjects(projects.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shapes className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Vui lòng đăng nhập</h1>
          <p className="text-gray-600 mb-4">Bạn cần đăng nhập để truy cập dashboard</p>
          <Link 
            href="/"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const getTypeLabel = (type: string) => {
    const types = {
      'class': 'Class Diagram',
      'usecase': 'Use Case',
      'erd': 'ERD',
      'sequence': 'Sequence',
      'activity': 'Activity',
      'state': 'State Machine',
      'bpmn': 'BPMN'
    };
    return types[type as keyof typeof types] || type;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'class': 'bg-blue-100 text-blue-800',
      'usecase': 'bg-green-100 text-green-800',
      'erd': 'bg-purple-100 text-purple-800',
      'sequence': 'bg-orange-100 text-orange-800',
      'activity': 'bg-red-100 text-red-800',
      'state': 'bg-yellow-100 text-yellow-800',
      'bpmn': 'bg-indigo-100 text-indigo-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

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
                <span className="text-xl font-bold text-gray-900">Dashboard</span>
              </div>
            </div>
            
            <Link 
              href="/uml-designer"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Dự án mới</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Chào mừng, {session.user.name}!
          </h1>
          <p className="text-gray-600">
            Quản lý và tổ chức các dự án UML của bạn
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 rounded-lg p-2">
                <Folder className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                <p className="text-gray-600">Tổng dự án</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 rounded-lg p-2">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.filter(p => p.isPublic).length}
                </p>
                <p className="text-gray-600">Công khai</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 rounded-lg p-2">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(projects.map(p => p.type)).size}
                </p>
                <p className="text-gray-600">Loại sơ đồ</p>
              </div>
            </div>
          </div>
        </div>

        {/* My Projects */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Dự án của bạn</h2>
              <Link 
                href="/uml-designer"
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Tạo mới</span>
              </Link>
            </div>
          </div>
          
          {projects.length === 0 ? (
            <div className="p-12 text-center">
              <Shapes className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có dự án nào</h3>
              <p className="text-gray-600 mb-4">Bắt đầu tạo dự án UML đầu tiên của bạn</p>
              <Link 
                href="/uml-designer"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Tạo dự án mới</span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {projects.map((project) => (
                <div key={project.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {project.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(project.type)}`}>
                          {getTypeLabel(project.type)}
                        </span>
                        {project.isPublic && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Công khai
                          </span>
                        )}
                      </div>
                      
                      {project.description && (
                        <p className="text-gray-600 mb-2">{project.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Tạo: {new Date(project.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Edit3 className="h-4 w-4" />
                          <span>Sửa: {new Date(project.updatedAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/uml-designer?project=${project.id}`}
                        className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Shared Projects */}
        {projects.filter(p => p.permission && p.permission !== 'OWNER').length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Dự án được chia sẻ</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {projects.filter(p => p.permission && p.permission !== 'OWNER').map((project) => (
                <div key={project.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {project.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(project.type)}`}>
                          {getTypeLabel(project.type)}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          project.permission === 'EDIT' ? 'bg-blue-100 text-blue-800' :
                          project.permission === 'COMMENT' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {project.permission === 'EDIT' ? 'Có thể chỉnh sửa' :
                           project.permission === 'COMMENT' ? 'Chỉ nhận xét' :
                           'Chỉ xem'}
                        </span>
                      </div>
                      
                      {project.description && (
                        <p className="text-gray-600 mb-2">{project.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Tạo: {new Date(project.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Edit3 className="h-4 w-4" />
                          <span>Sửa: {new Date(project.updatedAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>Bởi: {project.user.name || project.user.email}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/uml-designer?project=${project.id}`}
                        className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        title={project.permission === 'EDIT' ? 'Chỉnh sửa' : 'Xem'}
                      >
                        {project.permission === 'EDIT' ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
