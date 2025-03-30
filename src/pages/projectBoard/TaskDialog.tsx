import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

const TaskDialog: React.FC<{ 
  newTaskTitle: string; 
  setNewTaskTitle: (title: string) => void; 
  newTaskDescription: string; 
  setNewTaskDescription: (description: string) => void; 
  newTaskDeadline: string; 
  setNewTaskDeadline: (deadline: string) => void; 
  newTaskPriority: "low" | "medium" | "high"; 
  setNewTaskPriority: (priority: "low" | "medium" | "high") => void; 
  addNewTask: () => void; 
}> = ({ newTaskTitle, setNewTaskTitle, newTaskDescription, setNewTaskDescription, newTaskDeadline, setNewTaskDeadline, newTaskPriority, setNewTaskPriority, addNewTask }) => {
  return (
    <Dialog>
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
                  className="justify-start text-left font-normal bg-white/10 border-white/20 text-white"
                >
                  <CalendarComponent className="mr-2 h-4 w-4" />
                  {newTaskDeadline ? format(new Date(newTaskDeadline), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-black/80 border-white/10">
                <CalendarComponent
                  mode="single"
                  selected={newTaskDeadline ? new Date(newTaskDeadline) : undefined}
                  onSelect={(date) => {
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
  );
};

export default TaskDialog;