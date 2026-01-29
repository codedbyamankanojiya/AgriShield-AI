import { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, Image as ImageIcon, RotateCcw, ScanLine, Leaf } from 'lucide-react';
import { classifyImage, calibrateHealthyLeaf, type PredictionResult } from '../services/classifier';

interface CameraCaptureProps {
    onCapture: (imageUri: string, result: PredictionResult) => void;
    onError: (error: string) => void;
}

export function CameraCapture({ onCapture, onError }: CameraCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const waitForVideoReady = useCallback((video: HTMLVideoElement) => {
        return new Promise<void>((resolve, reject) => {
            if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
                resolve();
                return;
            }
            const onLoaded = () => resolve();
            const onError = () => reject(new Error('Camera not ready'));
            video.addEventListener('loadedmetadata', onLoaded, { once: true });
            video.addEventListener('error', onError, { once: true });
        });
    }, []);

    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                try { await videoRef.current.play(); } catch { void 0; }
            }
        } catch (err) {
            console.error('Camera error:', err);
            onError('Could not access camera. Please allow permissions or use upload.');
        }
    }, [onError]);

    const stopCamera = useCallback(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }, []);

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, [startCamera, stopCamera]);

    const handleCapture = async () => {
        if (!videoRef.current || !canvasRef.current || isProcessing) return;

        setIsProcessing(true);
        try {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            if (video.videoWidth === 0 || video.videoHeight === 0) {
                await waitForVideoReady(video);
            }

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Canvas context not available');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageUri = canvas.toDataURL('image/jpeg');
            const result = await classifyImage(canvas);
            onCapture(imageUri, result);
        } catch (err) {
            console.error('Capture error:', err);
            onError('Failed to capture and analyze image.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsProcessing(true);
        const reader = new FileReader();
        reader.onload = async (e) => {
            const img = new Image();
            img.onload = async () => {
                try {
                    const canvas = canvasRef.current;
                    if (canvas) {
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx?.drawImage(img, 0, 0);
                        const result = await classifyImage(canvas);
                        onCapture(img.src, result);
                    }
                } catch {
                    onError('Failed to analyze uploaded image.');
                } finally {
                    setIsProcessing(false);
                }
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleCalibrate = async () => {
        if (!videoRef.current || !canvasRef.current || isProcessing) return;
        setIsProcessing(true);
        try {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                calibrateHealthyLeaf(canvas);
            }
        } catch {
            onError('Calibration failed.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="relative h-full flex flex-col bg-black overflow-hidden">
            {/* Header Overlay */}
            <div className="absolute top-0 left-0 right-0 z-30 pt-safe-top pb-6 bg-gradient-to-b from-black/90 to-transparent flex justify-between items-start px-6">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs font-mono text-white/80 tracking-widest uppercase">Live Feed</span>
                    </div>
                </div>
                <button
                    onClick={() => { stopCamera(); startCamera(); }}
                    className="p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 active:scale-95 transition-transform"
                >
                    <RotateCcw size={18} className="text-white/80" />
                </button>
            </div>

            {/* Camera View */}
            <div className="flex-1 relative overflow-hidden">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* HUD Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Grid */}
                    <div className="absolute inset-0 opacity-20"
                        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '100px 100px' }}
                    />

                    {/* Focus Frame */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72">
                        <div className="absolute inset-0 border-2 border-nature-400/30 rounded-3xl" />

                        {/* Brackets */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-nature-400 rounded-tl-2xl" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-nature-400 rounded-tr-2xl" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-nature-400 rounded-bl-2xl" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-nature-400 rounded-br-2xl" />

                        {/* Scanning Line */}
                        <div className="absolute inset-x-4 h-0.5 bg-nature-400/80 shadow-[0_0_15px_rgba(74,222,128,0.8)] animate-scan-line top-0" />

                        {isProcessing && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-3xl animate-fade-in">
                                <ScanLine className="w-12 h-12 text-nature-400 animate-pulse" />
                                <span className="mt-2 text-nature-400 font-mono text-xs tracking-widest bg-nature-950/80 px-2 py-1 rounded">ANALYZING</span>
                            </div>
                        )}
                    </div>

                    {/* HUD Footer */}
                    <div className="absolute bottom-32 left-0 right-0 flex justify-center">
                        <span className="bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-nature-500/30 text-nature-300 text-xs font-medium tracking-wide">
                            {isProcessing ? 'Processing Data...' : 'Align Subject Within Frame'}
                        </span>
                    </div>
                </div>

                <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Controls */}
            <div className="relative z-30 pb-safe-bottom bg-black/80 backdrop-blur-xl border-t border-white/10 rounded-t-[2rem] -mt-6">
                <div className="flex items-center justify-around px-8 pt-6 pb-2">
                    {/* Gallery Button */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center gap-1 group"
                        disabled={isProcessing}
                    >
                        <div className="p-4 rounded-full bg-white/5 border border-white/10 group-active:scale-95 transition-all group-hover:bg-white/10">
                            <ImageIcon size={24} className="text-white/70 group-hover:text-white" />
                        </div>
                        <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Upload</span>
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />

                    {/* Shutter Button */}
                    <button
                        onClick={handleCapture}
                        disabled={isProcessing}
                        className="relative group -mt-12"
                    >
                        <div className="absolute inset-0 bg-nature-500 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="w-20 h-20 rounded-full border-4 border-black bg-white flex items-center justify-center p-1 shadow-lg ring-1 ring-white/20 active:scale-95 transition-transform duration-200">
                            <div className="w-full h-full rounded-full border-2 border-stone-200" />
                        </div>
                    </button>

                    {/* Calibrate Button */}
                    <button
                        onClick={handleCalibrate}
                        disabled={isProcessing}
                        className="flex flex-col items-center gap-1 group"
                    >
                        <div className="p-4 rounded-full bg-white/5 border border-white/10 group-active:scale-95 transition-all group-hover:bg-white/10">
                            <Leaf size={24} className="text-white/70 group-hover:text-white" />
                        </div>
                        <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Calibrate</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
