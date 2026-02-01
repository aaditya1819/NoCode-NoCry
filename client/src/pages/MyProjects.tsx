import React, { useEffect, useState } from 'react'
import type { Project } from '../types';
import { Loader2Icon, PlusIcon, TrashIcon, ExternalLink, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import api from '@/configs/axios';
import { toast } from 'sonner';

const MyProjects = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([])
  const navigate = useNavigate()

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/user/projects');
      setProjects(data.projects);
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching my projects:", error);
      toast.error("Failed to load your projects");
      setLoading(false);
    }
  }

  const deleteProject = async (projectId: string) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete this project? This action cannot be undone.");
      if (!confirm) return;

      toast.loading("Deleting project...", { id: 'delete-project' });
      await api.delete(`/api/project/${projectId}`);

      setProjects(prev => prev.filter(p => p.id !== projectId));
      toast.success("Project deleted successfully", { id: 'delete-project' });
    } catch (error: any) {
      console.error("Error deleting project:", error);
      toast.error(error?.response?.data?.message || "Failed to delete project", { id: 'delete-project' });
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return (
    <>
      <div className='px-4 md:px-16 lg:px-24 xl:px-32 bg-gray-950 min-h-screen'>
        {loading ? (
          <div className='flex items-center justify-center h-[80vh]'>
            <Loader2Icon className='size-10 animate-spin text-indigo-500' />
          </div>
        ) : projects.length > 0 ? (
          <div className='pt-10 pb-20'>
            <div className='flex items-center justify-between mb-12'>
              <div>
                <h1 className='text-3xl font-bold text-white'>My Projects</h1>
                <p className='text-gray-400 mt-2'>Manage and edit your AI-generated websites.</p>
              </div>
              <button
                onClick={() => navigate('/')}
                className='flex items-center gap-2 text-white px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all text-sm font-semibold'
              >
                <PlusIcon size={18} />New Project
              </button>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="relative group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 shadow-xl"
                >
                  {/* Mini Preview */}
                  <div
                    className='relative w-full h-44 bg-gray-950 overflow-hidden border-b border-gray-800 cursor-pointer'
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    {project.current_code ? (
                      <iframe
                        srcDoc={project.current_code}
                        sandbox="allow-scripts allow-same-origin"
                        className="absolute top-0 left-0 w-[1200px] h-[800px] origin-top-left pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity"
                        style={{ transform: 'scale(0.3)' }}
                      />
                    ) : (
                      <div className='flex items-center justify-center h-full text-gray-700 bg-gray-900'>
                        <div className="text-center">
                          <Loader2Icon className="size-5 animate-spin mx-auto mb-2 text-gray-800" />
                          <span className="text-[10px] uppercase tracking-widest font-bold">Generating Preview...</span>
                        </div>
                      </div>
                    )}

                    {/* Status Badge */}
                    {project.isPublished && (
                      <div className="absolute top-3 left-3 px-2 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                        Published
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className='p-5'>
                    <h2 className='text-lg font-bold text-white line-clamp-1 mb-1'>{project.name}</h2>
                    <p className='text-gray-500 text-xs line-clamp-1 mb-6'>{project.initial_prompt || "No description"}</p>

                    <div className='flex items-center justify-between pt-4 border-t border-gray-800'>
                      <div className='flex items-center gap-1 text-[10px] text-gray-600 font-medium'>
                        {new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>

                      <div className='flex gap-2'>
                        <button
                          onClick={() => window.open(`/view/${project.id}`, '_blank')}
                          title="View Live"
                          className='p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-all'
                        >
                          <ExternalLink size={16} />
                        </button>
                        <button
                          onClick={() => navigate(`/projects/${project.id}`)}
                          title="Open Editor"
                          className='p-2 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-lg transition-all border border-indigo-500/20'
                        >
                          <Settings size={16} />
                        </button>
                        <button
                          onClick={() => deleteProject(project.id)}
                          title="Delete Project"
                          className='p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all border border-red-500/20'
                        >
                          <TrashIcon size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center h-[80vh] text-center'>
            <div className="size-20 bg-gray-900 rounded-3xl flex items-center justify-center mb-6 border border-gray-800 text-gray-700">
              <PlusIcon className="size-8" />
            </div>
            <h1 className='text-2xl font-bold text-gray-300'>You haven't built anything yet</h1>
            <p className="text-gray-500 mt-2 max-w-xs">Start your first project and watch the AI bring it to life in seconds.</p>
            <button
              onClick={() => navigate('/')}
              className='mt-8 text-white px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all font-bold shadow-lg shadow-indigo-600/20'
            >
              Create New Project
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default MyProjects