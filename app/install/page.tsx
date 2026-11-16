import {
  Apple,
  Bell,
  Check,
  Download,
  Globe,
  Home,
  Lightbulb,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ScrollReveal from "@/components/ScrollReveal";
import EnableNotificationsButton from "@/components/EnableNotificationsButton";
import InstallAppButton from "@/components/pwa/InstallAppButton";
import { isFeatureEnabled } from "@/lib/db/queries";

function AndroidPhoneSvg() {
  return (
    <svg viewBox="0 0 240 460" className="w-56 mx-auto" fill="none">
      {/* Phone body */}
      <rect
        x="20"
        y="10"
        width="200"
        height="440"
        rx="24"
        stroke="#334155"
        strokeWidth="3"
        fill="#f8fafc"
      />
      <rect x="28" y="30" width="184" height="396" rx="2" fill="#f1f5f9" />
      {/* Status bar */}
      <rect x="28" y="30" width="184" height="24" fill="#021e40" rx="2" />
      <text x="40" y="46" fontSize="8" fill="white" fontFamily="system-ui">
        10:28
      </text>
      {/* Chrome browser bar */}
      <rect x="28" y="54" width="184" height="36" fill="#e2e8f0" />
      <rect
        x="36"
        y="62"
        width="120"
        height="20"
        rx="10"
        fill="white"
        stroke="#cbd5e1"
        strokeWidth="1"
      />
      <text x="46" y="76" fontSize="7" fill="#94a3b8" fontFamily="system-ui">
        cre8market.com
      </text>
      {/* Three-dot menu highlighted */}
      <circle cx="196" cy="72" r="3" fill="#64748b" />
      <rect
        x="182"
        y="58"
        width="28"
        height="28"
        rx="6"
        fill="#dc2626"
        fillOpacity="0.15"
        stroke="#dc2626"
        strokeWidth="1.5"
        strokeDasharray="3 2"
      />
      {/* Dropdown menu */}
      <rect
        x="130"
        y="94"
        width="76"
        height="80"
        rx="6"
        fill="white"
        stroke="#e2e8f0"
        strokeWidth="1"
        filter="url(#shadow)"
      />
      <rect
        x="138"
        y="102"
        width="60"
        height="16"
        rx="3"
        fill="#dc2626"
        fillOpacity="0.15"
      />
      <text
        x="142"
        y="114"
        fontSize="6"
        fill="#dc2626"
        fontFamily="system-ui"
        fontWeight="bold"
      >
        Install app
      </text>
      <text x="142" y="130" fontSize="6" fill="#475569" fontFamily="system-ui">
        Add to Home screen
      </text>
      <text x="142" y="144" fontSize="6" fill="#475569" fontFamily="system-ui">
        Share…
      </text>
      <text x="142" y="158" fontSize="6" fill="#475569" fontFamily="system-ui">
        Settings
      </text>
      {/* Arrow callout */}
      <path d="M208 58 L220 50 L230 50" stroke="#dc2626" strokeWidth="1.5" />
      <polygon points="230,50 225,46 225,54" fill="#dc2626" />
      <text
        x="218"
        y="44"
        fontSize="6"
        fill="#dc2626"
        fontFamily="system-ui"
        fontWeight="bold"
      >
        STEP 2-3
      </text>
      {/* Webpage content */}
      <rect x="36" y="180" width="168" height="14" rx="3" fill="#cbd5e1" />
      <rect x="36" y="198" width="120" height="10" rx="2" fill="#e2e8f0" />
      <rect x="36" y="214" width="168" height="90" rx="6" fill="#e2e8f0" />
      <rect x="36" y="310" width="168" height="14" rx="3" fill="#cbd5e1" />
      {/* Install banner at bottom */}
      <rect x="28" y="370" width="184" height="40" fill="#021e40" />
      <text
        x="42"
        y="385"
        fontSize="7"
        fill="white"
        fontFamily="system-ui"
        fontWeight="bold"
      >
        CRE8MARKET ENTEBBE
      </text>
      <text x="42" y="397" fontSize="6" fill="#94a3b8" fontFamily="system-ui">
        cre8market.com
      </text>
      <rect x="155" y="376" width="50" height="28" rx="14" fill="#6ce97a" />
      <text
        x="162"
        y="394"
        fontSize="8"
        fill="#021e40"
        fontFamily="system-ui"
        fontWeight="bold"
      >
        Install
      </text>
      {/* Home indicator */}
      <rect x="80" y="418" width="80" height="4" rx="2" fill="#cbd5e1" />
      {/* Drop shadow filter */}
      <defs>
        <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
        </filter>
      </defs>
    </svg>
  );
}

function IPhoneSvg() {
  return (
    <svg viewBox="0 0 240 460" className="w-56 mx-auto" fill="none">
      {/* Phone body */}
      <rect
        x="20"
        y="10"
        width="200"
        height="440"
        rx="36"
        stroke="#334155"
        strokeWidth="3"
        fill="#f8fafc"
      />
      {/* Notch */}
      <rect x="85" y="10" width="70" height="20" rx="10" fill="#1e293b" />
      <rect x="105" y="16" width="30" height="6" rx="3" fill="#0f172a" />
      {/* Screen */}
      <rect x="28" y="30" width="184" height="396" rx="2" fill="#f1f5f9" />
      {/* Status bar */}
      <text
        x="40"
        y="46"
        fontSize="8"
        fill="#1e293b"
        fontFamily="system-ui"
        fontWeight="bold"
      >
        9:41
      </text>
      {/* Safari browser bar */}
      <rect x="28" y="54" width="184" height="36" fill="#e2e8f0" />
      <rect
        x="36"
        y="62"
        width="144"
        height="20"
        rx="10"
        fill="white"
        stroke="#cbd5e1"
        strokeWidth="1"
      />
      <text x="46" y="76" fontSize="7" fill="#94a3b8" fontFamily="system-ui">
        cre8market.com
      </text>
      {/* Share button highlighted */}
      <rect
        x="178"
        y="58"
        width="28"
        height="28"
        rx="6"
        fill="#dc2626"
        fillOpacity="0.15"
        stroke="#dc2626"
        strokeWidth="1.5"
        strokeDasharray="3 2"
      />
      {/* Share icon */}
      <path
        d="M192 68 L192 78 M188 72 L192 68 L196 72"
        stroke="#dc2626"
        strokeWidth="1.5"
      />
      <rect x="188" y="78" width="8" height="2" rx="1" fill="#dc2626" />
      {/* Arrow callout */}
      <path d="M208 58 L220 50 L230 50" stroke="#dc2626" strokeWidth="1.5" />
      <polygon points="230,50 225,46 225,54" fill="#dc2626" />
      <text
        x="218"
        y="44"
        fontSize="6"
        fill="#dc2626"
        fontFamily="system-ui"
        fontWeight="bold"
      >
        STEP 2
      </text>
      {/* Webpage content */}
      <rect x="36" y="96" width="168" height="14" rx="3" fill="#cbd5e1" />
      <rect x="36" y="114" width="120" height="10" rx="2" fill="#e2e8f0" />
      <rect x="36" y="130" width="168" height="100" rx="6" fill="#e2e8f0" />
      <rect x="36" y="238" width="168" height="14" rx="3" fill="#cbd5e1" />
      {/* Share sheet overlay */}
      <rect
        x="28"
        y="270"
        width="184"
        height="156"
        fill="white"
        stroke="#e2e8f0"
        strokeWidth="1"
        rx="2"
      />
      <text
        x="42"
        y="288"
        fontSize="8"
        fill="#1e293b"
        fontFamily="system-ui"
        fontWeight="bold"
        textAnchor="middle"
      >
        Share
      </text>
      {/* Share sheet rows */}
      <rect x="36" y="296" width="50" height="50" rx="10" fill="#e2e8f0" />
      <text
        x="61"
        y="326"
        fontSize="6"
        fill="#475569"
        fontFamily="system-ui"
        textAnchor="middle"
      >
        Messages
      </text>
      <rect x="94" y="296" width="50" height="50" rx="10" fill="#e2e8f0" />
      <text
        x="119"
        y="326"
        fontSize="6"
        fill="#475569"
        fontFamily="system-ui"
        textAnchor="middle"
      >
        Mail
      </text>
      <rect x="152" y="296" width="50" height="50" rx="10" fill="#e2e8f0" />
      <text
        x="177"
        y="326"
        fontSize="6"
        fill="#475569"
        fontFamily="system-ui"
        textAnchor="middle"
      >
        Notes
      </text>
      {/* Add to Home Screen highlighted */}
      <rect
        x="36"
        y="356"
        width="50"
        height="50"
        rx="10"
        fill="#dc2626"
        fillOpacity="0.1"
        stroke="#dc2626"
        strokeWidth="1.5"
      />
      <text
        x="61"
        y="386"
        fontSize="6"
        fill="#dc2626"
        fontFamily="system-ui"
        textAnchor="middle"
        fontWeight="bold"
      >
        Add to Home
      </text>
      <path
        d="M61 368 L61 378 M57 373 L61 368 L65 373"
        stroke="#dc2626"
        strokeWidth="1.5"
      />
      <rect x="94" y="356" width="50" height="50" rx="10" fill="#e2e8f0" />
      <text
        x="119"
        y="386"
        fontSize="6"
        fill="#475569"
        fontFamily="system-ui"
        textAnchor="middle"
      >
        Safari
      </text>
      <rect x="152" y="356" width="50" height="50" rx="10" fill="#e2e8f0" />
      <text
        x="177"
        y="386"
        fontSize="6"
        fill="#475569"
        fontFamily="system-ui"
        textAnchor="middle"
      >
        Copy
      </text>
      {/* Arrow callout 2 */}
      <path d="M42 420 L60 430 L80 430" stroke="#dc2626" strokeWidth="1.5" />
      <polygon points="80,430 73,426 73,434" fill="#dc2626" />
      <text
        x="42"
        y="432"
        fontSize="6"
        fill="#dc2626"
        fontFamily="system-ui"
        fontWeight="bold"
      >
        STEP 3
      </text>
      {/* Home indicator */}
      <rect x="80" y="418" width="80" height="4" rx="2" fill="#cbd5e1" />
    </svg>
  );
}

function HomeScreenSvg() {
  return (
    <svg viewBox="0 0 240 460" className="w-56 mx-auto" fill="none">
      <rect
        x="20"
        y="10"
        width="200"
        height="440"
        rx="24"
        stroke="#334155"
        strokeWidth="3"
        fill="#f8fafc"
      />
      <rect x="28" y="30" width="184" height="396" rx="2" fill="#0f172a" />
      {/* Status bar */}
      <text
        x="40"
        y="46"
        fontSize="8"
        fill="white"
        fontFamily="system-ui"
        fontWeight="bold"
      >
        10:28
      </text>
      {/* Home screen grid */}
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={44 + col * 56}
            y={70 + row * 80}
            width="44"
            height="44"
            rx="10"
            fill="#1e293b"
          />
        )),
      )}
      {/* Installed app icon - highlighted */}
      <rect
        x="44"
        y="70"
        width="44"
        height="44"
        rx="10"
        fill="#021e40"
        stroke="#6ce97a"
        strokeWidth="2"
      />
      <text x="66" y="96" fontSize="16" textAnchor="middle" fill="#6ce97a">
        C
      </text>
      <text
        x="66"
        y="124"
        fontSize="6"
        textAnchor="middle"
        fill="white"
        fontFamily="system-ui"
      >
        CRE8MARKET
      </text>
      {/* Arrow callout */}
      <path d="M100 92 L130 82 L140 82" stroke="#6ce97a" strokeWidth="1.5" />
      <polygon points="140,82 133,78 133,86" fill="#6ce97a" />
      <text
        x="130"
        y="76"
        fontSize="6"
        fill="#6ce97a"
        fontFamily="system-ui"
        fontWeight="bold"
      >
        STEP 5
      </text>
      {/* Other icons */}
      {[1, 2].map((col) => (
        <text
          key={col}
          x={66 + col * 56}
          y="124"
          fontSize="6"
          textAnchor="middle"
          fill="#94a3b8"
          fontFamily="system-ui"
        >
          App
        </text>
      ))}
      <text
        x="156"
        y="124"
        fontSize="6"
        textAnchor="middle"
        fill="#94a3b8"
        fontFamily="system-ui"
      >
        Photos
      </text>
      {/* Dock */}
      <rect
        x="28"
        y="320"
        width="184"
        height="60"
        rx="16"
        fill="#1e293b"
        fillOpacity="0.5"
      />
      {[0, 1, 2].map((col) => (
        <rect
          key={`dock-${col}`}
          x={44 + col * 56}
          y="328"
          width="44"
          height="44"
          rx="10"
          fill="#334155"
        />
      ))}
      <text
        x="66"
        y="382"
        fontSize="6"
        textAnchor="middle"
        fill="#94a3b8"
        fontFamily="system-ui"
      >
        Phone
      </text>
      <text
        x="122"
        y="382"
        fontSize="6"
        textAnchor="middle"
        fill="#94a3b8"
        fontFamily="system-ui"
      >
        Messages
      </text>
      <text
        x="178"
        y="382"
        fontSize="6"
        textAnchor="middle"
        fill="#94a3b8"
        fontFamily="system-ui"
      >
        Chrome
      </text>
      {/* Home indicator */}
      <rect x="80" y="418" width="80" height="4" rx="2" fill="#475569" />
    </svg>
  );
}

