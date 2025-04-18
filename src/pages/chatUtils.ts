// Utility functions for SseChat and related chat/task features
// Type definitions for chat/task utils
export interface TaskDetail { 
  id: string;
  name: string;
  assignee_name?: string;
  assignee?: string;
  status: string;
  dueDate?: string | null;
  priority?: 'low' | 'medium' | 'high';
  description?: string;
}

export interface TaskFormData {
  name: string;
  description?: string;
  assignee: string;
  dueDate: string | null;
  priority: 'low' | 'medium' | 'high';
}

// Parse task list from content
export const parseTaskList = (content?: string): TaskDetail[] | null => {
  if (!content || !content.trim().startsWith("Here are the")) return null;
  const lines = content.split('\n').slice(1).filter(line => line.trim() !== '');
  const tasks: TaskDetail[] = [];
  const taskRegex = /- ID: (.*?), Name: "(.*?)", Assignee: (.*?), Status: (.*?)(?: \(Due: (.*?)\))?(?: \[Priority: (.*?)\])?$/;
  lines.forEach(line => {
    const match = line.trim().match(taskRegex);
    if (match) {
      tasks.push({
        id: match[1]?.trim() || 'N/A',
        name: match[2]?.trim() || 'N/A',
        assignee: match[3]?.trim() || 'N/A',
        status: match[4]?.trim() || 'N/A',
        dueDate: match[5]?.trim() || null,
        priority: (match[6]?.trim().toLowerCase() || 'medium') as 'low' | 'medium' | 'high',
      });
    }
  });
  return tasks.length > 0 ? tasks : null;
};

// Parse single task update
export const parseTaskUpdate = (content?: string): TaskDetail | null => {
  if (!content || !content.includes("Task Update:")) return null;
  const taskRegex = /Task Update: ID: (.*?), Name: "(.*?)", Status changed to: (.*?), Assignee: (.*?)(?: \(Due: (.*?)\))?/;
  const match = content.match(taskRegex);
  if (match) {
    return {
      id: match[1]?.trim() || 'N/A',
      name: match[2]?.trim() || 'N/A',
      status: match[3]?.trim() || 'N/A',
      assignee: match[4]?.trim() || 'N/A',
      dueDate: match[5]?.trim() || null,
    };
  }
  return null;
};

// Utility to robustly extract string content from SSE messages
export function parseContent(msgOrContent: any): string {
  if (typeof msgOrContent === 'string') return msgOrContent.trim();
  if (typeof msgOrContent === 'object' && msgOrContent !== null && 'text' in msgOrContent) {
    return String(msgOrContent.text).trim();
  }
  return '';
}
