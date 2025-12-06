
import React, { useState, useEffect, useRef } from 'react';
import WatchFace from './components/WatchFace';
import { WatchState, ThemeConfig } from './types';
import { generateCharacterQuote } from './services/geminiService';
import { DEFAULT_BG_IMAGE, DEFAULT_QUOTE } from './constants';
import { SpiderLilyIcon, WeatherIcon, StepsIcon, HeartRateIcon, MessageIcon, BatteryIcon, WatchBezelIcon } from './components/Icons';
import JSZip from 'jszip';
import saveAs from 'file-saver';

const App: React.FC = () => {
  const [isAOD, setIsAOD] = useState(false);
  const [bgImage, setBgImage] = useState(DEFAULT_BG_IMAGE);
  const [currentQuote, setCurrentQuote] = useState(DEFAULT_QUOTE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [generatedAssets, setGeneratedAssets] = useState<{name: string, url: string, type: string}[]>([]);
  
  // New Scaling State
  const [bezelScale, setBezelScale] = useState(0.95);
  const [iconScale, setIconScale] = useState(1.0);

  // Watch State Simulation
  const [watchState, setWatchState] = useState<WatchState>({
    isAOD: false,
    batteryLevel: 82,
    heartRate: 75,
    steps: 4329,
    date: new Date(),
    weatherTemp: 24,
    weatherCondition: 'Cloudy',
    notificationCount: 3,
  });

  // Ticking Clock & Simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setWatchState(prev => {
        const newDate = new Date();
        const newNotifs = newDate.getSeconds() % 30 === 0 
           ? Math.floor(Math.random() * 5) 
           : prev.notificationCount;

        return {
            ...prev,
            date: newDate,
            heartRate: prev.isAOD ? 70 : 70 + Math.floor(Math.random() * 10 - 5),
            notificationCount: newNotifs,
            steps: prev.steps + (Math.random() > 0.8 ? 1 : 0)
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setWatchState(prev => ({ ...prev, isAOD }));
  }, [isAOD]);

  const handleGenerateQuote = async () => {
    setIsGenerating(true);
    const quote = await generateCharacterQuote("Phrolova from Wuthering Waves");
    setCurrentQuote(quote);
    setIsGenerating(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setBgImage(url);
    }
  };

  // --- ASSET EXPORT LOGIC ---

  const generateDigitAsset = (
    num: number, 
    fontSize: string, 
    color: string, 
    shadow: boolean,
    width: number,
    height: number,
    fontFamily: string = 'Cinzel'
  ): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(null);

      // Wait for font to be ready
      document.fonts.load(`${fontSize} ${fontFamily}`).then(() => {
        ctx.clearRect(0, 0, width, height);
        
        ctx.font = `${fontSize} ${fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        if (shadow) {
            ctx.shadowColor = 'rgba(0,0,0,0.9)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetY = 4;
        }

        ctx.fillStyle = color;
        // Adjust y-position slightly for better visual centering of numbers
        ctx.fillText(num.toString(), width / 2, height / 2 + (height * 0.05)); 
        
        canvas.toBlob(resolve, 'image/png');
      });
    });
  };

  const generateSvgAsset = (elementId: string): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const originalSvg = document.getElementById(elementId);
      if (!originalSvg) return resolve(null);

      // Get accurate dimensions from the DOM before cloning
      const rect = originalSvg.getBoundingClientRect();
      const width = rect.width || 512;
      const height = rect.height || 512;

      // Clone the node to manipulate styles without affecting the DOM
      const clonedSvg = originalSvg.cloneNode(true) as SVGElement;
      
      // CRITICAL FIX: Explicitly set width and height attributes on the cloned SVG.
      clonedSvg.setAttribute('width', width.toString());
      clonedSvg.setAttribute('height', height.toString());

      // IMPORTANT: Recursive function to copy computed styles to inline styles
      const copyComputedStyles = (source: Element, target: Element) => {
        const computed = window.getComputedStyle(source);
        const stylesToCopy = ['fill', 'stroke', 'stroke-width', 'opacity', 'color', 'display', 'visibility', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray', 'transform', 'transform-origin'];
        
        if (target instanceof HTMLElement || target instanceof SVGElement) {
            stylesToCopy.forEach(prop => {
                const val = computed.getPropertyValue(prop);
                if (val && val !== 'none') {
                    (target as any).style[prop] = val;
                }
                
                if (prop === 'fill' && val !== 'none' && val !== 'transparent') {
                    target.setAttribute('fill', val);
                }
                if (prop === 'stroke' && val !== 'none' && val !== 'transparent') {
                    target.setAttribute('stroke', val);
                }
            });
            
            if (computed.fill === 'none') target.setAttribute('fill', 'none');
        }

        for (let i = 0; i < source.children.length; i++) {
            if (target.children[i]) {
                copyComputedStyles(source.children[i], target.children[i]);
            }
        }
      };
      
      copyComputedStyles(originalSvg, clonedSvg);

      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(clonedSvg);

      // Ensure namespaces
      if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }

      const img = new Image();
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Scale up for better quality (High DPI)
        const scale = 2;
        canvas.width = width * scale;
        canvas.height = height * scale;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.scale(scale, scale);
            // Draw using explicit dimensions to match the canvas
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(resolve, 'image/png');
        } else {
            resolve(null);
        }
      };
      img.onerror = (e) => {
        console.error("SVG Load Error", e);
        resolve(null);
      };
    });
  };

  const generateAllAssets = async () => {
    const assets: {name: string, url: string, type: string}[] = [];
    
    // 1. Generate Hours
    for (let i = 0; i <= 9; i++) {
        const blob = await generateDigitAsset(i, "9rem", "#ffffff", true, 150, 200);
        if(blob) assets.push({ name: `hour_${i}.png`, url: URL.createObjectURL(blob), type: 'Hour' });
    }

    // 2. Generate Mins
    for (let i = 0; i <= 9; i++) {
        const blob = await generateDigitAsset(i, "3rem", "#ffffff", false, 80, 100);
        if(blob) assets.push({ name: `min_${i}.png`, url: URL.createObjectURL(blob), type: 'Minute' });
    }

    // 3. Generate Secs
    for (let i = 0; i <= 9; i++) {
        const blob = await generateDigitAsset(i, "1.5rem", "#880015", false, 40, 60);
        if(blob) assets.push({ name: `sec_${i}.png`, url: URL.createObjectURL(blob), type: 'Second' });
    }

    // 4. Generate Icons
    const iconMap = [
        { id: "export-spider-lily", name: "aod_spider_lily.png" },
        { id: "export-bezel", name: "background_decoration.png" }, // Renamed for export clarity
        { id: "export-weather", name: "icon_weather.png" },
        { id: "export-steps", name: "icon_steps.png" },
        { id: "export-heart", name: "icon_heart.png" },
        { id: "export-message", name: "icon_message.png" },
        { id: "export-battery", name: "icon_battery.png" },
    ];

    for (const icon of iconMap) {
        const blob = await generateSvgAsset(icon.id);
        if(blob) assets.push({ name: icon.name, url: URL.createObjectURL(blob), type: 'Icon' });
    }
    
    return assets;
  };

  const handlePreviewAssets = async () => {
    setIsGenerating(true);
    const assets = await generateAllAssets();
    setGeneratedAssets(assets);
    setIsGenerating(false);
  };

  const handleExportAssets = async () => {
    setIsExporting(true);
    const zip = new JSZip();
    const folder = zip.folder("phrolova_assets");

    try {
        const assets = await generateAllAssets();
        
        // Add all assets to zip
        for(const asset of assets) {
            const response = await fetch(asset.url);
            const blob = await response.blob();
            folder?.file(asset.name, blob);
        }

        // 5. Try to export Background Image if it's a blob
        if (bgImage.startsWith('blob:') || bgImage.startsWith('data:')) {
            try {
                const response = await fetch(bgImage);
                const blob = await response.blob();
                folder?.file("background_source.jpg", blob);
            } catch (e) {
                console.warn("Could not export background image");
            }
        } else {
             // For static assets imported via path
             try {
                const response = await fetch(bgImage);
                const blob = await response.blob();
                folder?.file("background_source.jpg", blob);
             } catch(e) { console.warn("Static bg export fail", e); }
        }

        // Generate ZIP
        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "Phrolova_Watch_Assets.zip");

    } catch (e) {
        console.error("Export failed", e);
        alert("Failed to export assets. See console for details.");
    } finally {
        setIsExporting(false);
    }
  };

  const theme: ThemeConfig = {
    primaryColor: '#880015',
    secondaryColor: '#000000',
    accentColor: '#d4af37',
    bgImage: bgImage,
    quote: currentQuote,
    scales: { bezelScale, iconScale }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center p-8 gap-12 text-gray-200">
      
      {/* Hidden Staging Area for Asset Export - Renders components invisibly to capture them */}
      {/* Using left -9999px ensures layout is calculated but not visible */}
      <div className="fixed top-0 flex flex-col bg-white/0" style={{ left: '-9999px', position: 'absolute' }}>
         {/* AOD Flower */}
         <div className="w-[512px] h-[512px]">
             <SpiderLilyIcon id="export-spider-lily" className="w-full h-full text-[#880015]" />
         </div>
         {/* Decoration Bezel - FIXED: Ensure container is large enough and applies user scale */}
         <div className="w-[466px] h-[466px] flex items-center justify-center">
             <div className="w-full h-full" style={{ transform: `scale(${bezelScale})` }}>
                <WatchBezelIcon id="export-bezel" className="w-full h-full" />
             </div>
         </div>
         {/* Icons */}
         <div className="w-[100px] h-[100px] text-[#e5e7eb]">
             <WeatherIcon id="export-weather" className="w-full h-full" />
         </div>
         <div className="w-[100px] h-[100px] text-[#e5e7eb]">
             <StepsIcon id="export-steps" className="w-full h-full" />
         </div>
         <div className="w-[100px] h-[100px] text-[#880015]">
             <HeartRateIcon id="export-heart" className="w-full h-full" />
         </div>
         <div className="w-[100px] h-[100px] text-[#ffffff]">
             <MessageIcon id="export-message" className="w-full h-full" />
         </div>
         <div className="w-[100px] h-[100px] text-[#880015]">
             <BatteryIcon id="export-battery" className="w-full h-full" />
         </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full max-w-7xl">
        {/* Left Panel: Preview */}
        <div className="relative flex flex-col items-center">
            {/* Watch Bezel Simulation */}
            <div className={`relative p-4 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 shadow-2xl border-4 ${isAOD ? 'border-gray-800' : 'border-gray-600'} transition-all duration-500`}>
                <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none"></div>
                {/* Actual Watch Face */}
                <div className="overflow-hidden rounded-full ring-8 ring-black relative">
                    <WatchFace state={watchState} theme={theme} />
                    
                    {/* Glass Reflection Effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-50"></div>
                </div>
            </div>
            
            <p className="mt-6 text-sm text-gray-500 font-mono">466 x 466 AMOLED Simulation</p>
        </div>

        {/* Right Panel: Controls */}
        <div className="w-full max-w-md space-y-8 bg-[#151515] p-8 rounded-xl border border-white/5 shadow-xl">
            <div className="border-b border-white/10 pb-4">
                <h1 className="text-3xl font-cinzel text-phrolova-red mb-2">Phrolova Design</h1>
                <p className="text-sm text-gray-400">Custom Watch Face Configurator</p>
            </div>

            {/* Display Mode Toggle */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-300">Display Mode</h2>
                <div className="flex gap-4 p-1 bg-black/40 rounded-lg">
                    <button 
                        onClick={() => setIsAOD(false)}
                        className={`flex-1 py-3 px-4 rounded-md transition-all font-cinzel font-bold ${!isAOD ? 'bg-phrolova-red text-white shadow-glow' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        ACTIVE
                    </button>
                    <button 
                        onClick={() => setIsAOD(true)}
                        className={`flex-1 py-3 px-4 rounded-md transition-all font-cinzel font-bold ${isAOD ? 'bg-gray-800 text-white border border-gray-600' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        AOD
                    </button>
                </div>
            </div>

            {/* Scale Adjustments */}
            <div className="space-y-6 pt-4 border-t border-white/5">
                <h2 className="text-lg font-bold text-gray-300">Scale Adjustments</h2>
                
                {/* Bezel Scale */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400 uppercase tracking-widest">
                        <span>Decoration Size</span>
                        <span>{Math.round(bezelScale * 100)}%</span>
                    </div>
                    <input 
                        type="range" 
                        min="0.5" 
                        max="1.1" 
                        step="0.01" 
                        value={bezelScale} 
                        onChange={(e) => setBezelScale(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-phrolova-red hover:accent-red-500 transition-colors"
                    />
                </div>

                {/* Icon Scale */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400 uppercase tracking-widest">
                        <span>Icon Size</span>
                        <span>{Math.round(iconScale * 100)}%</span>
                    </div>
                    <input 
                        type="range" 
                        min="0.5" 
                        max="1.5" 
                        step="0.05" 
                        value={iconScale} 
                        onChange={(e) => setIconScale(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-phrolova-gold hover:accent-yellow-500 transition-colors"
                    />
                </div>
            </div>

            {/* Customization */}
            <div className="space-y-4 pt-4 border-t border-white/5">
                <h2 className="text-lg font-bold text-gray-300">Customization</h2>
                
                {/* Image Upload */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest text-gray-500">Background Asset</label>
                    <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-phrolova-red transition-colors bg-black/20 group">
                        <div className="text-center">
                            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Click to upload Character Image</span>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                </div>

                {/* AI Generator */}
                <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
                    <label className="text-xs uppercase tracking-widest text-gray-500">Gemini AI Integration</label>
                    <button 
                        onClick={handleGenerateQuote}
                        disabled={isGenerating}
                        className="w-full py-3 bg-gradient-to-r from-gray-800 to-gray-900 border border-white/10 rounded-lg hover:border-phrolova-gold/50 text-phrolova-gold font-mono text-sm transition-all flex items-center justify-center gap-2"
                    >
                        {isGenerating ? (
                            <span className="animate-pulse">Synthesizing...</span>
                        ) : (
                            <>
                                <span>✨ Generate Character Quote</span>
                            </>
                        )}
                    </button>
                </div>
                
                {/* Export Controls */}
                <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
                    <label className="text-xs uppercase tracking-widest text-gray-500">Asset Management</label>
                    
                    <button 
                        onClick={handlePreviewAssets}
                        disabled={isGenerating}
                        className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold font-cinzel transition-all flex items-center justify-center gap-2"
                    >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        GENERATE & PREVIEW ASSETS
                    </button>

                    <button 
                        onClick={handleExportAssets}
                        disabled={isExporting}
                        className="w-full py-4 bg-phrolova-red hover:bg-red-800 text-white rounded-lg font-bold font-cinzel transition-all flex items-center justify-center gap-2 shadow-glow ring-2 ring-offset-2 ring-offset-black ring-phrolova-red"
                    >
                        {isExporting ? (
                            <span className="animate-pulse">Packing Assets...</span>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                <span>DOWNLOAD ASSETS (.ZIP)</span>
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
      </div>

      {/* Asset Gallery Section */}
      {generatedAssets.length > 0 && (
          <div className="w-full max-w-7xl mt-12 mb-24 animate-slide-up">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                  <h2 className="text-3xl font-cinzel text-phrolova-silver">Generated Assets Gallery</h2>
                  <span className="text-sm text-gray-500 font-mono">Right-click images to save individually</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
                  {generatedAssets.map((asset) => (
                      <div key={asset.name} className="flex flex-col gap-2 group">
                          <div className="relative aspect-square bg-[#1a1a1a] rounded-lg overflow-hidden border border-white/5 group-hover:border-phrolova-red/50 transition-colors">
                              {/* Transparency Checkerboard */}
                              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}></div>
                              
                              <img src={asset.url} alt={asset.name} className="relative z-10 w-full h-full object-contain p-2" />
                              
                              <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/60 rounded text-[10px] text-gray-300 backdrop-blur-sm">
                                  {asset.type}
                              </div>
                          </div>
                          <p className="text-xs text-center text-gray-500 font-mono truncate select-all">{asset.name}</p>
                      </div>
                  ))}
              </div>
          </div>
      )}

    </div>
  );
};

export default App;
