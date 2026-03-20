# 🖥️ Visual 8086 Assembly Simulator

An interactive, browser-based environment for learning 8086 assembly programming with real-time CPU visualization. Write assembly code and watch the CPU come to life — step by step, pin by pin!

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.12-blue.svg)
![React](https://img.shields.io/badge/react-18.3-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.5-blue.svg)

> **Made by [Rudraksh Rakesh Zodage](https://github.com/RudrakshRakeshZodage)**

---

## ✨ Features

### 🎯 Real-Time Visualization
- **Live Register Panel**: All 12 registers (AX, BX, CX, DX, SI, DI, BP, SP, CS, DS, ES, SS) displayed in a compact 4-column grid
- **Memory Viewer**: 512-byte RAM workspace with highlighted memory access
- **Flags Panel**: Monitor all CPU flags (CF, PF, AF, ZF, SF, OF, etc.) live
- **Execution Dashboard**: After each instruction, see exactly what changed — registers, flags, and memory

### ⚙️ Hardware Pin Visualization (3D)
- **3D 8086 Chip**: An interactive 3D model of the Intel 8086 DIP-40 chip showing all 40 pins
- **Live Pin State**: Active pins (RD, WR, ALE, AD0–AD15, VCC, CLK) are highlighted in real-time
- **"Why this pin?"**: The dashboard explains *exactly why* each pin is used for the current instruction
  - e.g., "ALE pulses to latch the address. RD goes LOW to read from memory."

### 💻 Code Editor
- **Syntax Highlighting**: Monaco Editor with 8086 assembly support
- **Line Tracking**: Current Instruction Pointer (IP) is highlighted during execution
- **IntelliSense**: Auto-complete for instructions

### 🎮 Execution Controls
- **Step-by-Step**: Execute one instruction at a time
- **Run Mode**: Auto-execute with configurable speed (50ms–2000ms)
- **Pause / Resume / Reset**

### 🔧 Supported Instructions

| Category | Instructions |
|---|---|
| Data Transfer | `MOV`, `PUSH`, `POP` |
| Arithmetic | `ADD`, `SUB`, `INC`, `DEC` |
| Logic | `AND`, `OR`, `XOR`, `NOT` |
| Comparison | `CMP` |
| Control Flow | `JMP`, `JZ/JE`, `JNZ/JNE`, `CALL`, `RET`, `LOOP` |
| System | `NOP`, `HLT` |

---

## 🏗️ Architecture

```
┌─────────────────┐      WebSocket       ┌──────────────────┐
│ React Frontend  │ ◄───────────────────► │  FastAPI Backend │
│  (TypeScript)   │                       │     (Python)     │
│                 │                       │                  │
│ • Monaco Editor │                       │ • CPU Emulator   │
│ • 3D Pin Viz    │                       │ • Memory Manager │
│ • Live Dashboard│                       │ • Instruction    │
│ • WebSocket     │                       │   Set Handler    │
└─────────────────┘                       └──────────────────┘
```

**Frontend**: React 18 + TypeScript + Vite + TailwindCSS + Monaco Editor  
**Backend**: Python 3.12 + FastAPI + Uvicorn + WebSocket

---

## 🚀 Getting Started

### Prerequisites
- Python 3.12+
- Node.js 18+ and npm
- Git

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/RudrakshRakeshZodage/8086_Simulator.git
cd 8086_Simulator
```

#### 2. Backend Setup

```bash
cd backend
python3 -m venv 8086Sim
# Windows:
8086Sim\Scripts\activate
# macOS/Linux:
# source 8086Sim/bin/activate
pip install -r requirements.txt
python3 main.py
```

Server starts at `http://0.0.0.0:8000`

#### 3. Frontend Setup

Open a **new terminal** and run:

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at `http://localhost:5173`

---

## 📖 Usage Examples

### Basic Arithmetic
```assembly
MOV AX, 5      ; Load 5 into AX
MOV BX, 3      ; Load 3 into BX
ADD AX, BX     ; AX = 8  → ALU activates, ZF/SF flags update
MOV CX, AX     ; Copy result to CX
INC CX         ; CX = 9
SUB CX, 2      ; CX = 7
```

### Stack Operations
```assembly
MOV AX, 100h
MOV BX, 200h
PUSH AX        ; WR pin active, SP decrements
PUSH BX
POP DX         ; RD pin active, SP increments
POP SI
```

### Memory Read/Write
```assembly
MOV AX, 1234h
MOV [0x100], AX  ; ALE + WR pins activate
MOV BX, [0x100]  ; ALE + RD pins activate
ADD BX, 100h
MOV [0x102], BX
```

### Loop
```assembly
MOV CX, 5
COUNT_LOOP:
    MOV AX, CX
    DEC CX
    JNZ COUNT_LOOP
HLT
```

---

## 🎯 Educational Insights

| Action | What you'll learn |
|---|---|
| `MOV AX, BX` | Internal CPU register transfer — no bus pins used |
| `MOV [0x100], AX` | ALE latches address → WR goes LOW → data written |
| `ADD AX, BX` | ALU activates, flags (ZF, SF, CF, OF) computed |
| `PUSH AX` | SP decrements, WR pin active, stack segment used |
| `JZ label` | ZF flag checked — CPU jumps only if zero |

---

## 🤝 Contributing

Contributions welcome!

1. Fork this repo
2. Create feature branch: `git checkout -b feature/YourFeature`
3. Commit: `git commit -m 'Add YourFeature'`
4. Push: `git push origin feature/YourFeature`
5. Open a Pull Request

---

## 📝 License

MIT License — see [LICENSE.md](LICENSE.md) for details.

## 🙏 Acknowledgments

- Intel 8086 Programmer's Reference Manual
- Monaco Editor by Microsoft
- FastAPI Framework
- React Community

## 🔮 Future Enhancements

- [ ] MUL, DIV, shift, and rotate instructions
- [ ] Register-indirect addressing `[SI]`, `[BX+SI]`
- [ ] Breakpoint support
- [ ] Instruction history log
- [ ] Export/import assembly files

---

**Made with ❤️ by [Rudraksh Rakesh Zodage](https://github.com/RudrakshRakeshZodage)**