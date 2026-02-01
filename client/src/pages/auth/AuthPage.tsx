import { useParams } from "react-router-dom"
import { AuthView } from "@daveyplate/better-auth-ui"

export default function AuthPage() {
  const { pathname } = useParams();

  return (
    <main className="min-h-[90vh] flex flex-col justify-center items-center relative overflow-hidden bg-gray-950 px-6">
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Logo/Brand Section */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 mb-4 shadow-xl shadow-indigo-500/5">
            <img src="/favicon.svg" alt="logo" className="size-8" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-gray-400 mt-2 text-sm">Sign in to continue building with AI</p>
        </div>

        {/* Auth Card with Glassmorphism */}
        <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-3xl p-2 shadow-2xl shadow-black/50 overflow-hidden">
          <AuthView
            pathname={pathname}
            classNames={{
              base: 'bg-transparent border-0 shadow-none p-4',
              title: 'hidden', // We have our own title above
              description: 'hidden',
              button: 'w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all active:scale-[0.98] border-0 shadow-lg shadow-indigo-600/20',
              input: 'bg-gray-950/50 border-gray-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 rounded-xl text-white py-2.5 px-4 transition-all',
              label: 'text-gray-300 text-xs font-semibold mb-1 ml-1',
              link: 'text-indigo-400 hover:text-indigo-300 transition-colors font-medium',
              footer: 'text-gray-400 text-sm mt-6 border-t border-gray-800/50 pt-6'
            } as any}
          />
        </div>

        {/* Footer Credit */}
        <p className="text-center text-gray-500 text-[10px] mt-8 uppercase tracking-[0.2em]">
          Powered by NoCode NoCry AI
        </p>
      </div>
    </main>
  )
}