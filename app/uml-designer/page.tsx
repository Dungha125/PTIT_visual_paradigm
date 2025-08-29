"use client"
import React, { useCallback, useState, useRef, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import SaveProjectModal from '../components/SaveProjectModal';
import ShareProjectModal from '../components/ShareProjectModal';
import CollaborationPanel from '../components/CollaborationPanel';
import { useCollaboration } from '@/lib/hooks/useCollaboration';
import { 
  Square, 
  Circle, 
  Triangle, 
  Database, 
  User, 
  Settings, 
    Save,
  Download, 
  Upload,
  Cloud,
  CloudOff,
  Undo2,
  Redo2,
  Copy,
  Trash2,
  Plus,
  Grid3X3,
  ZoomIn,
  ZoomOut,
  Move,
  MousePointer,
  Palette as PaletteIcon,
  Shapes,
  Share2
} from 'lucide-react';
// ...existing code...

// Palette Component
interface PalettePanelProps {
  diagramType: string;
  onNodeAdd: (nodeType: string, position: { x: number; y: number }) => void;
  selectedConnectionType: string;
  setSelectedConnectionType: (type: string) => void;
}

const PalettePanel: React.FC<PalettePanelProps> = ({ 
  diagramType, 
  onNodeAdd,
  selectedConnectionType,
  setSelectedConnectionType
}) => {
  const nodes = NodeDefinitions[diagramType as keyof typeof NodeDefinitions] || {};
  
  const handleNodeClick = (nodeType: string) => {
    // Add node at center of screen with some randomness
    onNodeAdd(nodeType, { 
      x: 200 + Math.random() * 100, 
      y: 150 + Math.random() * 100 
    });
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <PaletteIcon size={20} />
        {diagramType.toUpperCase()} Elements
      </h3>
      
      <div className="space-y-2">
        {Object.entries(nodes).map(([key, node]) => {
          const IconComponent = node.icon;
          return (
            <button
              key={key}
              onClick={() => handleNodeClick(key)}
              className="w-full flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-all duration-200"
              style={{ backgroundColor: `${node.color}20` }}
              type="button"
            >
              <IconComponent size={18} />
              <span className="text-sm font-medium">{node.label}</span>
            </button>
          );
        })}
      </div>
      
      <div className="mt-6">
        <h4 className="font-semibold mb-3 text-gray-700">Relationships</h4>
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-600 mb-2">Chọn loại kết nối:</div>
          
          <div 
            className={`text-xs p-2 border rounded hover:bg-blue-100 cursor-pointer transition-colors flex items-center gap-2 ${
              selectedConnectionType === 'association' ? 'bg-blue-100 border-blue-300' : 'bg-gray-50 border-gray-200'
            }`}
            onClick={() => setSelectedConnectionType('association')}
            title="Mối quan hệ thông thường giữa các class"
          >
            <div className="w-6 h-1 bg-gray-700"></div>
            <span>Association</span>
          </div>
          
          <div 
            className={`text-xs p-2 border rounded hover:bg-purple-100 cursor-pointer transition-colors flex items-center gap-2 ${
              selectedConnectionType === 'inheritance' ? 'bg-purple-100 border-purple-300' : 'bg-gray-50 border-gray-200'
            }`}
            onClick={() => setSelectedConnectionType('inheritance')}
            title="Kế thừa - class con kế thừa từ class cha"
          >
            <div className="w-6 h-1 bg-purple-600"></div>
            <span>Inheritance ▷</span>
          </div>
          
          <div 
            className={`text-xs p-2 border rounded hover:bg-green-100 cursor-pointer transition-colors flex items-center gap-2 ${
              selectedConnectionType === 'composition' ? 'bg-green-100 border-green-300' : 'bg-gray-50 border-gray-200'
            }`}
            onClick={() => setSelectedConnectionType('composition')}
            title="Quan hệ chứa mạnh - object con thuộc về và phụ thuộc hoàn toàn vào object cha"
          >
            <div className="w-6 h-1 bg-green-600"></div>
            <span>Composition ◆</span>
          </div>
          
          <div 
            className={`text-xs p-2 border rounded hover:bg-yellow-100 cursor-pointer transition-colors flex items-center gap-2 ${
              selectedConnectionType === 'aggregation' ? 'bg-yellow-100 border-yellow-300' : 'bg-gray-50 border-gray-200'
            }`}
            onClick={() => setSelectedConnectionType('aggregation')}
            title="Quan hệ chứa yếu - object con có thể tồn tại độc lập"
          >
            <div className="w-6 h-1 bg-orange-600"></div>
            <span>Aggregation ◇</span>
          </div>
          
          <div 
            className={`text-xs p-2 border rounded hover:bg-red-100 cursor-pointer transition-colors flex items-center gap-2 ${
              selectedConnectionType === 'dependency' ? 'bg-red-100 border-red-300' : 'bg-gray-50 border-gray-200'
            }`}
            onClick={() => setSelectedConnectionType('dependency')}
            title="Phụ thuộc - class này sử dụng class khác"
          >
            <div className="w-6 h-1 bg-gray-700 border-dashed border-t"></div>
            <span>Dependency ⤏</span>
          </div>
          
          <div 
            className={`text-xs p-2 border rounded hover:bg-indigo-100 cursor-pointer transition-colors flex items-center gap-2 ${
              selectedConnectionType === 'realization' ? 'bg-indigo-100 border-indigo-300' : 'bg-gray-50 border-gray-200'
            }`}
            onClick={() => setSelectedConnectionType('realization')}
            title="Thực hiện interface - class thực hiện interface"
          >
            <div className="w-6 h-1 bg-gray-700 border-dashed border-t"></div>
            <span>Realization ▷┈┈</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Inspector Panel
// (Removed duplicate InspectorPanel definition to resolve redeclaration error)
// ...existing
// Types and Interfaces
interface Point {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface DiagramNode {
  id: string;
  type: string;
  position: Point;
  size: Size;
  data: {
    label: string;
    properties?: Record<string, any>;
    stereotype?: string;
    attributes?: string[];
    methods?: string[];
    cardinality?: string;
    isAbstract?: boolean;
    nodeType: string;
    color?: string;
  };
  selected?: boolean;
}

interface DiagramEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  label?: string;
  data?: {
    cardinality?: string;
    constraint?: string;
    stereotype?: string;
  };
  points?: Point[];
}

interface DiagramState {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  selectedNodeIds: string[];
  selectedEdgeIds: string[];
}

// Store for diagram state management
const useDiagramStore = () => {
  const [history, setHistory] = useState<DiagramState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [clipboard, setClipboard] = useState<{ nodes: DiagramNode[], edges: DiagramEdge[] }>({ 
    nodes: [], 
    edges: [] 
  });

  const saveToHistory = useCallback((state: DiagramState) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(state))); // Deep copy
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      return history[historyIndex - 1];
    }
    return null;
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      return history[historyIndex + 1];
    }
    return null;
  }, [history, historyIndex]);

  return { saveToHistory, undo, redo, clipboard, setClipboard };
};

