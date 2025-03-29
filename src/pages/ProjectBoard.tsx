
import React, { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Calendar, Clock, Plus, Edit, Trash2, MessageCircle, Filter, Search, Send, ChevronRight, Zap, BarChart3, MoreVertical, Calendar as CalendarIcon, XCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import { format } from "date-fns";

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
  progress: number;
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

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
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
      progress: 20,
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
      progress: 65,
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
      progress: 45,
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
      progress: 80,
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
      progress: 10,
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

const initialChatMessages: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "ai",
    text: "Hello! I'm your AI project assistant. How can I help with your tasks today?",
    timestamp: new Date(Date.now() - 60000),
  },
];

const ProjectBoard: React.FC = () => {
  const [boardData, setBoardData] = useState<BoardData>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTimelineView, setIsTimelineView] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

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
      deadline: newTaskDeadline || format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
      priority: newTaskPriority,
      assignee: {
        name: "Unassigned",
      },
      comments: 0,
      progress: 0,
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
    setSelectedDate(undefined);

    // Add AI response about the new task
    const aiResponse: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "ai",
      text: `Great! I've added "${newTaskTitle}" to your To Do list. Need help getting started with this task?`,
      timestamp: new Date(),
    };
    
    setChatMessages(prev => [...prev, aiResponse]);
  };

  const deleteTask = (taskId: string) => {
    // Find which column contains the task
    let columnId = "";
    for (const [colId, column] of Object.entries(boardData.columns)) {
      if (column.taskIds.includes(taskId)) {
        columnId = colId;
        break;
      }
    }

    if (!columnId) return;

    // Create a copy of the column and remove the task
    const column = boardData.columns[columnId];
    const newTaskIds = column.taskIds.filter(id => id !== taskId);

    // Create a copy of the tasks object without the deleted task
    const { [taskId]: _, ...remainingTasks } = boardData.tasks;

    // Update the state
    setBoardData({
      ...boardData,
      tasks: remainingTasks,
      columns: {
        ...boardData.columns,
        [columnId]: {
          ...column,
          taskIds: newTaskIds,
        },
      },
    });

    // Add AI response about the deleted task
    const aiResponse: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "ai",
      text: `I've deleted the task as requested. Is there anything else you need?`,
      timestamp: new Date(),
    };
    
    setChatMessages(prev => [...prev, aiResponse]);
  };

  const updateTaskProgress = (taskId: string, progress: number) => {
    setBoardData({
      ...boardData,
      tasks: {
        ...boardData.tasks,
        [taskId]: {
          ...boardData.tasks[taskId],
          progress,
        },
      },
    });
  };

  const sendMessage = () => {
    if (currentMessage.trim() === "") return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: currentMessage,
      timestamp: new Date(),
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");

    // Process user message and generate AI response
    setTimeout(() => {
      let aiResponse: ChatMessage;
      
      // Check if message contains certain keywords
      const lowerMessage = currentMessage.toLowerCase();
      
      if (lowerMessage.includes("add task") || lowerMessage.includes("create task")) {
        // Extract task details using simple parsing
        const taskTitle = lowerMessage.includes("called") 
          ? lowerMessage.split("called")[1].split(" with")[0].trim()
          : "New Task";
          
        const priority = lowerMessage.includes("high priority") 
          ? "high" 
          : lowerMessage.includes("low priority") 
            ? "low" 
            : "medium";
        
        // Create a new task
        const newTaskId = `task-${Date.now()}`;
        const newTask: Task = {
          id: newTaskId,
          title: taskTitle,
          description: "AI generated task",
          deadline: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
          priority,
          assignee: {
            name: "Unassigned",
          },
          comments: 0,
          progress: 0,
        };
        
        // Add to first column
        const firstColumnId = boardData.columnOrder[0];
        const firstColumn = boardData.columns[firstColumnId];
        
        setBoardData(prev => ({
          ...prev,
          tasks: {
            ...prev.tasks,
            [newTaskId]: newTask,
          },
          columns: {
            ...prev.columns,
            [firstColumnId]: {
              ...firstColumn,
              taskIds: [...firstColumn.taskIds, newTaskId],
            },
          },
        }));
        
        aiResponse = {
          id: `msg-${Date.now()}`,
          sender: "ai",
          text: `I've added a new ${priority} priority task "${taskTitle}" to your To Do list.`,
          timestamp: new Date(),
        };
      } else if (lowerMessage.includes("delete") && lowerMessage.includes("task")) {
        // Find task by title (simplified approach)
        const taskTitle = Object.values(boardData.tasks)
          .find(task => lowerMessage.toLowerCase().includes(task.title.toLowerCase()))?.title;
          
        if (taskTitle) {
          const taskId = Object.entries(boardData.tasks)
            .find(([_, task]) => task.title === taskTitle)?.[0];
            
          if (taskId) {
            // Delegate to the delete task function
            deleteTask(taskId);
            return; // The deleteTask function already adds an AI response
          }
        }
        
        aiResponse = {
          id: `msg-${Date.now()}`,
          sender: "ai",
          text: "I couldn't find that task. Could you specify which task you want to delete?",
          timestamp: new Date(),
        };
      } else if (lowerMessage.includes("progress") || lowerMessage.includes("update")) {
        aiResponse = {
          id: `msg-${Date.now()}`,
          sender: "ai",
          text: "To update a task's progress, you can drag it to a different column or use the progress slider on the task card.",
          timestamp: new Date(),
        };
      } else {
        aiResponse = {
          id: `msg-${Date.now()}`,
          sender: "ai",
          text: "I'm here to help manage your tasks. You can ask me to add or delete tasks, or get updates on your project progress.",
          timestamp: new Date(),
        };
      }
      
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/10 text-red-600 hover:bg-red-500/20";
      case "medium": return "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20";
      case "low": return "bg-green-500/10 text-green-600 hover:bg-green-500/20";
      default: return "bg-slate-500/10 text-slate-600 hover:bg-slate-500/20";
    }
  };

  const getTimelinePosition = (deadline: string) => {
    const today = new Date();
    const taskDate = new Date(deadline);
    const timelineDuration = 30; // 30 days timeline
    
    const diffTime = Math.abs(taskDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (taskDate < today) {
      return { left: "0%", color: "bg-red-500" };
    } else if (diffDays > timelineDuration) {
      return { left: "95%", color: "bg-green-500" };
    } else {
      const percentage = (diffDays / timelineDuration) * 100;
      return { left: `${percentage}%`, color: diffDays < 7 ? "bg-amber-500" : "bg-green-500" };
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

  const renderTimelineView = () => {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    const timelineMarkers = [];
    for (let i = 0; i <= 4; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i * 7);
      const left = `${(i * 7 / 30) * 100}%`;
      
      timelineMarkers.push(
        <div key={`marker-${i}`} className="absolute -top-6" style={{ left }}>
          <div className="text-xs text-muted-foreground whitespace-nowrap">
            {i === 0 ? 'Today' : `+${i * 7} days`}
          </div>
          <div className="h-6 w-px bg-border absolute top-5 left-0"></div>
        </div>
      );
    }
    
    return (
      <div className="my-8 space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Timeline View</h2>
          <Button variant="outline" size="sm" onClick={() => setIsTimelineView(false)}>
            Switch to Board View
          </Button>
        </div>
        
        <div className="relative pt-8 pb-16">
          {/* Timeline base */}
          <div className="h-1 w-full bg-secondary rounded-full relative">
            {timelineMarkers}
          </div>
          
          {/* Task markers */}
          {Object.values(filteredTasks).map(task => {
            const { left, color } = getTimelinePosition(task.deadline);
            return (
              <div 
                key={task.id} 
                className="absolute transform -translate-y-1/2"
                style={{ left, top: "30px" }}
              >
                <Popover>
                  <PopoverTrigger asChild>
                    <button 
                      className={`w-5 h-5 rounded-full ${color} border-2 border-background shadow-md hover:scale-125 transition-transform z-10`}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <Card>
                      <CardHeader className="p-3 pb-0">
                        <div className="flex justify-between items-start">
                          <Badge className={cn("font-normal", getPriorityColor(task.priority))}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
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
                        <h4 className="font-medium mb-1">{task.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{task.progress}%</span>
                          </div>
                          <Progress value={task.progress} />
                        </div>
                      </CardContent>
                      <CardFooter className="p-3 pt-0 flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-[10px]">
                              {task.assignee.name
                                .split(' ')
                                .map(n => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{task.assignee.name}</span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{new Date(task.deadline).toLocaleDateString()}</span>
                        </div>
                      </CardFooter>
                    </Card>
                  </PopoverContent>
                </Popover>
                <div className="absolute w-36 mt-3 -ml-16 text-center">
                  <span className="text-xs font-medium truncate block">{task.title}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(task.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(filteredTasks).map(task => (
            <Card key={task.id} className="hover:shadow-md transition-shadow overflow-hidden border-l-4" 
              style={{ borderLeftColor: task.priority === 'high' ? 'rgb(239, 68, 68)' : task.priority === 'medium' ? 'rgb(245, 158, 11)' : 'rgb(34, 197, 94)' }}>
              <CardHeader className="p-4 pb-0">
                <div className="flex justify-between">
                  <h3 className="font-medium">{task.title}</h3>
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
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{task.progress}%</span>
                  </div>
                  <Progress value={task.progress} className="h-2" />
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <div className="flex items-center gap-1.5">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {task.assignee.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs">{task.assignee.name}</span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{new Date(task.deadline).toLocaleDateString()}</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderBoardView = () => (
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
                              className="mb-3 transition-all hover:shadow-md overflow-hidden border-l-4"
                              style={{ 
                                ...provided.draggableProps.style,
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
                                    <AvatarFallback className="text-xs">
                                      {task.assignee.name
                                        .split(' ')
                                        .map(n => n[0])
                                        .join('')}
                                    </AvatarFallback>
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

  return (
    <div className="min-h-screen bg-[conic-gradient(at_left,_var(--tw-gradient-stops))] from-rose-500 to-indigo-700 bg-blend-soft-light">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xl" />
      
      <Header />
      
      <main className="container relative z-10 mx-auto px-4 py-20">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-white">Project Vision Board</h1>
            <p className="text-white/70">Visualize your project's journey with AI assistance</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative max-w-sm flex-1 md:min-w-[260px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-white/20 hover:bg-white/30 text-white border-white/10">
                  <Plus className="mr-2 h-4 w-4" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md backdrop-blur-xl bg-black/50 border-white/10 text-white">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="task-title" className="text-white">Title</Label>
                    <Input
                      id="task-title"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Task title"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="task-description" className="text-white">Description</Label>
                    <Input
                      id="task-description"
                      value={newTaskDescription}
                      onChange={(e) => setNewTaskDescription(e.target.value)}
                      placeholder="Task description"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="task-deadline" className="text-white">Deadline</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !selectedDate && "text-white/40",
                            "bg-white/10 border-white/20 text-white"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-black/80 border-white/10">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            if (date) {
                              setNewTaskDeadline(format(date, "yyyy-MM-dd"));
                            }
                          }}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="task-priority" className="text-white">Priority</Label>
                    <select
                      id="task-priority"
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as "low" | "medium" | "high")}
                      className="flex h-10 w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="low" className="bg-black text-white">Low</option>
                      <option value="medium" className="bg-black text-white">Medium</option>
                      <option value="high" className="bg-black text-white">High</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={addNewTask} className="bg-white/20 hover:bg-white/30 text-white">Create Task</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button 
              onClick={() => setIsTimelineView(!isTimelineView)}
              variant="outline" 
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              {isTimelineView ? (
                <>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Board View
                </>
              ) : (
                <>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Timeline View
                </>
              )}
            </Button>
            
            <Drawer>
              <DrawerTrigger asChild>
                <Button 
                  size="icon" 
                  className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                  onClick={() => setIsChatOpen(true)}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="backdrop-blur-xl bg-black/70 text-white border-t border-white/10">
                <DrawerHeader className="border-b border-white/10 pb-4">
                  <DrawerTitle className="flex items-center">
                    <Zap className="mr-2 h-5 w-5 text-blue-400" />
                    AI Project Assistant
                  </DrawerTitle>
                </DrawerHeader>
                <div className="px-4 pb-2">
                  <div className="h-[40vh] overflow-y-auto py-4 space-y-4">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-xl px-4 py-2 ${
                            message.sender === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-white/10 text-white"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className="mt-1 text-right text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messageEndRef} />
                  </div>
                  <div className="flex items-center space-x-2 pt-4">
                    <Input
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder="Ask AI to add, update or delete tasks..."
                      className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <Button 
                      onClick={sendMessage}
                      size="icon"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>

        <div className="mt-8 bg-white/5 backdrop-blur-md shadow-xl rounded-xl overflow-hidden border border-white/10">
          <div className="p-6">
            {isTimelineView ? renderTimelineView() : renderBoardView()}
          </div>
        </div>
      </main>
      
      <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
        <SheetContent className="w-[400px] sm:max-w-md backdrop-blur-xl bg-black/70 text-white border-l border-white/10">
          <SheetHeader className="border-b border-white/10 pb-4">
            <SheetTitle className="flex items-center">
              <Zap className="mr-2 h-5 w-5 text-blue-400" />
              AI Project Assistant
            </SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100vh-180px)] flex flex-col">
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-2 ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="mt-1 text-right text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>
            <div className="flex items-center space-x-2 pt-4 border-t border-white/10 mt-auto">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Ask AI to add, update or delete tasks..."
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button 
                onClick={sendMessage}
                size="icon"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ProjectBoard;
