import React, { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Calendar, Clock, Plus, Edit, Trash2, MessageCircle, Filter, Search, Send, ChevronRight, Zap, BarChart3, MoreVertical, Calendar as CalendarIcon, XCircle, Check } from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

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
    text: "Hello! I'm PMAI, your Project Management AI assistant. How can I help with your tasks today?",
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
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [showAiTaskForm, setShowAiTaskForm] = useState(false);
  const [aiTaskData, setAiTaskData] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    deadline: ""
  });
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [taskFilter, setTaskFilter] = useState<"all" | "today" | "thisWeek" | "thisMonth" | "overdue" | "future">("all");

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

  const addNewTask = (title = newTaskTitle, description = newTaskDescription, deadline = newTaskDeadline, priority = newTaskPriority) => {
    if (title.trim() === "") return;

    // Create new task
    const newTaskId = `task-${Date.now()}`;
    const newTask: Task = {
      id: newTaskId,
      title,
      description,
      deadline: deadline || format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
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
    setAiTaskData({
      title: "",
      description: "",
      priority: "medium",
      deadline: ""
    });
    setShowAiTaskForm(false);

    // Add AI response about the new task
    const aiResponse: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "ai",
      text: `Great! I've added "${title}" to your To Do list. Need help getting started with this task?`,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, aiResponse]);
    simulateAiSpeaking();
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
    simulateAiSpeaking();
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

  const simulateAiSpeaking = () => {
    setIsAiSpeaking(true);
    setTimeout(() => {
      setIsAiSpeaking(false);
    }, 5000);
  };

  const handleAiTaskSubmit = () => {
    addNewTask(aiTaskData.title, aiTaskData.description, aiTaskData.deadline, aiTaskData.priority);
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
        // Show task creation form
        setShowAiTaskForm(true);

        aiResponse = {
          id: `msg-${Date.now()}`,
          sender: "ai",
          text: "I'd be happy to help you create a task. Please fill out the form I've opened for you.",
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
            deleteTask(taskId);
            return;
          }
        }

        aiResponse = {
          id: `msg-${Date.now()}`,
          sender: "ai",
          text: "I couldn't find that task. Could you specify which task you want to delete?",
          timestamp: new Date(),
        };
      } else {
        aiResponse = {
          id: `msg-${Date.now()}`,
          sender: "ai",
          text: "I'm PMAI, here to help manage your tasks. You can ask me to add or delete tasks, or get updates on your project progress.",
          timestamp: new Date(),
        };
      }

      setChatMessages(prev => [...prev, aiResponse]);
      simulateAiSpeaking();
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

    // Calculate if the task is overdue, due soon, or in the future
    if (taskDate < today) {
      return {
        status: "overdue",
        daysFromNow: Math.ceil(Math.abs(today.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24)),
        color: "bg-red-500",
        left: "0%"
      };
    }

    const diffTime = Math.abs(taskDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > timelineDuration) {
      return {
        status: "future",
        daysFromNow: diffDays,
        color: "bg-indigo-500",
        left: "95%"
      };
    } else if (diffDays < 7) {
      return {
        status: "soon",
        daysFromNow: diffDays,
        color: "bg-amber-500",
        left: `${(diffDays / timelineDuration) * 100}%`
      };
    } else {
      return {
        status: "upcoming",
        daysFromNow: diffDays,
        color: "bg-green-500",
        left: `${(diffDays / timelineDuration) * 100}%`
      };
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

    const getDraggableStyle = (isDragging: boolean, draggableStyle: any) => ({
      // Basic styles for the dragging item
      userSelect: "none",
      // Keep the background visible during dragging
      background: isDragging ? "white" : "transparent",
      // Apply the provided styles without overriding transform
      ...draggableStyle,
      // Enhanced styling for dragging state that doesn't interfere with position
      boxShadow: isDragging 
        ? "0 12px 24px rgba(0, 0, 0, 0.15), 0 6px 12px rgba(59, 130, 246, 0.2)" 
        : "none",
      // Don't modify the transform property as it's crucial for positioning
      // Instead, add a subtle rotation via the motion component
      borderRadius: isDragging ? "8px" : "6px",
      zIndex: isDragging ? 9999 : 1,
      opacity: isDragging ? 0.85 : 1
    });

  const renderTimelineView = () => {
    const today = new Date();
    
    // Mock data for demonstration
    const mockTasks = [
      {
        id: "task-6",
        title: "Prepare project presentation",
        description: "Create slides for the project presentation.",
        deadline: format(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2), "yyyy-MM-dd"),
        priority: "high",
        assignee: { name: "Alex Chen" },
        comments: 0,
        progress: 0,
      },
      {
        id: "task-7",
        title: "Conduct user testing",
        description: "Gather feedback from users on the prototype.",
        deadline: format(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5), "yyyy-MM-dd"),
        priority: "medium",
        assignee: { name: "Maya Lin" },
        comments: 0,
        progress: 0,
      },
      {
        id: "task-8",
        title: "Finalize project report",
        description: "Compile all findings and finalize the report.",
        deadline: format(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10), "yyyy-MM-dd"),
        priority: "low",
        assignee: { name: "Jordan Taylor" },
        comments: 0,
        progress: 0,
      },
    ];

    // Combine existing tasks with mock tasks for demonstration
    const allTasks = { ...filteredTasks, ...mockTasks.reduce((acc, task) => ({ ...acc, [task.id]: task }), {}) };

    // Group tasks by their deadline status
    const groupedTasks = {
      overdue: [] as Task[],
      today: [] as Task[],
      thisWeek: [] as Task[],
      thisMonth: [] as Task[],
      future: [] as Task[],
    };

    Object.values(allTasks).forEach((task: Task) => {
      const position = getTimelinePosition(task.deadline);
      if (position.status === "overdue") {
        groupedTasks.overdue.push(task);
      } else if (position.daysFromNow === 0) {
        groupedTasks.today.push(task);
      } else if (position.daysFromNow < 7) {
        groupedTasks.thisWeek.push(task);
      } else if (position.daysFromNow <= 30) {
        groupedTasks.thisMonth.push(task);
      } else {
        groupedTasks.future.push(task);
      }
    });

    // Sort each group by priority (high > medium > low)
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const sortByPriority = (a: Task, b: Task) => {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    };

    Object.keys(groupedTasks).forEach(key => {
      groupedTasks[key as keyof typeof groupedTasks].sort(sortByPriority);
    });

    // Determine which tasks to display based on the selected filter
    let tasksToDisplay = [];
    switch (taskFilter) {
      case "today":
        tasksToDisplay = groupedTasks.today;
        break;
      case "thisWeek":
        tasksToDisplay = groupedTasks.thisWeek;
        break;
      case "thisMonth":
        tasksToDisplay = groupedTasks.thisMonth;
        break;
      case "future":
        tasksToDisplay = groupedTasks.future;
        break;
      case "overdue":
        tasksToDisplay = groupedTasks.overdue;
        break;
      default:
        tasksToDisplay = [
          ...groupedTasks.overdue,
          ...groupedTasks.today,
          ...groupedTasks.thisWeek,
          ...groupedTasks.thisMonth,
          ...groupedTasks.future,
        ];
        break;
    }

    // Calculate pin position based on the selected filter
    const pinPosition = (() => {
      switch (taskFilter) {
        case "today":
          return "10%"; // Center for today
        case "thisWeek":
          return "25%"; // Example position for this week
        case "thisMonth":
          return "75%"; // Example position for this month
        case "future":
          return "95%"; // Example position for future
        case "overdue":
          return "0%"; // Start for overdue
        case "all":
            return "100%";
        default:
          return "50%"; // Default to center
      }
    })();

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

        {/* Timeline path - curved SVG path */}
        <svg className="w-full h-20" viewBox="0 0 1000 80" preserveAspectRatio="none">
          <path
            d="M0,40 C200,80 300,0 500,40 C700,80 800,0 1000,40"
            stroke="#fff"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
          />
          {/* Pin Point */}
          <circle cx={parseInt(pinPosition) * 10} cy={40} r="5" fill="red" />
        </svg>

        {/* Current Date Indicator */}
        <div className="w-full flex justify-between items-center p-4 rounded-lg shadow-md">
          <span className="text-white text-lg font-semibold">{format(today, "PPP")}</span>
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
              {tasksToDisplay.map((task, index) => renderTaskCard(task, "bg-blue-500/10 border-blue-500/20", index))}
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


 // Add this to your imports if not already present
