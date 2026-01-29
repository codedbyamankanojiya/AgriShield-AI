import { MapPin, CloudSun, Wind, Droplets } from 'lucide-react';

interface WeatherWidgetProps {
    className?: string;
}

export function WeatherWidget({ className = '' }: WeatherWidgetProps) {
    // Mock data for now - in a real app would use navigator.geolocation and OpenWeatherMap
    const weatherData = {
        location: "Badlapur",
        temp: "28°C",
        condition: "Sunny",
        humidity: "65%",
        wind: "12km/h"
    };

    return (
        <div className={`w-full max-w-sm mx-auto ${className}`}>
            <div className="bg-nature-950/80 backdrop-blur-md border border-nature-700/30 rounded-3xl p-5 shadow-lg relative overflow-hidden group">
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-nature-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-nature-100">
                        <MapPin size={18} className="text-nature-400" />
                        <span className="font-semibold tracking-wide text-lg">{weatherData.location}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-nature-900/50 px-3 py-1 rounded-full border border-nature-700/30">
                        <CloudSun size={16} className="text-yellow-400" />
                        <span className="text-sm font-medium text-nature-200">{weatherData.temp}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-nature-900/50 border border-nature-700/20 text-blue-400">
                            <Droplets size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] text-nature-400 uppercase font-bold tracking-wider">Humidity</p>
                            <p className="text-sm font-semibold text-white">{weatherData.humidity}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-nature-900/50 border border-nature-700/20 text-gray-400">
                            <Wind size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] text-nature-400 uppercase font-bold tracking-wider">Wind</p>
                            <p className="text-sm font-semibold text-white">{weatherData.wind}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