// Node Definitions
const NodeDefinitions: Record<string, Record<string, any>> = {
  usecase: {
    actor: { label: 'Actor', icon: User, color: '#E3F2FD', defaultSize: { width: 80, height: 100 } },
    usecase: { label: 'Use Case', icon: Circle, color: '#F3E5F5', defaultSize: { width: 120, height: 60 } },
    system: { label: 'System Boundary', icon: Square, color: '#E8F5E8', defaultSize: { width: 200, height: 150 } }
  },
  class: {
    class: { label: 'Class', icon: Square, color: '#FFF3E0', defaultSize: { width: 200, height: 150 } },
    interface: { label: 'Interface', icon: Square, color: '#E1F5FE', defaultSize: { width: 200, height: 120 } },
    abstract: { label: 'Abstract Class', icon: Square, color: '#FCE4EC', defaultSize: { width: 200, height: 150 } },
    enum: { label: 'Enumeration', icon: Square, color: '#F1F8E9', defaultSize: { width: 150, height: 100 } }
  },
  erd: {
    entity: { label: 'Entity', icon: Square, color: '#E8F5E8', defaultSize: { width: 150, height: 100 } },
    weakEntity: { label: 'Weak Entity', icon: Square, color: '#FFEBEE', defaultSize: { width: 150, height: 100 } },
    relationship: { label: 'Relationship', icon: Triangle, color: '#F3E5F5', defaultSize: { width: 100, height: 60 } },
    attribute: { label: 'Attribute', icon: Circle, color: '#E3F2FD', defaultSize: { width: 80, height: 60 } }
  },
  sequence: {
    lifeline: { label: 'Lifeline', icon: Square, color: '#E8F5E8', defaultSize: { width: 80, height: 300 } },
    activation: { label: 'Activation', icon: Square, color: '#FFF3E0', defaultSize: { width: 12, height: 60 } },
    message: { label: 'Message', icon: Square, color: '#F3E5F5', defaultSize: { width: 100, height: 20 } }
  },
  activity: {
    initial: { label: 'Initial', icon: Circle, color: '#000000', defaultSize: { width: 20, height: 20 } },
    action: { label: 'Action', icon: Square, color: '#FFF3E0', defaultSize: { width: 120, height: 60 } },
    decision: { label: 'Decision', icon: Triangle, color: '#F3E5F5', defaultSize: { width: 80, height: 80 } },
    final: { label: 'Final', icon: Circle, color: '#000000', defaultSize: { width: 30, height: 30 } }
  },
  state: {
    initial: { label: 'Initial State', icon: Circle, color: '#000000', defaultSize: { width: 20, height: 20 } },
    state: { label: 'State', icon: Square, color: '#FFF3E0', defaultSize: { width: 120, height: 80 } },
    composite: { label: 'Composite State', icon: Square, color: '#F3E5F5', defaultSize: { width: 200, height: 150 } },
    final: { label: 'Final State', icon: Circle, color: '#000000', defaultSize: { width: 30, height: 30 } }
  },
  bpmn: {
    startEvent: { label: 'Start Event', icon: Circle, color: '#E8F5E8', defaultSize: { width: 36, height: 36 } },
    task: { label: 'Task', icon: Square, color: '#FFF3E0', defaultSize: { width: 100, height: 80 } },
    gateway: { label: 'Gateway', icon: Triangle, color: '#F3E5F5', defaultSize: { width: 50, height: 50 } },
    endEvent: { label: 'End Event', icon: Circle, color: '#FFEBEE', defaultSize: { width: 36, height: 36 } }
  }
};

// Canvas Component for rendering diagrams
interface DiagramCanvasProps {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  onNodesChange: (nodes: DiagramNode[]) => void;
  onEdgesChange: (edges: DiagramEdge[]) => void;
  onSelectionChange: (selectedNodeIds: string[]) => void;
  selectedNodeIds: string[];
  zoom: number;
  pan: { x: number; y: number };
  selectedConnectionType: string;
}