// import { createPortal } from 'react-dom';

const renderTaskCard = (task: Task, cardStyle: string, index: number) => {
  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided, snapshot) => {
        // The actual card content that will be used both for the original position and the drag preview
        const cardContent = (
          <motion.div
            whileHover={{ 
              scale: snapshot.isDragging ? 1 : 1.03, 
              y: snapshot.isDragging ? 0 : -3,
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
              {/* Card content remains the same */}
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
                {/* Header content remains the same */}
                <div className="flex justify-between">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Badge className={cn("font-normal", getPriorityColor(task.priority))}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </Badge>
                  </motion.div>
                  <div className="flex gap-1">
                    <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 relative overflow-hidden group"
                        onClick={() => updateTaskProgress(task.id, Math.min(100, task.progress + 10))}>
                        <span className="absolute inset-0 bg-blue-500/10 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                        <Edit className="h-3.5 w-3.5 relative z-10" />
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive relative overflow-hidden group"
                        onClick={() => deleteTask(task.id)}>
                        <span className="absolute inset-0 bg-red-500/10 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                        <Trash2 className="h-3.5 w-3.5 relative z-10" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3">
                {/* Content remains the same */}
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
                {/* Footer content remains the same */}
                <div className="flex items-center gap-1.5">
                  <Avatar className="h-5 w-5 relative">
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

        // For the drag preview, use portal to render it outside of the current column
        // This is what makes it visible across columns
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
              opacity: snapshot.isDragging ? 0.5 : 1, // Original becomes semi-transparent
            }}
          >
            {cardContent}
            {snapshot.isDragging && 
              createPortal(
                <div
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    ...provided.draggableProps.style,
                  }}
                >
                  {cardContent}
                </div>,
                document.body
              )
            }
          </div>
        );
      }}
    </Draggable>
  );
};

