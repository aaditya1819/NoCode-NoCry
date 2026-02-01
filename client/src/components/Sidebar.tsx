import React, { useRef, useState, useEffect } from 'react'
import type { Message, Project, Version } from '../types'
import { BotIcon, EyeIcon, Loader2Icon, SendIcon, UserIcon, RefreshCcw, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/configs/axios';
import { toast } from 'sonner';

interface SidebarProps {
    isMenuOpen: boolean;
    project: Project,
    setProject: (project: Project) => void;
    isGenerating: boolean;
    setIsGenerating: (isGenerating: boolean) => void
}

const Sidebar = ({ isMenuOpen, project, setProject, isGenerating, setIsGenerating }: SidebarProps) => {
    const messageEndRef = useRef<HTMLDivElement>(null);
    const [input, setInput] = useState('');

    const fetchProject = async () => {
        try {
            const { data } = await api.get(`/api/user/project/${project.id}`)
            setProject(data.project)
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message)
        }
    }

    const handleRollback = async (versionId: string) => {
        try {
            const confirm = window.confirm('Are you sure you want to rollback to this version?')
            if (!confirm) return;
            setIsGenerating(true)
            const { data } = await api.get(`/api/project/rollback/${project.id}/${versionId}`)
            await fetchProject();
            toast.success(data.message)
            setIsGenerating(false)
        } catch (error: any) {
            setIsGenerating(false)
            toast.error(error?.response?.data?.message || error.message)
        }
    }

    const handleRevisons = async (e?: React.FormEvent, customPrompt?: string) => {
        if (e) e.preventDefault();
        const finalInput = customPrompt || input;
        if (!finalInput.trim()) return;

        try {
            setIsGenerating(true)
            setInput('')
            const { data } = await api.post(`/api/project/version/${project.id}`, { message: finalInput })
            await fetchProject();
            toast.success(data.message)
            setIsGenerating(false)
        } catch (error: any) {
            setIsGenerating(false)
            toast.error(error?.response?.data?.message || error.message)
        }
    }

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [project.conversation.length, isGenerating])

    const suggestions = [
        "Make it dark mode",
        "Add a contact section",
        "Make it more colorful",
        "Optimize for mobile"
    ];

    return (
        <div className={`h-full sm:max-w-md bg-gray-900 border-r border-gray-800 transition-all ${isMenuOpen ? 'max-sm:w-0 overflow-hidden' : 'w-full'}`}>
            <div className='flex flex-col h-full'>
                {/* Header */}
                <div className='p-4 border-b border-gray-800 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <div className='size-2 rounded-full bg-green-500 animate-pulse' />
                        <span className='text-xs font-semibold uppercase tracking-wider text-gray-400'>NoCode NoCry AI Active</span>
                    </div>
                </div>

                {/* message container */}
                <div className='flex-1 overflow-y-auto no-scrollbar px-4 py-6 flex flex-col gap-6'>
                    {[...project.conversation, ...project.versions]
                        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).map((message) => {
                            const isMessage = 'content' in message;
                            if (isMessage) {
                                const msg = message as Message;
                                const isUser = msg.role === 'user';
                                return (
                                    <div key={msg.id} className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isUser ? "bg-gray-700" : "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20"}`}>
                                            {isUser ? <UserIcon className='size-4 text-gray-300' /> : <BotIcon className='size-4 text-white' />}
                                        </div>
                                        <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${isUser
                                            ? "bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-900/10"
                                            : "bg-gray-800 text-gray-100 border border-gray-700 rounded-tl-none"
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                )
                            } else {
                                const ver = message as Version;
                                return (
                                    <div key={ver.id} className='px-4 py-3 rounded-2xl bg-gray-800/50 border border-dashed border-gray-700 flex flex-col gap-3'>
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center gap-2 text-xs text-gray-400'>
                                                <RefreshCcw className='size-3' />
                                                <span>Code checkpoint</span>
                                            </div>
                                            <span className='text-[10px] text-gray-500'>{new Date(ver.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                        <div className='flex items-center gap-3'>
                                            {project.current_version_index === ver.id ? (
                                                <button className='flex-1 h-8 rounded-lg text-xs bg-gray-700 text-gray-300 font-medium' disabled>Active Version</button>
                                            ) : (
                                                <button onClick={() => handleRollback(ver.id)} className='flex-1 h-8 rounded-lg text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all font-medium'>Restore</button>
                                            )}
                                            <Link target='_blank' to={`/preview/${project.id}/${ver.id}`} className='shrink-0 h-8 w-8 flex items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors'>
                                                <EyeIcon className='size-4 text-gray-300' />
                                            </Link>
                                        </div>
                                    </div>
                                )
                            }
                        })}

                    {isGenerating && (
                        <div className='flex items-start gap-3'>
                            <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20'>
                                <BotIcon className='size-4 text-white' />
                            </div>
                            <div className='flex gap-1.5 pt-3'>
                                <span className='size-1.5 rounded-full animate-bounce bg-indigo-400' style={{ animationDelay: '0s' }} />
                                <span className='size-1.5 rounded-full animate-bounce bg-indigo-400' style={{ animationDelay: '0.2s' }} />
                                <span className='size-1.5 rounded-full animate-bounce bg-indigo-400' style={{ animationDelay: '0.4s' }} />
                            </div>
                        </div>
                    )}
                    <div ref={messageEndRef} />
                </div>

                {/* Input and Suggestions */}
                <div className='p-4 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm'>
                    {!isGenerating && project.conversation.length > 0 && (
                        <div className='flex gap-2 overflow-x-auto no-scrollbar mb-4'>
                            {suggestions.map((suggest) => (
                                <button
                                    key={suggest}
                                    onClick={() => handleRevisons(undefined, suggest)}
                                    className='shrink-0 px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-[11px] text-gray-400 hover:text-white hover:border-indigo-500 hover:bg-indigo-500/5 transition-all flex items-center gap-1.5'
                                >
                                    <Sparkles className='size-3' />
                                    {suggest}
                                </button>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleRevisons} className='relative'>
                        <textarea
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                            rows={1}
                            placeholder='Ask for changes...'
                            className='w-full p-4 pr-14 rounded-2xl resize-none text-sm outline-none bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-100 placeholder-gray-500 transition-all'
                            style={{ minHeight: '56px', maxHeight: '120px' }}
                            disabled={isGenerating}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleRevisons();
                                }
                            }}
                        />
                        <button
                            disabled={isGenerating || !input.trim()}
                            className="absolute right-2 top-2 p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:bg-gray-700 disabled:text-gray-500 shadow-lg shadow-indigo-600/20"
                            type="submit"
                        >
                            {isGenerating ? <Loader2Icon className='size-5 animate-spin' /> : <SendIcon className='size-5' />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Sidebar