function ConfirmInstallSvg() {
  return (
    <svg viewBox="0 0 240 460" className="w-56 mx-auto" fill="none">
      <rect
        x="20"
        y="10"
        width="200"
        height="440"
        rx="24"
        stroke="#334155"
        strokeWidth="3"
        fill="#f8fafc"
      />
      <rect
        x="28"
        y="30"
        width="184"
        height="396"
        rx="2"
        fill="#f1f5f9"
        opacity="0.3"
      />
      {/* Backdrop overlay */}
      <rect
        x="28"
        y="30"
        width="184"
        height="396"
        fill="black"
        fillOpacity="0.4"
      />
      {/* Install dialog */}
      <rect x="30" y="130" width="180" height="200" rx="16" fill="white" />
      <rect x="90" y="148" width="60" height="60" rx="14" fill="#021e40" />
      <text
        x="120"
        y="184"
        fontSize="24"
        textAnchor="middle"
        fill="#6ce97a"
        fontFamily="system-ui"
        fontWeight="bold"
      >
        C
      </text>
      <text
        x="120"
        y="220"
        fontSize="12"
        textAnchor="middle"
        fill="#1e293b"
        fontFamily="system-ui"
        fontWeight="bold"
      >
        CRE8MARKET
      </text>
      <text
        x="120"
        y="236"
        fontSize="8"
        textAnchor="middle"
        fill="#64748b"
        fontFamily="system-ui"
      >
        cre8market.com
      </text>
      <text
        x="120"
        y="258"
        fontSize="8"
        textAnchor="middle"
        fill="#475569"
        fontFamily="system-ui"
      >
        Add to Home screen
      </text>
      {/* Cancel button */}
      <rect x="40" y="278" width="80" height="36" rx="18" fill="#e2e8f0" />
      <text
        x="80"
        y="300"
        fontSize="9"
        textAnchor="middle"
        fill="#475569"
        fontFamily="system-ui"
        fontWeight="bold"
      >
        Cancel
      </text>
      {/* Install button highlighted */}
      <rect x="130" y="278" width="70" height="36" rx="18" fill="#6ce97a" />
      <text
        x="165"
        y="300"
        fontSize="9"
        textAnchor="middle"
        fill="#021e40"
        fontFamily="system-ui"
        fontWeight="bold"
      >
        Install
      </text>
      {/* Arrow callout */}
      <path d="M200 278 L220 268 L230 268" stroke="#dc2626" strokeWidth="1.5" />
      <polygon points="230,268 223,264 223,272" fill="#dc2626" />
      <text
        x="218"
        y="262"
        fontSize="6"
        fill="#dc2626"
        fontFamily="system-ui"
        fontWeight="bold"
      >
        STEP 4
      </text>
      {/* Home indicator */}
      <rect x="80" y="418" width="80" height="4" rx="2" fill="#cbd5e1" />
    </svg>
  );
}

