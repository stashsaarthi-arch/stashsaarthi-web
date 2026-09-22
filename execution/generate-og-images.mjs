import { execSync } from "child_process";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";

const ROOT = resolve(import.meta.dirname, "..");
const PUBLIC_IMAGES = resolve(ROOT, "public/images");

if (!existsSync(PUBLIC_IMAGES)) {
  mkdirSync(PUBLIC_IMAGES, { recursive: true });
}

function createStudentSVG() {
  return `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0A0D0F"/>
        <stop offset="50%" stop-color="#0F172A"/>
        <stop offset="100%" stop-color="#051C14"/>
      </linearGradient>
      <radialGradient id="mintGlow" cx="80%" cy="20%" r="60%">
        <stop offset="0%" stop-color="#10B981" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#10B981" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="cyanGlow" cx="20%" cy="80%" r="60%">
        <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#06B6D4" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="cardBorder" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#10B981" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#06B6D4" stop-opacity="0.2"/>
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="1200" height="630" fill="url(#bg)"/>
    <rect width="1200" height="630" fill="url(#mintGlow)"/>
    <rect width="1200" height="630" fill="url(#cyanGlow)"/>

    <!-- Glass Card Container -->
    <rect x="80" y="60" width="1040" height="510" rx="28" fill="#0A0D0F" fill-opacity="0.75" stroke="url(#cardBorder)" stroke-width="2"/>

    <!-- Header Badge -->
    <g transform="translate(130, 110)">
      <rect width="260" height="42" rx="21" fill="#10B981" fill-opacity="0.2" stroke="#10B981" stroke-width="1.5"/>
      <text x="130" y="26" fill="#00F5A0" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="15" font-weight="700" text-anchor="middle" letter-spacing="1">STUDENT PERSONA MODE</text>
    </g>

    <!-- Title -->
    <text x="130" y="225" fill="#FFFFFF" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="52" font-weight="800" letter-spacing="-1">
      Vacation Micro-Storage at <tspan fill="#00F5A0">₹300/bag/mo</tspan>
    </text>

    <!-- Subtitle -->
    <text x="130" y="285" fill="#94A3B8" font-family="'Inter', system-ui, sans-serif" font-size="24" font-weight="500">
      Zero-Brokerage Verified Rooms • Saved ₹8,400 Dead-Rent During Breaks
    </text>

    <!-- Feature Cards / Badges -->
    <g transform="translate(130, 340)">
      <!-- Pill 1 -->
      <g transform="translate(0, 0)">
        <rect width="260" height="90" rx="16" fill="#0F172A" fill-opacity="0.9" stroke="#1E293B" stroke-width="1.5"/>
        <text x="24" y="38" fill="#94A3B8" font-family="'Inter', sans-serif" font-size="14" font-weight="600">LUGGAGE STORAGE</text>
        <text x="24" y="68" fill="#00F5A0" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="700">₹300 / bag / mo</text>
      </g>
      <!-- Pill 2 -->
      <g transform="translate(280, 0)">
        <rect width="260" height="90" rx="16" fill="#0F172A" fill-opacity="0.9" stroke="#1E293B" stroke-width="1.5"/>
        <text x="24" y="38" fill="#94A3B8" font-family="'Inter', sans-serif" font-size="14" font-weight="600">SAFETY GUARANTEE</text>
        <text x="24" y="68" fill="#38BDF8" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="700">₹10,000 Cover</text>
      </g>
      <!-- Pill 3 -->
      <g transform="translate(560, 0)">
        <rect width="260" height="90" rx="16" fill="#0F172A" fill-opacity="0.9" stroke="#1E293B" stroke-width="1.5"/>
        <text x="24" y="38" fill="#94A3B8" font-family="'Inter', sans-serif" font-size="14" font-weight="600">CAMPUS COVERAGE</text>
        <text x="24" y="68" fill="#F43F5E" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="700">IITK &amp; Kakadeo</text>
      </g>
    </g>

    <!-- Footer Brand Mark -->
    <g transform="translate(130, 495)">
      <circle cx="20" cy="20" r="18" fill="#10B981"/>
      <path d="M12 20 L18 26 L28 14" stroke="#0A0D0F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <text x="50" y="27" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="800" letter-spacing="-0.5">StashSaarthi</text>
      <text x="195" y="27" fill="#64748B" font-family="'Inter', sans-serif" font-size="18" font-weight="500">| stashsaarthi-web.vercel.app</text>
    </g>
  </svg>
  `;
}

