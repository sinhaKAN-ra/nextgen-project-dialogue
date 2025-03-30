import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { ChatMessage } from '../ProjectBoard';

const ChatDrawer: React.FC<{ 
  isChatOpen: boolean; 
  setIsChatOpen: (open: boolean) => void; 
  chatMessages: ChatMessage[]; 
  sendMessage: () => void; 
  currentMessage: string; 
  setCurrentMessage: (message: string) => void; 
  showAiTaskForm: boolean; 
  setShowAiTaskForm: (show: boolean) => void; 
  aiTaskData: any; 
  setAiTaskData: (data: any) => void; 
}> = ({ isChatOpen, setIsChatOpen, chatMessages, sendMessage, currentMessage, setCurrentMessage, showAiTaskForm, setShowAiTaskForm, aiTaskData, setAiTaskData }) => {
  return (
    <Drawer open={isChatOpen} onOpenChange={setIsChatOpen}>
      <DrawerTrigger asChild>
        <Button size="icon" className="bg-white/20 hover:bg-white/30 text-white border-white/20">
          <MessageCircle className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="backdrop-blur-xl bg-gradient-to-b from-black/40 to-black/60 text-slate-100 border-t border-white/10">
        <DrawerHeader className="border-b border-white/10 pb-4">
          <DrawerTitle className="flex items-center gap-3">
            <div className="relative">
              <motion.div 
                className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"
                animate={{ scale: isAiSpeaking ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
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
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                      message.sender === "user"
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
                        className="w-full justify-start text-left font-normal bg-white/20 border-white/20 text-white"
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
  );
};

export default ChatDrawer;