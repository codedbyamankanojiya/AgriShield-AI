import { Camera, Shield, Leaf, ScanLine } from 'lucide-react';

interface FrontPageProps {
    onStart: () => void;
}

export function FrontPage({ onStart }: FrontPageProps) {
    return (
        <div className="min-h-screen w-full bg-nature-950 text-white flex flex-col items-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-nature-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-nature-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>

            {/* Header */}
            <header className="pt-16 pb-8 flex flex-col items-center gap-4 z-10 animate-fade-in-down">
                <div className="p-4 bg-nature-900/50 rounded-2xl ring-1 ring-nature-700/50 shadow-xl backdrop-blur-md">
                    <Shield className="w-12 h-12 text-nature-400 fill-nature-400/10" />
                </div>
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-br from-white to-nature-200 bg-clip-text text-transparent">
                        AgriShield
                    </h1>
                    <p className="text-nature-300 font-medium tracking-wide uppercase text-xs opacity-90">
                        AI Plant Doctor
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center w-full max-w-md px-6 z-10 gap-12 -mt-10">

                {/* Hero Text */}
                <div className="text-center space-y-4 max-w-xs">
                    <h2 className="text-2xl font-semibold leading-tight text-nature-50">
                        Instant Disease Detection
                    </h2>
                    <p className="text-nature-400/80 text-sm leading-relaxed">
                        Scan your plants with AI to identify diseases and get treatment plans in seconds.
                    </p>
                </div>

                {/* Big Camera Button */}
                <div className="relative group">
                    {/* Pulsing Rings */}
                    <div className="absolute inset-0 bg-nature-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 animate-pulse" />
                    <div className="absolute inset-0 bg-nature-400 rounded-full opacity-10 animate-ping" />

                    <button
                        onClick={onStart}
                        className="relative w-32 h-32 rounded-full bg-gradient-to-tr from-nature-800 to-nature-700 p-2 shadow-2xl shadow-nature-900/50 ring-1 ring-nature-500/30 transition-all duration-300 hover:scale-105 active:scale-95 group-hover:shadow-[0_0_40px_rgba(74,222,128,0.3)]"
                    >
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-nature-900 to-nature-950 flex items-center justify-center border border-nature-600/30 group-hover:border-nature-400/50 transition-colors">
                            <Camera className="w-12 h-12 text-nature-100 drop-shadow-lg group-hover:text-nature-50 transition-colors" />
                        </div>

                        {/* Decorative scanning line in button */}
                        <div className="absolute inset-x-8 h-0.5 bg-nature-400/50 top-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(74,222,128,0.8)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>

                    <p className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-nature-300 font-medium text-sm whitespace-nowrap opacity-80 group-hover:opacity-100 transition-opacity">
                        Tap into Scan
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-2 gap-4 w-full mt-4">
                    <div className="p-4 bg-nature-900/30 rounded-2xl border border-nature-800/50 backdrop-blur-sm flex flex-col items-center gap-2 text-center">
                        <Leaf className="w-6 h-6 text-nature-400" />
                        <span className="text-xs font-medium text-nature-200">99% Accuracy</span>
                    </div>
                    <div className="p-4 bg-nature-900/30 rounded-2xl border border-nature-800/50 backdrop-blur-sm flex flex-col items-center gap-2 text-center">
                        <ScanLine className="w-6 h-6 text-nature-400" />
                        <span className="text-xs font-medium text-nature-200">Instant Results</span>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 text-nature-600 text-xs font-medium z-10">
                Powered by Advanced AI
            </footer>
        </div>
    );
}
