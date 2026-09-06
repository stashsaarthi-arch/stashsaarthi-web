import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Compass,
  Maximize2,
  Minimize2,
  RotateCw,
  ZoomIn,
  ZoomOut,
  X,
  MapPin,
  MessageCircle,
  Eye,
  Info,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { FOUNDER_WHATSAPP, getWhatsAppUrl } from "@/lib/constants";

export interface RoomHotspot {
  yaw: number; // -180 to 180 deg
  pitch: number; // -90 to 90 deg
  label: string;
  label_hi: string;
  description: string;
  description_hi: string;
}

export interface RoomScene {
  id: string;
  title: string;
  title_hi: string;
  imageUrl: string;
  hotspots: RoomHotspot[];
}

export interface Room360ViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomTitle?: string;
  roomLocation?: string;
  rentAmount?: number;
  scenes?: RoomScene[];
}

const DEFAULT_SCENES: RoomScene[] = [
  {
    id: "bedroom",
    title: "Master Bedroom & Bed Space",
    title_hi: "मास्टर बेडरूम और बेड स्पेस",
    imageUrl:
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=2000&q=80",
    hotspots: [
      {
        yaw: -35,
        pitch: -10,
        label: "Study Desk & Fiber Wi-Fi",
        label_hi: "स्टडी डेस्क और फाइबर वाई-फाई",
        description: "100 Mbps fiber internet with dedicated power outlets for laptops.",
        description_hi: "लैपटॉप के लिए समर्पित पावर आउटलेट के साथ 100 Mbps फाइबर इंटरनेट।",
      },
      {
        yaw: 40,
        pitch: 15,
        label: "Sunlit Window & Ventilation",
        label_hi: "धूप वाली खिड़की और वेंटिलेशन",
        description: "East-facing window providing natural sunlight and fresh air flow.",
        description_hi: "प्राकृतिक धूप और ताजी हवा प्रदान करने वाली पूर्व-मुखी खिड़की।",
      },
      {
        yaw: 120,
        pitch: -20,
        label: "Storage Locker & Cupboard",
        label_hi: "स्टोरेज लॉकर और अलमारी",
        description: "Double door wooden cupboard with heavy-duty lock latch.",
        description_hi: "हैवी-ड्यूटी लॉक कुंडी के साथ डबल डोर लकड़ी की अलमारी।",
      },
    ],
  },
  {
    id: "study",
    title: "Study Area & Quiet Desk",
    title_hi: "स्टडी एरिया और शांत डेस्क",
    imageUrl:
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=2000&q=80",
    hotspots: [
      {
        yaw: 0,
        pitch: 0,
        label: "Ergonomic Chair & Lamp",
        label_hi: "एर्गोनोमिक कुर्सी और लैंप",
        description: "High-back ergonomic study chair ideal for late-night exam prep.",
        description_hi: "देर रात परीक्षा की तैयारी के लिए आदर्श हाई-बैक एर्गोनोमिक स्टडी चेयर।",
      },
      {
        yaw: 85,
        pitch: -15,
        label: "Power Backup Point",
        label_hi: "पावर बैकअप पॉइंट",
        description: "Inverter connected 24x7 power point for Wi-Fi router & phone charger.",
        description_hi: "वाई-फाई राउटर और फोन चार्जर के लिए इन्वर्टर से जुड़ा 24x7 पावर पॉइंट।",
      },
    ],
  },
  {
    id: "washroom",
    title: "Attached Washroom & Balcony",
    title_hi: "अटैच्ड वाशरूम और बालकनी",
    imageUrl:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=2000&q=80",
    hotspots: [
      {
        yaw: -60,
        pitch: -5,
        label: "24x7 Hot & Cold Water",
        label_hi: "24x7 गर्म और ठंडा पानी",
        description: "Solar & Electric Geyser setup with high-pressure shower.",
        description_hi: "हाई-प्रेशर शावर के साथ सोलर और इलेक्ट्रिक गीजर सेटअप।",
      },
      {
        yaw: 60,
        pitch: 10,
        label: "Private Balcony Access",
        label_hi: "निजी बालकनी तक पहुंच",
        description: "Quiet green view balcony with cloth drying space.",
        description_hi: "कपड़े सुखाने की जगह के साथ शांत हरे दृश्य वाली बालकनी।",
      },
    ],
  },
];

