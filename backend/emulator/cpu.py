"""8086 CPU implementation."""
from .memory import Memory
from .flags import FlagsRegister
from .instruction_set import InstructionSet
import re


class CPU:
    """Simulates the 8086 CPU."""
    
    def __init__(self):
        """Initialize CPU with registers, memory, and flags."""
        # General purpose registers (16-bit)
        self.registers = {
            'AX': 0x0000, 'BX': 0x0000, 'CX': 0x0000, 'DX': 0x0000,
            'SI': 0x0000, 'DI': 0x0000, 'BP': 0x0000, 'SP': 0xFFFE,
            'CS': 0x0000, 'DS': 0x0000, 'SS': 0x0000, 'ES': 0x0000,
        }
        
        self.ip = 0x0000  # Instruction Pointer
        self.memory = Memory()
        self.flags = FlagsRegister()
        self.instruction_set = InstructionSet(self)
        
        # Program state
        self.program = []  # List of instructions
        self.labels = {}  # Label name -> line number mapping
        self.running = False
        self.halted = False
        
        # ALU operation tracking
        self.last_alu_operation = None
        
    def load_program(self, code: str):
        """Load assembly program from string."""
        self.program = []
        self.labels = {}
        self.ip = 0
        
        lines = code.strip().split('\n')
        line_num = 0
        
        for line in lines:
            # Remove comments
            line = line.split(';')[0].strip()
            if not line:
                continue
            
            # Check for labels
            if ':' in line:
                label_match = re.match(r'(\w+):\s*(.*)', line)
                if label_match:
                    label_name = label_match.group(1).upper()
                    self.labels[label_name] = line_num
                    line = label_match.group(2).strip()
                    if not line:
                        continue
            
            self.program.append(line)
            line_num += 1
    
    def step(self):
        """Execute one instruction."""
        if self.halted or self.ip >= len(self.program):
            self.halted = True
            return None
        
        instruction = self.program[self.ip].strip()
        result = self.execute_instruction(instruction)
        
        # Don't increment IP if it was a jump instruction that succeeded
        if result and not (result.get('jumped', False) or result.get('operation') == 'RET'):
            self.ip += 1
        elif result and result.get('operation') == 'RET':
            pass  # IP already set by RET
        elif not result or not result.get('jumped', False):
            self.ip += 1
        
        return result
    
    def execute_instruction(self, instruction: str):
        """Parse and execute a single instruction."""
        parts = re.split(r'[,\s]+', instruction.strip())
        if not parts:
            return None
        
        opcode = parts[0].upper()
        
        if opcode not in self.instruction_set.instructions:
            return {'error': f'Unknown instruction: {opcode}'}
        
        handler = self.instruction_set.instructions[opcode]
        
        try:
            # Handle instructions with different operand counts
            if opcode in ['MOV', 'ADD', 'SUB', 'AND', 'OR', 'XOR', 'CMP']:
                if len(parts) < 3:
                    return {'error': f'{opcode} requires 2 operands'}
                return handler(parts[1].rstrip(','), parts[2])
            
            elif opcode in ['INC', 'DEC', 'NOT', 'PUSH', 'POP']:
                if len(parts) < 2:
                    return {'error': f'{opcode} requires 1 operand'}
                return handler(parts[1])
            
            elif opcode in ['JMP', 'JZ', 'JNZ', 'JE', 'JNE', 'CALL', 'LOOP']:
                if len(parts) < 2:
                    return {'error': f'{opcode} requires a label'}
                return handler(parts[1])
            
            elif opcode in ['RET', 'NOP']:
                return handler()
            
            else:
                return {'error': f'Unhandled instruction: {opcode}'}
                
        except Exception as e:
            return {'error': str(e)}
    
    def get_state(self):
        """Get current CPU state for visualization."""
        return {
            'registers': self.registers.copy(),
            'flags': self.flags.to_dict(),
            'ip': self.ip,
            'current_instruction': self.program[self.ip] if self.ip < len(self.program) else None,
            'memory_access': {
                'address': self.memory.last_access,
                'type': self.memory.access_type
            } if self.memory.last_access is not None else None,
            'alu_operation': self.last_alu_operation,
            'halted': self.halted
        }
    
    def reset(self):
        """Reset CPU to initial state."""
        for reg in self.registers:
            self.registers[reg] = 0x0000
        self.registers['SP'] = 0xFFFE
        self.ip = 0
        self.flags.reset()
        self.memory.reset()
        self.running = False
        self.halted = False
        self.last_alu_operation = None