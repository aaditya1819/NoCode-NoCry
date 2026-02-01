import { AccountSettingsCards, ChangePasswordCard, DeleteAccountCard } from "@daveyplate/better-auth-ui"
import Footer from "../components/Footer"

export const Settings = () => {
    // Custom class names for better-auth-ui components
    const classNames: any = {
        card: {
            base: 'bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-2xl overflow-hidden mb-8',
            content: 'p-6',
            footer: 'bg-gray-950/50 border-t border-gray-800 p-6 flex justify-end gap-3',
        },
        title: 'text-2xl font-bold text-white mb-2',
        description: 'text-gray-400 text-sm mb-8',
        input: 'bg-gray-950/60 border-gray-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 rounded-xl text-white py-3 px-4 transition-all w-full',
        label: 'text-gray-300 text-sm font-semibold mb-2 block ml-1',
        button: 'bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all active:scale-[0.98] border-0 shadow-lg shadow-indigo-600/20',
    };

    return (
        <main className="min-h-screen relative overflow-hidden bg-[#020617] text-white">
            {/* Background Decorative elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[150px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[150px] -z-10 -translate-x-1/2 translate-y-1/2"></div>

            <div className="max-w-[800px] mx-auto px-6 py-20 relative z-10">
                <header className="mb-16 animate-fade-in">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">Settings</h1>
                    <p className="text-gray-400 mt-4 text-lg">Manage your account settings and preferences.</p>
                </header>

                <div className="space-y-12 transition-all duration-700">
                    <div className="animate-fade-in delay-100">
                        <AccountSettingsCards classNames={classNames} />
                    </div>

                    <div className="animate-fade-in delay-200">
                        <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-white mb-2">Change Password</h2>
                                <p className="text-gray-400 text-sm mb-8">Update your password to keep your account secure.</p>
                                <ChangePasswordCard
                                    classNames={{
                                        base: 'bg-transparent border-0 shadow-none p-0',
                                        input: classNames.input,
                                        label: classNames.label,
                                        button: classNames.button,
                                        footer: 'flex justify-end pt-8'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="animate-fade-in delay-300">
                        <div className="bg-gray-900/40 backdrop-blur-xl border border-red-900/20 rounded-3xl overflow-hidden shadow-2xl">
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-red-500 mb-2">Danger Zone</h2>
                                <p className="text-gray-400 text-sm mb-8">Once you delete your account, there is no going back. Please be certain.</p>
                                <DeleteAccountCard
                                    classNames={{
                                        base: 'bg-transparent border-0 shadow-none p-0',
                                        button: 'bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all active:scale-[0.98] border-0 shadow-lg shadow-red-600/20',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
export default Settings