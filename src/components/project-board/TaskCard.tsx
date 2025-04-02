import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Calendar, Edit, Trash2, Check } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Task } from '@/pages/ProjectBoard';
import type { TaskCardProps } from './types';

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isAiSpeaking,
  onUpdateProgress,
  onDeleteTask,
  getPriorityColor,
}) => {
  return (
    <Draggable draggableId={task.id} index={0}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`group relative rounded-lg border bg-card p-4 transition-all hover:shadow-md ${
            snapshot.isDragging ? 'shadow-lg' : ''
          }`}
          style={{
            ...provided.draggableProps.style,
            borderLeftColor: getPriorityColor(task.priority),
            borderLeftWidth: '4px',
          }}
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <h4 className="font-medium">{task.title}</h4>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => onDeleteTask(task.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">{task.description}</p>
          <div className="mb-2 flex items-center gap-2">
            <Progress value={task.progress} className="flex-1" />
            {task.progress === 100 && (
              <Check className="h-4 w-4 text-green-500" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={`https://avatar.vercel.sh/${task.assignee}.png`} />
                <AvatarFallback>{task.assignee[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{task.assignee}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {new Date(task.deadline).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard; 