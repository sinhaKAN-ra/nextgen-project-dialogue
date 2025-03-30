import React from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { BoardData, Task } from '../ProjectBoard';
import { Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const TaskBoard: React.FC<{ 
  boardData: BoardData; 
  setBoardData: (data: BoardData) => void; 
  filteredTasks: Record<string, Task>; 
  updateTaskProgress: (taskId: string, progress: number) => void; 
  deleteTask: (taskId: string) => void; 
}> = ({ boardData, setBoardData, filteredTasks, updateTaskProgress, deleteTask }) => {
  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or if the item was dropped back to its original position
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const sourceColumn = boardData.columns[source.droppableId];
    const destColumn = boardData.columns[destination.droppableId];
    
    // If moving within the same column
    if (sourceColumn === destColumn) {
      const newTaskIds = Array.from(sourceColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...sourceColumn,
        taskIds: newTaskIds,
      };

      setBoardData({
        ...boardData,
        columns: {
          ...boardData.columns,
          [newColumn.id]: newColumn,
        },
      });
    } else {
      // Moving from one column to another
      const sourceTaskIds = Array.from(sourceColumn.taskIds);
      sourceTaskIds.splice(source.index, 1);
      
      const destinationTaskIds = Array.from(destColumn.taskIds);
      destinationTaskIds.splice(destination.index, 0, draggableId);

      setBoardData({
        ...boardData,
        columns: {
          ...boardData.columns,
          [sourceColumn.id]: {
            ...sourceColumn,
            taskIds: sourceTaskIds,
          },
          [destColumn.id]: {
            ...destColumn,
            taskIds: destinationTaskIds,
          },
        },
      });
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {boardData.columnOrder.map((columnId) => {
          const column = boardData.columns[columnId];
          const tasks = column.taskIds
            .filter(taskId => filteredTasks[taskId])
            .map(taskId => filteredTasks[taskId]);

            function getPriorityColor(priority: string): import("clsx").ClassValue {
                throw new Error('Function not implemented.');
            }

          return (
            <div key={column.id} className="flex flex-col rounded-lg border bg-card/50 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b p-4">
                <h3 className="font-medium">{column.title}</h3>
                <Badge variant="outline">{tasks.length}</Badge>
              </div>
              
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-1 overflow-y-auto p-3"
                    style={{ minHeight: "calc(100vh - 320px)" }}
                  >
                    {tasks.length === 0 ? (
                      <div className="flex h-24 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                        No tasks
                      </div>
                    ) : (
                      tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-3 transition-all hover:shadow-md overflow-hidden border-l-4"
                              style={{ 
                                borderLeftColor: task.priority === 'high' ? 'rgb(239, 68, 68)' : task.priority === 'medium' ? 'rgb(245, 158, 11)' : 'rgb(34, 197, 94)' 
                              }}
                            >
                              <CardHeader className="p-3 pb-0">
                                <div className="flex justify-between">
                                  <Badge className={cn("font-normal", getPriorityColor(task.priority))}>
                                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                                  </Badge>
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" 
                                      onClick={() => updateTaskProgress(task.id, Math.min(100, task.progress + 10))}>
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive" 
                                      onClick={() => deleteTask(task.id)}>
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="p-3 pt-1">
                                <h4 className="font-medium">{task.title}</h4>
                                <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span>Progress</span>
                                    <span>{task.progress}%</span>
                                  </div>
                                  <Progress value={task.progress} className="h-1.5" />
                                </div>
                              </CardContent>
                              <CardFooter className="p-3 pt-1 flex justify-between">
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
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;