"""8086 Memory management."""

class Memory:
    """Simulates 8086 memory (64KB addressable space)."""
    
    def __init__(self, size: int = 65536):
        """Initialize memory with given size (default 64KB)."""
        self.size = size
        self.data = bytearray(size)
        self.last_access = None  # Track last access for visualization
        self.access_type = None  # 'read' or 'write'
    
    def read_byte(self, address: int) -> int:
        """Read a byte from memory."""
        if 0 <= address < self.size:
            self.last_access = address
            self.access_type = 'read'
            return self.data[address]
        raise ValueError(f"Memory address out of range: {address}")
    
    def write_byte(self, address: int, value: int):
        """Write a byte to memory."""
        if 0 <= address < self.size:
            self.last_access = address
            self.access_type = 'write'
            self.data[address] = value & 0xFF
        else:
            raise ValueError(f"Memory address out of range: {address}")
    
    def read_word(self, address: int) -> int:
        """Read a word (2 bytes) from memory (little-endian)."""
        low = self.read_byte(address)
        high = self.read_byte(address + 1)
        return (high << 8) | low
    
    def write_word(self, address: int, value: int):
        """Write a word (2 bytes) to memory (little-endian)."""
        self.write_byte(address, value & 0xFF)
        self.write_byte(address + 1, (value >> 8) & 0xFF)
    
    def load_program(self, program_bytes: list, start_address: int = 0x0000):
        """Load program bytes into memory at specified address."""
        for i, byte in enumerate(program_bytes):
            self.write_byte(start_address + i, byte)
    
    def get_region(self, start: int, length: int) -> list:
        """Get a region of memory for visualization."""
        if start + length > self.size:
            length = self.size - start
        return list(self.data[start:start + length])
    
    def reset(self):
        """Clear all memory."""
        self.data = bytearray(self.size)
        self.last_access = None
        self.access_type = None