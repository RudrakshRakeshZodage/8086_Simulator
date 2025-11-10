import React from 'react';

interface MemoryViewerProps {
  memory?: number[];
  startAddress?: number;
  highlightAddress?: number | null;
}

export const MemoryViewer: React.FC<MemoryViewerProps> = ({ 
  memory = [], 
  startAddress = 0,
  highlightAddress 
}) => {
  const formatHex = (value: number, digits: number = 2) => 
    value.toString(16).toUpperCase().padStart(digits, '0');

  const renderMemoryGrid = () => {
    const rows: JSX.Element[] = [];
    const bytesPerRow = 16;

    for (let i = 0; i < Math.min(memory.length, 512); i += bytesPerRow) {
      const address = startAddress + i;
      const rowBytes = memory.slice(i, i + bytesPerRow);

      rows.push(
        <div key={address} className="flex items-center gap-2 font-mono text-sm">
          <span className="text-yellow-400 font-semibold w-16">
            {formatHex(address, 4)}:
          </span>
          <div className="flex gap-1">
            {rowBytes.map((byte, idx) => {
              const byteAddress = address + idx;
              const isHighlighted = byteAddress === highlightAddress;
              
              return (
                <span
                  key={idx}
                  className={`px-1 py-0.5 rounded transition-all ${
                    isHighlighted
                      ? 'bg-red-500 text-white font-bold shadow-lg'
                      : byte !== 0
                      ? 'text-green-400'
                      : 'text-gray-600'
                  }`}
                >
                  {formatHex(byte)}
                </span>
              );
            })}
          </div>
          <span className="text-gray-500 ml-2">
            {rowBytes.map(b => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '.')).join('')}
          </span>
        </div>
      );
    }

    return rows;
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg h-full overflow-auto">
      <h2 className="text-white font-bold text-xl mb-4 border-b border-gray-600 pb-2">
        💾 Memory View
      </h2>
      <div className="space-y-1">
        {memory.length > 0 ? (
          renderMemoryGrid()
        ) : (
          <p className="text-gray-400 text-center py-8">No memory data loaded</p>
        )}
      </div>
    </div>
  );
};