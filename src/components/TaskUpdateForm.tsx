// TaskStatusUpdate.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sendToast } from '@/lib/utils';

interface TaskStatusUpdateProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { status: string; comment: string }) => void;
  taskId: string;
  taskName: string;
  currentStatus: string;
}

const TaskStatusUpdate: React.FC<TaskStatusUpdateProps> = ({
  isOpen,
  onClose,
  onSubmit,
  taskId,
  taskName,
  currentStatus
}) => {
  const [status, setStatus] = useState(currentStatus);
  const [comment, setComment] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!status) {
      sendToast('Please select a status', 'error');
      return;
    }
    onSubmit({ status, comment });
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">Update Task Status</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400">Task</label>
            <p className="text-sm font-medium text-white">{taskName}</p>
            <p className="text-xs text-gray-400">ID: {taskId}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Status*</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="review">Ready for Review</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Status Update Comment</label>
            <Textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Add details about your progress, blockers, or completion..."
              className="bg-gray-700 border-gray-600 text-white resize-none"
              rows={3}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Update Status
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskStatusUpdate;