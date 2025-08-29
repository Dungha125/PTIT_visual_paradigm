'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface ShareProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectTitle: string;
}

interface ShareData {
  email: string;
  permission: 'VIEW' | 'COMMENT' | 'EDIT';
}

interface ShareInfo {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
  permission: 'VIEW' | 'COMMENT' | 'EDIT';
  invitedAt: string;
  isActive: boolean;
}

const permissionLabels = {
  VIEW: 'Chỉ xem',
  COMMENT: 'Chỉ nhận xét',
  EDIT: 'Có thể chỉnh sửa'
};

const permissionDescriptions = {
  VIEW: 'Người dùng chỉ có thể xem project, không thể chỉnh sửa hoặc nhận xét',
  COMMENT: 'Người dùng có thể xem và nhận xét project, không thể chỉnh sửa',
  EDIT: 'Người dùng có thể xem, nhận xét và chỉnh sửa project'
};

export default function ShareProjectModal({ 
  isOpen, 
  onClose, 
  projectId, 
  projectTitle 
}: ShareProjectModalProps) {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<'VIEW' | 'COMMENT' | 'EDIT'>('VIEW');
  const [isSharing, setIsSharing] = useState(false);
  const [shares, setShares] = useState<ShareInfo[]>([]);
  const [isLoadingShares, setIsLoadingShares] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadShares();
    }
  }, [isOpen, projectId]);

  const loadShares = async () => {
    setIsLoadingShares(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/share`);
      if (response.ok) {
        const data = await response.json();
        setShares(data.shares);
      }
    } catch (error) {
      console.error('Error loading shares:', error);
    } finally {
      setIsLoadingShares(false);
    }
  };

  const handleShare = async () => {
    if (!email.trim()) {
      setError('Vui lòng nhập email');
      return;
    }

    setIsSharing(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/projects/${projectId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), permission }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`Đã chia sẻ project với ${data.sharedWith}`);
        setEmail('');
        setPermission('VIEW');
        loadShares(); // Reload shares list
      } else {
        setError(data.error || 'Có lỗi xảy ra khi chia sẻ');
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi chia sẻ');
    } finally {
      setIsSharing(false);
    }
  };

  const handleRemoveShare = async (shareId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/share/${shareId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Đã xóa quyền truy cập');
        loadShares(); // Reload shares list
      } else {
        setError('Có lỗi xảy ra khi xóa quyền truy cập');
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi xóa quyền truy cập');
    }
  };

  const handlePermissionChange = async (shareId: string, newPermission: 'VIEW' | 'COMMENT' | 'EDIT') => {
    try {
      const response = await fetch(`/api/projects/${projectId}/share/${shareId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ permission: newPermission }),
      });

      if (response.ok) {
        setSuccess('Đã cập nhật quyền truy cập');
        loadShares(); // Reload shares list
      } else {
        setError('Có lỗi xảy ra khi cập nhật quyền');
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi cập nhật quyền');
    }
  };

  if (!isOpen) return null;

  return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Chia sẻ Project</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">"{projectTitle}"</h3>
          <p className="text-gray-600">Chia sẻ project này với người khác để cùng làm việc</p>
        </div>

        {/* Share Form */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="font-semibold mb-3">Chia sẻ với người khác</h4>
          
          <div className="flex gap-3 mb-3">
            <input
              type="email"
              placeholder="Nhập email người dùng"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value as 'VIEW' | 'COMMENT' | 'EDIT')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="VIEW">Chỉ xem</option>
              <option value="COMMENT">Chỉ nhận xét</option>
              <option value="EDIT">Có thể chỉnh sửa</option>
            </select>
          </div>

          <div className="mb-3">
            <p className="text-sm text-gray-600">
              {permissionDescriptions[permission]}
            </p>
          </div>

          <button
            onClick={handleShare}
            disabled={isSharing || !email.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSharing ? 'Đang chia sẻ...' : 'Chia sẻ'}
          </button>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Current Shares */}
        <div>
          <h4 className="font-semibold mb-3">Người đã được chia sẻ</h4>
          
          {isLoadingShares ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : shares.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Chưa có ai được chia sẻ</p>
          ) : (
            <div className="space-y-3">
              {shares.map((share) => (
                <div key={share.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {share.user.image ? (
                      <img
                        src={share.user.image}
                        alt={share.user.name || share.user.email}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm text-gray-600">
                          {share.user.name?.[0] || share.user.email[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    <div>
                      <p className="font-medium">{share.user.name || 'Không có tên'}</p>
                      <p className="text-sm text-gray-600">{share.user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={share.permission}
                      onChange={(e) => handlePermissionChange(share.id, e.target.value as 'VIEW' | 'COMMENT' | 'EDIT')}
                      className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="VIEW">Chỉ xem</option>
                      <option value="COMMENT">Chỉ nhận xét</option>
                      <option value="EDIT">Có thể chỉnh sửa</option>
                    </select>
                    
                    <button
                      onClick={() => handleRemoveShare(share.id)}
                      className="text-red-600 hover:text-red-800 text-sm px-2 py-1"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