const WHY_INSTALL = [
  {
    icon: Zap,
    title: "Faster access",
    description:
      "Open the app directly from your home screen — no typing a URL.",
  },
  {
    icon: Bell,
    title: "Push notifications",
    description: "Get notified about new deals, messages, and offers.",
  },
];

const ANDROID_STEPS = [
  {
    step: "1",
    title: "Open in Chrome",
    desc: "Make sure you are viewing this site in the Google Chrome browser on your Android phone or tablet.",
  },
  {
    step: "2",
    title: "Tap the Menu",
    desc: "Tap the three-dot menu icon (⋮) in the top-right corner of the Chrome browser.",
  },
  {
    step: "3",
    title: 'Select "Install App"',
    desc: 'From the dropdown menu, tap "Install app" or "Add to Home screen". You may see an install banner at the bottom — tap "Install".',
  },
  {
    step: "4",
    title: "Confirm Installation",
    desc: 'A pop-up will appear showing the app name and icon. Tap "Install" again to confirm. The app will be downloaded and added to your home screen.',
  },
  {
    step: "5",
    title: "Launch the App",
    desc: "Find the CRE8MARKET ENTEBBE icon on your home screen and tap it to open. It will launch like a native app, with no browser address bar.",
  },
];

const IOS_STEPS = [
  {
    step: "1",
    title: "Open in Google Chrome",
    desc: "For the best results, open this site in Google Chrome on your iPhone or iPad. Chrome offers the smoothest install flow and better push notification support.",
  },
  {
    step: "2",
    title: "Tap the Menu",
    desc: "Tap the three-dot menu icon in the Chrome browser, then choose the install option or share menu depending on your device version.",
  },
  {
    step: "3",
    title: 'Choose "Install App" or "Add to Home Screen"',
    desc: 'From the menu or share sheet, tap "Install app" or "Add to Home Screen" to continue the setup.',
  },
  {
    step: "4",
    title: "Confirm & Add",
    desc: 'Review the app name, then tap "Install" or "Add". Your CRE8MARKET shortcut will appear on the home screen.',
  },
  {
    step: "5",
    title: "Enable Push Notifications",
    desc: "After installation, allow notifications when prompted so you get deal alerts, messages, and updates even when you are not using the app.",
  },
];

