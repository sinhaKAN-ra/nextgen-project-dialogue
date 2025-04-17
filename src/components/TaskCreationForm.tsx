// TaskCreationForm.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TaskFormData {
  name: string;
  assignee: string;
  dueDate?: Date;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'in progress' | 'completed';
}

interface TaskCreationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: TaskFormData) => void;
  initialData?: Partial<TaskFormData>;
  userOptions: Array<{ id: string; name: string; role: string }>;
}

const TaskCreationForm: React.FC<TaskCreationFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = {},
  userOptions
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    name: '',
    assignee: '',
    dueDate: undefined,
    description: '',
    priority: 'medium',
    status: 'pending'
  });

  // Initialize form with initial data when props change
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  const handleChange = (field: keyof TaskFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="bg-gray-700/90 backdrop-blur-lg text-white border-white/20 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Task Name*</label>
            <Input
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="Enter task name"
              className="bg-gray-700/90 border-gray-600 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Assignee*</label>
            <Select value={formData.assignee} onValueChange={value => handleChange('assignee', value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {userOptions.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Due Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-gray-700 border-gray-600 text-white",
                    !formData.dueDate && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dueDate ? format(formData.dueDate, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                <Calendar
                  mode="single"
                  selected={formData.dueDate}
                  onSelect={(date) => handleChange('dueDate', date)}
                  initialFocus
                  className="bg-gray-800 text-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Priority</label>
            <Select 
              value={formData.priority} 
              onValueChange={value => handleChange('priority', value as 'low' | 'medium' | 'high')}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Set priority" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Description</label>
            <Textarea
              value={formData.description || ''}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Enter task description"
              className="bg-gray-700 border-gray-600 text-white resize-none"
              rows={3}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="bg-white/20 border-white/30 text-white hover:bg-white/30 transition-all rounded-full">
              Cancel
            </Button>
            <Button type="submit" className="px-6 py-2 bg-gradient-to-r from-[#7f5fff] to-[#32c5ff] text-white rounded-full shadow-lg hover:from-[#32c5ff] hover:to-[#ff6fd8] transition-all">
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskCreationForm;