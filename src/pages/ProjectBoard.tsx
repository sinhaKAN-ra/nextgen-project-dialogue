
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Calendar, Clock, Plus, Edit, Trash2, MessageCircle, Filter, Search } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";

// Types
interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  priority: "low" | "medium" | "high";
  assignee: {
    name: string;
    avatar?: string;
  };
  comments: number;
}

interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

interface BoardData {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  columnOrder: string[];
}

const initialData: BoardData = {
  tasks: {
    "task-1": {
      id: "task-1",
      title: "Create project requirements doc",
      description: "Document all functional and non-functional requirements",
      deadline: "2023-06-15",
      priority: "high",
      assignee: {
        name: "Alex Chen",
        avatar: undefined,
      },
      comments: 3,
    },
    "task-2": {
      id: "task-2",
      title: "Design user interface",
      description: "Create wireframes and mockups for the main screens",
      deadline: "2023-06-20",
      priority: "medium",
      assignee: {
        name: "Maya Lin",
        avatar: undefined,
      },
      comments: 5,
    },
    "task-3": {
      id: "task-3",
      title: "Implement authentication",
      description: "Add user login and registration functionality",
      deadline: "2023-06-25",
      priority: "high",
      assignee: {
        name: "Sam Park",
        avatar: undefined,
      },
      comments: 2,
    },
    "task-4": {
      id: "task-4",
      title: "Create database schema",
      description: "Design and implement the database structure",
      deadline: "2023-06-18",
      priority: "medium",
      assignee: {
        name: "Jordan Taylor",
        avatar: undefined,
      },
      comments: 1,
    },
    "task-5": {
      id: "task-5",
      title: "Write API documentation",
      description: "Document all API endpoints and parameters",
      deadline: "2023-06-30",
      priority: "low",
      assignee: {
        name: "Avery Johnson",
        avatar: undefined,
      },
      comments: 0,
    },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "To Do",
      taskIds: ["task-1", "task-5"],
    },
    "column-2": {
      id: "column-2",
      title: "In Progress",
      taskIds: ["task-2", "task-3"],
    },
    "column-3": {
      id: "column-3",
      title: "Review",
      taskIds: ["task-4"],
    },
    "column-4": {
      id: "column-4",
      title: "Done",
      taskIds: [],
    },
  },
  columnOrder: ["column-1", "column-2", "column-3", "column-4"],
};

const ProjectBoard: React.FC = () => {
  const [boardData, setBoardData] = useState<BoardData>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium");
  
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

  const addNewTask = () => {
    if (newTaskTitle.trim() === "") return;
    
    // Create new task
    const newTaskId = `task-${Date.now()}`;
    const newTask: Task = {
      id: newTaskId,
      title: newTaskTitle,
      description: newTaskDescription,
      deadline: newTaskDeadline,
      priority: newTaskPriority,
      assignee: {
        name: "Unassigned",
      },
      comments: 0,
    };
    
    // Add to first column
    const firstColumnId = boardData.columnOrder[0];
    const firstColumn = boardData.columns[firstColumnId];
    
    setBoardData({
      ...boardData,
      tasks: {
        ...boardData.tasks,
        [newTaskId]: newTask,
      },
      columns: {
        ...boardData.columns,
        [firstColumnId]: {
          ...firstColumn,
          taskIds: [...firstColumn.taskIds, newTaskId],
        },
      },
    });
    
    // Reset form
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskDeadline("");
    setNewTaskPriority("medium");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/10 text-red-600 hover:bg-red-500/20";
      case "medium": return "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20";
      case "low": return "bg-green-500/10 text-green-600 hover:bg-green-500/20";
      default: return "bg-slate-500/10 text-slate-600 hover:bg-slate-500/20";
    }
  };

  const filteredTasks = searchTerm.trim() === "" 
    ? boardData.tasks 
    : Object.fromEntries(
        Object.entries(boardData.tasks).filter(([_, task]) => 
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      <Header />
      <main className="container mx-auto px-4 py-24">
        <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">Project Board</h1>
            <p className="text-muted-foreground">Manage your tasks with ease</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative flex-1 md:min-w-[260px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="task-title">Title</Label>
                    <Input
                      id="task-title"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Task title"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="task-description">Description</Label>
                    <Input
                      id="task-description"
                      value={newTaskDescription}
                      onChange={(e) => setNewTaskDescription(e.target.value)}
                      placeholder="Task description"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="task-deadline">Deadline</Label>
                    <Input
                      id="task-deadline"
                      type="date"
                      value={newTaskDeadline}
                      onChange={(e) => setNewTaskDeadline(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="task-priority">Priority</Label>
                    <select
                      id="task-priority"
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as "low" | "medium" | "high")}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={addNewTask}>Create Task</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {boardData.columnOrder.map((columnId) => {
              const column = boardData.columns[columnId];
              const tasks = column.taskIds
                .filter(taskId => filteredTasks[taskId])
                .map(taskId => filteredTasks[taskId]);

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
                                  className="mb-3 transition-all hover:shadow-md"
                                >
                                  <CardHeader className="p-3 pb-2">
                                    <div className="flex justify-between">
                                      <Badge className={cn("font-normal", getPriorityColor(task.priority))}>
                                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                                      </Badge>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                            <Edit className="h-3 w-3" />
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-40">
                                          <div className="grid gap-1">
                                            <Button size="sm" variant="ghost" className="justify-start">
                                              <Edit className="mr-2 h-3 w-3" />
                                              Edit
                                            </Button>
                                            <Button size="sm" variant="ghost" className="justify-start text-red-600">
                                              <Trash2 className="mr-2 h-3 w-3" />
                                              Delete
                                            </Button>
                                          </div>
                                        </PopoverContent>
                                      </Popover>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="p-3 pt-0">
                                    <h4 className="mb-1 font-medium">{task.title}</h4>
                                    <p className="mb-3 text-sm text-muted-foreground">{task.description}</p>
                                  </CardContent>
                                  <CardFooter className="flex items-center justify-between p-3 pt-0">
                                    <div className="flex items-center gap-2">
                                      <Avatar className="h-6 w-6">
                                        {task.assignee.avatar && (
                                          <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                                        )}
                                        <AvatarFallback className="text-xs">
                                          {task.assignee.name
                                            .split(' ')
                                            .map(n => n[0])
                                            .join('')}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-xs text-muted-foreground">{task.comments} comments</span>
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                      <Clock className="mr-1 h-3 w-3" />
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
      </main>
    </div>
  );
};

export default ProjectBoard;
