import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ENABLE_CHAT } from '@/config';

const OFFLINE = 'Assistant is offline right now.';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const HelperAIChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hi! I'm Helper AI — Shriram’s intelligent portfolio assistant. You can ask me about his projects, skills, education, or achievements." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    // Listen for custom open event from TechCompanion
    useEffect(() => {
        const handleOpenChat = () => setIsOpen(true);
        window.addEventListener('open-chat', handleOpenChat);
        return () => window.removeEventListener('open-chat', handleOpenChat);
    }, []);

    const handleSend = async () => {
        if (!ENABLE_CHAT || !input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages.map(m => ({ role: m.role, content: m.content }))
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);

                // --- AUTO NAVIGATION & HIGHLIGHT ---
                if (data.navigateTo) {
                    const section = document.getElementById(data.navigateTo);
                    if (section) {
                        // 1. Scroll
                        section.scrollIntoView({ behavior: "smooth", block: "start" });

                        // 2. Add Highlight Class (Auto-Glow the Section)
                        section.classList.add("highlight-section");
                        setTimeout(() => section.classList.remove("highlight-section"), 2000);
                    }
                }

                // --- ADVANCED INTERACTIONS ---
                // If backend wants us to highlight a specific Project Card or Hackathon Card
                if (data.highlightCard) {
                    setTimeout(() => {
                        // Dispatch event for Projects.tsx or others to catch
                        window.dispatchEvent(new CustomEvent('highlight-card', {
                            detail: { id: data.highlightCard }
                        }));
                    }, 800); // Wait for scroll
                }

                // If backend wants us to Open a Modal directly (e.g. "Open that project")
                if (data.openModalId) {
                    setTimeout(() => {
                        window.dispatchEvent(new CustomEvent('trigger-project-view', {
                            detail: { projectId: data.openModalId }
                        }));
                    }, 1000); // Wait for scroll
                }

            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: OFFLINE }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: OFFLINE }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!ENABLE_CHAT) return null;

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-4 pointer-events-none max-w-[calc(100vw-2rem)]">

            {/* Chat Window */}
            <div
                className={cn(
                    "w-[calc(100vw-2rem)] max-w-[350px] md:max-w-none md:w-[400px] h-[480px] sm:h-[500px] bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right pointer-events-auto",
                    isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-10 pointer-events-none hidden"
                )}
            >
                {/* Header */}
                <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 to-orange-600 flex items-center justify-center">
                            <Bot size={18} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm">Helper AI</h3>
                            <p className="text-xs text-green-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                Online
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10"
                        onClick={() => {
                            setIsOpen(false);
                            window.dispatchEvent(new Event('close-chat'));
                        }}
                    >
                        <X size={18} />
                    </Button>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4 bg-transparent">
                    <div className="flex flex-col gap-4">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "flex gap-3 max-w-[85%]",
                                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                        msg.role === 'user' ? "bg-white/10" : "bg-gradient-to-tr from-yellow-500 to-orange-600"
                                    )}
                                >
                                    {msg.role === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
                                </div>

                                <div
                                    className={cn(
                                        "p-3 rounded-2xl text-sm leading-relaxed",
                                        msg.role === 'user'
                                            ? "bg-white/10 text-white rounded-tr-none"
                                            : "bg-[#1A1A1A] border border-white/5 text-gray-200 rounded-tl-none"
                                    )}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex gap-3 max-w-[85%]">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 to-orange-600 flex items-center justify-center shrink-0">
                                    <Bot size={14} className="text-white" />
                                </div>
                                <div className="bg-[#1A1A1A] border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                                    <Loader2 size={16} className="text-yellow-500 animate-spin" />
                                    <span className="text-xs text-muted-foreground">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 bg-white/5 border-t border-white/10">
                    <div className="relative">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about my portfolio..."
                            className="pr-12 bg-black/50 border-white/10 focus-visible:ring-yellow-500/50 text-white placeholder:text-white/30"
                            disabled={isLoading}
                        />
                        <Button
                            size="icon"
                            className={cn(
                                "absolute right-1 top-1 h-8 w-8 transition-all",
                                input.trim() ? "bg-yellow-500 hover:bg-yellow-600 text-black" : "bg-transparent text-white/20 hover:bg-white/5"
                            )}
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                        >
                            <Send size={14} />
                        </Button>
                    </div>
                    <div className="mt-2 text-center">
                        <p className="text-[10px] text-white/20 flex items-center justify-center gap-1">
                            <Sparkles size={10} /> Powered by Llama 3 & Vercel
                        </p>
                    </div>
                </div>
            </div>

            {/* Floating Trigger Button REMOVED - Controlled by TechCompanion */}

        </div>
    );
};

export default HelperAIChat;
