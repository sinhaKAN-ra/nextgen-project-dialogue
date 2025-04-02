import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import TaskCard from "./TaskCard";
import { Task, Column } from "@/types/task";

interface BoardViewProps {
  columnOrder: string[];
  columns: Record<string, Column>;
  tasks: Record<string, Task>;
  filteredTasks: Record<string, Task>;
  isAiSpeaking: boolean;
  onUpdateProgress: (taskId: string, progress: number) => void;
  onDeleteTask: (taskId: string) => void;
}

const BoardView: React.FC<BoardViewProps> = ({
  columnOrder,
  columns,
  filteredTasks,
  isAiSpeaking,
  onUpdateProgress,
  onDeleteTask,
}) => {
  return (
    <motion.div 
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
    >
      {columnOrder.map((columnId, colIndex) => {
        const column = columns[columnId];
        const tasks = column.taskIds
          .filter(taskId => filteredTasks[taskId])
          .map(taskId => filteredTasks[taskId]);

        return (
          <motion.div 
            key={column.id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: colIndex * 0.1,
              duration: 0.5, 
              type: "spring"
            }}
            className="flex flex-col rounded-lg border bg-card/50 backdrop-blur-sm relative overflow-hidden"
          >
            {/* Subtle background gradient animation */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"
              animate={{ 
                background: [
                  "linear-gradient(to bottom right, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))",
                  "linear-gradient(to bottom right, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05))",
                  "linear-gradient(to bottom right, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))"
                ]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            />

            <div className="flex items-center justify-between border-b p-4 relative z-10">
              <h3 className="font-medium">{column.title}</h3>
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                  {tasks.length}
                </Badge>
              </motion.div>
            </div>

            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <motion.div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex-1 overflow-y-auto p-3 transition-all duration-300"
                  style={{ 
                    minHeight: "calc(100vh - 320px)",
                    background: snapshot.isDraggingOver 
                      ? "rgba(59, 130, 246, 0.05)" 
                      : "transparent"
                  }}
                  animate={{ 
                    boxShadow: snapshot.isDraggingOver 
                      ? "inset 0 0 15px rgba(59, 130, 246, 0.1)" 
                      : "inset 0 0 0 rgba(0, 0, 0, 0)",
                    scale: snapshot.isDraggingOver ? 1.02 : 1,
                  }}
                  transition={{
                    scale: { type: "spring", stiffness: 300, damping: 30 }
                  }}
                >
                  {tasks.length === 0 ? (
                    <motion.div 
                      className="flex h-24 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground"
                      animate={{ 
                        opacity: snapshot.isDraggingOver ? 0.9 : [0.7, 0.9, 0.7], 
                        scale: snapshot.isDraggingOver ? 1.05 : 1,
                        borderColor: snapshot.isDraggingOver 
                          ? "rgba(59, 130, 246, 0.4)" 
                          : [
                              "rgba(99, 102, 241, 0.2)",
                              "rgba(139, 92, 246, 0.2)",
                              "rgba(99, 102, 241, 0.2)"
                            ]
                      }}
                      transition={{ 
                        duration: snapshot.isDraggingOver ? 0.2 : 3,
                        repeat: snapshot.isDraggingOver ? 0 : Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      {snapshot.isDraggingOver ? 
                        "Drop here" : 
                        "No tasks"}
                    </motion.div>
                  ) : (
                    tasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <TaskCard
                          task={task}
                          cardStyle="bg-blue/10 border-blue-500/20"
                          index={index}
                          isAiSpeaking={isAiSpeaking}
                          onUpdateProgress={onUpdateProgress}
                          onDeleteTask={onDeleteTask}
                        />
                      </motion.div>
                    ))
                  )}
                  {provided.placeholder}
                </motion.div>
              )}
            </Droppable>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default BoardView; 