const DiagramCanvas: React.FC<DiagramCanvasProps> = ({ 
  nodes, 
  edges, 
  onNodesChange, 
  onEdgesChange,
  onSelectionChange,
  selectedNodeIds,
  zoom,
  pan,
  selectedConnectionType
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragNodeId, setDragNodeId] = useState<string | null>(null);
  const [resizing, setResizing] = useState<{ nodeId: string; handle: string } | null>(null);
  const [connecting, setConnecting] = useState<{ sourceId: string; position: string; startX: number; startY: number; currentX: number; currentY: number } | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    // Don't start node dragging if we're in connecting mode
    if (connecting) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    setDragStart({
      x: (e.clientX - rect.left) / zoom - pan.x,
      y: (e.clientY - rect.top) / zoom - pan.y
    });
    setDragNodeId(nodeId);
    setIsDragging(true);
    
    // Update selection
    if (!selectedNodeIds.includes(nodeId)) {
      onSelectionChange([nodeId]);
    }
  }, [zoom, pan, selectedNodeIds, onSelectionChange, connecting]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const currentX = (e.clientX - rect.left) / zoom - pan.x;
    const currentY = (e.clientY - rect.top) / zoom - pan.y;
    
    // Handle connection dragging
    if (connecting) {
      setConnecting(prev => prev ? {
        ...prev,
        currentX: e.clientX - rect.left,
        currentY: e.clientY - rect.top
      } : null);
      return;
    }
    
    if (dragNodeId && !resizing) {
      // Node dragging
      const deltaX = currentX - dragStart.x;
      const deltaY = currentY - dragStart.y;
      
      onNodesChange(nodes.map(node => {
        if (selectedNodeIds.includes(node.id)) {
          return {
            ...node,
            position: {
              x: Math.max(0, node.position.x + deltaX),
              y: Math.max(0, node.position.y + deltaY)
            }
          };
        }
        return node;
      }));
      
      setDragStart({ x: currentX, y: currentY });
    } else if (resizing) {
      // Node resizing
      const deltaX = currentX - dragStart.x;
      const deltaY = currentY - dragStart.y;
      
      onNodesChange(nodes.map(node => {
        if (node.id === resizing.nodeId) {
          const newSize = { ...node.size };
          let newPosition = { ...node.position };
          
          if (resizing.handle.includes('right')) {
            newSize.width = Math.max(80, node.size.width + deltaX);
          }
          if (resizing.handle.includes('left')) {
            newSize.width = Math.max(80, node.size.width - deltaX);
            newPosition.x = node.position.x + deltaX;
          }
          if (resizing.handle.includes('bottom')) {
            newSize.height = Math.max(60, node.size.height + deltaY);
          }
          if (resizing.handle.includes('top')) {
            newSize.height = Math.max(60, node.size.height - deltaY);
            newPosition.y = node.position.y + deltaY;
          }
          
          return { ...node, size: newSize, position: newPosition };
        }
        return node;
      }));
      
      setDragStart({ x: currentX, y: currentY });
    }
  }, [isDragging, dragNodeId, resizing, dragStart, nodes, selectedNodeIds, onNodesChange, zoom, pan]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (connecting) {
      // Check if we're over a node
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const mouseX = (e.clientX - rect.left) / zoom - pan.x;
        const mouseY = (e.clientY - rect.top) / zoom - pan.y;
        
        // Find target node under mouse (with some tolerance)
        const targetNode = nodes.find(node => {
          const tolerance = 10; // pixels tolerance
          return mouseX >= (node.position.x - tolerance) && 
                 mouseX <= (node.position.x + node.size.width + tolerance) &&
                 mouseY >= (node.position.y - tolerance) && 
                 mouseY <= (node.position.y + node.size.height + tolerance) &&
                 node.id !== connecting.sourceId;
        });
        
        if (targetNode) {
          const newEdge = {
            id: `edge_${Date.now()}`,
            source: connecting.sourceId,
            target: targetNode.id,
            type: selectedConnectionType,
            label: ''
          };
          onEdgesChange([...edges, newEdge]);
        }
      }
    }
    
    setIsDragging(false);
    setDragNodeId(null);
    setResizing(null);
    setConnecting(null);
  }, [connecting, nodes, edges, onEdgesChange, zoom, pan, selectedConnectionType]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current || e.target === svgRef.current) {
      onSelectionChange([]);
    }
  }, [onSelectionChange]);

  // Resize handle mouse events
  const handleResizeStart = useCallback((e: React.MouseEvent, nodeId: string, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    setResizing({ nodeId, handle });
    setIsDragging(true);
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    setDragStart({
      x: (e.clientX - rect.left) / zoom - pan.x,
      y: (e.clientY - rect.top) / zoom - pan.y
    });
  }, [zoom, pan]);

  // Connection handle events
  const handleConnectionStart = useCallback((e: React.MouseEvent, nodeId: string, position: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const sourceNode = nodes.find(n => n.id === nodeId);
    if (!sourceNode) return;
    
    // Calculate connection point based on position
    let startX: number, startY: number;
    
    switch (position) {
      case 'left':
        startX = sourceNode.position.x * zoom + pan.x;
        startY = (sourceNode.position.y + sourceNode.size.height / 2) * zoom + pan.y;
        break;
      case 'right':
        startX = (sourceNode.position.x + sourceNode.size.width) * zoom + pan.x;
        startY = (sourceNode.position.y + sourceNode.size.height / 2) * zoom + pan.y;
        break;
      case 'top':
        startX = (sourceNode.position.x + sourceNode.size.width / 2) * zoom + pan.x;
        startY = sourceNode.position.y * zoom + pan.y;
        break;
      case 'bottom':
        startX = (sourceNode.position.x + sourceNode.size.width / 2) * zoom + pan.x;
        startY = (sourceNode.position.y + sourceNode.size.height) * zoom + pan.y;
        break;
      default:
        startX = (sourceNode.position.x + sourceNode.size.width / 2) * zoom + pan.x;
        startY = (sourceNode.position.y + sourceNode.size.height / 2) * zoom + pan.y;
    }
    
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    setConnecting({ 
      sourceId: nodeId, 
      position, 
      startX, 
      startY, 
      currentX, 
      currentY 
    });
    setIsDragging(true);
  }, [nodes, zoom, pan]);

  const handleConnectionEnd = useCallback((e: React.MouseEvent, nodeId: string) => {
    if (connecting && connecting.sourceId !== nodeId) {
      const newEdge = {
        id: `edge_${Date.now()}`,
        source: connecting.sourceId,
        target: nodeId,
        type: 'association',
        label: ''
      };
      onEdgesChange([...edges, newEdge]);
    }
    setConnecting(null);
  }, [connecting, edges, onEdgesChange]);

  // Render individual node
  const renderNode = (node: DiagramNode) => {
    const isSelected = selectedNodeIds.includes(node.id);
    const x = node.position.x * zoom + pan.x;
    const y = node.position.y * zoom + pan.y;
    const width = node.size.width * zoom;
    const height = node.size.height * zoom;

    const commonStyle: React.CSSProperties = {
      position: 'absolute',
      left: x,
      top: y,
      width,
      height,
      cursor: isDragging ? 'grabbing' : 'grab',
      border: isSelected ? '2px solid #3b82f6' : '2px solid #d1d5db',
      borderRadius: node.type === 'usecase' || node.type === 'startEvent' || node.type === 'endEvent' ? '50%' : '8px',
      backgroundColor: node.data.color || '#ffffff',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: node.type === 'actor' ? 'center' : 'flex-start',
      alignItems: 'center',
      padding: '8px',
      fontSize: `${Math.max(10, 12 * zoom)}px`,
      overflow: 'hidden',
      userSelect: 'none'
    };

    let content;
    
    if (node.type === 'actor') {
      content = (
        <>
          <User size={Math.max(16, 24 * zoom)} className="text-blue-600" />
          <div className="mt-1 font-semibold text-center text-xs">{node.data.label}</div>
        </>
      );
    } else if (node.type === 'usecase') {
      content = (
        <div className="font-semibold text-center text-xs">{node.data.label}</div>
      );
    } else if (['class', 'interface', 'abstract', 'enum'].includes(node.type)) {
      content = (
        <>
          <div className="w-full border-b border-gray-300 bg-gray-50 p-1 text-center">
            {node.data.stereotype && (
              <div className="text-xs text-gray-600">«{node.data.stereotype}»</div>
            )}
            <div className={`font-bold text-xs ${node.data.isAbstract ? 'italic' : ''}`}>
              {node.data.label}
            </div>
          </div>
          <div className="w-full border-b border-gray-300 p-1 text-xs flex-1 overflow-auto">
            {node.data.attributes?.length ? (
              node.data.attributes.map((attr: string, index: number) => (
                <div key={index} className="text-gray-700 truncate">{attr}</div>
              ))
            ) : (
              <div className="text-gray-400 italic text-xs">No attributes</div>
            )}
          </div>
          <div className="w-full p-1 text-xs flex-1 overflow-auto">
            {node.data.methods?.length ? (
              node.data.methods.map((method: string, index: number) => (
                <div key={index} className="text-gray-700 truncate">{method}</div>
              ))
            ) : (
              <div className="text-gray-400 italic text-xs">No methods</div>
            )}
          </div>
        </>
      );
    } else if (['entity', 'weakEntity'].includes(node.type)) {
      const isWeak = node.type === 'weakEntity';
      content = (
        <>
          <div className="font-bold text-center text-sm mb-2">{node.data.label}</div>
          {node.data.attributes?.length && (
            <div className="text-xs">
              {node.data.attributes.map((attr: string, index: number) => (
                <div key={index} className="text-gray-700 truncate">{attr}</div>
              ))}
            </div>
          )}
        </>
      );
      commonStyle.border = isWeak ? '4px double #d1d5db' : '2px solid #d1d5db';
      if (isSelected) {
        commonStyle.border = isWeak ? '4px double #3b82f6' : '2px solid #3b82f6';
      }
    } else if (['initial', 'final'].includes(node.type)) {
      content = null;
      commonStyle.backgroundColor = '#000000';
    } else if (['startEvent', 'endEvent'].includes(node.type)) {
      content = (
        <div className="font-semibold text-center text-xs">{node.data.label}</div>
      );
      if (node.type === 'endEvent') {
        commonStyle.borderWidth = '4px';
      }
    } else {
      content = <div className="font-semibold text-center text-xs">{node.data.label}</div>;
    }

    return (
      <div key={node.id} style={commonStyle} onMouseDown={(e) => handleMouseDown(e, node.id)}>
        {content}
        
        {/* Connection handles */}
        {isSelected && !['initial', 'final'].includes(node.type) && (
          <>
            <div
              className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-crosshair shadow-lg hover:bg-blue-600 hover:scale-110 transition-all duration-200"
              style={{ left: -8, top: '50%', transform: 'translateY(-50%)' }}
              onMouseDown={(e) => handleConnectionStart(e, node.id, 'left')}
              title="Kéo để tạo kết nối"
            />
            <div
              className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-crosshair shadow-lg hover:bg-blue-600 hover:scale-110 transition-all duration-200"
              style={{ right: -8, top: '50%', transform: 'translateY(-50%)' }}
              onMouseDown={(e) => handleConnectionStart(e, node.id, 'right')}
              title="Kéo để tạo kết nối"
            />
            <div
              className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-crosshair shadow-lg hover:bg-blue-600 hover:scale-110 transition-all duration-200"
              style={{ left: '50%', top: -8, transform: 'translateX(-50%)' }}
              onMouseDown={(e) => handleConnectionStart(e, node.id, 'top')}
              title="Kéo để tạo kết nối"
            />
            <div
              className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-crosshair shadow-lg hover:bg-blue-600 hover:scale-110 transition-all duration-200"
              style={{ left: '50%', bottom: -8, transform: 'translateX(-50%)' }}
              onMouseDown={(e) => handleConnectionStart(e, node.id, 'bottom')}
              title="Kéo để tạo kết nối"
            />
          </>
        )}
        
        {/* Highlight when being targeted for connection */}
        {connecting && connecting.sourceId !== node.id && (
          <div 
            className="absolute inset-0 border-4 border-blue-400 border-dashed rounded-lg pointer-events-none animate-pulse"
            style={{ zIndex: 10 }}
          />
        )}
        
        {/* Resize handles */}
        {isSelected && !['initial', 'final', 'startEvent', 'endEvent'].includes(node.type) && (
          <>
            <div
              className="absolute w-2 h-2 bg-blue-500 border border-white rounded-full cursor-nw-resize"
              style={{ left: -4, top: -4 }}
              onMouseDown={(e) => handleResizeStart(e, node.id, 'top-left')}
            />
            <div
              className="absolute w-2 h-2 bg-blue-500 border border-white rounded-full cursor-ne-resize"
              style={{ right: -4, top: -4 }}
              onMouseDown={(e) => handleResizeStart(e, node.id, 'top-right')}
            />
            <div
              className="absolute w-2 h-2 bg-blue-500 border border-white rounded-full cursor-sw-resize"
              style={{ left: -4, bottom: -4 }}
              onMouseDown={(e) => handleResizeStart(e, node.id, 'bottom-left')}
            />
            <div
              className="absolute w-2 h-2 bg-blue-500 border border-white rounded-full cursor-se-resize"
              style={{ right: -4, bottom: -4 }}
              onMouseDown={(e) => handleResizeStart(e, node.id, 'bottom-right')}
            />
          </>
        )}
      </div>
    );
  };

  // Calculate intersection point between line and rectangle
  const getIntersectionPoint = (
    lineStart: { x: number; y: number },
    lineEnd: { x: number; y: number },
    rect: { x: number; y: number; width: number; height: number }
  ) => {
    const dx = lineEnd.x - lineStart.x;
    const dy = lineEnd.y - lineStart.y;
    
    // Rectangle bounds
    const left = rect.x;
    const right = rect.x + rect.width;
    const top = rect.y;
    const bottom = rect.y + rect.height;
    
    // Center of rectangle
    const centerX = rect.x + rect.width / 2;
    const centerY = rect.y + rect.height / 2;
    
    // Calculate intersection with each edge
    const intersections = [];
    
    // Left edge
    if (dx !== 0) {
      const t = (left - lineStart.x) / dx;
      const y = lineStart.y + t * dy;
      if (t >= 0 && t <= 1 && y >= top && y <= bottom) {
        intersections.push({ x: left, y, distance: Math.abs(centerX - left) + Math.abs(centerY - y) });
      }
    }
    
    // Right edge
    if (dx !== 0) {
      const t = (right - lineStart.x) / dx;
      const y = lineStart.y + t * dy;
      if (t >= 0 && t <= 1 && y >= top && y <= bottom) {
        intersections.push({ x: right, y, distance: Math.abs(centerX - right) + Math.abs(centerY - y) });
      }
    }
    
    // Top edge
    if (dy !== 0) {
      const t = (top - lineStart.y) / dy;
      const x = lineStart.x + t * dx;
      if (t >= 0 && t <= 1 && x >= left && x <= right) {
        intersections.push({ x, y: top, distance: Math.abs(centerX - x) + Math.abs(centerY - top) });
      }
    }
    
    // Bottom edge
    if (dy !== 0) {
      const t = (bottom - lineStart.y) / dy;
      const x = lineStart.x + t * dx;
      if (t >= 0 && t <= 1 && x >= left && x <= right) {
        intersections.push({ x, y: bottom, distance: Math.abs(centerX - x) + Math.abs(centerY - bottom) });
      }
    }
    
    // Return the closest intersection to the rectangle center
    if (intersections.length > 0) {
      intersections.sort((a, b) => a.distance - b.distance);
      return { x: intersections[0].x, y: intersections[0].y };
    }
    
    // Fallback to center if no intersection found
    return { x: centerX, y: centerY };
  };

  // Render edges
  const renderEdges = () => {
    return edges.map(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      if (!sourceNode || !targetNode) return null;

      // Calculate centers in screen coordinates
      const sourceCenterX = (sourceNode.position.x + sourceNode.size.width / 2) * zoom + pan.x;
      const sourceCenterY = (sourceNode.position.y + sourceNode.size.height / 2) * zoom + pan.y;
      const targetCenterX = (targetNode.position.x + targetNode.size.width / 2) * zoom + pan.x;
      const targetCenterY = (targetNode.position.y + targetNode.size.height / 2) * zoom + pan.y;

      // Source and target rectangles in screen coordinates
      const sourceRect = {
        x: sourceNode.position.x * zoom + pan.x,
        y: sourceNode.position.y * zoom + pan.y,
        width: sourceNode.size.width * zoom,
        height: sourceNode.size.height * zoom
      };
      
      const targetRect = {
        x: targetNode.position.x * zoom + pan.x,
        y: targetNode.position.y * zoom + pan.y,
        width: targetNode.size.width * zoom,
        height: targetNode.size.height * zoom
      };

      // Calculate intersection points
      const startPoint = getIntersectionPoint(
        { x: sourceCenterX, y: sourceCenterY },
        { x: targetCenterX, y: targetCenterY },
        sourceRect
      );
      
      const endPoint = getIntersectionPoint(
        { x: targetCenterX, y: targetCenterY },
        { x: sourceCenterX, y: sourceCenterY },
        targetRect
      );

      const startX = startPoint.x;
      const startY = startPoint.y;
      const endX = endPoint.x;
      const endY = endPoint.y;

      // Calculate angle for positioning
      const angle = Math.atan2(endY - startY, endX - startX);
      
      // Define different marker sizes for fine adjustment
      const markerSizes = {
        association: 12,
        inheritance: 14,
        composition: 16,
        aggregation: 16,
        dependency: 12,
        realization: 14
      };
      
      const markerSize = markerSizes[edge.type as keyof typeof markerSizes] || 12;
      
      // Fine-tune line end to account for marker size (small adjustment)
      const lineEndX = endX - (markerSize * 0.3) * Math.cos(angle);
      const lineEndY = endY - (markerSize * 0.3) * Math.sin(angle);

      // Define line styles for different relationship types
      const getLineStyle = (type: string) => {
        switch (type) {
          case 'dependency':
          case 'realization':
            return {
              stroke: "#374151",
              strokeWidth: 2,
              strokeDasharray: "8,4",
              markerEnd: `url(#${type})`
            };
          case 'inheritance':
            return {
              stroke: "#7c3aed", // Purple for inheritance
              strokeWidth: 2,
              strokeDasharray: "none",
              markerEnd: `url(#${type})`
            };
          case 'composition':
            return {
              stroke: "#059669", // Green for composition
              strokeWidth: 2.5,
              strokeDasharray: "none",
              markerEnd: `url(#${type})`
            };
          case 'aggregation':
            return {
              stroke: "#d97706", // Orange for aggregation
              strokeWidth: 2,
              strokeDasharray: "none",
              markerEnd: `url(#${type})`
            };
          case 'association':
          default:
            return {
              stroke: "#374151",
              strokeWidth: 2,
              strokeDasharray: "none",
              markerEnd: `url(#${type || 'association'})`
            };
        }
      };

      const lineStyle = getLineStyle(edge.type);

      return (
        <g key={edge.id}>
          <line
            x1={startX}
            y1={startY}
            x2={lineEndX}
            y2={lineEndY}
            stroke={lineStyle.stroke}
            strokeWidth={lineStyle.strokeWidth}
            strokeDasharray={lineStyle.strokeDasharray}
            markerEnd={lineStyle.markerEnd}
          />
          {edge.label && (
            <text
              x={(startX + lineEndX) / 2}
              y={(startY + lineEndY) / 2}
              fill={lineStyle.stroke}
              fontSize={Math.max(10, 12 * zoom)}
              fontWeight="500"
              textAnchor="middle"
              dy="-8"
              className="pointer-events-none"
            >
              {edge.label}
            </text>
          )}
        </g>
      );
    });
  };

  return (
    <div
      ref={canvasRef}
      className="flex-1 relative bg-white overflow-hidden"
      style={{ 
        backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)', 
        backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
        backgroundPosition: `${pan.x}px ${pan.y}px`
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleCanvasClick}
    >
      {/* SVG for edges */}
      <svg
        ref={svgRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
        width="100%"
        height="100%"
      >
        <defs>
          {/* Association Arrow - Simple filled arrow */}
          <marker
            id="association"
            markerWidth="12"
            markerHeight="8"
            refX="12"
            refY="4"
            orient="auto"
          >
            <polygon points="0 0, 12 4, 0 8" fill="#374151" />
          </marker>
          
          {/* Inheritance Arrow - Empty triangle */}
          <marker
            id="inheritance"
            markerWidth="14"
            markerHeight="10"
            refX="14"
            refY="5"
            orient="auto"
          >
            <polygon points="0 0, 14 5, 0 10" fill="white" stroke="#7c3aed" strokeWidth="1.5" />
          </marker>
          
          {/* Composition Arrow - Filled diamond */}
          <marker
            id="composition"
            markerWidth="16"
            markerHeight="10"
            refX="16"
            refY="5"
            orient="auto"
          >
            <polygon points="0 5, 8 0, 16 5, 8 10" fill="#059669" />
          </marker>
          
          {/* Aggregation Arrow - Empty diamond */}
          <marker
            id="aggregation"
            markerWidth="16"
            markerHeight="10"
            refX="16"
            refY="5"
            orient="auto"
          >
            <polygon points="0 5, 8 0, 16 5, 8 10" fill="white" stroke="#d97706" strokeWidth="1.5" />
          </marker>
          
          {/* Dependency Arrow - Simple arrow for dashed line */}
          <marker
            id="dependency"
            markerWidth="12"
            markerHeight="8"
            refX="12"
            refY="4"
            orient="auto"
          >
            <polygon points="0 0, 12 4, 0 8" fill="#374151" />
          </marker>
          
          {/* Realization Arrow - Empty triangle for dashed line */}
          <marker
            id="realization"
            markerWidth="14"
            markerHeight="10"
            refX="14"
            refY="5"
            orient="auto"
          >
            <polygon points="0 0, 14 5, 0 10" fill="white" stroke="#374151" strokeWidth="1.5" />
          </marker>
        </defs>
        {renderEdges()}
        
        {/* Connection preview line */}
        {connecting && (
          <g>
            <line
              x1={connecting.startX}
              y1={connecting.startY}
              x2={connecting.currentX}
              y2={connecting.currentY}
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="5,5"
              className="pointer-events-none"
              markerEnd={`url(#${selectedConnectionType})`}
              opacity="0.7"
            />
            {/* Small circle at start point */}
            <circle
              cx={connecting.startX}
              cy={connecting.startY}
              r="3"
              fill="#3b82f6"
              className="pointer-events-none"
            />
          </g>
        )}
      </svg>
      
      {/* Nodes */}
      <div className="absolute inset-0" style={{ zIndex: 2 }}>
        {nodes.map(renderNode)}
      </div>
    </div>
  );
};

