import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Edit, Trash2, Calendar, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Task } from "@/types/task";

interface TaskCardProps {
  task: Task;
  cardStyle: string;
  index: number;
  isAiSpeaking: boolean;
  onUpdateProgress: (taskId: string, progress: number) => void;
  onDeleteTask: (taskId: string) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high": return "bg-red-500/10 text-red-600 hover:bg-red-500/20";
    case "medium": return "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20";
    case "low": return "bg-green-500/10 text-green-600 hover:bg-green-500/20";
    default: return "bg-slate-500/10 text-slate-600 hover:bg-slate-500/20";
  }
};

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  cardStyle,
  index,
  isAiSpeaking,
  onUpdateProgress,
  onDeleteTask,
}) => {
  const cardContent = (
    <motion.div
      whileHover={{ 
        scale: 1.03, 
        y: -3,
        transition: { type: "spring", stiffness: 400 }
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
      className={`${cardStyle} relative`}
    >
      <Card 
        className="mb-3 transition-all hover:shadow-lg overflow-hidden border-l-4 backdrop-blur-sm"
        style={{ 
          borderLeftColor: task.priority === 'high' ? 'rgb(239, 68, 68)' : task.priority === 'medium' ? 'rgb(245, 158, 11)' : 'rgb(34, 197, 94)'
        }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" 
          initial={{ width: 0 }}
          animate={{ width: `${task.progress}%` }}
          transition={{ type: "spring", damping: 15 }}
          style={{ 
            height: '3px', 
            top: 0, 
            opacity: 0.8,
            background: task.progress === 100 
              ? 'linear-gradient(to right, rgba(16, 185, 129, 0.7), rgba(5, 150, 105, 0.9))' 
              : 'linear-gradient(to right, rgba(59, 130, 246, 0.6), rgba(99, 102, 241, 0.8))'
          }}
        />

        <CardHeader className="p-3 pb-0">
          <div className="flex justify-between">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Badge className={cn("font-normal", getPriorityColor(task.priority))}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
            </motion.div>
            <div className="flex gap-1">
              <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0 relative overflow-hidden group"
                  onClick={() => onUpdateProgress(task.id, Math.min(100, task.progress + 10))}
                >
                  <span className="absolute inset-0 bg-blue-500/10 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  <Edit className="h-3.5 w-3.5 relative z-10" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0 text-destructive relative overflow-hidden group"
                  onClick={() => onDeleteTask(task.id)}
                >
                  <span className="absolute inset-0 bg-red-500/10 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  <Trash2 className="h-3.5 w-3.5 relative z-10" />
                </Button>
              </motion.div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <motion.h4 
            className="font-medium mb-1 line-clamp-1"
            initial={{ y: 0 }}
            whileHover={{ y: -1 }}
          >
            {task.title}
          </motion.h4>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Progress</span>
              <motion.span
                key={task.progress}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {task.progress}%
              </motion.span>
            </div>
            <Progress 
              value={task.progress} 
              className={task.progress === 100 ? "bg-emerald-500" : ""} 
            />
            {task.progress === 100 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="absolute top-3 right-3"
              >
                <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-3 pt-0 flex justify-between items-center mt-auto">
          <div className="flex items-center gap-1.5">
            <Avatar className="h-3 w-3 relative">
              <motion.div
                className="relative"
                animate={{ 
                  scale: isAiSpeaking ? [1, 1.1, 1] : 1,
                  rotate: isAiSpeaking ? [0, 2, 0, -2, 0] : 0
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: isAiSpeaking ? Infinity : null,
                  repeatType: "loop"
                }}
              >
                <AvatarFallback className="text-[10px] bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                  {task.assignee.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </AvatarFallback>
              </motion.div>
            </Avatar>
            <span className="text-xs">{task.assignee.name}</span>
          </div>
          <motion.div 
            className="flex items-center text-xs text-muted-foreground"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Calendar className="h-3 w-3 mr-1" />
            <span>{new Date(task.deadline).toLocaleDateString()}</span>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );

  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.5 : 1,
            transform: snapshot.isDragging ? provided.draggableProps.style?.transform : 'none',
            transition: snapshot.isDragging ? 'none' : 'all 0.2s ease',
            cursor: 'grab',
            userSelect: 'none',
          }}
        >
          {cardContent}
          {snapshot.isDragging && createPortal(
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 9999,
                ...provided.draggableProps.style,
                transform: provided.draggableProps.style?.transform,
                transition: 'none',
              }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                style={{
                  transform: provided.draggableProps.style?.transform,
                  width: '100%',
                  maxWidth: '300px',
                  margin: '0 auto',
                }}
              >
                {cardContent}
              </motion.div>
            </div>,
            document.body
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard; 