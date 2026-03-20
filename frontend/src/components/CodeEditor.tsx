import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  currentLine?: number;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, currentLine }) => {
  return (
    <div className="glass-panel flex-1 flex flex-col min-h-0 relative group overflow-hidden hardware-depth">
      <div className="bg-white/5 px-4 py-3 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
          <span className="ml-2 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Source Code</span>
        </div>
        <div className="text-[9px] text-blue-400 font-bold bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/20 uppercase tracking-tighter">8086.asm</div>
      </div>
      
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          defaultLanguage="plaintext"
          theme="vs-dark"
          value={code}
          onChange={(value) => onChange(value || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            renderLineHighlight: 'all',
            padding: { top: 16, bottom: 16 },
          }}
          onMount={(_, monaco) => {
            monaco.editor.defineTheme('custom-dark', {
              base: 'vs-dark',
              inherit: true,
              rules: [],
              colors: {
                'editor.background': '#00000000',
              }
            });
            monaco.editor.setTheme('custom-dark');
          }}
        />
      </div>
      
      <div className="bg-white/5 px-4 py-2 border-t border-white/10 flex justify-between items-center text-[9px] font-bold text-white/20 uppercase tracking-widest">
        <span>Instruction Trace</span>
        <span className="text-blue-400/50">IP: 0x{currentLine?.toString(16).toUpperCase().padStart(4, '0') || '0000'}</span>
      </div>
    </div>
  );
};