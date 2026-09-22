import React, { useState, useEffect } from "react";
import {
  Bell,
  BellRing,
  BellOff,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  X,
  Clock,
  Smartphone,
  ShieldCheck,
  User,
  MapPin,
  IndianRupee,
  Trash2,
  Zap,
} from "lucide-react";
import {
  requestPushPermission,
  getPushPermissionState,
  getSavedPushSubscription,
  subscribeHostToPushNotifications,
  playPersistentHostBookingAlert,
  stopPersistentHostBookingAlert,
  isAlertSoundPlaying,
  triggerHostPushNotification,
  simulateIncomingBookingRequest,
  getNotificationHistory,
  clearNotificationHistory,
  HostPushSubscription,
  HostBookingNotificationPayload,
} from "@/lib/hostPushNotifications";
import { playClick, playPop } from "@/lib/audio";

export function HostPushNotificationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [permissionState, setPermissionState] = useState<NotificationPermission>("default");
  const [subscription, setSubscription] = useState<HostPushSubscription | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPlayingAlert, setIsPlayingAlert] = useState(false);
  const [historyLogs, setHistoryLogs] = useState<HostBookingNotificationPayload[]>([]);
  const [lastReceived, setLastReceived] = useState<HostBookingNotificationPayload | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setPermissionState(getPushPermissionState());
    setSubscription(getSavedPushSubscription());
    setHistoryLogs(getNotificationHistory());
    setIsPlayingAlert(isAlertSoundPlaying());

    const handleLivePush = (e: Event) => {
      const customEvent = e as CustomEvent<HostBookingNotificationPayload>;
      if (customEvent.detail) {
        setLastReceived(customEvent.detail);
        setHistoryLogs(getNotificationHistory());
        setIsPlayingAlert(true);
      }
    };

    window.addEventListener("stashsaarthi:host-push-notification", handleLivePush);
    return () => {
      window.removeEventListener("stashsaarthi:host-push-notification", handleLivePush);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubscribe = async () => {
    playClick();
    setIsSubmitting(true);
    try {
      const sub = await subscribeHostToPushNotifications();
      setSubscription(sub);
      setPermissionState(getPushPermissionState());
      playPop();
    } catch (err: any) {
      alert(err.message || "Failed to subscribe to Web Push Notifications.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleSoundTest = () => {
    playClick();
    if (isPlayingAlert || isAlertSoundPlaying()) {
      stopPersistentHostBookingAlert();
      setIsPlayingAlert(false);
    } else {
      playPersistentHostBookingAlert();
      setIsPlayingAlert(true);
    }
  };

  const handleSimulateRequest = async () => {
    playClick();
    const payload = simulateIncomingBookingRequest();
    setLastReceived(payload);
    await triggerHostPushNotification(payload);
    setHistoryLogs(getNotificationHistory());
    setIsPlayingAlert(true);
    playPop();
  };

  const handleClearHistory = () => {
    playClick();
    clearNotificationHistory();
    setHistoryLogs([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-amber-500/30 bg-[#0A0D0F] p-6 text-white shadow-2xl">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30">
              <BellRing className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-300">Host Web Push & Alert Siren</h2>
              <p className="text-xs text-amber-400/70">
                Persistent Audio Sound & Instant Booking Alerts
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClick();
              stopPersistentHostBookingAlert();
              setIsPlayingAlert(false);
              onClose();
            }}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-5 space-y-5 max-h-[75vh] overflow-y-auto pr-1">
          {/* Active Siren Banner if playing */}
          {isPlayingAlert && (
            <div className="flex items-center justify-between rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-rose-300 animate-pulse">
              <div className="flex items-center gap-3">
                <Volume2 className="h-6 w-6 text-rose-400 animate-bounce" />
                <div>
                  <div className="font-bold text-sm">🚨 PERSISTENT ALARM SIREN PLAYING</div>
                  <div className="text-xs opacity-90">
                    Incoming booking alert chime loop active on host device.
                  </div>
                </div>
              </div>
              <button
                onClick={handleToggleSoundTest}
                className="rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-600 transition-colors shadow-lg"
              >
                Silence Alarm
              </button>
            </div>
          )}

          {/* Permission & Subscription Status Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-zinc-400">Web Push Status</span>
                {permissionState === "granted" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="h-3 w-3" /> GRANTED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[11px] font-bold text-amber-400 border border-amber-500/30">
                    <AlertTriangle className="h-3 w-3" /> PROMPT / UNSET
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-300 mb-3">
                Enables background push notifications even when host browser is minimized.
              </p>
              {permissionState !== "granted" ? (
                <button
                  onClick={handleSubscribe}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-2 text-xs font-bold text-black hover:from-amber-400 hover:to-amber-500 transition-all shadow-md"
                >
                  {isSubmitting ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Bell className="h-4 w-4" />
                  )}
                  Enable Web Push Notifications
                </button>
              ) : (
                <div className="text-xs text-emerald-400/90 font-mono bg-emerald-950/30 border border-emerald-800/40 rounded-lg p-2 truncate">
                  Endpoint: {subscription?.endpoint || "Registered"}
                </div>
              )}
            </div>

            {/* Persistent Audio Alert Test Card */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-zinc-400">Audio Alarm Synthesizer</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400">
                  <Volume2 className="h-3.5 w-3.5 text-amber-400" /> Web Audio API
                </span>
              </div>
              <p className="text-xs text-zinc-300 mb-3">
                Plays continuous 880Hz/660Hz dual-tone alert sound when a new booking arrives.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleToggleSoundTest}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
                    isPlayingAlert
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30"
                      : "bg-zinc-800 text-amber-300 border border-zinc-700 hover:bg-zinc-700"
                  }`}
                >
                  {isPlayingAlert ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                  {isPlayingAlert ? "Stop Sound Test" : "Test Alert Sound"}
                </button>
              </div>
            </div>
          </div>

          {/* Simulated Booking Request Trigger */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-amber-400" /> Live Push Simulation Simulator
                </h3>
                <p className="text-xs text-zinc-400">
                  Fires an instant push notification payload and triggers the persistent audio
                  alarm.
                </p>
              </div>
              <button
                onClick={handleSimulateRequest}
                className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400 transition-all shadow-md shrink-0"
              >
                <Sparkles className="h-4 w-4" /> Simulate Incoming Booking
              </button>
            </div>

            {/* Last Received Highlight */}
            {lastReceived && (
              <div className="mt-3 rounded-lg border border-amber-500/40 bg-black/40 p-3 text-xs">
                <div className="flex items-center justify-between font-bold text-amber-300 mb-1">
                  <span>
                    🚨 {lastReceived.bookingType.toUpperCase()} - {lastReceived.id}
                  </span>
                  <span>₹{lastReceived.amount}</span>
                </div>
                <div className="text-zinc-300">
                  <span className="font-semibold text-white">{lastReceived.studentName}</span> (
                  {lastReceived.studentPhone}) — {lastReceived.details}
                </div>
                <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-amber-400" /> {lastReceived.nodeName} •{" "}
                  {new Date(lastReceived.timestamp).toLocaleTimeString()}
                </div>
              </div>
            )}
          </div>

          {/* Push Notification History Drawer */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-400" /> Notification Audit History (
                {historyLogs.length})
              </h3>
              {historyLogs.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="h-3 w-3" /> Clear Audit Log
                </button>
              )}
            </div>

            {historyLogs.length === 0 ? (
              <div className="text-center py-6 text-xs text-zinc-500">
                No notification events logged yet. Click "Simulate Incoming Booking" above to test.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {historyLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-800/80 bg-black/40 p-2.5 text-xs hover:border-amber-500/30 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-400 uppercase text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                          {log.bookingType}
                        </span>
                        <span className="font-medium text-white">{log.studentName}</span>
                        <span className="text-[11px] text-zinc-400">({log.studentPhone})</span>
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        {log.details} • {log.nodeName}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">₹{log.amount}</div>
                      <div className="text-[10px] text-zinc-500">
                        {new Date(log.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-5 border-t border-amber-500/20 pt-4 flex flex-wrap items-center justify-between text-xs text-zinc-400 gap-2">
          <div className="flex items-center gap-1.5 text-amber-400/80">
            <ShieldCheck className="h-4 w-4" /> 100% Host Alert SLA — 0 Missed Student Requests
          </div>
          <button
            onClick={() => {
              playClick();
              stopPersistentHostBookingAlert();
              setIsPlayingAlert(false);
              onClose();
            }}
            className="rounded-lg bg-zinc-800 px-4 py-1.5 font-bold text-white hover:bg-zinc-700 transition-colors"
          >
            Close Console
          </button>
        </div>
      </div>
    </div>
  );
}