export function Room360Viewer({
  open,
  onOpenChange,
  roomTitle = "Kalyanpur Verified Student Room",
  roomLocation = "Kalyanpur, Kanpur · 6 min to IIT Gate 1",
  rentAmount = 6500,
  scenes = DEFAULT_SCENES,
}: Room360ViewerProps) {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const activeScene = scenes[activeSceneIndex] || scenes[0];

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // View state
  const [yaw, setYaw] = useState(0); // horizontal angle (-180 to 180)
  const [pitch, setPitch] = useState(0); // vertical angle (-60 to 60)
  const [fov, setFov] = useState(75); // Field of view in degrees (45 to 100)
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<RoomHotspot | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Drag state
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const animFrameId = useRef<number | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Load active panorama image
  useEffect(() => {
    if (!open || !activeScene) return;
    setLoaded(false);
    setActiveHotspot(null);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = activeScene.imageUrl;
    img.onload = () => {
      imageRef.current = img;
      setLoaded(true);
    };
    img.onerror = () => {
      // Fallback
      imageRef.current = null;
      setLoaded(true);
    };
  }, [open, activeSceneIndex, activeScene?.imageUrl]);

  // Canvas render loop
  useEffect(() => {
    if (!open) return;

    let localYaw = yaw;
    let localPitch = pitch;

    const render = () => {
      if (autoRotate && !isDragging.current) {
        localYaw = (localYaw + 0.15) % 360;
        if (localYaw > 180) localYaw -= 360;
        setYaw(localYaw);
      }

      const canvas = canvasRef.current;
      if (canvas && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (canvas.width !== rect.width || canvas.height !== rect.height) {
          canvas.width = rect.width;
          canvas.height = rect.height;
        }

        const ctx = canvas.getContext("2d");
        if (ctx) {
          const width = canvas.width;
          const height = canvas.height;
          ctx.clearRect(0, 0, width, height);

          const img = imageRef.current;
          if (img && img.complete) {
            // Render Equirectangular projection slice onto canvas
            const imgWidth = img.width;
            const imgHeight = img.height;

            // Calculate current center X & Y in normalized image space (0..1)
            const normYaw = ((localYaw + 180) % 360) / 360;
            const normPitch = (localPitch + 90) / 180;

            const scaleX = 360 / fov;
            const scaleY = (scaleX * height) / width;

            const sourceWidth = imgWidth / scaleX;
            const sourceHeight = imgHeight / scaleY;

            const sourceX = normYaw * imgWidth - sourceWidth / 2;
            const sourceY = normPitch * imgHeight - sourceHeight / 2;

            // Handle wrap-around horizontally
            if (sourceX < 0) {
              const part1Width = -sourceX;
              const part2Width = sourceWidth - part1Width;

              ctx.drawImage(
                img,
                imgWidth - part1Width,
                Math.max(0, Math.min(imgHeight - sourceHeight, sourceY)),
                part1Width,
                sourceHeight,
                0,
                0,
                (part1Width / sourceWidth) * width,
                height,
              );
              ctx.drawImage(
                img,
                0,
                Math.max(0, Math.min(imgHeight - sourceHeight, sourceY)),
                part2Width,
                sourceHeight,
                (part1Width / sourceWidth) * width,
                0,
                (part2Width / sourceWidth) * width,
                height,
              );
            } else if (sourceX + sourceWidth > imgWidth) {
              const part1Width = imgWidth - sourceX;
              const part2Width = sourceWidth - part1Width;

              ctx.drawImage(
                img,
                sourceX,
                Math.max(0, Math.min(imgHeight - sourceHeight, sourceY)),
                part1Width,
                sourceHeight,
                0,
                0,
                (part1Width / sourceWidth) * width,
                height,
              );
              ctx.drawImage(
                img,
                0,
                Math.max(0, Math.min(imgHeight - sourceHeight, sourceY)),
                part2Width,
                sourceHeight,
                (part1Width / sourceWidth) * width,
                0,
                (part2Width / sourceWidth) * width,
                height,
              );
            } else {
              ctx.drawImage(
                img,
                sourceX,
                Math.max(0, Math.min(imgHeight - sourceHeight, sourceY)),
                sourceWidth,
                sourceHeight,
                0,
                0,
                width,
                height,
              );
            }
          } else {
            // Draw gradient background placeholder
            const grad = ctx.createLinearGradient(0, 0, width, height);
            grad.addColorStop(0, "#0f172a");
            grad.addColorStop(1, "#020617");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);
          }
        }
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [open, autoRotate, fov, pitch, yaw]);

  // Calculate screen position for hotspots
  const getHotspotScreenPos = (hotspot: RoomHotspot) => {
    if (!containerRef.current) return null;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Angle diff relative to current view center
    let deltaYaw = hotspot.yaw - yaw;
    while (deltaYaw > 180) deltaYaw -= 360;
    while (deltaYaw < -180) deltaYaw += 360;

    let deltaPitch = hotspot.pitch - pitch;

    // Check if within visible FOV
    if (Math.abs(deltaYaw) > fov / 1.5 || Math.abs(deltaPitch) > (fov * (height / width)) / 1.5) {
      return null;
    }

    const x = width / 2 + (deltaYaw / (fov / 2)) * (width / 2);
    const y = height / 2 - (deltaPitch / ((fov * (height / width)) / 2)) * (height / 2);

    return { x, y };
  };

  // Mouse & Touch interaction handlers
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    setAutoRotate(false);

    const touch = "touches" in e && e.touches && e.touches[0] ? e.touches[0] : null;
    const clientX = touch ? touch.clientX : (e as React.MouseEvent).clientX;
    const clientY = touch ? touch.clientY : (e as React.MouseEvent).clientY;
    lastMousePos.current = { x: clientX, y: clientY };
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current) return;

    const touch = "touches" in e && e.touches && e.touches[0] ? e.touches[0] : null;
    const clientX = touch ? touch.clientX : (e as React.MouseEvent).clientX;
    const clientY = touch ? touch.clientY : (e as React.MouseEvent).clientY;

    const deltaX = clientX - lastMousePos.current.x;
    const deltaY = clientY - lastMousePos.current.y;

    const sensitivity = fov / 600;

    setYaw((prev) => {
      let next = prev - deltaX * sensitivity;
      if (next > 180) next -= 360;
      if (next < -180) next += 360;
      return next;
    });

    setPitch((prev) => {
      const next = prev + deltaY * sensitivity;
      return Math.max(-55, Math.min(55, next));
    });

    lastMousePos.current = { x: clientX, y: clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setFov((prev) => Math.max(45, Math.min(95, prev + e.deltaY * 0.05)));
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative flex flex-col w-full max-w-5xl h-[90vh] rounded-3xl overflow-hidden border border-white/15 bg-slate-950 shadow-2xl"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-900/90 backdrop-blur-md z-20">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                <Compass className="h-5 w-5 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-extrabold text-white">{roomTitle}</h3>
                  <span className="rounded-full border border-emerald-500/40 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                    360° Tour
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-cyan" /> {roomLocation}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                ₹{rentAmount.toLocaleString("en-IN")}/mo
              </span>
              <button
                onClick={() => onOpenChange(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                aria-label="Close 360 Tour"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Main 360 Viewport */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            onWheel={handleWheel}
            className="relative flex-1 w-full bg-slate-950 overflow-hidden cursor-grab active:cursor-grabbing select-none"
          >
            {/* Canvas Equirectangular Panorama */}
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Loading Overlay */}
            {!loaded && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/90 text-white gap-3">
                <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-semibold text-emerald-400">
                  {isHi ? "360° कमरा लोड हो रहा है..." : "Loading 360° Room Panorama..."}
                </p>
              </div>
            )}

            {/* Drag Hint Watermark */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none bg-black/60 backdrop-blur-md border border-white/10 text-white/80 text-[11px] px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
              <Eye className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              <span>{isHi ? "चारों ओर देखने के लिए ड्रैग करें" : "Drag to look around 360°"}</span>
            </div>

            {/* Hotspots Overlay */}
            {loaded &&
              activeScene?.hotspots?.map((hotspot, idx) => {
                const pos = getHotspotScreenPos(hotspot);
                if (!pos) return null;

                const isSelected = activeHotspot?.label === hotspot.label;

                return (
                  <div
                    key={idx}
                    style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
                    className="absolute z-20 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHotspot(isSelected ? null : hotspot);
                      }}
                      className={`relative flex items-center justify-center h-8 w-8 rounded-full border shadow-xl transition-all cursor-pointer ${
                        isSelected
                          ? "bg-emerald-500 border-white text-black scale-125 ring-4 ring-emerald-500/40"
                          : "bg-black/75 border-emerald-400 text-emerald-300 hover:bg-emerald-500 hover:text-black hover:scale-110"
                      }`}
                    >
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      {/* Pulse Ping Ring */}
                      <span className="absolute inset-0 rounded-full bg-emerald-400/40 animate-ping" />
                    </button>

                    {/* Hotspot Popover Tooltip */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.9 }}
                          className="absolute bottom-10 left-1/2 -translate-x-1/2 w-56 sm:w-64 p-3 rounded-2xl bg-slate-900/95 border border-emerald-500/40 text-white shadow-2xl backdrop-blur-xl z-30"
                        >
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                              {isHi ? hotspot.label_hi : hotspot.label}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveHotspot(null);
                              }}
                              className="text-slate-400 hover:text-white"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="text-[11px] leading-snug text-slate-300">
                            {isHi ? hotspot.description_hi : hotspot.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

            {/* View Controls Toolbar */}
            <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-black/75 backdrop-blur-md border border-white/15 p-1.5 rounded-full shadow-2xl">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  autoRotate
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
                title={autoRotate ? "Pause Auto-Rotation" : "Start Auto-Rotation"}
              >
                <RotateCw className={`h-4 w-4 ${autoRotate ? "animate-spin-slow" : ""}`} />
              </button>

              <button
                onClick={() => setFov((prev) => Math.max(45, prev - 10))}
                className="p-2 rounded-full text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>

              <button
                onClick={() => setFov((prev) => Math.min(95, prev + 10))}
                className="p-2 rounded-full text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>

              <button
                onClick={() => {
                  setYaw(0);
                  setPitch(0);
                  setFov(75);
                }}
                className="p-2 rounded-full text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                title="Reset View"
              >
                <Compass className="h-4 w-4" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-full text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Footer Bar: Scene Switcher & CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 px-4 py-3 border-t border-white/10 bg-slate-900/90 backdrop-blur-md z-20">
            {/* Scene Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {scenes.map((scene, idx) => {
                const isActive = idx === activeSceneIndex;
                return (
                  <button
                    key={scene.id}
                    onClick={() => setActiveSceneIndex(idx)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/25"
                        : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {isHi ? scene.title_hi : scene.title}
                  </button>
                );
              })}
            </div>

            {/* Direct Booking WhatsApp Action */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button
                asChild
                variant="hero"
                size="sm"
                className="w-full sm:w-auto text-xs py-1.5 px-4"
              >
                <a
                  href={getWhatsAppUrl(
                    isHi
                      ? `नमस्ते, मैंने StashSaarthi पर 360° रूम टूर (${roomTitle}) देखा और मैं इसे बुक करना चाहता/चाहती हूं।`
                      : `Hi, I viewed the 360° virtual room tour (${roomTitle}) on StashSaarthi and would like to reserve it.`,
                    FOUNDER_WHATSAPP,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4 mr-1.5" />
                  {isHi ? "यह कमरा बुक करें" : "Book This Room Now"}
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