function createHostSVG() {
  return `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgHost" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0A0D0F"/>
        <stop offset="50%" stop-color="#1E1306"/>
        <stop offset="100%" stop-color="#2D1A04"/>
      </linearGradient>
      <radialGradient id="amberGlow" cx="80%" cy="20%" r="60%">
        <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#F59E0B" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="goldGlow" cx="20%" cy="80%" r="60%">
        <stop offset="0%" stop-color="#FBBF24" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#FBBF24" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="cardBorderHost" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.7"/>
        <stop offset="100%" stop-color="#FBBF24" stop-opacity="0.2"/>
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="1200" height="630" fill="url(#bgHost)"/>
    <rect width="1200" height="630" fill="url(#amberGlow)"/>
    <rect width="1200" height="630" fill="url(#goldGlow)"/>

    <!-- Glass Card Container -->
    <rect x="80" y="60" width="1040" height="510" rx="28" fill="#0A0D0F" fill-opacity="0.8" stroke="url(#cardBorderHost)" stroke-width="2"/>

    <!-- Header Badge -->
    <g transform="translate(130, 110)">
      <rect width="280" height="42" rx="21" fill="#F59E0B" fill-opacity="0.2" stroke="#F59E0B" stroke-width="1.5"/>
      <text x="140" y="26" fill="#FBBF24" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="15" font-weight="700" text-anchor="middle" letter-spacing="1">ELDERLY HOST PERSONA MODE</text>
    </g>

    <!-- Title -->
    <text x="130" y="225" fill="#FFFFFF" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="52" font-weight="800" letter-spacing="-1">
      Earn <tspan fill="#FBBF24">₹11,500+/Month</tspan> Passive Income
    </text>

    <!-- Subtitle -->
    <text x="130" y="285" fill="#CBD5E1" font-family="'Inter', system-ui, sans-serif" font-size="24" font-weight="500">
      Dignified Intergenerational Living • 100% Control Over House Norms
    </text>

    <!-- Feature Cards / Badges -->
    <g transform="translate(130, 340)">
      <!-- Pill 1 -->
      <g transform="translate(0, 0)">
        <rect width="260" height="90" rx="16" fill="#181109" fill-opacity="0.9" stroke="#38240D" stroke-width="1.5"/>
        <text x="24" y="38" fill="#94A3B8" font-family="'Inter', sans-serif" font-size="14" font-weight="600">AVG MONTHLY PAYOUT</text>
        <text x="24" y="68" fill="#FBBF24" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="700">₹11,500 / month</text>
      </g>
      <!-- Pill 2 -->
      <g transform="translate(280, 0)">
        <rect width="260" height="90" rx="16" fill="#181109" fill-opacity="0.9" stroke="#38240D" stroke-width="1.5"/>
        <text x="24" y="38" fill="#94A3B8" font-family="'Inter', sans-serif" font-size="14" font-weight="600">HOST PRIVACY</text>
        <text x="24" y="68" fill="#10B981" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="700">Zero Intrusion</text>
      </g>
      <!-- Pill 3 -->
      <g transform="translate(560, 0)">
        <rect width="260" height="90" rx="16" fill="#181109" fill-opacity="0.9" stroke="#38240D" stroke-width="1.5"/>
        <text x="24" y="38" fill="#94A3B8" font-family="'Inter', sans-serif" font-size="14" font-weight="600">SAFETY CHARTER</text>
        <text x="24" y="68" fill="#F59E0B" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="700">₹10k Protection</text>
      </g>
    </g>

    <!-- Footer Brand Mark -->
    <g transform="translate(130, 495)">
      <circle cx="20" cy="20" r="18" fill="#F59E0B"/>
      <path d="M12 20 L18 26 L28 14" stroke="#0A0D0F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <text x="50" y="27" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="800" letter-spacing="-0.5">StashSaarthi</text>
      <text x="195" y="27" fill="#94A3B8" font-family="'Inter', sans-serif" font-size="18" font-weight="500">| Dignified Senior Living</text>
    </g>
  </svg>
  `;
}

