import React, { useState, useEffect } from 'react';
import { Mail, Phone, User, Clock, Trash2, CheckCircle, Circle, RefreshCcw } from 'lucide-react';

const MessagesSection = ({ isHe }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchMessages = async () => {
        setIsRefreshing(true);
        try {
            const res = await fetch('/api/messages');
            const data = await res.json();
            // Upstash returns them in order, we use reverse() so newest are on top
            setMessages(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch messages:", err);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    const toggleRead = async (id, currentStatus) => {
        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isRead: !currentStatus })
            });
            if (res.ok) fetchMessages();
        } catch (err) {
            alert(isHe ? 'שגיאה בעדכון' : 'Update failed');
        }
    };

    const deleteMessage = async (id) => {
        const confirmText = isHe ? 'האם למחוק את ההודעה לצמיתות?' : 'Delete this message permanently?';
        if (!window.confirm(confirmText)) return;

        try {
            const res = await fetch('/api/messages', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (res.ok) fetchMessages();
        } catch (err) {
            alert(isHe ? 'שגיאה במחיקה' : 'Delete failed');
        }
    };

    useEffect(() => { fetchMessages(); }, []);

    if (loading) return (
        <div className="p-20 text-center animate-pulse text-slate-400">
            {isHe ? 'טוען הודעות...' : 'Loading messages...'}
        </div>
    );

    return (
        <div className="space-y-6" dir={isHe ? 'rtl' : 'ltr'}>
            <div className="flex justify-between items-center px-2">
                <div>
                    <h2 className="text-2xl font-black text-slate-800">{isHe ? 'הודעות נכנסות' : 'Inbound Messages'}</h2>
                    <p className="text-sm text-slate-500">{messages.length} {isHe ? 'הודעות במערכת' : 'total messages'}</p>
                </div>
                <button
                    onClick={fetchMessages}
                    className={`p-2 rounded-full hover:bg-slate-100 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
                >
                    <RefreshCcw size={20} className="text-slate-400" />
                </button>
            </div>

            {messages.length === 0 ? (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center text-slate-400">
                    {isHe ? 'אין הודעות חדשות' : 'No new messages.'}
                </div>
            ) : (
                <div className="grid gap-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`group relative p-6 rounded-3xl border transition-all duration-300 ${
                                msg.isRead 
                                ? 'bg-slate-50/50 border-slate-100 opacity-75' 
                                : 'bg-white border-blue-100 shadow-sm hover:shadow-md'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => toggleRead(msg.id, msg.isRead)}
                                        className={`transition-colors ${msg.isRead ? 'text-green-500' : 'text-blue-500 hover:text-blue-600'}`}
                                    >
                                        {msg.isRead ? <CheckCircle size={28} fill="currentColor" className="text-white fill-green-500" /> : <Circle size={28} />}
                                    </button>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg">{msg.name}</h4>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <Clock size={12} />
                                            {new Date(msg.timestamp).toLocaleString(isHe ? 'he-IL' : 'en-US')}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => deleteMessage(msg.id)}
                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                <a href={`mailto:${msg.email}`} className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50/50 px-3 py-2 rounded-xl hover:bg-blue-100 transition-colors">
                                    <Mail size={14} /> {msg.email}
                                </a>
                                <a href={`tel:${msg.phone}`} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100/50 px-3 py-2 rounded-xl hover:bg-slate-200 transition-colors">
                                    <Phone size={14} /> {msg.phone}
                                </a>
                            </div>

                            <div className="bg-slate-100/80 p-4 rounded-2xl text-slate-700 text-sm leading-relaxed">
                                {msg.message || (isHe ? '(הודעה ריקה)' : '(Empty message)')}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MessagesSection;