// Palette Component
const Palette = ({ 
  diagramType, 
  onNodeAdd,
  selectedConnectionType,
  setSelectedConnectionType
}: {
  diagramType: string;
  onNodeAdd: (nodeType: string, position: { x: number; y: number }) => void;
  selectedConnectionType: string;
  setSelectedConnectionType: (type: string) => void;
}) => {
  const nodes = NodeDefinitions[diagramType] || {};
  
  const handleNodeClick = (nodeType: string) => {
    // Add node at center of screen with some randomness
    onNodeAdd(nodeType, { 
      x: 200 + Math.random() * 100, 
      y: 150 + Math.random() * 100 
    });
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <PaletteIcon size={20} />
        {diagramType.toUpperCase()} Elements
      </h3>
      
      <div className="space-y-2">
        {Object.entries(nodes).map(([key, node]) => {
          const IconComponent = (node as any).icon;
          return (
            <button
              key={key}
              onClick={() => handleNodeClick(key)}
              className="w-full flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-all duration-200"
              style={{ backgroundColor: `${(node as any).color}20` }}
            >
              <IconComponent size={18} />
              <span className="text-sm font-medium">{(node as any).label}</span>
            </button>
          );
        })}
      </div>
      
      <div className="mt-6">
        <h4 className="font-semibold mb-3 text-gray-700">Relationships</h4>
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-600 mb-2">Chọn loại kết nối:</div>
          
          <div 
            className={`text-xs p-2 border rounded hover:bg-blue-100 cursor-pointer transition-colors flex items-center gap-2 ${
              selectedConnectionType === 'association' ? 'bg-blue-100 border-blue-300' : 'bg-gray-50 border-gray-200'
            }`}
            onClick={() => setSelectedConnectionType('association')}
            title="Mối quan hệ thông thường giữa các class"
          >
            <div className="w-6 h-1 bg-gray-700"></div>
            <span>Association</span>
          </div>
          
          <div 
            className={`text-xs p-2 border rounded hover:bg-purple-100 cursor-pointer transition-colors flex items-center gap-2 ${
              selectedConnectionType === 'inheritance' ? 'bg-purple-100 border-purple-300' : 'bg-gray-50 border-gray-200'
            }`}
            onClick={() => setSelectedConnectionType('inheritance')}
            title="Kế thừa - class con kế thừa từ class cha"
          >
            <div className="w-6 h-1 bg-purple-600"></div>
            <span>Inheritance ▷</span>
          </div>
          
          <div 
            className={`text-xs p-2 border rounded hover:bg-green-100 cursor-pointer transition-colors flex items-center gap-2 ${
              selectedConnectionType === 'composition' ? 'bg-green-100 border-green-300' : 'bg-gray-50 border-gray-200'
            }`}
            onClick={() => setSelectedConnectionType('composition')}
            title="Quan hệ chứa mạnh - object con thuộc về và phụ thuộc hoàn toàn vào object cha"
          >
            <div className="w-6 h-1 bg-green-600"></div>
            <span>Composition ◆</span>
          </div>
          
          <div 
            className={`text-xs p-2 border rounded hover:bg-yellow-100 cursor-pointer transition-colors flex items-center gap-2 ${
              selectedConnectionType === 'aggregation' ? 'bg-yellow-100 border-yellow-300' : 'bg-gray-50 border-gray-200'
            }`}
            onClick={() => setSelectedConnectionType('aggregation')}
            title="Quan hệ chứa yếu - object con có thể tồn tại độc lập"
          >
            <div className="w-6 h-1 bg-orange-600"></div>
            <span>Aggregation ◇</span>
          </div>
          
          <div 
            className={`text-xs p-2 border rounded hover:bg-red-100 cursor-pointer transition-colors flex items-center gap-2 ${
              selectedConnectionType === 'dependency' ? 'bg-red-100 border-red-300' : 'bg-gray-50 border-gray-200'
            }`}
            onClick={() => setSelectedConnectionType('dependency')}
            title="Phụ thuộc - class này sử dụng class khác"
          >
            <div className="w-6 h-1 bg-gray-700 border-dashed border-t"></div>
            <span>Dependency ⤏</span>
          </div>
          
          <div 
            className={`text-xs p-2 border rounded hover:bg-indigo-100 cursor-pointer transition-colors flex items-center gap-2 ${
              selectedConnectionType === 'realization' ? 'bg-indigo-100 border-indigo-300' : 'bg-gray-50 border-gray-200'
            }`}
            onClick={() => setSelectedConnectionType('realization')}
            title="Thực hiện interface - class thực hiện interface"
          >
            <div className="w-6 h-1 bg-gray-700 border-dashed border-t"></div>
            <span>Realization ▷┈┈</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Inspector Panel
const InspectorPanel = ({ 
  selectedNode, 
  onUpdateNode,
  onDeleteNode,
  onDuplicateNode,
  onAutoSizeNode
}: {
  selectedNode: DiagramNode | null;
  onUpdateNode: (id: string, changes: Partial<DiagramNode>) => void;
  onDeleteNode: (id: string) => void;
  onDuplicateNode: (id: string) => void;
  onAutoSizeNode: (id: string) => void;
}) => {
  if (!selectedNode) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Settings size={20} />
          Properties
        </h3>
        <div className="text-center py-8">
          <Settings size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Select an element to edit its properties</p>
        </div>
      </div>
    );
  }

  const handleAttributeChange = (newAttributes: string[]) => {
    onUpdateNode(selectedNode.id, {
      data: { ...selectedNode.data, attributes: newAttributes }
    });
  };

  const handleMethodChange = (newMethods: string[]) => {
    onUpdateNode(selectedNode.id, {
      data: { ...selectedNode.data, methods: newMethods }
    });
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Settings size={20} />
        Properties
      </h3>
      
      <div className="space-y-6">
        {/* Basic Properties */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-3 text-gray-700">Basic Properties</h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Name</label>
              <input
                type="text"
                value={selectedNode.data.label}
                onChange={(e) => onUpdateNode(selectedNode.id, {
                  data: { ...selectedNode.data, label: e.target.value }
                })}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {['class', 'interface', 'abstract'].includes(selectedNode.type) && (
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">Stereotype</label>
                <input
                  type="text"
                  value={selectedNode.data.stereotype || ''}
                  onChange={(e) => onUpdateNode(selectedNode.id, {
                    data: { ...selectedNode.data, stereotype: e.target.value }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="interface, abstract, entity..."
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Class-specific Properties */}
        {['class', 'interface', 'abstract', 'enum'].includes(selectedNode.type) && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 text-blue-800">Class Properties</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">Attributes</label>
                <textarea
                  value={(selectedNode.data.attributes || []).join('\n')}
                  onChange={(e) => handleAttributeChange(
                    e.target.value.split('\n').filter(line => line.trim())
                  )}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+ name: String&#10;- age: int&#10;# email: String"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">Methods</label>
                <textarea
                  value={(selectedNode.data.methods || []).join('\n')}
                  onChange={(e) => handleMethodChange(
                    e.target.value.split('\n').filter(line => line.trim())
                  )}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+ getName(): String&#10;+ setAge(age: int): void&#10;- validateEmail(): boolean"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isAbstract"
                  checked={selectedNode.data.isAbstract || false}
                  onChange={(e) => onUpdateNode(selectedNode.id, {
                    data: { ...selectedNode.data, isAbstract: e.target.checked }
                  })}
                  className="rounded"
                />
                <label htmlFor="isAbstract" className="text-sm font-medium text-gray-600">Abstract Class</label>
              </div>
            </div>
          </div>
        )}
        
        {/* Entity Properties */}
        {['entity', 'weakEntity'].includes(selectedNode.type) && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 text-green-800">Entity Properties</h4>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Attributes</label>
              <textarea
                value={(selectedNode.data.attributes || []).join('\n')}
                onChange={(e) => handleAttributeChange(
                  e.target.value.split('\n').filter(line => line.trim())
                )}
                className="w-full p-2 border border-gray-300 rounded-md text-sm h-24 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="customer_id (PK)&#10;first_name&#10;last_name&#10;email (UNIQUE)"
              />
            </div>
          </div>
        )}
        
        {/* Position and Size */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-3 text-gray-700">Position & Size</h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Position</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={Math.round(selectedNode.position.x)}
                  onChange={(e) => onUpdateNode(selectedNode.id, {
                    position: { ...selectedNode.position, x: parseInt(e.target.value) || 0 }
                  })}
                  className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="X"
                />
                <input
                  type="number"
                  value={Math.round(selectedNode.position.y)}
                  onChange={(e) => onUpdateNode(selectedNode.id, {
                    position: { ...selectedNode.position, y: parseInt(e.target.value) || 0 }
                  })}
                  className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Y"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Size</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={Math.round(selectedNode.size.width)}
                  onChange={(e) => onUpdateNode(selectedNode.id, {
                    size: { ...selectedNode.size, width: Math.max(80, parseInt(e.target.value) || 80) }
                  })}
                  className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Width"
                  min="80"
                />
                <input
                  type="number"
                  value={Math.round(selectedNode.size.height)}
                  onChange={(e) => onUpdateNode(selectedNode.id, {
                    size: { ...selectedNode.size, height: Math.max(60, parseInt(e.target.value) || 60) }
                  })}
                  className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Height"
                  min="60"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-3 text-red-800">Actions</h4>
          <div className="space-y-2">
            <button
              className="w-full p-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md text-sm transition-colors"
              type="button"
              onClick={() => onDeleteNode(selectedNode.id)}
            >
              Delete Element
            </button>
            <button
              className="w-full p-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md text-sm transition-colors"
              type="button"
              onClick={() => onDuplicateNode(selectedNode.id)}
            >
              Duplicate Element
            </button>
            <button
              className="w-full p-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-md text-sm transition-colors"
              type="button"
              onClick={() => onAutoSizeNode(selectedNode.id)}
            >
              Auto-size to Content
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function UMLDiagramDesigner() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project');

  const [diagramType, setDiagramType] = useState('class');
  const [diagramState, setDiagramState] = useState<DiagramState>({
    nodes: [],
    edges: [],
    selectedNodeIds: [],
    selectedEdgeIds: []
  });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedConnectionType, setSelectedConnectionType] = useState('association');
  const { saveToHistory, undo, redo, clipboard, setClipboard } = useDiagramStore();

  // Project management states
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCollaborationPanel, setShowCollaborationPanel] = useState(false); // Mặc định ẩn
  
  // Collaboration hook - temporarily disabled due to import issues
  // const { 
  //   activeUsers, 
  //   comments, 
  //   isConnected, 
  //   joinProject, 
  //   leaveProject, 
  //   addComment 
  // } = useCollaboration({
  //   projectId: currentProject?.id || '',
  //   onProjectUpdate: (data: any) => {
  //     // Handle project updates from other users
  //     console.log('Project updated by other user:', data);
  //   },
  //   onUserJoined: (userId: string) => {
  //     console.log('User joined project:', userId);
  //   },
  //   onUserLeft: (userId: string) => {
  //     console.log('User left project:', userId);
  //   }
  // });
  
  // Temporary mock data for collaboration
  const activeUsers: any[] = [];
  const comments: any[] = [];
  const isConnected = false;
  const joinProject = (id: string) => console.log('Join project:', id);
  const leaveProject = (id: string) => console.log('Leave project:', id);
  const addComment = (content: string) => console.log('Add comment:', content);
  const [saveLoading, setSaveLoading] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Load project if projectId is provided
  useEffect(() => {
    if (projectId && session?.user) {
      loadProject(projectId);
    } else {
      // Initialize with sample data only if no project is being loaded
      initializeSampleData();
    }
  }, [projectId, session]);

  const loadProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`);
      if (response.ok) {
        const project = await response.json();
        setCurrentProject(project);
        setDiagramType(project.type);
        
        if (project.content) {
          const projectData = JSON.parse(project.content);
          setDiagramState(projectData);
        }
      }
    } catch (error) {
      console.error('Error loading project:', error);
    }
  };

  const saveProject = async (projectData: { title: string; description?: string; isPublic: boolean }) => {
    if (!session?.user) {
      alert('Vui lòng đăng nhập để lưu dự án');
      return;
    }

    setSaveLoading(true);
    try {
      const data = {
        ...projectData,
        content: JSON.stringify(diagramState),
        type: diagramType
      };

      let response;
      if (currentProject) {
        // Update existing project
        response = await fetch(`/api/projects/${currentProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } else {
        // Create new project
        response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      }

      if (response.ok) {
        const project = await response.json();
        setCurrentProject(project);
        setShowSaveModal(false);
        
        // Update URL to include project ID
        if (!currentProject) {
          window.history.replaceState({}, '', `/uml-designer?project=${project.id}`);
        }
      } else {
        alert('Lỗi khi lưu dự án');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Lỗi khi lưu dự án');
    } finally {
      setSaveLoading(false);
    }
  };

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled || !currentProject || !session?.user) return;

    const autoSaveTimer = setTimeout(async () => {
      try {
        await fetch(`/api/projects/${currentProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: currentProject.title,
            description: currentProject.description,
            content: JSON.stringify(diagramState),
            type: diagramType,
            isPublic: currentProject.isPublic
          })
        });
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 5000); // Auto-save after 5 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [diagramState, diagramType, currentProject, session, autoSaveEnabled]);

  // Initialize with sample data
  const initializeSampleData = () => {
    const sampleNodes = [
      {
        id: '1',
        type: 'class',
        position: { x: 100, y: 100 },
        size: { width: 200, height: 150 },
        data: {
          label: 'User',
          nodeType: 'class',
          attributes: ['- id: String', '- name: String', '- email: String'],
          methods: ['+ getId(): String', '+ getName(): String', '+ setEmail(email: String): void'],
          color: '#FFF3E0'
        }
      },
      {
        id: '2',
        type: 'class',
        position: { x: 400, y: 100 },
        size: { width: 200, height: 120 },
        data: {
          label: 'Product',
          nodeType: 'class',
          attributes: ['- id: String', '- name: String', '- price: Double'],
          methods: ['+ getId(): String', '+ getPrice(): Double'],
          color: '#FFF3E0'
        }
      },
      {
        id: '3',
        type: 'entity',
        position: { x: 100, y: 350 },
        size: { width: 150, height: 100 },
        data: {
          label: 'Customer',
          nodeType: 'entity',
          attributes: ['customer_id (PK)', 'first_name', 'last_name', 'email'],
          color: '#E8F5E8'
        }
      }
    ];

    const sampleEdges = [
      {
        id: 'e1-2',
        source: '1',
        target: '2',
        type: 'association',
        label: 'uses'
      }
    ];

    setDiagramState({
      nodes: sampleNodes,
      edges: sampleEdges,
      selectedNodeIds: [],
      selectedEdgeIds: []
    });
  };

  const handleNodesChange = useCallback((newNodes: DiagramNode[]) => {
    setDiagramState(prev => ({ ...prev, nodes: newNodes }));
  }, []);

  const handleEdgesChange = useCallback((newEdges: DiagramEdge[]) => {
    setDiagramState(prev => ({ ...prev, edges: newEdges }));
  }, []);

  const handleSelectionChange = useCallback((nodeIds: string[]) => {
    setDiagramState(prev => ({ 
      ...prev, 
      selectedNodeIds: nodeIds,
      nodes: prev.nodes.map(node => ({ ...node, selected: nodeIds.includes(node.id) }))
    }));
  }, []);

  const handleNodeAdd = useCallback((nodeType: string, position: { x: number; y: number }) => {
    const nodeConfig = NodeDefinitions[diagramType]?.[nodeType];
    if (!nodeConfig) return;

    const newNode = {
      id: `node_${Date.now()}`,
      type: nodeType,
      position,
      size: nodeConfig.defaultSize,
      data: {
        label: nodeConfig.label,
        nodeType: nodeType,
        color: nodeConfig.color,
        attributes: ['class', 'interface', 'abstract'].includes(nodeType) ? ['+ attribute: Type'] : 
                   ['entity', 'weakEntity'].includes(nodeType) ? ['attribute_name'] : undefined,
        methods: ['class', 'interface', 'abstract'].includes(nodeType) ? ['+ method(): ReturnType'] : undefined
      }
    };

    const newNodes = [...diagramState.nodes, newNode];
    setDiagramState(prev => ({ ...prev, nodes: newNodes }));
    saveToHistory({ ...diagramState, nodes: newNodes });
  }, [diagramType, diagramState, saveToHistory]);

  const handleNodeUpdate = useCallback((id: string, changes: Partial<DiagramNode>) => {
    const newNodes = diagramState.nodes.map(node => 
      node.id === id ? { ...node, ...changes } : node
    );
    setDiagramState(prev => ({ ...prev, nodes: newNodes }));
  }, [diagramState.nodes]);

  // Inspector actions
  const handleDeleteNode = useCallback((id: string) => {
    const newNodes = diagramState.nodes.filter(node => node.id !== id);
    const newEdges = diagramState.edges.filter(edge => edge.source !== id && edge.target !== id);
    const newState = {
      ...diagramState,
      nodes: newNodes,
      edges: newEdges,
      selectedNodeIds: []
    };
    setDiagramState(newState);
    saveToHistory(newState);
  }, [diagramState, saveToHistory]);

  const handleDuplicateNode = useCallback((id: string) => {
    const node = diagramState.nodes.find(n => n.id === id);
    if (!node) return;
    const newNode = {
      ...node,
      id: `node_${Date.now()}`,
      position: { x: node.position.x + 40, y: node.position.y + 40 },
      selected: false
    };
    const newNodes = [...diagramState.nodes, newNode];
    setDiagramState(prev => ({ ...prev, nodes: newNodes }));
    saveToHistory({ ...diagramState, nodes: newNodes });
  }, [diagramState, saveToHistory]);

  const handleAutoSizeNode = useCallback((id: string) => {
    // For demo: just reset to default size
    const node = diagramState.nodes.find(n => n.id === id);
    if (!node) return;
    const nodeConfig = NodeDefinitions[diagramType]?.[node.type];
    if (!nodeConfig) return;
    const newNodes = diagramState.nodes.map(n =>
      n.id === id ? { ...n, size: nodeConfig.defaultSize } : n
    );
    setDiagramState(prev => ({ ...prev, nodes: newNodes }));
    saveToHistory({ ...diagramState, nodes: newNodes });
  }, [diagramState, diagramType, saveToHistory]);

  const handleUndo = useCallback(() => {
    const state = undo();
    if (state) {
      setDiagramState(state);
    }
  }, [undo]);

  const handleRedo = useCallback(() => {
    const state = redo();
    if (state) {
      setDiagramState(state);
    }
  }, [redo]);

  const handleCopy = useCallback(() => {
    const selectedNodes = diagramState.nodes.filter(node => 
      diagramState.selectedNodeIds.includes(node.id)
    );
    setClipboard({ nodes: selectedNodes, edges: [] });
  }, [diagramState.nodes, diagramState.selectedNodeIds, setClipboard]);

  const handleDelete = useCallback(() => {
    const newNodes = diagramState.nodes.filter(node => 
      !diagramState.selectedNodeIds.includes(node.id)
    );
    const newEdges = diagramState.edges.filter(edge => 
      !diagramState.selectedNodeIds.includes(edge.source) && 
      !diagramState.selectedNodeIds.includes(edge.target)
    );
    
    const newState = {
      ...diagramState,
      nodes: newNodes,
      edges: newEdges,
      selectedNodeIds: []
    };
    
    setDiagramState(newState);
    saveToHistory(newState);
  }, [diagramState, saveToHistory]);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.2, 0.3));
  }, []);

  const generatePlantUML = useCallback(() => {
    let plantUML = '@startuml\n';
    
    diagramState.nodes.forEach(node => {
      if (['class', 'interface', 'abstract'].includes(node.data.nodeType)) {
        plantUML += `class ${node.data.label} {\n`;
                  if (node.data.attributes) {
            node.data.attributes.forEach((attr: string) => {
              plantUML += `  ${attr}\n`;
            });
          }
          if (node.data.methods) {
            node.data.methods.forEach((method: string) => {
              plantUML += `  ${method}\n`;
            });
          }
        plantUML += '}\n';
      } else if (['entity', 'weakEntity'].includes(node.data.nodeType)) {
        plantUML += `entity ${node.data.label} {\n`;
        if (node.data.attributes) {
          node.data.attributes.forEach((attr: string) => {
            plantUML += `  ${attr}\n`;
          });
        }
        plantUML += '}\n';
      } else if (node.data.nodeType === 'actor') {
        plantUML += `actor ${node.data.label}\n`;
      } else if (node.data.nodeType === 'usecase') {
        plantUML += `usecase ${node.data.label}\n`;
      }
    });
    
    diagramState.edges.forEach(edge => {
      const sourceNode = diagramState.nodes.find(n => n.id === edge.source);
      const targetNode = diagramState.nodes.find(n => n.id === edge.target);
      if (sourceNode && targetNode) {
        plantUML += `${sourceNode.data.label} --> ${targetNode.data.label}`;
        if (edge.label) {
          plantUML += ` : ${edge.label}`;
        }
        plantUML += '\n';
      }
    });
    
    plantUML += '@enduml';
    
    navigator.clipboard.writeText(plantUML).then(() => {
      alert('PlantUML code copied to clipboard!');
    }).catch(() => {
      console.log('PlantUML code:', plantUML);
      alert('PlantUML code logged to console');
    });
  }, [diagramState]);

  const selectedNode = useMemo(() => {
    return diagramState.nodes.find(node => 
      diagramState.selectedNodeIds.includes(node.id)
    ) || null;
  }, [diagramState.nodes, diagramState.selectedNodeIds]);

  // Collaboration management
  useEffect(() => {
    if (currentProject && isConnected) {
      joinProject(currentProject.id);
      return () => {
        leaveProject(currentProject.id);
      };
    }
  }, [currentProject, isConnected, joinProject, leaveProject]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (e.key === 'Delete') {
        handleDelete();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        handleCopy();
      } else if (e.key === 'Escape' && showCollaborationPanel) {
        e.preventDefault();
        setShowCollaborationPanel(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleDelete, handleUndo, handleRedo, handleCopy, showCollaborationPanel]);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm z-40 relative">
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Shapes className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">UML Designer</h1>
          </div>
          <select
            value={diagramType}
            onChange={(e) => setDiagramType(e.target.value)}
            className="p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="class">Class Diagram</option>
            <option value="usecase">Use Case Diagram</option>
            <option value="erd">Entity Relationship</option>
            <option value="sequence">Sequence Diagram</option>
            <option value="activity">Activity Diagram</option>
            <option value="state">State Machine</option>
            <option value="bpmn">BPMN</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleUndo} 
            className="p-2 hover:bg-gray-100 rounded-md transition-colors" 
            title="Undo (Ctrl+Z)"
            type="button"
          >
            <Undo2 size={20} />
          </button>
          <button 
            onClick={handleRedo} 
            className="p-2 hover:bg-gray-100 rounded-md transition-colors" 
            title="Redo (Ctrl+Y)"
            type="button"
          >
            <Redo2 size={20} />
          </button>
          <button 
            onClick={handleCopy} 
            className="p-2 hover:bg-gray-100 rounded-md transition-colors" 
            title="Copy (Ctrl+C)"
            type="button"
          >
            <Copy size={20} />
          </button>
          <button 
            onClick={handleDelete} 
            className="p-2 hover:bg-gray-100 rounded-md transition-colors" 
            title="Delete (Del)"
            type="button"
          >
            <Trash2 size={20} />
          </button>
          <div className="border-l border-gray-300 mx-2 h-6"></div>
          <button 
            onClick={handleZoomOut} 
            className="p-2 hover:bg-gray-100 rounded-md transition-colors" 
            title="Zoom Out"
            type="button"
          >
            <ZoomOut size={20} />
          </button>
          <span className="text-sm font-mono px-2 min-w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button 
            onClick={handleZoomIn} 
            className="p-2 hover:bg-gray-100 rounded-md transition-colors" 
            title="Zoom In"
            type="button"
          >
            <ZoomIn size={20} />
          </button>
          <div className="border-l border-gray-300 mx-2 h-6"></div>
          
          {/* Save Project Button */}
          {session?.user && (
            <button 
              onClick={() => setShowSaveModal(true)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors" 
              title="Lưu dự án"
              type="button"
            >
              <Cloud size={20} />
            </button>
          )}
          
          {/* Divider */}
          <div className="border-l border-gray-300 mx-2 h-6"></div>
          
          {/* Share Project Button */}
          {session?.user && currentProject && (
            <button 
              onClick={() => setShowShareModal(true)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors" 
              title="Chia sẻ dự án"
              type="button"
            >
              <Share2 size={20} />
            </button>
          )}
          
          {/* Divider */}
          <div className="border-l border-gray-300 mx-2 h-6"></div>
          
          {/* Auto-save Indicator */}
          {currentProject && session?.user && (
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
                className={`p-1 rounded transition-colors ${
                  autoSaveEnabled ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'
                }`}
                title={autoSaveEnabled ? 'Auto-save: Bật' : 'Auto-save: Tắt'}
              >
                {autoSaveEnabled ? <Cloud size={16} /> : <CloudOff size={16} />}
              </button>
              <span className="text-xs text-gray-500">
                {currentProject.title}
              </span>
            </div>
          )}
          
          {/* Divider */}
          <div className="border-l border-gray-300 mx-2 h-6"></div>
          
          {/* Collaboration Status - Compact */}
          {currentProject && (
            <div className="flex items-center space-x-2 text-xs">
              {/* Online Status */}
              <span className={`px-2 py-1 rounded-full ${isConnected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {isConnected ? '🟢 Online' : '🔴 Offline'}
              </span>
              
              {/* Active Users Count */}
              {activeUsers.length > 0 && (
                <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                  👥 {activeUsers.length}
                </span>
              )}
              
              {/* Comments Count */}
              {comments.length > 0 && (
                <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                  💬 {comments.length}
                </span>
              )}
              
              {/* Warning for Multiple Users */}
              {activeUsers.length > 1 && (
                <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                  ⚠️ {activeUsers.length - 1} người khác
                </span>
              )}
              
              {/* Toggle Collaboration Panel */}
              <button
                onClick={() => setShowCollaborationPanel(!showCollaborationPanel)}
                className={`px-2 py-1 rounded-full transition-colors ${
                  showCollaborationPanel 
                    ? 'bg-blue-200 text-blue-800 hover:bg-blue-300' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={showCollaborationPanel ? 'Ẩn panel collaboration (Esc)' : 'Hiện panel collaboration'}
              >
                {showCollaborationPanel ? '👁️' : '👁️‍🗨️'}
              </button>
              
              {/* Close Button (when panel is open) */}
              {showCollaborationPanel && (
                <button
                  onClick={() => setShowCollaborationPanel(false)}
                  className="px-2 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                  title="Đóng panel collaboration"
                >
                  ✕
                </button>
              )}
            </div>
          )}
          
          {/* Divider */}
          <div className="border-l border-gray-300 mx-2 h-6"></div>
          
          <button 
            onClick={() => alert('PNG export would use html2canvas')} 
            className="p-2 hover:bg-gray-100 rounded-md transition-colors" 
            title="Export PNG"
            type="button"
          >
            <Download size={20} />
          </button>
          <button 
            onClick={generatePlantUML} 
            className="p-2 hover:bg-gray-100 rounded-md transition-colors" 
            title="Generate PlantUML"
            type="button"
          >
            <Save size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Palette */}
        <PalettePanel 
          diagramType={diagramType} 
          onNodeAdd={handleNodeAdd}
          selectedConnectionType={selectedConnectionType}
          setSelectedConnectionType={setSelectedConnectionType}
        />
        
        {/* Canvas */}
        <DiagramCanvas
          nodes={diagramState.nodes}
          edges={diagramState.edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onSelectionChange={handleSelectionChange}
          selectedNodeIds={diagramState.selectedNodeIds}
          zoom={zoom}
          pan={pan}
          selectedConnectionType={selectedConnectionType}
        />
        
        {/* Inspector Panel */}
        <InspectorPanel
          selectedNode={selectedNode}
          onUpdateNode={handleNodeUpdate}
          onDeleteNode={handleDeleteNode}
          onDuplicateNode={handleDuplicateNode}
          onAutoSizeNode={handleAutoSizeNode}
        />
        
        {/* Collaboration Panel */}
        {currentProject && showCollaborationPanel && (
          <CollaborationPanel
            projectId={currentProject.id}
            isOpen={showCollaborationPanel}
            onClose={() => setShowCollaborationPanel(false)}
          />
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 p-2 flex justify-between items-center text-sm text-gray-600">
        <div className="flex gap-4">
          <span>Nodes: {diagramState.nodes.length}</span>
          <span>Edges: {diagramState.edges.length}</span>
          <span>Selected: {diagramState.selectedNodeIds.length}</span>
          {session?.user && (
            <span className="text-blue-600">
              User: {session.user.name || session.user.email}
            </span>
          )}
        </div>
        
        {/* Connection Legend */}
        <div className="flex items-center gap-3 text-xs">
          <span className="font-medium">Kết nối:</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-0.5 bg-gray-700"></div>
            <span>Association</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-0.5 bg-purple-600"></div>
            <span>Inheritance</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-0.5 bg-green-600"></div>
            <span>Composition</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-0.5 bg-orange-600"></div>
            <span>Aggregation</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-0.5 bg-gray-700 border-dashed border-t"></div>
            <span>Dependency</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span>Zoom: {Math.round(zoom * 100)}%</span>
          <span>Grid: On</span>
          <span className="text-xs text-blue-600 font-medium">Loại hiện tại: {selectedConnectionType}</span>
          {currentProject && (
            <span className={`text-xs font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? '🟢 Online' : '🔴 Offline'}
            </span>
          )}
        </div>
      </div>

      {/* Save Project Modal */}
      <SaveProjectModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={saveProject}
        initialData={currentProject ? {
          title: currentProject.title,
          description: currentProject.description,
          isPublic: currentProject.isPublic
        } : undefined}
        loading={saveLoading}
      />
      
      {/* Share Project Modal */}
      {currentProject && (
        <ShareProjectModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          projectId={currentProject.id}
          projectTitle={currentProject.title}
        />
      )}
    </div>
  );
}