function createAdminSVG() {
  return `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgAdmin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0A0D0F"/>
        <stop offset="50%" stop-color="#0B1E2B"/>
        <stop offset="100%" stop-color="#061824"/>
      </linearGradient>
      <radialGradient id="cyanGlowAdmin" cx="80%" cy="20%" r="60%">
        <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#06B6D4" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="cardBorderAdmin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.7"/>
        <stop offset="100%" stop-color="#3B82F6" stop-opacity="0.2"/>
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="1200" height="630" fill="url(#bgAdmin)"/>
    <rect width="1200" height="630" fill="url(#cyanGlowAdmin)"/>

    <!-- Glass Card Container -->
    <rect x="80" y="60" width="1040" height="510" rx="28" fill="#0A0D0F" fill-opacity="0.85" stroke="url(#cardBorderAdmin)" stroke-width="2"/>

    <!-- Header Badge -->
    <g transform="translate(130, 110)">
      <rect width="320" height="42" rx="21" fill="#06B6D4" fill-opacity="0.2" stroke="#06B6D4" stroke-width="1.5"/>
      <text x="160" y="26" fill="#22D3EE" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="15" font-weight="700" text-anchor="middle" letter-spacing="1">GOVERNANCE &amp; OPERATIONS PORTAL</text>
    </g>

    <!-- Title -->
    <text x="130" y="225" fill="#FFFFFF" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="52" font-weight="800" letter-spacing="-1">
      StashSaarthi <tspan fill="#22D3EE">Admin &amp; Investor Telemetry</tspan>
    </text>

    <!-- Subtitle -->
    <text x="130" y="285" fill="#94A3B8" font-family="'Inter', system-ui, sans-serif" font-size="24" font-weight="500">
      Real-Time Campus Node Management &amp; Kanpur Unit Economics Dashboard
    </text>

    <!-- Feature Cards / Badges -->
    <g transform="translate(130, 340)">
      <!-- Pill 1 -->
      <g transform="translate(0, 0)">
        <rect width="260" height="90" rx="16" fill="#081825" fill-opacity="0.9" stroke="#16384E" stroke-width="1.5"/>
        <text x="24" y="38" fill="#94A3B8" font-family="'Inter', sans-serif" font-size="14" font-weight="600">STASH NET MARGIN</text>
        <text x="24" y="68" fill="#22D3EE" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="700">26.7% Net</text>
      </g>
      <!-- Pill 2 -->
      <g transform="translate(280, 0)">
        <rect width="260" height="90" rx="16" fill="#081825" fill-opacity="0.9" stroke="#16384E" stroke-width="1.5"/>
        <text x="24" y="38" fill="#94A3B8" font-family="'Inter', sans-serif" font-size="14" font-weight="600">ACTIVE CAMPUS NODES</text>
        <text x="24" y="68" fill="#38BDF8" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="700">Kanpur Genesis</text>
      </g>
      <!-- Pill 3 -->
      <g transform="translate(560, 0)">
        <rect width="260" height="90" rx="16" fill="#081825" fill-opacity="0.9" stroke="#16384E" stroke-width="1.5"/>
        <text x="24" y="38" fill="#94A3B8" font-family="'Inter', sans-serif" font-size="14" font-weight="600">PERSISTENCE</text>
        <text x="24" y="68" fill="#10B981" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="700">Zero-Data-Drop</text>
      </g>
    </g>

    <!-- Footer Brand Mark -->
    <g transform="translate(130, 495)">
      <circle cx="20" cy="20" r="18" fill="#06B6D4"/>
      <path d="M12 20 L18 26 L28 14" stroke="#0A0D0F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <text x="50" y="27" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="800" letter-spacing="-0.5">StashSaarthi</text>
      <text x="195" y="27" fill="#64748B" font-family="'Inter', sans-serif" font-size="18" font-weight="500">| Operator Console</text>
    </g>
  </svg>
  `;
}

async function generateAll() {
  const specs = [
    { name: "og-student", svg: createStudentSVG() },
    { name: "og-host", svg: createHostSVG() },
    { name: "og-admin", svg: createAdminSVG() },
  ];

  for (const s of specs) {
    const svgPath = resolve(PUBLIC_IMAGES, `${s.name}.svg`);
    const pngPath = resolve(PUBLIC_IMAGES, `${s.name}.png`);
    const webpPath = resolve(PUBLIC_IMAGES, `${s.name}.webp`);

    writeFileSync(svgPath, s.svg.trim(), "utf-8");
    console.log(`📝 Wrote ${s.name}.svg`);

    // Convert SVG to PNG
    execSync(`npx -y sharp-cli -i "${svgPath}" -o "${pngPath}" --format png`, {
      cwd: ROOT,
      stdio: "inherit",
    });
    console.log(`🖼️ Converted to ${s.name}.png`);

    // Convert SVG to WebP
    execSync(`npx -y sharp-cli -i "${svgPath}" -o "${webpPath}" --format webp -q 85`, {
      cwd: ROOT,
      stdio: "inherit",
    });
    console.log(`⚡ Converted to ${s.name}.webp`);
  }

  console.log("✅ OpenGraph image generation complete.");
}

generateAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
