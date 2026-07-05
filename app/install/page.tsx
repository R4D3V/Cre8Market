import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'

function AndroidPhoneSvg() {
  return (
    <svg viewBox="0 0 240 460" className="w-56 mx-auto" fill="none">
      {/* Phone body */}
      <rect x="20" y="10" width="200" height="440" rx="24" stroke="#334155" strokeWidth="3" fill="#f8fafc" />
      <rect x="28" y="30" width="184" height="396" rx="2" fill="#f1f5f9" />
      {/* Status bar */}
      <rect x="28" y="30" width="184" height="24" fill="#021e40" rx="2" />
      <text x="40" y="46" fontSize="8" fill="white" fontFamily="system-ui">10:28</text>
      {/* Chrome browser bar */}
      <rect x="28" y="54" width="184" height="36" fill="#e2e8f0" />
      <rect x="36" y="62" width="120" height="20" rx="10" fill="white" stroke="#cbd5e1" strokeWidth="1" />
      <text x="46" y="76" fontSize="7" fill="#94a3b8" fontFamily="system-ui">cre8market.com</text>
      {/* Three-dot menu highlighted */}
      <circle cx="196" cy="72" r="3" fill="#64748b" />
      <rect x="182" y="58" width="28" height="28" rx="6" fill="#dc2626" fillOpacity="0.15" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3 2" />
      {/* Dropdown menu */}
      <rect x="130" y="94" width="76" height="80" rx="6" fill="white" stroke="#e2e8f0" strokeWidth="1" filter="url(#shadow)" />
      <rect x="138" y="102" width="60" height="16" rx="3" fill="#dc2626" fillOpacity="0.15" />
      <text x="142" y="114" fontSize="6" fill="#dc2626" fontFamily="system-ui" fontWeight="bold">Install app</text>
      <text x="142" y="130" fontSize="6" fill="#475569" fontFamily="system-ui">Add to Home screen</text>
      <text x="142" y="144" fontSize="6" fill="#475569" fontFamily="system-ui">Share…</text>
      <text x="142" y="158" fontSize="6" fill="#475569" fontFamily="system-ui">Settings</text>
      {/* Arrow callout */}
      <path d="M208 58 L220 50 L230 50" stroke="#dc2626" strokeWidth="1.5" />
      <polygon points="230,50 225,46 225,54" fill="#dc2626" />
      <text x="218" y="44" fontSize="6" fill="#dc2626" fontFamily="system-ui" fontWeight="bold">STEP 2-3</text>
      {/* Webpage content */}
      <rect x="36" y="180" width="168" height="14" rx="3" fill="#cbd5e1" />
      <rect x="36" y="198" width="120" height="10" rx="2" fill="#e2e8f0" />
      <rect x="36" y="214" width="168" height="90" rx="6" fill="#e2e8f0" />
      <rect x="36" y="310" width="168" height="14" rx="3" fill="#cbd5e1" />
      {/* Install banner at bottom */}
      <rect x="28" y="370" width="184" height="40" fill="#021e40" />
      <text x="42" y="385" fontSize="7" fill="white" fontFamily="system-ui" fontWeight="bold">CRE8MARKET ENTEBBE</text>
      <text x="42" y="397" fontSize="6" fill="#94a3b8" fontFamily="system-ui">cre8market.com</text>
      <rect x="155" y="376" width="50" height="28" rx="14" fill="#6ce97a" />
      <text x="162" y="394" fontSize="8" fill="#021e40" fontFamily="system-ui" fontWeight="bold">Install</text>
      {/* Home indicator */}
      <rect x="80" y="418" width="80" height="4" rx="2" fill="#cbd5e1" />
      {/* Drop shadow filter */}
      <defs>
        <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
        </filter>
      </defs>
    </svg>
  )
}

