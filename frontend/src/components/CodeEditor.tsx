import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  currentLine?: number;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, currentLine }) => {
  return (
    <div className="h-full bg-gray-900 rounded-lg overflow-hidden shadow-lg">
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
        <h2 className="text-white font-semibold text-lg">📝 Assembly Code Editor</h2>
      </div>
      <Editor
        height="calc(100% - 48px)"
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
        }}
      />
    </div>
  );
};