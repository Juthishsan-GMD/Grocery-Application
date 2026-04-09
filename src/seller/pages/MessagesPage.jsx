import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { PageHeader, EmptyState } from '../components/sharedComponents';
import { avatarBg } from '../components/shared';

export default function MessagesPage({ messages, setMessages }) {
  const safeMessages = messages || [];
  const [activeMsg, setActiveMsg] = useState(safeMessages[0] || null);
  const [reply, setReply] = useState("");

  const sendReply = () => {
    if (!reply.trim() || !activeMsg) return;
    setMessages(ms => (ms || []).map(m => m.id === activeMsg.id ? { ...m, replies: [...(m.replies || []), reply], unread: false } : m));
    setActiveMsg(m => ({ ...m, replies: [...(m?.replies || []), reply] }));
    setReply("");
  };

  const markRead = (id) => setMessages(ms => (ms || []).map(m => m.id === id ? { ...m, unread: false } : m));

  if (!safeMessages.length) {
    return (
      <div className="flex flex-col gap-5 w-full">
        <PageHeader title="Messages" subtitle="0 unread messages" />
        <EmptyState icon={MessageSquare} title="No messages" sub="Your inbox is empty" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 w-full h-full min-h-[600px]">
      <PageHeader title="Notifications & Messages" subtitle={`${safeMessages.filter(m => m?.unread).length} unread messages`} />
      
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4 h-[600px] lg:h-[700px]">
        {/* Inbox Sidebar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold text-[14px] text-slate-800 dark:text-slate-100 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
            <span>Inbox</span>
            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] px-2 py-0.5 rounded-full">{safeMessages.filter(m => m?.unread).length} New</span>
          </div>
          <div className="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800/50">
            {safeMessages.map(m => m && (
              <div 
                key={m.id} 
                onClick={() => { setActiveMsg(m); markRead(m.id); }} 
                className={`p-4 cursor-pointer transition-colors border-l-4 ${activeMsg?.id === m.id ? "bg-[#c9a14a]/10 border-l-[#10B981]" : "hover:bg-slate-50 dark:hover:bg-slate-800/50 border-l-transparent"}`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0 ${avatarBg(m.avatar || "U")}`}>
                    {m.avatar || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[13px] font-bold text-slate-800 dark:text-slate-200 truncate">{m.customer || "Unknown"}</span>
                      {m.unread && <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />}
                    </div>
                    <div className="text-[11px] text-slate-500">{m.time || ""}</div>
                  </div>
                </div>
                <div className={`text-[12px] truncate ${m.unread ? "text-slate-800 dark:text-slate-200 font-medium" : "text-slate-500 dark:text-slate-400"}`}>
                  {m.message || ""}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-sm">
          {activeMsg ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold text-white shrink-0 ${avatarBg(activeMsg.avatar || "U")}`}>
                  {activeMsg.avatar || "U"}
                </div>
                <div>
                  <div className="font-bold text-[14px] text-slate-800 dark:text-slate-100">{activeMsg.customer || "Unknown"}</div>
                  <div className="text-[12px] text-slate-500">{activeMsg.time || ""}</div>
                </div>
              </div>

              {/* Chat Body */}
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                {/* Customer Message */}
                <div className="self-start max-w-[80%] flex items-end gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 mb-1 ${avatarBg(activeMsg.avatar || "U")}`}>
                    {activeMsg.avatar || "U"}
                  </div>
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 p-3.5 rounded-2xl rounded-bl-sm text-[13px] leading-relaxed shadow-sm">
                    {activeMsg.message || ""}
                  </div>
                </div>
                
                {/* Seller Replies */}
                {(activeMsg.replies || []).map((r, i) => (
                  <div key={i} className="self-end max-w-[80%] flex items-end gap-2 flex-row-reverse">
                    <div className="bg-gradient-to-r flex-1 from-emerald-500 to-emerald-600 text-white p-3.5 rounded-2xl rounded-br-sm text-[13px] leading-relaxed shadow-md">
                      {r}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2.5 bg-white dark:bg-slate-900">
                <input 
                  value={reply} 
                  onChange={e => setReply(e.target.value)} 
                  onKeyDown={e => e.key === "Enter" && sendReply()} 
                  placeholder="Type your reply here..." 
                  className="flex-1 bg-slate-100 dark:bg-slate-800 border-none outline-none rounded-xl px-4 py-3 text-[13px] text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20 transition-shadow" 
                />
                <button 
                  onClick={sendReply} 
                  disabled={!reply.trim()}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-4 py-3 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <Send size={18} className="ml-0.5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <MessageSquare size={48} className="mb-4 opacity-50" />
              <div className="text-[15px] font-medium text-slate-500">Select a conversation to start messaging</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
