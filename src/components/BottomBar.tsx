import { Icons } from './Icons';

export function BottomBar({ 
  leftLabel = "Repeat", 
  rightLabel = "Next", 
  centerLabel = "Enable Tool",
  centerIcon: CenterIcon = Icons.Enable,
  onLeftClick,
  onRightClick,
  onCenterClick
}: { 
  leftLabel?: string, 
  rightLabel?: string, 
  centerLabel?: string,
  centerIcon?: any,
  onLeftClick?: () => void,
  onRightClick?: () => void,
  onCenterClick?: () => void
}) {
  return (
    <nav className="fixed bottom-0 left-72 right-0 z-40 flex justify-around items-center h-24 px-12 bg-surface-container border-t border-outline-variant/10 shadow-2xl rounded-t-xl">
      <button 
        onClick={onLeftClick}
        className="text-on-surface-variant px-4 py-2 hover:bg-surface-container-high rounded-full flex flex-col items-center transition-all active:scale-95"
      >
        <Icons.Repeat className="w-5 h-5" />
        <span className="font-medium text-[10px] mt-1 uppercase tracking-widest">{leftLabel}</span>
      </button>

      <button 
        onClick={onCenterClick}
        className="primary-gradient text-on-primary rounded-full px-10 py-3 flex items-center gap-3 shadow-lg hover:scale-105 active:scale-95 transition-all"
      >
        <CenterIcon className="w-5 h-5" />
        <span className="font-bold uppercase tracking-wider">{centerLabel}</span>
      </button>

      <button 
        onClick={onRightClick}
        className="text-on-surface-variant px-4 py-2 hover:bg-surface-container-high rounded-full flex flex-col items-center transition-all active:scale-95"
      >
        <Icons.ArrowRight className="w-5 h-5" />
        <span className="font-medium text-[10px] mt-1 uppercase tracking-widest">{rightLabel}</span>
      </button>
    </nav>
  );
}