// Make sure to add the DragDropContext component with proper styles
const renderBoardView = () => (
  <DragDropContext 
    onDragEnd={handleDragEnd}
    onDragStart={() => {
      // You can add global styles or state changes when drag starts
      document.body.style.cursor = 'grabbing';
    }}
    onDragUpdate={(update) => {
      // Optional: handle drag updates
    }}
  >
    <motion.div 
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
    >
      {boardData.columnOrder.map((columnId, colIndex) => {
        const column = boardData.columns[columnId];
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
                        {renderTaskCard(task, "bg-blue/10 border-blue-500/20", index)}
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
  </DragDropContext>
);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-900">
      <Header />
      <main className="container mx-auto px-4 py-20">
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
                  <Button onClick={() => addNewTask()} className="bg-white/20 hover:bg-white/30 text-white">Create Task</Button>
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
                  size="default"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                  onClick={() => setIsChatOpen(true)}
                >
                  <Zap className="h-4 w-4" />
                  <span className="text-xl font-bold bg-clip-text ">
                    Pmai
                  </span> 
                </Button>
              </DrawerTrigger>
              <DrawerContent className="backdrop-blur-xl bg-gradient-to-b from-black/40 to-black/60 text-slate-100 border-t border-white/10">
                <DrawerHeader className="border-b border-white/10 pb-4">
                  <DrawerTitle className="flex items-center gap-3">
                    <div className="relative">
                      <motion.div
                        className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"
                        animate={{ scale: isAiSpeaking ? 1.1 : 1 }} // Pulsing effect
                        transition={{ duration: 0.3, repeat: isAiSpeaking ? Infinity : 0, ease: "easeInOut" }}
                      >
                        <Zap className="h-6 w-6 text-white" />
                      </motion.div>
                      {isAiSpeaking && (
                        <motion.div
                          className="absolute -bottom-1 -right-1 w-3 h-3 bg-purple-900 rounded-full"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [1, 0.7, 1]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">PMAI Assistant</h3>
                      <p className="text-xs text-slate-100">Project Management AI</p>
                    </div>
                    {!isAiSpeaking && (
                      <motion.div
                        className="flex items-center gap-1 ml-2 bg-white/10 px-2 py-1 rounded-full"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs text-white-500">Active</span>
                      </motion.div>
                    )}
                  </DrawerTitle>
                </DrawerHeader>
                <div className="px-4 py-4 flex flex-col h-[calc(100vh-100px)]">
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    <AnimatePresence>
                      {chatMessages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={`flex items-end gap-2 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {message.sender === "ai" && (
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                <Zap className="h-4 w-4 text-white" />
                              </div>
                              <span className="text-[10px] text-slate-200">PMAI</span>
                            </div>
                          )}
                          <motion.div
                            className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${message.sender === "user"
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none"
                                : "bg-gradient-to-r from-white/20 to-white/10 text-slate-100 rounded-bl-none"
                              }`}
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                          >
                            <p className="text-sm">{message.text}</p>
                            <p className="mt-1 text-right text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </motion.div>
                          {message.sender === "user" && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                              <span className="text-sm font-semibold text-white">U</span>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <div ref={messageEndRef} />
                  </div>

                  {showAiTaskForm && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="mb-4 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm rounded-lg border border-white/20 shadow-xl p-4"
                    >
                      <h3 className="text-lg font-medium mb-4 text-white flex items-center">
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Task
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="ai-task-title" className="text-white block mb-1.5">Title</Label>
                          <Input
                            id="ai-task-title"
                            value={aiTaskData.title}
                            onChange={(e) => setAiTaskData(prev => ({ ...prev, title: e.target.value }))}
                            className="bg-white/20 border-white/20 text-white placeholder:text-white/60"
                            placeholder="Enter task title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ai-task-description" className="text-white block mb-1.5">Description</Label>
                          <Input
                            id="ai-task-description"
                            value={aiTaskData.description}
                            onChange={(e) => setAiTaskData(prev => ({ ...prev, description: e.target.value }))}
                            className="bg-white/20 border-white/20 text-white placeholder:text-white/60"
                            placeholder="Enter task description"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ai-task-deadline" className="text-white block mb-1.5">Deadline</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !aiTaskData.deadline && "text-white/60",
                                  "bg-white/20 border-white/20 text-white"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {aiTaskData.deadline ? format(new Date(aiTaskData.deadline), "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-black/80 border-white/20">
                              <CalendarComponent
                                mode="single"
                                selected={aiTaskData.deadline ? new Date(aiTaskData.deadline) : undefined}
                                onSelect={(date) => {
                                  if (date) {
                                    setAiTaskData(prev => ({ ...prev, deadline: format(date, "yyyy-MM-dd") }));
                                  }
                                }}
                                initialFocus
                                className="bg-black/80 text-white"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <Label htmlFor="ai-task-priority" className="text-white block mb-1.5">Priority</Label>
                          <select
                            id="ai-task-priority"
                            value={aiTaskData.priority}
                            onChange={(e) => setAiTaskData(prev => ({ ...prev, priority: e.target.value as "low" | "medium" | "high" }))}
                            className="w-full h-10 rounded-md border border-white/20 bg-white/20 px-3 py-2 text-sm text-white"
                          >
                            <option value="low" className="bg-black text-white">Low</option>
                            <option value="medium" className="bg-black text-white">Medium</option>
                            <option value="high" className="bg-black text-white">High</option>
                          </select>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={() => setShowAiTaskForm(false)}
                            className="flex-1 bg-white/20 hover:bg-white/30 text-white"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => {
                              addNewTask(aiTaskData.title, aiTaskData.description, aiTaskData.deadline, aiTaskData.priority);
                              setShowAiTaskForm(false);
                            }}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Create Task
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex items-center space-x-2 pt-4 border-t border-white/10">
                    <Input
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder="Ask AI to add, update or delete tasks..."
                      className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-full px-6"
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
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-full"
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
    </div>
  );
};

export default ProjectBoard;
