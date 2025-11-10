"""8086 Flags Register implementation."""

class FlagsRegister:
    """Manages the 8086 FLAGS register.
    
    Bit positions:
    0: CF (Carry Flag)
    2: PF (Parity Flag)
    4: AF (Auxiliary Carry Flag)
    6: ZF (Zero Flag)
    7: SF (Sign Flag)
    8: TF (Trap Flag)
    9: IF (Interrupt Enable Flag)
    10: DF (Direction Flag)
    11: OF (Overflow Flag)
    """
    
    def __init__(self):
        self.cf = 0  # Carry Flag
        self.pf = 0  # Parity Flag
        self.af = 0  # Auxiliary Carry Flag
        self.zf = 0  # Zero Flag
        self.sf = 0  # Sign Flag
        self.tf = 0  # Trap Flag
        self.if_flag = 0  # Interrupt Enable Flag
        self.df = 0  # Direction Flag
        self.of = 0  # Overflow Flag
    
    def update_zf(self, result: int, bits: int = 16):
        """Update Zero Flag."""
        mask = (1 << bits) - 1
        self.zf = 1 if (result & mask) == 0 else 0
    
    def update_sf(self, result: int, bits: int = 16):
        """Update Sign Flag."""
        self.sf = 1 if (result & (1 << (bits - 1))) != 0 else 0
    
    def update_pf(self, result: int):
        """Update Parity Flag (1 if even number of 1s in low byte)."""
        low_byte = result & 0xFF
        count = bin(low_byte).count('1')
        self.pf = 1 if count % 2 == 0 else 0
    
    def update_cf_add(self, result: int, bits: int = 16):
        """Update Carry Flag for addition."""
        max_val = 1 << bits
        self.cf = 1 if result >= max_val else 0
    
    def update_cf_sub(self, operand1: int, operand2: int):
        """Update Carry Flag for subtraction (borrow)."""
        self.cf = 1 if operand2 > operand1 else 0
    
    def update_of_add(self, op1: int, op2: int, result: int, bits: int = 16):
        """Update Overflow Flag for addition."""
        sign_bit = 1 << (bits - 1)
        op1_sign = (op1 & sign_bit) != 0
        op2_sign = (op2 & sign_bit) != 0
        result_sign = (result & sign_bit) != 0
        
        # Overflow occurs when adding two numbers with same sign produces different sign
        self.of = 1 if (op1_sign == op2_sign) and (op1_sign != result_sign) else 0
    
    def update_of_sub(self, op1: int, op2: int, result: int, bits: int = 16):
        """Update Overflow Flag for subtraction."""
        sign_bit = 1 << (bits - 1)
        op1_sign = (op1 & sign_bit) != 0
        op2_sign = (op2 & sign_bit) != 0
        result_sign = (result & sign_bit) != 0
        
        # Overflow occurs when subtracting numbers with different signs produces wrong sign
        self.of = 1 if (op1_sign != op2_sign) and (op1_sign != result_sign) else 0
    
    def update_af(self, op1: int, op2: int, result: int):
        """Update Auxiliary Carry Flag (carry from bit 3 to bit 4)."""
        self.af = 1 if ((op1 ^ op2 ^ result) & 0x10) != 0 else 0
    
    def to_dict(self):
        """Convert flags to dictionary for JSON serialization."""
        return {
            'CF': self.cf,
            'PF': self.pf,
            'AF': self.af,
            'ZF': self.zf,
            'SF': self.sf,
            'TF': self.tf,
            'IF': self.if_flag,
            'DF': self.df,
            'OF': self.of
        }
    
    def reset(self):
        """Reset all flags to 0."""
        self.cf = self.pf = self.af = self.zf = self.sf = 0
        self.tf = self.if_flag = self.df = self.of = 0