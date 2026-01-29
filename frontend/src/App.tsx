import { useState, useEffect } from 'react';
import { CameraCapture } from './components/CameraCapture';
import { FrontPage } from './components/FrontPage';
import { ResultPage } from './components/ResultPage';
import { initializeClassifier, type PredictionResult } from './services/classifier';
import { saveScan, syncWithBackend } from './services/storage';
import { RefreshCw } from 'lucide-react';

type Screen = 'home' | 'camera' | 'result' | 'history';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [scanResult, setScanResult] = useState<{ result: PredictionResult; imageUri: string } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const speak = (text: string, lang: string) => {
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang;
      utter.rate = 0.95;
      utter.pitch = 1.0;
      synth.cancel();
      synth.speak(utter);
    } catch { void 0 }
  };

  const handleSync = async () => {
    if (navigator.onLine) {
      setIsSyncing(true);
      await syncWithBackend();
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    initializeClassifier();
    const onOnline = () => { void handleSync(); };
    window.addEventListener('online', onOnline);
    if (navigator.onLine) {
      setTimeout(() => { void handleSync(); }, 0);
    }
    return () => { window.removeEventListener('online', onOnline); };
  }, []);

  const handleCapture = (imageUri: string, result: PredictionResult) => {
    setScanResult({ imageUri, result });
    saveScan({
      disease: result.disease,
      confidence: result.confidence,
      imageUri,
      locationName: 'Detected Location'
    });
    setCurrentScreen('result');
    speak(result.disease.treatmentHindi, 'hi-IN');
  };

  const handleBack = () => {
    setScanResult(null);
    setCurrentScreen('camera');
  };

  return (
    <div className="h-screen w-full bg-nature-950 relative overflow-hidden">

      {/* Sync Indicator */}
      <div className="absolute top-4 right-4 z-50 pointer-events-none">
        {isSyncing && (
          <div className="bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 border border-white/10 animate-fade-in">
            <RefreshCw size={12} className="animate-spin" />
            Syncing...
          </div>
        )}
      </div>

      {/* Screens */}
      {currentScreen === 'home' && (
        <FrontPage onStart={() => setCurrentScreen('camera')} />
      )}

      {currentScreen === 'camera' && (
        <CameraCapture onCapture={handleCapture} onError={(err) => alert(err)} />
      )}

      {currentScreen === 'result' && scanResult && (
        <ResultPage
          result={scanResult.result}
          imageUri={scanResult.imageUri}
          onBack={handleBack}
        />
      )}
    </div>
  );
}

export default App;
