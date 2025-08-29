'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import io, { Socket } from 'socket.io-client';

interface CollaborationPanelProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface UserPresence {
  userId: string;
  name: string;
  email: string;
  image?: string;
  isTyping?: boolean;
  lastSeen: Date;
}

interface Comment {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  createdAt: string;
  parentId?: string;
  replies: Comment[];
}

export default function CollaborationPanel({ 
  projectId, 
  isOpen, 
  onClose 
}: CollaborationPanelProps) {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [activeUsers, setActiveUsers] = useState<UserPresence[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  useEffect(() => {
    if (isOpen && session?.user?.id) {
      // Initialize socket connection
      const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000');
      
      newSocket.on('connect', () => {
        setIsConnected(true);
        // Join project room
        newSocket.emit('join-project', { projectId, userId: session.user.id });
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });

      newSocket.on('project-users', (users: string[]) => {
        // Handle project users update
        console.log('Project users updated:', users);
      });

      newSocket.on('user-joined', (data: { userId: string; projectId: string }) => {
        console.log('User joined:', data);
      });

      newSocket.on('user-left', (data: { userId: string; projectId: string }) => {
        console.log('User left:', data);
      });

      newSocket.on('comment-added', (comment: Comment) => {
        setComments(prev => [comment, ...prev]);
      });

      setSocket(newSocket);

      // Load existing comments
      loadComments();

      return () => {
        newSocket.close();
      };
    }
  }, [isOpen, projectId, session?.user?.id]);

  const loadComments = async () => {
    setIsLoadingComments(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !socket) return;

    try {
      const response = await fetch(`/api/projects/${projectId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment.trim() }),
      });

      if (response.ok) {
        setNewComment('');
        // Comment will be added via socket event
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleTyping = (isTyping: boolean) => {
    if (socket && session?.user?.id) {
      socket.emit('user-typing', { projectId, userId: session.user.id, isTyping });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed top-16 left-0 right-0 bottom-0 bg-black/50 bg-opacity-25 z-[55]"
          onClick={onClose}
        />
      )}
      
      {/* Panel */}
      <div className={`fixed right-0 top-16 bottom-0 w-80 bg-white border-l border-gray-200 shadow-lg z-[60] transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Collaboration</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition-colors"
              title="Đóng panel"
            >
              ✕
            </button>
          </div>

          {/* Connection Status */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {isConnected ? 'Đã kết nối' : 'Đang kết nối...'}
              </span>
            </div>
          </div>

          {/* Active Users */}
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-medium mb-3">Người đang online</h4>
            {activeUsers.length === 0 ? (
              <p className="text-sm text-gray-500">Chưa có ai online</p>
            ) : (
              <div className="space-y-2">
                {activeUsers.map((user) => (
                  <div key={user.userId} className="flex items-center gap-2">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-xs text-gray-600">
                          {user.name?.[0] || user.email[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium">{user.name || user.email}</span>
                    {user.isTyping && (
                      <span className="text-xs text-blue-600">đang gõ...</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-medium mb-3">Nhận xét</h4>
              
              {/* Add Comment */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Thêm nhận xét..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onFocus={() => handleTyping(true)}
                  onBlur={() => handleTyping(false)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Gửi
                </button>
              </div>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4">
              {isLoadingComments ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : comments.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Chưa có nhận xét nào</p>
              ) : (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-start gap-2 mb-2">
                        {comment.user.image ? (
                          <img
                            src={comment.user.image}
                            alt={comment.user.name}
                            className="w-6 h-6 rounded-full mt-1"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mt-1">
                            <span className="text-xs text-gray-600">
                              {comment.user.name?.[0] || comment.user.email[0].toUpperCase()}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">
                              {comment.user.name || comment.user.email}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleString('vi-VN')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.content}</p>
                        </div>
                      </div>

                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="ml-6 mt-2 space-y-2">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="bg-white p-2 rounded border-l-2 border-gray-200">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium">
                                  {reply.user.name || reply.user.email}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(reply.createdAt).toLocaleString('vi-VN')}
                                </span>
                              </div>
                              <p className="text-xs text-gray-700">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
