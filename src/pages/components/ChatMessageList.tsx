import React from "react";
import ChatMessageItem from "./ChatMessageItem";
import type { Message } from "../SseChat";
import type { TaskDetail } from "../chatUtils";

interface ChatMessageListProps {
  messages: Message[];
  scrollRef?: React.RefObject<HTMLDivElement>;
  onTaskSelect?: (task: TaskDetail) => void;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, scrollRef, onTaskSelect }) => {
  return (
    <div className="chat-message-list" style={{ flex: 1, overflowY: 'auto' }} ref={scrollRef}>
      {messages.map((msg) => (
        <ChatMessageItem key={msg.id} {...msg} onTaskSelect={onTaskSelect} />
      ))}
    </div>
  );
};

export default ChatMessageList;
