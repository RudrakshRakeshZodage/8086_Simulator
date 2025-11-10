# 🖥️ Visual 8086 Assembly Simulator

An interactive, browser-based environment for learning 8086 assembly programming with real-time CPU visualization. Write assembly code and watch the CPU come to life as your program executes!

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.12-blue.svg)
![React](https://img.shields.io/badge/react-18.3-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.5-blue.svg)

## ✨ Features

### 🎯 Real-Time Visualization
- **Live Register Panel**: Watch all 8086 registers (AX, BX, CX, DX, SI, DI, BP, SP, segment registers) update in real-time
- **Dynamic ALU Display**: See arithmetic and logic operations as they happen with operands and results
- **Memory Viewer**: Visualize memory contents with 512-byte display range
- **Flags Panel**: Monitor all CPU flags (CF, PF, AF, ZF, SF, OF, etc.) during execution
- **Memory Access Tracker**: See read/write operations with highlighted addresses

### 💻 Code Editor
- **Syntax Highlighting**: Monaco Editor with assembly language support
- **Line Tracking**: Current instruction pointer (IP) highlighted during execution
- **IntelliSense**: Auto-complete support for 8086 instructions

### 🎮 Execution Controls
- **Step-by-Step**: Execute one instruction at a time
- **Run Mode**: Auto-execute with adjustable speed (50ms - 2000ms)
- **Pause/Resume**: Control execution flow
- **Reset**: Restore CPU to initial state

### 🔧 Supported Instructions

**Data Transfer**: `MOV`, `PUSH`, `POP`  
**Arithmetic**: `ADD`, `SUB`, `INC`, `DEC`  
**Logic**: `AND`, `OR`, `XOR`, `NOT`  
**Comparison**: `CMP`  
**Control Flow**: `JMP`, `JZ/JE`, `JNZ/JNE`, `CALL`, `RET`, `LOOP`  
**System**: `NOP`, `HLT`  

## 🏗️ Architecture

```
┌─────────────────┐      WebSocket       ┌──────────────────┐
│ React Frontend  │ ◄───────────────────► │  FastAPI Backend │
│  (TypeScript)   │                       │     (Python)     │
│                 │                       │                  │
│ • Monaco Editor │                       │ • CPU Emulator   │
│ • Live UI       │                       │ • Memory Manager │
│ • WebSocket     │                       │ • Instruction    │
│   Client        │                       │   Set Handler    │
└─────────────────┘                       └──────────────────┘
```

**Frontend**: React 18 + TypeScript + Vite + TailwindCSS + Monaco Editor  
**Backend**: Python 3.12 + FastAPI + Uvicorn + WebSocket

## 🚀 Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+ and npm
- Git

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/JNR-10/8086-Simulator.git
cd 8086-Simulator
```

#### 2. Backend Setup

```bash
cd backend
python3 -m venv 8086Sim
source 8086Sim/bin/activate  # On Windows: 8086Sim\Scripts\activate
pip install -r requirements.txt
python3 main.py
```

Server will start on `http://0.0.0.0:8000`

#### 3. Frontend Setup

Open a **new terminal** and run:

```bash
cd frontend
npm install
npm run dev
```

Frontend will start on `http://localhost:5173`

### Access the Application

Open your browser and navigate to `http://localhost:5173`

## 📖 Usage

### Example: Basic Arithmetic

```assembly
; Simple arithmetic program
MOV AX, 5      ; Load 5 into AX
MOV BX, 3      ; Load 3 into BX
ADD AX, BX     ; AX = AX + BX (5 + 3 = 8)
MOV CX, AX     ; Copy result to CX
INC CX         ; Increment CX (8 + 1 = 9)
SUB CX, 2      ; Subtract 2 from CX (9 - 2 = 7)
```

### Example: Stack Operations

```assembly
; Stack demo
MOV AX, 100h
MOV BX, 200h
PUSH AX        ; Push AX onto stack
PUSH BX        ; Push BX onto stack
POP DX         ; Pop into DX (gets BX value = 200h)
POP SI         ; Pop into SI (gets AX value = 100h)
```

### Example: Memory Operations

```assembly
; Write and read from memory
MOV AX, 1234h       ; Load value
MOV [0x100], AX     ; Write to memory address 0x100
MOV BX, [0x100]     ; Read from memory into BX
ADD BX, 100h        ; Modify value
MOV [0x102], BX     ; Write to address 0x102
```

### Example: Loop

```assembly
; Count from 1 to 5
MOV CX, 5           ; Loop counter

COUNT_LOOP:
    MOV AX, CX      ; Move counter to AX
    DEC CX          ; Decrement counter
    JNZ COUNT_LOOP  ; Jump if not zero
    
HLT                 ; Stop execution
```

## 🎯 Key Observations

- **MOV operations** → ALU stays idle (not an ALU operation)
- **ADD/SUB/INC/DEC** → ALU lights up with purple border showing operands and result
- **Memory writes** → Memory Access panel highlights with type and address
- **Flags** → Update automatically based on operation results

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- Intel 8086 Architecture Reference
- Monaco Editor by Microsoft
- FastAPI Framework
- React Community

## 📧 Contact

LinkedIn: [https://www.linkedin.com/in/jainil-rana-ba0663224/](https://www.linkedin.com/in/jainil-rana-ba0663224/)
**GitHub**: [@JNR-10](https://github.com/JNR-10)  
**Project Link**: [https://github.com/JNR-10/8086-Simulator](https://github.com/JNR-10/8086-Simulator)

## 🔮 Future Enhancements

- [ ] Support for more 8086 instructions (MUL, DIV, shifts, rotates)
- [ ] Register-based memory addressing `[SI]`, `[DI]`, `[BX+SI]`
- [ ] Breakpoint support
- [ ] Assembly code export/import
- [ ] Instruction execution history
- [ ] Dark/Light theme toggle
- [ ] Mobile responsive design

---

**Made with ❤️ for learning 8086 Assembly**