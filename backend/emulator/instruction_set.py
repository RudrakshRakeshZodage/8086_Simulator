"""8086 Instruction Set implementation."""
import re
from typing import Tuple, Optional


class InstructionSet:
    """Handles parsing and execution of 8086 assembly instructions."""
    
    def __init__(self, cpu):
        """Initialize with reference to CPU."""
        self.cpu = cpu
        self.instructions = {
            'MOV': self.mov,
            'ADD': self.add,
            'SUB': self.sub,
            'INC': self.inc,
            'DEC': self.dec,
            'AND': self.and_op,
            'OR': self.or_op,
            'XOR': self.xor_op,
            'NOT': self.not_op,
            'CMP': self.cmp,
            'JMP': self.jmp,
            'JZ': self.jz,
            'JNZ': self.jnz,
            'JE': self.jz,  # JE is alias for JZ
            'JNE': self.jnz,  # JNE is alias for JNZ
            'PUSH': self.push,
            'POP': self.pop,
            'CALL': self.call,
            'RET': self.ret,
            'LOOP': self.loop,
            'NOP': self.nop,
        }
    
    def parse_operand(self, operand: str) -> Tuple[str, int]:
        """Parse an operand and return its type and value.
        
        Returns:
            ('register', reg_name) or ('immediate', value) or ('memory', address)
        """
        operand = operand.strip().upper()
        
        # Check if it's a register
        if operand in self.cpu.registers:
            return ('register', operand)
        
        # Check if it's a hex immediate (0x1234 or 1234h)
        if operand.startswith('0X'):
            return ('immediate', int(operand, 16))
        if operand.endswith('H'):
            return ('immediate', int(operand[:-1], 16))
        
        # Check if it's a decimal immediate
        if operand.isdigit():
            return ('immediate', int(operand))
        
        # Check if it's a memory reference [address]
        mem_match = re.match(r'\[(\w+)\]', operand)
        if mem_match:
            addr_str = mem_match.group(1)
            if addr_str.startswith('0X'):
                addr = int(addr_str, 16)
            elif addr_str.endswith('H'):
                addr = int(addr_str[:-1], 16)
            else:
                addr = int(addr_str)
            return ('memory', addr)
        
        raise ValueError(f"Invalid operand: {operand}")
    
    def get_operand_value(self, op_type: str, op_value) -> int:
        """Get the actual value of an operand."""
        if op_type == 'register':
            return self.cpu.registers[op_value]
        elif op_type == 'immediate':
            return op_value
        elif op_type == 'memory':
            return self.cpu.memory.read_word(op_value)
        return 0
    
    def set_operand_value(self, op_type: str, op_value, value: int):
        """Set the value of an operand."""
        if op_type == 'register':
            self.cpu.registers[op_value] = value & 0xFFFF
        elif op_type == 'memory':
            self.cpu.memory.write_word(op_value, value & 0xFFFF)
    
    # Instruction implementations
    def mov(self, dest: str, src: str):
        """MOV dest, src - Move data."""
        dest_type, dest_val = self.parse_operand(dest)
        src_type, src_val = self.parse_operand(src)
        
        value = self.get_operand_value(src_type, src_val)
        self.set_operand_value(dest_type, dest_val, value)
        
        # MOV is not an ALU operation
        self.cpu.last_alu_operation = None
        
        return {'operation': 'MOV', 'dest': dest, 'src': src, 'value': value}
    
    def add(self, dest: str, src: str):
        """ADD dest, src - Addition."""
        dest_type, dest_val = self.parse_operand(dest)
        src_type, src_val = self.parse_operand(src)
        
        op1 = self.get_operand_value(dest_type, dest_val)
        op2 = self.get_operand_value(src_type, src_val)
        result = op1 + op2
        
        # Update flags
        self.cpu.flags.update_zf(result)
        self.cpu.flags.update_sf(result)
        self.cpu.flags.update_pf(result)
        self.cpu.flags.update_cf_add(result)
        self.cpu.flags.update_of_add(op1, op2, result)
        self.cpu.flags.update_af(op1, op2, result)
        
        self.set_operand_value(dest_type, dest_val, result)
        
        # Track ALU operation
        self.cpu.last_alu_operation = {
            'operation': 'ADD',
            'operand1': op1 & 0xFFFF,
            'operand2': op2 & 0xFFFF,
            'result': result & 0xFFFF
        }
        
        return {'operation': 'ADD', 'dest': dest, 'src': src, 'result': result & 0xFFFF}
    
    def sub(self, dest: str, src: str):
        """SUB dest, src - Subtraction."""
        dest_type, dest_val = self.parse_operand(dest)
        src_type, src_val = self.parse_operand(src)
        
        op1 = self.get_operand_value(dest_type, dest_val)
        op2 = self.get_operand_value(src_type, src_val)
        result = op1 - op2
        
        # Update flags
        self.cpu.flags.update_zf(result)
        self.cpu.flags.update_sf(result)
        self.cpu.flags.update_pf(result)
        self.cpu.flags.update_cf_sub(op1, op2)
        self.cpu.flags.update_of_sub(op1, op2, result)
        self.cpu.flags.update_af(op1, op2, result)
        
        self.set_operand_value(dest_type, dest_val, result)
        
        # Track ALU operation
        self.cpu.last_alu_operation = {
            'operation': 'SUB',
            'operand1': op1 & 0xFFFF,
            'operand2': op2 & 0xFFFF,
            'result': result & 0xFFFF
        }
        
        return {'operation': 'SUB', 'dest': dest, 'src': src, 'result': result & 0xFFFF}
    
    def inc(self, dest: str):
        """INC dest - Increment."""
        dest_type, dest_val = self.parse_operand(dest)
        op1 = self.get_operand_value(dest_type, dest_val)
        result = op1 + 1
        
        self.cpu.flags.update_zf(result)
        self.cpu.flags.update_sf(result)
        self.cpu.flags.update_pf(result)
        self.cpu.flags.update_of_add(op1, 1, result)
        self.cpu.flags.update_af(op1, 1, result)
        
        self.set_operand_value(dest_type, dest_val, result)
        
        # Track ALU operation
        self.cpu.last_alu_operation = {
            'operation': 'INC',
            'operand1': op1 & 0xFFFF,
            'result': result & 0xFFFF
        }
        
        return {'operation': 'INC', 'dest': dest, 'result': result & 0xFFFF}
    
    def dec(self, dest: str):
        """DEC dest - Decrement."""
        dest_type, dest_val = self.parse_operand(dest)
        op1 = self.get_operand_value(dest_type, dest_val)
        result = op1 - 1
        
        self.cpu.flags.update_zf(result)
        self.cpu.flags.update_sf(result)
        self.cpu.flags.update_pf(result)
        self.cpu.flags.update_of_sub(op1, 1, result)
        self.cpu.flags.update_af(op1, 1, result)
        
        self.set_operand_value(dest_type, dest_val, result)
        
        # Track ALU operation
        self.cpu.last_alu_operation = {
            'operation': 'DEC',
            'operand1': op1 & 0xFFFF,
            'result': result & 0xFFFF
        }
        
        return {'operation': 'DEC', 'dest': dest, 'result': result & 0xFFFF}
    
    def and_op(self, dest: str, src: str):
        """AND dest, src - Logical AND."""
        dest_type, dest_val = self.parse_operand(dest)
        src_type, src_val = self.parse_operand(src)
        
        op1 = self.get_operand_value(dest_type, dest_val)
        op2 = self.get_operand_value(src_type, src_val)
        result = op1 & op2
        
        self.cpu.flags.update_zf(result)
        self.cpu.flags.update_sf(result)
        self.cpu.flags.update_pf(result)
        self.cpu.flags.cf = 0
        self.cpu.flags.of = 0
        
        self.set_operand_value(dest_type, dest_val, result)
        
        # Track ALU operation
        self.cpu.last_alu_operation = {
            'operation': 'AND',
            'operand1': op1 & 0xFFFF,
            'operand2': op2 & 0xFFFF,
            'result': result & 0xFFFF
        }
        
        return {'operation': 'AND', 'dest': dest, 'src': src, 'result': result & 0xFFFF}
    
    def or_op(self, dest: str, src: str):
        """OR dest, src - Logical OR."""
        dest_type, dest_val = self.parse_operand(dest)
        src_type, src_val = self.parse_operand(src)
        
        op1 = self.get_operand_value(dest_type, dest_val)
        op2 = self.get_operand_value(src_type, src_val)
        result = op1 | op2
        
        self.cpu.flags.update_zf(result)
        self.cpu.flags.update_sf(result)
        self.cpu.flags.update_pf(result)
        self.cpu.flags.cf = 0
        self.cpu.flags.of = 0
        
        self.set_operand_value(dest_type, dest_val, result)
        
        # Track ALU operation
        self.cpu.last_alu_operation = {
            'operation': 'OR',
            'operand1': op1 & 0xFFFF,
            'operand2': op2 & 0xFFFF,
            'result': result & 0xFFFF
        }
        
        return {'operation': 'OR', 'dest': dest, 'src': src, 'result': result & 0xFFFF}
    
    def xor_op(self, dest: str, src: str):
        """XOR dest, src - Logical XOR."""
        dest_type, dest_val = self.parse_operand(dest)
        src_type, src_val = self.parse_operand(src)
        
        op1 = self.get_operand_value(dest_type, dest_val)
        op2 = self.get_operand_value(src_type, src_val)
        result = op1 ^ op2
        
        self.cpu.flags.update_zf(result)
        self.cpu.flags.update_sf(result)
        self.cpu.flags.update_pf(result)
        self.cpu.flags.cf = 0
        self.cpu.flags.of = 0
        
        self.set_operand_value(dest_type, dest_val, result)
        
        # Track ALU operation
        self.cpu.last_alu_operation = {
            'operation': 'XOR',
            'operand1': op1 & 0xFFFF,
            'operand2': op2 & 0xFFFF,
            'result': result & 0xFFFF
        }
        
        return {'operation': 'XOR', 'dest': dest, 'src': src, 'result': result & 0xFFFF}
    
    def not_op(self, dest: str):
        """NOT dest - Logical NOT."""
        dest_type, dest_val = self.parse_operand(dest)
        op1 = self.get_operand_value(dest_type, dest_val)
        result = ~op1
        
        self.set_operand_value(dest_type, dest_val, result)
        
        # Track ALU operation
        self.cpu.last_alu_operation = {
            'operation': 'NOT',
            'operand1': op1 & 0xFFFF,
            'result': result & 0xFFFF
        }
        
        return {'operation': 'NOT', 'dest': dest, 'result': result & 0xFFFF}
    
    def cmp(self, op1_str: str, op2_str: str):
        """CMP op1, op2 - Compare (sets flags like SUB but doesn't store result)."""
        op1_type, op1_val = self.parse_operand(op1_str)
        op2_type, op2_val = self.parse_operand(op2_str)
        
        op1 = self.get_operand_value(op1_type, op1_val)
        op2 = self.get_operand_value(op2_type, op2_val)
        result = op1 - op2
        
        self.cpu.flags.update_zf(result)
        self.cpu.flags.update_sf(result)
        self.cpu.flags.update_pf(result)
        self.cpu.flags.update_cf_sub(op1, op2)
        self.cpu.flags.update_of_sub(op1, op2, result)
        
        return {'operation': 'CMP', 'op1': op1_str, 'op2': op2_str}
    
    def jmp(self, label: str):
        """JMP label - Unconditional jump."""
        if label in self.cpu.labels:
            self.cpu.ip = self.cpu.labels[label]
            return {'operation': 'JMP', 'target': label, 'jumped': True}
        return {'operation': 'JMP', 'target': label, 'jumped': False, 'error': 'Label not found'}
    
    def jz(self, label: str):
        """JZ/JE label - Jump if zero."""
        if self.cpu.flags.zf == 1:
            if label in self.cpu.labels:
                self.cpu.ip = self.cpu.labels[label]
                return {'operation': 'JZ', 'target': label, 'jumped': True}
        return {'operation': 'JZ', 'target': label, 'jumped': False}
    
    def jnz(self, label: str):
        """JNZ/JNE label - Jump if not zero."""
        if self.cpu.flags.zf == 0:
            if label in self.cpu.labels:
                self.cpu.ip = self.cpu.labels[label]
                return {'operation': 'JNZ', 'target': label, 'jumped': True}
        return {'operation': 'JNZ', 'target': label, 'jumped': False}
    
    def push(self, src: str):
        """PUSH src - Push to stack."""
        src_type, src_val = self.parse_operand(src)
        value = self.get_operand_value(src_type, src_val)
        
        self.cpu.registers['SP'] = (self.cpu.registers['SP'] - 2) & 0xFFFF
        self.cpu.memory.write_word(self.cpu.registers['SP'], value)
        
        return {'operation': 'PUSH', 'src': src, 'value': value, 'sp': self.cpu.registers['SP']}
    
    def pop(self, dest: str):
        """POP dest - Pop from stack."""
        dest_type, dest_val = self.parse_operand(dest)
        
        value = self.cpu.memory.read_word(self.cpu.registers['SP'])
        self.cpu.registers['SP'] = (self.cpu.registers['SP'] + 2) & 0xFFFF
        
        self.set_operand_value(dest_type, dest_val, value)
        
        return {'operation': 'POP', 'dest': dest, 'value': value, 'sp': self.cpu.registers['SP']}
    
    def call(self, label: str):
        """CALL label - Call subroutine."""
        # Push return address
        self.cpu.registers['SP'] = (self.cpu.registers['SP'] - 2) & 0xFFFF
        self.cpu.memory.write_word(self.cpu.registers['SP'], self.cpu.ip + 1)
        
        # Jump to label
        if label in self.cpu.labels:
            self.cpu.ip = self.cpu.labels[label]
            return {'operation': 'CALL', 'target': label, 'jumped': True}
        
        return {'operation': 'CALL', 'target': label, 'jumped': False, 'error': 'Label not found'}
    
    def ret(self):
        """RET - Return from subroutine."""
        # Pop return address
        return_addr = self.cpu.memory.read_word(self.cpu.registers['SP'])
        self.cpu.registers['SP'] = (self.cpu.registers['SP'] + 2) & 0xFFFF
        self.cpu.ip = return_addr
        
        return {'operation': 'RET', 'return_address': return_addr}
    
    def loop(self, label: str):
        """LOOP label - Decrement CX and jump if not zero."""
        self.cpu.registers['CX'] = (self.cpu.registers['CX'] - 1) & 0xFFFF
        
        if self.cpu.registers['CX'] != 0:
            if label in self.cpu.labels:
                self.cpu.ip = self.cpu.labels[label]
                return {'operation': 'LOOP', 'target': label, 'jumped': True, 'cx': self.cpu.registers['CX']}
        
        return {'operation': 'LOOP', 'target': label, 'jumped': False, 'cx': self.cpu.registers['CX']}
    
    def nop(self):
        """NOP - No operation."""
        return {'operation': 'NOP'}