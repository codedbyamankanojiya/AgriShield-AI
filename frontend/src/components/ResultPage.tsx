import { ArrowLeft, Share2, ShieldCheck, AlertTriangle, CheckCircle, Info, Stethoscope, Languages } from 'lucide-react';
import type { PredictionResult } from '../services/classifier';

interface ResultPageProps {
    result: PredictionResult;
    imageUri: string;
    onBack: () => void;
}

export function ResultPage({ result, imageUri, onBack }: ResultPageProps) {
    const isHealthy = result.disease.name.toLowerCase().includes('healthy');
    const confidenceColor = result.confidence > 80 ? 'text-green-400' : 'text-yellow-400';
    const severityColor = result.disease.severity === 'high' ? 'text-red-400' :
        result.disease.severity === 'medium' ? 'text-orange-400' : 'text-green-400';

    return (
        <div className="min-h-screen bg-nature-950 text-white pb-safe animate-slide-up flex flex-col">
            {/* Header Image */}
            <div className="relative h-96 w-full shrink-0">
                <img src={imageUri} alt="Scanned plant" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-nature-950 via-nature-950/40 to-black/30" />

                {/* Navbar */}
                <div className="absolute top-0 left-0 right-0 pt-safe-top pb-4 px-4 flex justify-between items-center z-10">
                    <button
                        onClick={onBack}
                        className="p-3 bg-black/40 backdrop-blur-xl rounded-full text-white hover:bg-black/60 transition border border-white/10"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <button
                        className="p-3 bg-black/40 backdrop-blur-xl rounded-full text-white hover:bg-black/60 transition border border-white/10"
                    >
                        <Share2 size={20} />
                    </button>
                </div>

                {/* Disease Title Overlap */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10 translate-y-8">
                    <div className="glass-modern rounded-3xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-nature-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        <div className="flex justify-between items-start mb-2">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${isHealthy ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                                {isHealthy ? 'Healthy Plant' : 'Issue Detected'}
                            </span>
                            <div className="flex items-center gap-1.5 bg-nature-950/50 px-2 py-1 rounded-lg border border-white/5">
                                <ShieldCheck size={14} className={confidenceColor} />
                                <span className={`text-xs font-bold ${confidenceColor}`}>
                                    {result.confidence.toFixed(0)}% MATCH
                                </span>
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold text-white capitalize leading-tight mb-1 text-glow">
                            {result.disease.name}
                        </h1>
                        <p className="text-nature-300/80 text-sm font-medium flex items-center gap-2">
                            <Languages size={14} />
                            {result.disease.nameHindi}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Scroll */}
            <div className="flex-1 px-6 pt-12 pb-8 space-y-6 overflow-y-auto">

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="glass-panel p-4 rounded-2xl">
                        <span className="block text-[10px] text-nature-400 uppercase tracking-widest font-semibold opacity-60 mb-1">Severity</span>
                        <div className="flex items-center gap-2">
                            <AlertTriangle size={18} className={severityColor} />
                            <span className={`text-lg font-bold capitalize ${severityColor}`}>
                                {result.disease.severity}
                            </span>
                        </div>
                    </div>
                    <div className="glass-panel p-4 rounded-2xl">
                        <span className="block text-[10px] text-nature-400 uppercase tracking-widest font-semibold opacity-60 mb-1">Action</span>
                        <div className="flex items-center gap-2">
                            <CheckCircle size={18} className="text-nature-300" />
                            <span className="text-lg font-bold text-white">Required</span>
                        </div>
                    </div>
                </div>

                {/* Treatment Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <Stethoscope className="text-nature-400" size={20} />
                        <h2 className="text-lg font-bold text-white">Recommended Treatment</h2>
                    </div>

                    <div className="glass-panel p-5 rounded-2xl space-y-4">
                        <div>
                            <p className="text-nature-100/90 leading-relaxed text-sm">
                                {result.disease.treatment}
                            </p>
                        </div>

                        <div className="w-full h-px bg-white/5" />

                        <div>
                            <span className="text-[10px] font-bold text-nature-500 uppercase tracking-wider mb-2 block opacity-80">Hindi Translation</span>
                            <p className="text-nature-200/90 leading-relaxed text-sm font-medium">
                                {result.disease.treatmentHindi}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Info Note */}
                <div className="flex gap-3 p-4 rounded-xl bg-nature-900/30 border border-nature-800/50">
                    <Info className="shrink-0 text-nature-500" size={20} />
                    <p className="text-xs text-nature-400/70 leading-relaxed">
                        AI analysis gives a high-probability diagnosis. Always consult an agricultural expert for critical crop decisions.
                    </p>
                </div>
            </div>
        </div>
    );
}
