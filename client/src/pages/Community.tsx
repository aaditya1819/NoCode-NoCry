import React, { useEffect, useState } from 'react'
import type { Project } from '../types';
import { Loader2Icon, PlusIcon, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import api from '@/configs/axios';
import { toast } from 'sonner';

const Community = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  const fetchPublishedProjects = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/project/published');
      setProjects(data.projects);
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching community projects:", error);
      toast.error("Failed to load community projects");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishedProjects();
  }, []);

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
                <h1 className='text-3xl font-bold text-white'>Community Showcase</h1>
                <p className='text-gray-400 mt-2'>Stunning websites built by our community using AI.</p>
              </div>
              <button
                onClick={() => navigate('/')}
                className='flex items-center gap-2 text-white px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all text-sm font-semibold'
              >
                <PlusIcon size={18} />Build Yours
              </button>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="relative group cursor-pointer bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 shadow-xl"
                >
                  {/* Mini Preview */}
                  <div
                    className='relative w-full h-48 bg-gray-950 overflow-hidden border-b border-gray-800'
                    onClick={() => window.open(`/view/${project.id}`, '_blank')}
                  >
                    {project.current_code ? (
                      <iframe
                        title={`Preview of ${project.name}`}
                        srcDoc={project.current_code}
                        sandbox="allow-scripts allow-same-origin"
                        className="absolute top-0 left-0 w-[1200px] h-[800px] origin-top-left pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity"
                        style={{ transform: 'scale(0.3)' }}
                      />
                    ) : (
                      <div className='flex items-center justify-center h-full text-gray-700 bg-gray-900'>
                        <span className="text-xs uppercase tracking-widest font-bold">No Preview Available</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-colors" />
                  </div>

                  {/* Content */}
                  <div className='p-5'>
                    <div className='flex items-start justify-between gap-2'>
                      <h2 className='text-lg font-bold text-white line-clamp-1 group-hover:text-indigo-400 transition-colors'>{project.name}</h2>
                      <span className='shrink-0 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md'>HTML5</span>
                    </div>

                    <p className='text-gray-500 mt-2 text-xs line-clamp-2 h-8 leading-relaxed'>{project.initial_prompt || "Built with NoCode NoCry AI"}</p>

                    <div className='flex justify-between items-center mt-6 pt-4 border-t border-gray-800'>
                      <div className='flex items-center gap-2'>
                        <div className='size-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white border border-white/10'>
                          {project.user?.name?.slice(0, 1).toUpperCase() || 'A'}
                        </div>
                        <span className='text-xs font-medium text-gray-400 group-hover:text-gray-200 transition-colors'>
                          {project.user?.name || 'Anonymous Creator'}
                        </span>
                      </div>
                      <ExternalLink className="size-4 text-gray-600 group-hover:text-indigo-400 transition-colors" />
                    </div>
                  </div>

                  {/* View Overlay */}
                  <div
                    onClick={() => window.open(`/view/${project.id}`, '_blank')}
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-indigo-600/5 transition-opacity pointer-events-none"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center h-[80vh] text-center'>
            <div className="size-20 bg-gray-900 rounded-3xl flex items-center justify-center mb-6 border border-gray-800">
              <PlusIcon className="size-8 text-gray-700" />
            </div>
            <h1 className='text-2xl font-bold text-gray-300'>No published projects yet</h1>
            <p className="text-gray-500 mt-2 max-w-xs">Be the first to publish a masterpiece to the community!</p>
            <button
              onClick={() => navigate('/')}
              className='mt-8 text-white px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all font-bold shadow-lg shadow-indigo-600/20'
            >
              Start Generating
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Community;