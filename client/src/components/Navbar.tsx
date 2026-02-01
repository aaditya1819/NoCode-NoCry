import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { authClient } from '@/lib/auth-client';
import { UserButton } from '@daveyplate/better-auth-ui'
import api from '@/configs/axios';
import { toast } from 'sonner';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const navigate = useNavigate()
  const [credits, setCredits] = useState(0)

  const { data: session } = authClient.useSession();

  const getCredits = async () => {
    try {
      const { data } = await api.get('/api/user/credits')
      setCredits(data.credits)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message)
      console.log(error)
    }
  }

  useEffect(() => {
    if (session?.user) {
      getCredits()
    }
  }, [session?.user])

  return (
    <>
      <nav className="z-50 flex items-center justify-between w-full py-3 px-4 md:px-16 lg:px-24 xl:px-32 backdrop-blur border-b text-white border-slate-800 bg-[#020617]/50">
        <Link to='/'>
          <img src={assets.logo} alt="logo" className='h-8 sm:h-10 active:scale-95 transition-transform object-contain' />
        </Link>

        <div className="hidden md:flex items-center gap-8 transition duration-500">
          <Link to='/' className="hover:text-indigo-400 transition-colors">Home</Link>
          <Link to='/projects' className="hover:text-indigo-400 transition-colors">My Projects</Link>
          <Link to='/community' className="hover:text-indigo-400 transition-colors">Community</Link>
          <Link to='/pricing' className="hover:text-indigo-400 transition-colors">Pricing</Link>
        </div>

        <div className="flex items-center gap-3">
          {!session?.user ? (
            <button onClick={() => navigate('/auth/signin')} className="px-6 py-1.5 max-sm:text-sm bg-indigo-600 active:scale-95 hover:bg-indigo-700 transition rounded">
              Get started
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button className='bg-white/10 px-6 py-1.5 max-sm:text-sm active:scale-95 hover:bg-white/20 transition rounded border border-white/5'>
                Credits : <span className='text-indigo-300'>{credits}</span>
              </button>
              <UserButton size='icon' />
            </div>
          )}
          <button id="open-menu" className="md:hidden active:scale-90 transition" onClick={() => setMenuOpen(true)} >
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16" /><path d="M4 12h16" /><path d="M4 19h16" /></svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 text-white backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300">
          <Link to='/' onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to='/projects' onClick={() => setMenuOpen(false)}>My Projects</Link>
          <Link to='/community' onClick={() => setMenuOpen(false)}>Community</Link>
          <Link to='/pricing' onClick={() => setMenuOpen(false)}>Pricing</Link>

          <button className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-slate-100 hover:bg-slate-200 transition text-black rounded-md flex" onClick={() => setMenuOpen(false)} >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </button>
        </div>
      )}

      <section className="flex flex-col items-center text-white text-sm pb-0 px-4 font-poppins">
        {/* BACKGROUND IMAGE */}
        <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/hero/bg-gradient-2.png" className="absolute inset-0 -z-10 size-full opacity-50" alt="" />
      </section>
    </>
  )
}

export default Navbar