const TIPS = [
  "Make sure your browser is up to date for the best install experience.",
  "On Android, you may need to dismiss the install banner if you want to use the menu method.",
  "On iPhone/iPad, Google Chrome is recommended for a smoother install flow and better push notification support.",
  "Once installed, the app will auto-update every time you open it while online.",
  'You can uninstall it like any other app — long-press the icon and select "Remove" or "Uninstall".',
];

export default async function InstallPage() {
  const pushEnabled = await isFeatureEnabled("push-notifications");

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Navbar />

      <PageHero
        backHref="/"
        backLabel="Back to home"
        eyebrow="Get the app"
        eyebrowIcon={Sparkles}
        align="center"
        size="large"
        title={
          <>
            Install the app.{" "}
            <span className="mt-1 block bg-gradient-to-r from-primary via-emerald-300 to-teal-200 bg-clip-text text-transparent">
              Skip the store.
            </span>
          </>
        }
        description="Install CRE8MARKET ENTEBBE on your phone for a faster, app-like experience — directly from your browser, no Play Store or App Store needed."
      >
        <div className="flex justify-center">
          <InstallAppButton />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-primary" />
            Android &amp; iOS
          </span>
          <span className="inline-flex items-center gap-2">
            <Download className="h-4 w-4 text-primary" />
            Add to home screen
          </span>
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            No store required
          </span>
        </div>
      </PageHero>

      <main className="page-ambient container py-10 pb-28 sm:py-14 sm:pb-14">
        {/* Notifications */}
        {pushEnabled && (
          <ScrollReveal delay={60}>
            <div className="mx-auto max-w-md text-center">
              <p className="mb-3 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-primary/80">
                <Bell className="h-3.5 w-3.5" />
                Stay in the loop
              </p>
              <EnableNotificationsButton />
            </div>
          </ScrollReveal>
        )}

        {/* Why install */}
        <ScrollReveal delay={80}>
          <div className="mt-12">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">
                Why install
              </p>
              <h2 className="mt-3 font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                A faster way to browse.
              </h2>
            </div>

            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {WHY_INSTALL.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex items-start gap-4 rounded-2xl border border-border/70 bg-card/70 p-5 transition hover:border-primary/40"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Android */}
        <ScrollReveal delay={120}>
          <section className="relative mt-10 overflow-hidden rounded-3xl border border-border/70 bg-card/80 p-6 backdrop-blur-sm sm:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-[80px]"
            />
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                  <Smartphone className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-heading text-xl font-extrabold tracking-tight text-foreground">
                    Install on Android
                  </h2>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Globe className="h-3.5 w-3.5" />
                    Best in Google Chrome
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Android devices (Chrome browser) support adding this website to
                your home screen as an app. Follow the steps below:
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Steps 1 – 3
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Open in Chrome → Tap the menu → Select &quot;Install app&quot;
                  </p>
                  <div className="mt-3">
                    <AndroidPhoneSvg />
                  </div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Step 4
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Tap &quot;Install&quot; to confirm
                  </p>
                  <div className="mt-3">
                    <ConfirmInstallSvg />
                  </div>
                </div>
              </div>

              <ol className="mt-6 grid gap-4 sm:grid-cols-2">
                {ANDROID_STEPS.map((s) => (
                  <li key={s.step} className="flex gap-3.5">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-primary/30 bg-primary/10 text-xs font-bold text-primary">
                      {s.step}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {s.title}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {s.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </ScrollReveal>

        {/* iOS */}
        <ScrollReveal delay={160}>
          <section className="mt-6 overflow-hidden rounded-3xl border border-border/70 bg-card/80 p-6 backdrop-blur-sm sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                <Apple className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-heading text-xl font-extrabold tracking-tight text-foreground">
                  Install on iPhone / iPad (iOS)
                </h2>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Globe className="h-3.5 w-3.5" />
                  Recommended flow
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-primary/25 bg-primary/5 p-4 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">
                For the best experience, use Google Chrome on iPhone/iPad.
              </p>
              <p className="mt-1 leading-relaxed">
                Chrome gives a smoother install flow and supports push
                notifications so you can receive deal alerts and updates even
                when the app is not open.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-border/60 bg-muted/20 p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Recommended flow
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Open in Chrome → Tap the menu → Choose &quot;Install app&quot; or
                &quot;Add to Home Screen&quot;
              </p>
              <div className="mt-3">
                <IPhoneSvg />
              </div>
            </div>

            <ol className="mt-6 grid gap-4 sm:grid-cols-2">
              {IOS_STEPS.map((s) => (
                <li key={s.step} className="flex gap-3.5">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-primary/30 bg-primary/10 text-xs font-bold text-primary">
                    {s.step}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-foreground">{s.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {s.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </ScrollReveal>

        {/* Final result */}
        <ScrollReveal delay={180}>
          <section className="mt-6 grid gap-6 overflow-hidden rounded-3xl border border-border/70 bg-card/80 p-6 backdrop-blur-sm sm:p-8 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                  <Home className="h-5 w-5" />
                </span>
                <h2 className="font-heading text-xl font-extrabold tracking-tight text-foreground">
                  Final Result
                </h2>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Once installed, the app icon appears on your home screen just
                like any other app. Tap it to launch directly — no browser
                needed.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                <Check className="h-3.5 w-3.5" />
                App-like experience
              </div>
            </div>
            <div className="mx-auto w-full max-w-xs rounded-2xl border border-border/60 bg-muted/20 p-4">
              <HomeScreenSvg />
            </div>
          </section>
        </ScrollReveal>

        {/* Tips */}
        <ScrollReveal delay={200}>
          <div className="mt-6 rounded-3xl border border-secondary/30 bg-secondary/10 p-5 sm:p-6">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-secondary">
              <Lightbulb className="h-3.5 w-3.5" />
              Tips
            </p>
            <ul className="mt-4 space-y-2.5">
              {TIPS.map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-2.5 text-sm text-muted-foreground"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
      </main>

      <Footer />
    </div>
  );
}
