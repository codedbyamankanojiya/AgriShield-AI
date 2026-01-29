import { Camera, Upload, ChevronDown, MessageSquare } from 'lucide-react';
import { WeatherWidget } from './WeatherWidget';
import { ParticleBackground } from './ParticleBackground';

interface FrontPageProps {
    onStart: () => void;
}

export function FrontPage({ onStart }: FrontPageProps) {
    return (
        <div className="min-h-screen w-full bg-black text-white flex flex-col relative overflow-hidden font-sans">
            {/* Background Image */}
            <div className="absolute inset-0 z-0 select-none">
                <img
                    src="/bg.png"
                    alt="Background"
                    className="w-full h-full object-cover opacity-90 animate-fade-in"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />
                <ParticleBackground />
            </div>

            {/* Header */}
            <header className="relative z-10 flex justify-between items-start pt-safe-top px-6 py-6 animate-slide-up">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold leading-none tracking-tight text-white drop-shadow-md">
                        Agri<span className="text-nature-400">Shield-AI</span>
                    </h1>
                </div>

                <button className="flex items-center gap-1 bg-black/40 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-black/60 transition active:scale-95">
                    English <ChevronDown size={14} />
                </button>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-1 flex flex-col items-center pt-12 px-6">

                {/* Scan Button Card */}
                <div className="flex flex-col items-center gap-6 w-full max-w-xs animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <button
                        onClick={onStart}
                        className="group relative w-56 h-56 bg-nature-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 flex flex-col items-center justify-center gap-4 shadow-[0_0_50px_rgba(0,0,0,0.4)] transition-all duration-500 hover:scale-105 active:scale-95 hover:bg-nature-950/60 overflow-hidden"
                    >
                        {/* Scanning Beam */}
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent translate-y-[-100%] group-hover:animate-shimmer transition-opacity" />

                        <div className="absolute top-5 right-5 text-nature-100/50 group-hover:text-nature-400 transition-colors">
                            <LeafIcon className="w-8 h-8 rotate-12" />
                        </div>

                        {/* Camera Icon Container */}
                        <div className="w-24 h-24 bg-white rounded-[1.2rem] flex items-center justify-center shadow-xl group-hover:shadow-nature-500/30 transition-all duration-300 relative z-10">
                            <Camera className="w-12 h-12 text-nature-900" />
                        </div>

                        <div className="text-center relative z-10">
                            <span className="block text-3xl font-bold text-white tracking-wide leading-none drop-shadow-lg">Scan</span>
                            <span className="block text-3xl font-bold text-white tracking-wide leading-none drop-shadow-lg">Plant</span>
                        </div>

                        {/* Corner Brackets */}
                        <div className="absolute top-5 left-5 w-5 h-5 border-t-2 border-l-2 border-white/30 rounded-tl-lg group-hover:border-nature-400/80 transition-colors" />
                        <div className="absolute top-5 right-5 w-5 h-5 border-t-2 border-r-2 border-white/30 rounded-tr-lg group-hover:border-nature-400/80 transition-colors" />
                        <div className="absolute bottom-5 left-5 w-5 h-5 border-b-2 border-l-2 border-white/30 rounded-bl-lg group-hover:border-nature-400/80 transition-colors" />
                        <div className="absolute bottom-5 right-5 w-5 h-5 border-b-2 border-r-2 border-white/30 rounded-br-lg group-hover:border-nature-400/80 transition-colors" />
                    </button>

                    {/* Upload Button */}
                    <button className="flex items-center gap-2 bg-nature-950/60 backdrop-blur-md px-8 py-3.5 rounded-full border border-white/10 text-nature-100 font-medium hover:bg-nature-900 hover:border-nature-500/30 transition-all shadow-lg active:scale-95">
                        <Upload size={18} />
                        Upload Image
                    </button>
                </div>

                {/* Detect Message - Chat style */}
                <div className="w-full max-w-xs flex justify-end mt-auto mb-6 relative animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <div className="bg-nature-950/90 backdrop-blur-md border border-nature-700/30 text-white px-5 py-2.5 rounded-2xl rounded-tr-sm shadow-xl flex items-center gap-3">
                        <span className="text-sm font-medium">Detect Disease</span>
                        <div className="bg-white p-1.5 rounded-lg shadow-inner">
                            <MessageSquare size={14} className="text-nature-900 fill-current" />
                        </div>
                    </div>
                </div>

            </main>

            {/* Bottom Widget */}
            <div className="relative z-10 px-4 pb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <WeatherWidget />
            </div>
        </div>
    );
}

function LeafIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
    )
}
