import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Socket } from 'socket.io-client';
import io from 'socket.io-client';

interface CollaborationState {
  isConnected: boolean;
  activeUsers: UserPresence[];
  comments: Comment[];
  isTyping: boolean;
  lastUpdate: Date | null;
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

interface UseCollaborationProps {
  projectId: string;
  onProjectUpdate?: (data: any) => void;
  onUserJoined?: (userId: string) => void;
  onUserLeft?: (userId: string) => void;
}

export function useCollaboration({
  projectId,
  onProjectUpdate,
  onUserJoined,
  onUserLeft
}: UseCollaborationProps) {
  const { data: session } = useSession();
  const [state, setState] = useState<CollaborationState>({
    isConnected: false,
    activeUsers: [],
    comments: [],
    isTyping: false,
    lastUpdate: null
  });

  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize socket connection
  const connectSocket = useCallback(() => {
    if (!session?.user?.id || socketRef.current?.connected) return;

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000');
    
    socket.on('connect', () => {
      setState(prev => ({ ...prev, isConnected: true }));
      
      // Join project room
      socket.emit('join-project', { projectId, userId: session.user.id });
    });

    socket.on('disconnect', () => {
      setState(prev => ({ ...prev, isConnected: false }));
    });

    socket.on('project-users', (users: string[]) => {
      // Handle project users update
      console.log('Project users updated:', users);
    });

    socket.on('user-joined', (data: { userId: string; projectId: string }) => {
      console.log('User joined:', data);
      onUserJoined?.(data.userId);
    });

    socket.on('user-left', (data: { userId: string; projectId: string }) => {
      console.log('User left:', data);
      onUserLeft?.(data.userId);
    });

    socket.on('project-updated', (data: any) => {
      setState(prev => ({ 
        ...prev, 
        lastUpdate: new Date() 
      }));
      onProjectUpdate?.(data);
    });

    socket.on('comment-added', (comment: Comment) => {
      setState(prev => ({
        ...prev,
        comments: [comment, ...prev.comments]
      }));
    });

    socket.on('user-typing', (data: { userId: string; isTyping: boolean }) => {
      setState(prev => ({
        ...prev,
        activeUsers: prev.activeUsers.map(user => 
          user.userId === data.userId 
            ? { ...user, isTyping: data.isTyping }
            : user
        )
      }));
    });

    socketRef.current = socket;
  }, [projectId, session?.user?.id, onProjectUpdate, onUserJoined, onUserLeft]);

  // Disconnect socket
  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setState(prev => ({ ...prev, isConnected: false }));
  }, []);

  // Send project update
  const sendProjectUpdate = useCallback((content: string, action: string = 'edit') => {
    if (!socketRef.current?.connected || !session?.user?.id) return;

    socketRef.current.emit('project-update', {
      projectId,
      userId: session.user.id,
      content,
      version: Date.now(), // Simple versioning
      action
    });
  }, [projectId, session?.user?.id]);

  // Add comment
  const addComment = useCallback(async (content: string, parentId?: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, parentId }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      // Comment will be added via socket event
      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      return false;
    }
  }, [projectId]);

  // Handle typing indicator
  const handleTyping = useCallback((isTyping: boolean) => {
    if (!socketRef.current?.connected || !session?.user?.id) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Send typing status
    socketRef.current.emit('user-typing', { 
      projectId, 
      userId: session.user.id, 
      isTyping 
    });

    // Auto-clear typing status after delay
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current?.emit('user-typing', { 
          projectId, 
          userId: session.user.id, 
          isTyping: false 
        });
      }, 3000);
    }
  }, [projectId, session?.user?.id]);

  // Load existing comments
  const loadComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setState(prev => ({ ...prev, comments: data.comments }));
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  }, [projectId]);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    if (session?.user?.id) {
      connectSocket();
      loadComments();
    }

    return () => {
      disconnectSocket();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [session?.user?.id, connectSocket, disconnectSocket, loadComments]);

  return {
    ...state,
    sendProjectUpdate,
    addComment,
    handleTyping,
    loadComments,
    connectSocket,
    disconnectSocket
  };
}
