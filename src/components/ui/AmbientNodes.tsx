export function AmbientNodes() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div
        className="absolute left-[10%] top-[20%] h-64 w-64 rounded-full opacity-40 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute right-[15%] top-[60%] h-80 w-80 rounded-full opacity-35 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.06) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