function IPhoneSvg() {
  return (
    <svg viewBox="0 0 240 460" className="w-56 mx-auto" fill="none">
      {/* Phone body */}
      <rect x="20" y="10" width="200" height="440" rx="36" stroke="#334155" strokeWidth="3" fill="#f8fafc" />
      {/* Notch */}
      <rect x="85" y="10" width="70" height="20" rx="10" fill="#1e293b" />
      <rect x="105" y="16" width="30" height="6" rx="3" fill="#0f172a" />
      {/* Screen */}
      <rect x="28" y="30" width="184" height="396" rx="2" fill="#f1f5f9" />
      {/* Status bar */}
      <text x="40" y="46" fontSize="8" fill="#1e293b" fontFamily="system-ui" fontWeight="bold">9:41</text>
      {/* Safari browser bar */}
      <rect x="28" y="54" width="184" height="36" fill="#e2e8f0" />
      <rect x="36" y="62" width="144" height="20" rx="10" fill="white" stroke="#cbd5e1" strokeWidth="1" />
      <text x="46" y="76" fontSize="7" fill="#94a3b8" fontFamily="system-ui">cre8market.com</text>
      {/* Share button highlighted */}
      <rect x="178" y="58" width="28" height="28" rx="6" fill="#dc2626" fillOpacity="0.15" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3 2" />
      {/* Share icon */}
      <path d="M192 68 L192 78 M188 72 L192 68 L196 72" stroke="#dc2626" strokeWidth="1.5" />
      <rect x="188" y="78" width="8" height="2" rx="1" fill="#dc2626" />
      {/* Arrow callout */}
      <path d="M208 58 L220 50 L230 50" stroke="#dc2626" strokeWidth="1.5" />
      <polygon points="230,50 225,46 225,54" fill="#dc2626" />
      <text x="218" y="44" fontSize="6" fill="#dc2626" fontFamily="system-ui" fontWeight="bold">STEP 2</text>
      {/* Webpage content */}
      <rect x="36" y="96" width="168" height="14" rx="3" fill="#cbd5e1" />
      <rect x="36" y="114" width="120" height="10" rx="2" fill="#e2e8f0" />
      <rect x="36" y="130" width="168" height="100" rx="6" fill="#e2e8f0" />
      <rect x="36" y="238" width="168" height="14" rx="3" fill="#cbd5e1" />
      {/* Share sheet overlay */}
      <rect x="28" y="270" width="184" height="156" fill="white" stroke="#e2e8f0" strokeWidth="1" rx="2" />
      <text x="42" y="288" fontSize="8" fill="#1e293b" fontFamily="system-ui" fontWeight="bold" textAnchor="middle">Share</text>
      {/* Share sheet rows */}
      <rect x="36" y="296" width="50" height="50" rx="10" fill="#e2e8f0" />
      <text x="61" y="326" fontSize="6" fill="#475569" fontFamily="system-ui" textAnchor="middle">Messages</text>
      <rect x="94" y="296" width="50" height="50" rx="10" fill="#e2e8f0" />
      <text x="119" y="326" fontSize="6" fill="#475569" fontFamily="system-ui" textAnchor="middle">Mail</text>
      <rect x="152" y="296" width="50" height="50" rx="10" fill="#e2e8f0" />
      <text x="177" y="326" fontSize="6" fill="#475569" fontFamily="system-ui" textAnchor="middle">Notes</text>
      {/* Add to Home Screen highlighted */}
      <rect x="36" y="356" width="50" height="50" rx="10" fill="#dc2626" fillOpacity="0.1" stroke="#dc2626" strokeWidth="1.5" />
      <text x="61" y="386" fontSize="6" fill="#dc2626" fontFamily="system-ui" textAnchor="middle" fontWeight="bold">Add to Home</text>
      <path d="M61 368 L61 378 M57 373 L61 368 L65 373" stroke="#dc2626" strokeWidth="1.5" />
      <rect x="94" y="356" width="50" height="50" rx="10" fill="#e2e8f0" />
      <text x="119" y="386" fontSize="6" fill="#475569" fontFamily="system-ui" textAnchor="middle">Safari</text>
      <rect x="152" y="356" width="50" height="50" rx="10" fill="#e2e8f0" />
      <text x="177" y="386" fontSize="6" fill="#475569" fontFamily="system-ui" textAnchor="middle">Copy</text>
      {/* Arrow callout 2 */}
      <path d="M42 420 L60 430 L80 430" stroke="#dc2626" strokeWidth="1.5" />
      <polygon points="80,430 73,426 73,434" fill="#dc2626" />
      <text x="42" y="432" fontSize="6" fill="#dc2626" fontFamily="system-ui" fontWeight="bold">STEP 3</text>
      {/* Home indicator */}
      <rect x="80" y="418" width="80" height="4" rx="2" fill="#cbd5e1" />
    </svg>
  )
}

