import React from 'react';
import { format } from "date-fns";
import { Task } from '../ProjectBoard';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TimelineView: React.FC<{ 
    tasksToDisplay: Task[]; taskFilter: string; 
    setTaskFilter: (filter: string) => void;
    setIsTimelineView: any
}> = ({ tasksToDisplay, taskFilter, setTaskFilter, setIsTimelineView }) => {
  return (
    <div className="space-y-6 p-4 h-[calc(100vh-200px)] overflow-y-auto">
      <div className="flex justify-between items-center pb-4">
        <h2 className="text-xl text-white/90 font-semibold flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" /> Timeline Journey
        </h2>
        <Button variant="outline" size="sm" onClick={() => setIsTimelineView(false)}>
          Switch to Board View
        </Button>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-4 mb-4">
        <Button variant={taskFilter === "today" ? "default" : "outline"} onClick={() => setTaskFilter("today")}>
          Today
        </Button>
        <Button variant={taskFilter === "thisWeek" ? "default" : "outline"} onClick={() => setTaskFilter("thisWeek")}>
          This Week
        </Button>
        <Button variant={taskFilter === "thisMonth" ? "default" : "outline"} onClick={() => setTaskFilter("thisMonth")}>
          This Month
        </Button>
        <Button variant={taskFilter === "future" ? "default" : "outline"} onClick={() => setTaskFilter("future")}>
          Future
        </Button>
        <Button variant={taskFilter === "all" ? "default" : "outline"} onClick={() => setTaskFilter("all")}>
          All
        </Button>
        <Button variant={taskFilter === "overdue" ? "default" : "outline"} onClick={() => setTaskFilter("overdue")}>
          Overdue
        </Button>
      </div>

      {/* Current Date Indicator */}
      <div className="w-full flex justify-between items-center p-4 rounded-lg shadow-md">
        <span className="text-white text-lg font-semibold">{format(new Date(), "PPP")}</span>
        <span className="text-white text-lg font-semibold">Current Position</span>
      </div>

      {/* Phases of the selected task */}
      <div className="mt-4">
        <div className="flex space-x-4">
          {tasksToDisplay.map(task => (
            <div key={task.id} className="flex flex-col items-center">
              <div className="text-white">{task.title}</div>
              <div className="text-xs text-gray-400">{format(new Date(task.deadline), "PPP")}</div>
              <div className="h-2 w-2 rounded-full bg-blue-500" />
            </div>
          ))}
        </div>
        <h3 className="text-lg text-white">Task Phases</h3>
      </div>

      {/* Task groups */}
      <div className="space-y-8 mt-12">
        {tasksToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {tasksToDisplay.map(task => renderTaskCard(task, "bg-blue-500/10 border-blue-500/20"))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            <p>No tasks found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineView;

const renderTaskCard = (task: Task, cardStyle: string) => {
    return (
      <motion.div 
        key={task.id}
        whileHover={{ scale: 1.02 }}
        // className="h-full"
        initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className={cardStyle}
      >
        <Card className={`h-full border ${cardStyle} text-white bg-white/10 shadow-sm hover:shadow-md transition-shadow duration-200`}>
          <CardHeader className="p-3 pb-0">
            <div className="flex justify-between">
              <Badge className={cn("font-normal", getPriorityColor(task.priority))}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" 
                  onClick={() => updateTaskProgress(task.id, Math.min(100, task.progress + 10))}>
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" 
                  onClick={() => deleteTask(task.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <h4 className="font-medium mb-1 line-clamp-1">{task.title}</h4>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span>{task.progress}%</span>
              </div>
              <Progress value={task.progress} className={task.progress === 100 ? "bg-emerald-500" : ""} />
            </div>
          </CardContent>
          <CardFooter className="p-3 pt-0 flex justify-between items-center mt-auto">
            <div className="flex items-center gap-1.5">
              <Avatar className="h-5 w-5">
                <motion.div 
                  className="relative"
                  animate={{ scale: isAiSpeaking ? 1.1 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <AvatarFallback className="text-[10px]">
                    {task.assignee.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </AvatarFallback>
                </motion.div>
              </Avatar>
              <span className="text-xs">{task.assignee.name}</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{new Date(task.deadline).toLocaleDateString()}</span>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    );
  };