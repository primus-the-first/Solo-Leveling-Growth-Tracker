import { SLSystemEye } from './icons/SLIcons';

const SystemButton = ({ onClick, darkMode = true }) => (
  <button
    onClick={onClick}
    title="Ask The System"
    className="group relative flex items-center gap-2 px-3 py-2 transition-all duration-200 overflow-hidden"
    style={{
      border: '1px solid rgba(78,154,254,0.35)',
      borderRadius: '3px',
      background: 'rgba(78,154,254,0.07)',
      fontFamily: 'Orbitron, sans-serif',
      fontSize: '0.62rem',
      letterSpacing: '0.18em',
    }}
  >
    {/* Hover glow sweep */}
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{ background: 'linear-gradient(90deg, rgba(78,154,254,0.08), rgba(118,255,250,0.06), rgba(78,154,254,0.08))' }}
    />

    <SLSystemEye
      size={16}
      style={{ color: 'var(--sl-blue)', flexShrink: 0, position: 'relative' }}
      className="group-hover:drop-shadow-[0_0_4px_rgba(78,154,254,0.9)] transition-all duration-200"
    />

    <span
      className="relative"
      style={{ color: 'var(--sl-blue)' }}
    >
      SYSTEM
    </span>

    {/* Bottom active line */}
    <div
      className="absolute bottom-0 left-0 right-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
      style={{ height: '1px', background: 'linear-gradient(90deg, var(--sl-blue), var(--sl-aqua))' }}
    />
  </button>
);

export default SystemButton;