function HomeScreenSvg() {
  return (
    <svg viewBox="0 0 240 460" className="w-56 mx-auto" fill="none">
      <rect x="20" y="10" width="200" height="440" rx="24" stroke="#334155" strokeWidth="3" fill="#f8fafc" />
      <rect x="28" y="30" width="184" height="396" rx="2" fill="#0f172a" />
      {/* Status bar */}
      <text x="40" y="46" fontSize="8" fill="white" fontFamily="system-ui" fontWeight="bold">10:28</text>
      {/* Home screen grid */}
      {[0, 1, 2].map(row =>
        [0, 1, 2].map(col => (
          <rect key={`${row}-${col}`} x={44 + col * 56} y={70 + row * 80} width="44" height="44" rx="10" fill="#1e293b" />
        ))
      )}
      {/* Installed app icon - highlighted */}
      <rect x="44" y="70" width="44" height="44" rx="10" fill="#021e40" stroke="#6ce97a" strokeWidth="2" />
      <text x="66" y="96" fontSize="16" textAnchor="middle" fill="#6ce97a">C</text>
      <text x="66" y="124" fontSize="6" textAnchor="middle" fill="white" fontFamily="system-ui">CRE8MARKET</text>
      {/* Arrow callout */}
      <path d="M100 92 L130 82 L140 82" stroke="#6ce97a" strokeWidth="1.5" />
      <polygon points="140,82 133,78 133,86" fill="#6ce97a" />
      <text x="130" y="76" fontSize="6" fill="#6ce97a" fontFamily="system-ui" fontWeight="bold">STEP 5</text>
      {/* Other icons */}
      {[1, 2].map(col => (
        <text key={col} x={66 + col * 56} y="124" fontSize="6" textAnchor="middle" fill="#94a3b8" fontFamily="system-ui">App</text>
      ))}
      <text x="156" y="124" fontSize="6" textAnchor="middle" fill="#94a3b8" fontFamily="system-ui">Photos</text>
      {/* Dock */}
      <rect x="28" y="320" width="184" height="60" rx="16" fill="#1e293b" fillOpacity="0.5" />
      {[0, 1, 2].map(col => (
        <rect key={`dock-${col}`} x={44 + col * 56} y="328" width="44" height="44" rx="10" fill="#334155" />
      ))}
      <text x="66" y="382" fontSize="6" textAnchor="middle" fill="#94a3b8" fontFamily="system-ui">Phone</text>
      <text x="122" y="382" fontSize="6" textAnchor="middle" fill="#94a3b8" fontFamily="system-ui">Messages</text>
      <text x="178" y="382" fontSize="6" textAnchor="middle" fill="#94a3b8" fontFamily="system-ui">Chrome</text>
      {/* Home indicator */}
      <rect x="80" y="418" width="80" height="4" rx="2" fill="#475569" />
    </svg>
  )
}

