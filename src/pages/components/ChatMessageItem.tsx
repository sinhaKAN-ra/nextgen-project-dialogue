import React from "react";
import ReactMarkdown from "react-markdown";
import { TaskDetail } from "../chatUtils";
import styles from "./ChatMessageItem.module.css";

type MessageType = 'text' | 'task_list' | 'task_update' | 'action_request' | 'project_plan_created' | 'task_added_to_plan' | 'task_edited_in_plan' | 'project_plan_finalized' | 'task_history';

import type { Message } from "../SseChat";

import { Zap } from "lucide-react";

const ChatMessageItem: React.FC<Message & { message?: string; onTaskSelect?: (task: TaskDetail) => void; onRequestStatus?: (task: TaskDetail) => void; history?: any[] } & React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const { sender, timestamp, content, type, tasks, task, suggested_replies, message, onTaskSelect, onRequestStatus, history } = props;
  const displayTasks = tasks || [];
  const displayContent = content || message || '';
  const formattedTime = timestamp instanceof Date ? timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : timestamp;

  // Avatar + meta
  const renderAvatar = () => {
    if (sender === "ai") {
      return (
        <div className="flex flex-col items-center gap-1 mr-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-[10px] text-slate-200">PMAI</span>
        </div>
      );
    }
    if (sender === "user") {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center ml-2">
          <span className="text-sm font-semibold text-white">U</span>
        </div>
      );
    }
    return null;
  };

  // Main chat row
  return (
    <div className={`flex items-end gap-4 mb-4 ${sender === "user" ? "justify-end" : "justify-start"}`}>
      {sender === "ai" && renderAvatar()}
      <div className="flex flex-col max-w-[80%]">
        {/* Meta info */}
        <div className="flex items-center gap-2 mb-1">
          {sender === "ai" && <span className="text-xs text-blue-300 font-semibold">PMAI</span>}
          {sender === "user" && <span className="text-xs text-pink-200 font-semibold">You</span>}
          <span className="text-xs text-slate-400">{formattedTime}</span>
        </div>
        {/* Bubble */}
        <div className={[
          styles["chat-message-content"],
          "rounded-xl px-5 py-3 shadow-lg",
          sender === "user"
            ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-none"
            : sender === "ai"
            ? "bg-gradient-to-br from-gray-700 to-gray-800 text-gray-200 rounded-bl-none"
            : ""
        ].join(" ")}>
          {type === 'connection' || sender === 'system' ? (
            <div className={styles["chat-message-notification"]}>
              <span role="img" aria-label="Notification">🔔</span> {displayContent}
            </div>
          ) : type === 'task_list' ? (
            <div className={styles["chat-message-task-list"]}>
              <div className={styles["chat-task-list-title"]}>
                <span role="img" aria-label="Task List">📝</span> Here are your current tasks:
              </div>
              {displayTasks.length === 0 ? (
                <div className={styles["chat-task-list-empty"]}>No tasks to display.</div>
              ) : (
                <div>
                  {displayTasks.map((t) => (
                    <div key={t.id} className={styles["chat-task-list-li"]}>
                      <div>
                        <strong>Task Name:</strong> {t.name} (ID: {t.id})
                      </div>
                      <div><strong>Status:</strong> {t.status || 'N/A'}</div>
                      <div><strong>Assignee:</strong> {t.assignee || t.assignee_name || 'Unassigned'}</div>
                      {t.dueDate && <div><strong>Due:</strong> {t.dueDate}</div>}
                      {t.priority && <div><strong>Priority:</strong> {t.priority}</div>}
                      {t.description && <div><strong>Description:</strong> {t.description}</div>}
                      {onTaskSelect && (
                        <button
                          onClick={() => onTaskSelect(t)}
                          className=" mt-2 px-2 py-1 text-xs text-white bg-gradient-to-br from-[#283048] to-[#859398] rounded-full shadow-sm hover:opacity-90"
                        >
                          Update Status
                        </button>
                      )}
                      {onRequestStatus && (
                        <button
                          onClick={() => onRequestStatus(t)}
                          className=" mt-2 ml-2 px-2 py-1 text-xs text-white bg-gradient-to-br from-[#283048] to-[#859398] rounded-full shadow-sm hover:opacity-90"
                        >
                          Request Status
                        </button>
                      )}
                      <div className={styles["chat-task-divider"]} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : type === 'task_update' && task ? (
            <div className={styles["chat-message-task-update"]}>
              <div>
                <span role="img" aria-label="Task Update">🔄</span> <b>Task Update:</b> {task.name} (ID: {task.id})
              </div>
              <div><strong>Status:</strong> {task.status || 'N/A'}</div>
              <div><strong>Assignee:</strong> {task.assignee || task.assignee_name || 'Unassigned'}</div>
              {task.dueDate && <div><strong>Due:</strong> {task.dueDate}</div>}
              {task.priority && <div><strong>Priority:</strong> {task.priority}</div>}
              {task.description && <div><strong>Description:</strong> {task.description}</div>}
            </div>
          ) : type === 'task_history' && history && task ? (
            <div className={styles["chat-message-task-history"]}>
              <div>
                <span role="img" aria-label="History">📜</span> <b>History for task:</b> {task.name}
              </div>
              {history.length > 0 ? (
                <ul>
                  {history.map((h, i) => (
                    <li key={i} className={styles["chat-task-list-li"]}>
                      <div>
                        <span className="text-xs text-slate-400">
                          {h.ts instanceof Date ? h.ts.toLocaleString() : new Date(h.ts).toLocaleString()}
                        </span> - <strong>{h.status}</strong>{h.by ? ` by ${h.by}` : ''}
                      </div>
                      {h.comment && <div className="ml-4 text-sm">{h.comment}</div>}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={styles["chat-task-list-empty"]}>No history available.</div>
              )}
            </div>
          ) : type === 'action_request' && task ? (
            <div className={styles["chat-message-action-request"] || "flex flex-col"}>
              <div>{displayContent}</div>
              <button
                onClick={() => onTaskSelect && onTaskSelect(task)}
                className="max-w-52 mt-2 px-2 py-1 text-xs text-white bg-gradient-to-br from-[#283048] to-[#859398] rounded-full shadow-sm hover:opacity-90"
              >
                Update Status
              </button>
            </div>
          ) : type === 'project_plan_created' ? (
            <div className={styles["chat-message-notification"]}>
              <span role="img" aria-label="Plan Created">📦</span> <b>Project Plan Created:</b> {displayContent}
            </div>
          ) : type === 'task_added_to_plan' ? (
            <div className={styles["chat-message-notification"]}>
              <span role="img" aria-label="Task Added">🆕</span> {displayContent}
            </div>
          ) : type === 'task_edited_in_plan' ? (
            <div className={styles["chat-message-notification"]}>
              <span role="img" aria-label="Task Edited">✏️</span> {displayContent}
            </div>
          ) : type === 'project_plan_finalized' ? (
            <div className={styles["chat-message-notification"]}>
              <span role="img" aria-label="Plan Finalized">✅</span> <b>Project Plan Finalized:</b> {displayContent}
            </div>
          ) : (
            <ReactMarkdown>{displayContent}</ReactMarkdown>
          )}
        </div>
      </div>
      {sender === "user" && renderAvatar()}
    </div>
  );
};

export default ChatMessageItem;
