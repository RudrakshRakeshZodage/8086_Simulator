export interface CPUState {
  registers: Registers;
  flags: Flags;
  ip: number;
  current_instruction: string | null;
  memory_access: MemoryAccess | null;
  alu_operation: ALUOperation | null;
  halted: boolean;
}

export interface Registers {
  AX: number;
  BX: number;
  CX: number;
  DX: number;
  SI: number;
  DI: number;
  BP: number;
  SP: number;
  CS: number;
  DS: number;
  SS: number;
  ES: number;
}

export interface Flags {
  CF: number;
  PF: number;
  AF: number;
  ZF: number;
  SF: number;
  TF: number;
  IF: number;
  DF: number;
  OF: number;
}

export interface MemoryAccess {
  address: number;
  type: 'read' | 'write';
}

export interface ALUOperation {
  operation: string;
  operand1: number;
  operand2?: number;
  result: number;
}

export interface WebSocketMessage {
  event: string;
  [key: string]: any;
}

export type ExecutionMode = 'idle' | 'running' | 'stepping' | 'paused';