function ConfirmInstallSvg() {
  return (
    <svg viewBox="0 0 240 460" className="w-56 mx-auto" fill="none">
      <rect x="20" y="10" width="200" height="440" rx="24" stroke="#334155" strokeWidth="3" fill="#f8fafc" />
      <rect x="28" y="30" width="184" height="396" rx="2" fill="#f1f5f9" opacity="0.3" />
      {/* Backdrop overlay */}
      <rect x="28" y="30" width="184" height="396" fill="black" fillOpacity="0.4" />
      {/* Install dialog */}
      <rect x="30" y="130" width="180" height="200" rx="16" fill="white" />
      <rect x="90" y="148" width="60" height="60" rx="14" fill="#021e40" />
      <text x="120" y="184" fontSize="24" textAnchor="middle" fill="#6ce97a" fontFamily="system-ui" fontWeight="bold">C</text>
      <text x="120" y="220" fontSize="12" textAnchor="middle" fill="#1e293b" fontFamily="system-ui" fontWeight="bold">CRE8MARKET</text>
      <text x="120" y="236" fontSize="8" textAnchor="middle" fill="#64748b" fontFamily="system-ui">cre8market.com</text>
      <text x="120" y="258" fontSize="8" textAnchor="middle" fill="#475569" fontFamily="system-ui">Add to Home screen</text>
      {/* Cancel button */}
      <rect x="40" y="278" width="80" height="36" rx="18" fill="#e2e8f0" />
      <text x="80" y="300" fontSize="9" textAnchor="middle" fill="#475569" fontFamily="system-ui" fontWeight="bold">Cancel</text>
      {/* Install button highlighted */}
      <rect x="130" y="278" width="70" height="36" rx="18" fill="#6ce97a" />
      <text x="165" y="300" fontSize="9" textAnchor="middle" fill="#021e40" fontFamily="system-ui" fontWeight="bold">Install</text>
      {/* Arrow callout */}
      <path d="M200 278 L220 268 L230 268" stroke="#dc2626" strokeWidth="1.5" />
      <polygon points="230,268 223,264 223,272" fill="#dc2626" />
      <text x="218" y="262" fontSize="6" fill="#dc2626" fontFamily="system-ui" fontWeight="bold">STEP 4</text>
      {/* Home indicator */}
      <rect x="80" y="418" width="80" height="4" rx="2" fill="#cbd5e1" />
    </svg>
  )
}

