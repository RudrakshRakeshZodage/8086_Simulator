import React from 'react';

interface MemoryViewerProps {
  memory: number[];
  startAddress: number;
  highlightAddress?: number;
}

export const MemoryViewer: React.FC<MemoryViewerProps> = ({ memory, startAddress, highlightAddress }) => {
  const rows = [];
  const bytesPerRow = 16; // Increased density for single screen

  for (let i = 0; i < memory.length; i += bytesPerRow) {
    rows.push(memory.slice(i, i + bytesPerRow));
  }

  return (
    <div className="glass-panel p-3 flex flex-col gap-2 min-h-0 min-w-0 flex-1 hardware-depth">
      <div className="border-b border-white/10 pb-1.5 flex justify-between items-center">
        <h2 className="text-white/30 font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-2">
            RAM Workspace (0x00 - 0x1FF)
        </h2>
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                <span className="text-[8px] text-yellow-500/70 font-black uppercase">Accessed</span>
            </div>
            <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                <span className="text-[8px] text-white/30 font-black uppercase">Stored</span>
            </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-[9px]">
        <table className="w-full border-collapse border-separate border-spacing-0.5">
          <thead>
            <tr className="text-white/10 font-black uppercase tracking-tighter">
              <th className="p-1 text-left w-10">Addr</th>
              {[...Array(bytesPerRow)].map((_, i) => (
                <th key={i} className="p-1">{i.toString(16).toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                <td className="p-1 text-white/20 font-bold group-hover:text-blue-500/50 transition-colors">
                  0x{(startAddress + rowIndex * bytesPerRow).toString(16).toUpperCase().padStart(2, '0')}
                </td>
                {row.map((byte, byteIndex) => {
                  const currentAddr = startAddress + rowIndex * bytesPerRow + byteIndex;
                  const isHighlighted = currentAddr === highlightAddress;
                  return (
                    <td 
                      key={byteIndex} 
                      className={`p-1 text-center font-bold tracking-tighter transition-all duration-200 border border-transparent ${
                        isHighlighted 
                          ? 'bg-blue-600 text-white rounded z-10' 
                          : byte !== 0 
                            ? 'text-white/80 bg-white/5 rounded-sm' 
                            : 'text-white/5'
                      }`}
                    >
                      {byte.toString(16).toUpperCase().padStart(2, '0')}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};