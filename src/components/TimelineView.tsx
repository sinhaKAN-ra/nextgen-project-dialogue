import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Task, Column } from "@/types/task";
import { format, differenceInDays, isPast, isToday, isFuture } from "date-fns";
import { Calendar, AlertCircle, Edit, Trash2, Check } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { cn } from "@/lib/utils";

interface TimelineViewProps {
  columnOrder: string[];
  columns: Record<string, Column>;
  tasks: Record<string, Task>;
  filteredTasks: Record<string, Task>;
  isAiSpeaking: boolean;
  onUpdateProgress: (taskId: string, progress: number) => void;
  onDeleteTask: (taskId: string) => void;
}

const TimelineView: React.FC<TimelineViewProps> = ({
  columnOrder,
  columns,
  filteredTasks,
  isAiSpeaking,
  onUpdateProgress,
  onDeleteTask,
}) => {
  // Group tasks by time periods with specific ranges
  const getTimeGroup = (deadline: string) => {
    const today = new Date();
    const taskDate = new Date(deadline);
    const diffDays = differenceInDays(taskDate, today);
    
    if (isPast(taskDate)) return "overdue";
    if (isToday(taskDate)) return "today";
    if (diffDays <= 7) return "thisWeek";
    if (diffDays <= 30) return "thisMonth";
    return "future";
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/15 text-red-400 border-red-500/30";
      case "medium": return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "low": return "bg-green-500/15 text-green-400 border-green-500/30";
      default: return "bg-slate-500/15 text-slate-400 border-slate-500/30";
    }
  };
  
  const getProgressColor = (progress: number) => {
    if (progress === 100) return "bg-emerald-500";
    if (progress >= 75) return "bg-indigo-500";
    return "bg-blue-500";
  };
  
  // Get time period label and percentage position on timeline
  const getTimePeriodInfo = (timeGroup: string) => {
    switch (timeGroup) {
      case "overdue": return { label: "Overdue", position: "0%" };
      case "today": return { label: "Today", position: "20%" };
      case "thisWeek": return { label: "This Week", position: "40%" };
      case "thisMonth": return { label: "This Month", position: "70%" };
      case "future": return { label: "Future", position: "95%" };
    }
  };
  
  const renderTaskCard = (task: Task) => {
    const taskTimeGroup = getTimeGroup(task.deadline);
    const timeInfo = getTimePeriodInfo(taskTimeGroup);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-4"
      >
        <Card className="border-l-4 bg-white/10 backdrop-blur-sm border-white/20"
          style={{ 
            borderLeftColor: task.priority === 'high' ? 'rgb(239, 68, 68)' : 
                            task.priority === 'medium' ? 'rgb(245, 158, 11)' : 'rgb(34, 197, 94)'
          }}
        >
          <CardHeader className="p-3 pb-2">
            <div className="flex justify-between items-center">
              <Badge className={cn("font-normal", getPriorityColor(task.priority))}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
              
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-white/10"
                  onClick={() => onUpdateProgress(task.id, Math.min(100, task.progress + 10))}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={() => onDeleteTask(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-3 pt-0">
            <h4 className="font-medium mb-1 text-lg text-white">
              {task.title}
            </h4>
            <p className="text-sm text-slate-300 mb-3 line-clamp-2">
              {task.description}
            </p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Progress</span>
                <span>{task.progress}%</span>
              </div>
              
              <div className="h-2 w-full bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${getProgressColor(task.progress)} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${task.progress}%` }}
                  transition={{ type: "spring", damping: 15 }}
                />
              </div>
              
              {task.progress === 100 && (
                <div className="flex items-center text-emerald-400 text-sm font-medium">
                  <Check className="h-4 w-4 mr-1" />
                  Complete
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="p-3 pt-0 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                  {task.assignee.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-slate-300">{task.assignee.name}</span>
            </div>
            
            {isPast(new Date(task.deadline)) ? (
              <Badge className="bg-red-500/15 text-red-400 border-red-500/30">
                <AlertCircle className="h-3 w-3 mr-1" />
                Overdue
              </Badge>
            ) : (
              <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/30">
                <Calendar className="h-3 w-3 mr-1" />
                {format(new Date(task.deadline), "MMM d")}
              </Badge>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-white/10">
      {/* Timeline header with clear labels */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium text-white">Project Timeline</h2>
      </div>

      {/* Timeline track / slider */}
      <div className="relative h-3 bg-slate-700/50 rounded-full mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-indigo-500/30 rounded-full" />
        
        {/* Timeline markers */}
        {["overdue", "today", "thisWeek", "thisMonth", "future"].map(timeGroup => {
          const info = getTimePeriodInfo(timeGroup);
          const color = timeGroup === "overdue" ? "bg-red-500" :
                      timeGroup === "today" ? "bg-amber-500" :
                      timeGroup === "thisWeek" ? "bg-blue-500" :
                      timeGroup === "thisMonth" ? "bg-indigo-500" : "bg-purple-500";
          
          return (
            <div key={timeGroup} className="absolute" style={{ left: info.position, top: "-24px" }}>
              <div className="flex flex-col items-center">
                <span className="text-xs text-slate-300 mb-1">{info.label}</span>
                <div className={`w-2 h-6 ${color} rounded-full absolute top-6`}></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Group tasks by column and time period */}
      {columnOrder.map((columnId, colIndex) => {
        const column = columns[columnId];
        const tasks = column.taskIds
          .filter(taskId => filteredTasks[taskId])
          .map(taskId => filteredTasks[taskId]);

        // If no tasks in this column, show empty state
        if (tasks.length === 0) {
          return (
            <motion.div 
              key={column.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: colIndex * 0.1 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-medium text-lg text-white">{column.title}</h3>
                <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
                  0
                </Badge>
              </div>
              <div className="flex items-center justify-center h-24 bg-white/5 rounded-lg border border-white/10">
                <p className="text-slate-400 text-sm">No tasks in this stage</p>
              </div>
            </motion.div>
          );
        }

        return (
          <motion.div 
            key={column.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: colIndex * 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-medium text-lg text-white">{column.title}</h3>
              <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
                {tasks.length}
              </Badge>
            </div>

            {/* Group tasks by time period */}
            <div className="grid grid-cols-5 gap-4">
              {["overdue", "today", "thisWeek", "thisMonth", "future"].map(timeGroup => {
                const timeGroupTasks = tasks.filter(task => 
                  getTimeGroup(task.deadline) === timeGroup
                );
                
                const bgColor = timeGroup === "overdue" ? "bg-red-500/5" :
                              timeGroup === "today" ? "bg-amber-500/5" :
                              timeGroup === "thisWeek" ? "bg-blue-500/5" :
                              timeGroup === "thisMonth" ? "bg-indigo-500/5" : "bg-purple-500/5";
                
                const borderColor = timeGroup === "overdue" ? "border-red-500/10" :
                                  timeGroup === "today" ? "border-amber-500/10" :
                                  timeGroup === "thisWeek" ? "border-blue-500/10" :
                                  timeGroup === "thisMonth" ? "border-indigo-500/10" : "border-purple-500/10";
                
                return (
                  <div 
                    key={`${column.id}-${timeGroup}`} 
                    className={`${bgColor} border ${borderColor} rounded-md p-3`}
                  >
                    {timeGroupTasks.length > 0 ? (
                      timeGroupTasks.map(task => renderTaskCard(task))
                    ) : (
                      <div className="h-12 flex items-center justify-center text-sm text-slate-500">
                        No tasks
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TimelineView;