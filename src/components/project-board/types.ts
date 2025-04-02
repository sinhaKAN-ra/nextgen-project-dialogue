import { ReactNode } from 'react';

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  comments: string[];
  progress: number;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface BoardData {
  tasks: { [key: string]: Task };
  columns: { [key: string]: Column };
  columnOrder: string[];
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface TaskFormData {
  title: string;
  description: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  assignee: string;
}

export interface TaskCardProps {
  task: Task;
  isAiSpeaking?: boolean;
  onUpdateProgress: (taskId: string, progress: number) => void;
  onDeleteTask: (taskId: string) => void;
  getPriorityColor: (priority: Task['priority']) => string;
}

export interface BoardColumnProps {
  column: Column;
  tasks: Task[];
  isAiSpeaking?: boolean;
  onUpdateProgress: (taskId: string, progress: number) => void;
  onDeleteTask: (taskId: string) => void;
  getPriorityColor: (priority: Task['priority']) => string;
  onAddTask: (columnId: string, task: TaskFormData) => void;
}

export interface BoardViewProps {
  data: BoardData;
  isAiSpeaking?: boolean;
  onUpdateProgress: (taskId: string, progress: number) => void;
  onDeleteTask: (taskId: string) => void;
  getPriorityColor: (priority: Task['priority']) => string;
  onAddTask: (columnId: string, task: TaskFormData) => void;
}

export interface TimelineViewProps {
  data: BoardData;
  isAiSpeaking?: boolean;
  onUpdateProgress: (taskId: string, progress: number) => void;
  onDeleteTask: (taskId: string) => void;
  getPriorityColor: (priority: Task['priority']) => string;
}

export interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isAiSpeaking: boolean;
  children?: ReactNode;
} 