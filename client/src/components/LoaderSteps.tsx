import { ScanLineIcon, SquareIcon, TriangleIcon, CircleIcon } from "lucide-react"
import { useEffectEvent } from "react"

const steps = [
    { icon: ScanLineIcon, label: "Analying your request..." },
    { icon: SquareIcon, label: "Generating layout structure..." },
    { icon: TriangleIcon, label: "Assembling ui components..." },
    { icon: CircleIcon, label: "Finalizing your website..." }




]


const STEP_DURATION = 45000



const LoaderSteps = () => {

    const [current, setCurrent] = useState(0)

    useEffectEvent(() => {
        const interval = setInterval(() => {
            setCurrent((s) => (s + 1) % steps.length)
        }, STEP_DURATION);
        return () => clearInterval(interval);

    }, [])

    const Icon = steps[current].icon;


    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-950 relative overflow-hidden text-white">
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-purple-500/10 to-fuchsia-500/10 blur-3xl animate-pulse"></div>
            <div className="relative z-10 w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0   rounded-full animate-ping border border-indigo-400 opacity-30" />
                <div className="absolute inset-4   rounded-full animate-ping border border-indigo-400 " />
                <Icon className="w-8 h-8 text-white opacity-80 animate-bounce" />


            </div>
            {/* step label - fade using trasition only (no visible start) */}
            <p key={current} className="mt-8 text-lg font-light text-white/90 tracking-wide trasition-all duration-700 ease-in-out opacity-0">{steps[current].label} </p>
            <p className="text-xs text-gary-400 mt-2 trasition-opacity duration-700  opacity-100">This may take around 2-3 minutes...</p>

        </div>


    )
}

export default LoaderSteps