export default function InstallPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8 pb-28 sm:pb-8">
        <Link href="/" className="text-sm text-navy font-semibold hover:underline mb-6 inline-block">← Home</Link>

        <ScrollReveal>
          <div className="neu-dark-card text-white text-center py-12 px-6 mb-8">
            <span className="text-5xl block mb-4">📲</span>
            <h1 className="text-3xl font-extrabold mb-3">Install the App</h1>
            <p className="text-white/70 text-base max-w-lg mx-auto">
              Install CRE8MARKET ENTEBBE on your phone for a faster, app-like experience — directly from your browser, no Play Store or App Store needed.
            </p>
          </div>
        </ScrollReveal>

        {/* Why install */}
        <ScrollReveal delay={80}>
          <div className="neu-card p-6 sm:p-8 mb-6">
            <h2 className="text-lg font-extrabold text-gray-900 mb-3">Why Install?</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: '⚡', title: 'Faster Access', desc: 'Open the app directly from your home screen — no typing a URL.' },
                { icon: '📦', title: 'Works Offline', desc: 'Browse previously viewed listings even without internet.' },
                { icon: '🔔', title: 'Push Notifications', desc: 'Get notified about new deals, messages, and offers.' },
              ].map((f) => (
                <div key={f.title} className="neu-card p-4 text-center">
                  <span className="text-3xl block mb-2">{f.icon}</span>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{f.title}</h3>
                  <p className="text-gray-500 text-xs">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Android */}
        <ScrollReveal delay={120}>
          <div className="neu-card p-6 sm:p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🤖</span>
              <h2 className="text-xl font-extrabold text-gray-900">Install on Android</h2>
            </div>
            <p className="text-gray-600 text-sm mb-5">
              Android devices (Chrome browser) support adding this website to your home screen as an app. Follow the steps below:
            </p>

            {/* Visual steps for Android */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="neu-inset p-4 text-center">
                <p className="eyebrow text-center !mb-2">Steps 1 – 3</p>
                <p className="text-xs text-gray-500 mb-3">Open in Chrome → Tap the menu → Select "Install app"</p>
                <AndroidPhoneSvg />
              </div>
              <div className="neu-inset p-4 text-center">
                <p className="eyebrow text-center !mb-2">Step 4</p>
                <p className="text-xs text-gray-500 mb-3">Tap "Install" to confirm</p>
                <ConfirmInstallSvg />
              </div>
            </div>

            <ol className="space-y-4">
              {[
                { step: '1', title: 'Open in Chrome', desc: 'Make sure you are viewing this site in the Google Chrome browser on your Android phone or tablet.' },
                { step: '2', title: 'Tap the Menu', desc: 'Tap the three-dot menu icon (⋮) in the top-right corner of the Chrome browser.' },
                { step: '3', title: 'Select "Install App"', desc: 'From the dropdown menu, tap "Install app" or "Add to Home screen". You may see an install banner at the bottom — tap "Install".' },
                { step: '4', title: 'Confirm Installation', desc: 'A pop-up will appear showing the app name and icon. Tap "Install" again to confirm. The app will be downloaded and added to your home screen.' },
                { step: '5', title: 'Launch the App', desc: 'Find the CRE8MARKET ENTEBBE icon on your home screen and tap it to open. It will launch like a native app, with no browser address bar.' },
              ].map((s) => (
                <li key={s.step} className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-navy text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                    {s.step}
                  </span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{s.title}</p>
                    <p className="text-gray-500 text-sm mt-0.5">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </ScrollReveal>

        {/* iOS */}
        <ScrollReveal delay={160}>
          <div className="neu-card p-6 sm:p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🍎</span>
              <h2 className="text-xl font-extrabold text-gray-900">Install on iPhone / iPad (iOS)</h2>
            </div>
            <p className="text-gray-600 text-sm mb-5">
              Safari on iOS supports adding websites to your home screen, making them work just like apps.
            </p>

            {/* Visual for iOS */}
            <div className="neu-inset p-4 text-center mb-8">
              <p className="eyebrow text-center !mb-2">Steps 2 – 3</p>
              <p className="text-xs text-gray-500 mb-3">Tap the Share button → Scroll down → Tap "Add to Home Screen"</p>
              <IPhoneSvg />
            </div>

            <ol className="space-y-4">
              {[
                { step: '1', title: 'Open in Safari', desc: 'Open this site in the Safari browser on your iPhone or iPad. Other browsers may not support this feature.' },
                { step: '2', title: 'Tap the Share Button', desc: 'Tap the Share icon (a square with an arrow pointing up) at the bottom of the Safari screen.' },
                { step: '3', title: 'Scroll Down & Tap "Add to Home Screen"', desc: 'Scroll down the share sheet and tap "Add to Home Screen" (it has a plus + icon).' },
                { step: '4', title: 'Customise & Tap "Add"', desc: 'You can edit the name (e.g. "CRE8MARKET"), then tap "Add" in the top-right corner. The icon will be placed on your home screen.' },
                { step: '5', title: 'Launch the App', desc: 'Tap the CRE8MARKET ENTEBBE icon on your home screen. It will open in a full-screen, app-like experience without browser tabs or address bars.' },
              ].map((s) => (
                <li key={s.step} className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-navy text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                    {s.step}
                  </span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{s.title}</p>
                    <p className="text-gray-500 text-sm mt-0.5">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </ScrollReveal>

        {/* Final home screen preview */}
        <ScrollReveal delay={180}>
          <div className="neu-card p-6 sm:p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🏠</span>
              <h2 className="text-xl font-extrabold text-gray-900">Final Result</h2>
            </div>
            <p className="text-gray-600 text-sm mb-5">
              Once installed, the app icon appears on your home screen just like any other app. Tap it to launch directly — no browser needed.
            </p>
            <div className="max-w-xs mx-auto">
              <HomeScreenSvg />
            </div>
          </div>
        </ScrollReveal>

        {/* Tips */}
        <ScrollReveal delay={200}>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-3">💡 Tips</p>
            <ul className="space-y-2 text-sm text-amber-800">
              <li>• Make sure your browser is up to date for the best install experience.</li>
              <li>• On Android, you may need to dismiss the install banner if you want to use the menu method.</li>
              <li>• On iOS, the "Add to Home Screen" option only appears in Safari, not Chrome or Firefox.</li>
              <li>• Once installed, the app will auto-update every time you open it while online.</li>
              <li>• You can uninstall it like any other app — long-press the icon and select "Remove" or "Uninstall".</li>
            </ul>
          </div>
        </ScrollReveal>
      </main>
      <Footer />
    </>
  )
}
