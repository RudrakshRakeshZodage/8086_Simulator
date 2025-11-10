"""FastAPI WebSocket server for 8086 emulator."""
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import json
from emulator.cpu import CPU

app = FastAPI(title="8086 Emulator API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global CPU instance per connection (in production, use connection-based storage)
cpu_instances = {}


class CodePayload(BaseModel):
    code: str


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "8086 Emulator Server Running"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time emulator updates."""
    await websocket.accept()
    
    # Create CPU instance for this connection
    connection_id = id(websocket)
    cpu = CPU()
    cpu_instances[connection_id] = cpu
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message = json.loads(data)
            
            command = message.get("command")
            
            if command == "load":
                # Load program
                code = message.get("code", "")
                try:
                    cpu.load_program(code)
                    cpu.reset()
                    
                    await websocket.send_json({
                        "event": "program_loaded",
                        "success": True,
                        "program_length": len(cpu.program),
                        "labels": cpu.labels,
                        "state": cpu.get_state()
                    })
                except Exception as e:
                    await websocket.send_json({
                        "event": "error",
                        "message": f"Failed to load program: {str(e)}"
                    })
            
            elif command == "step":
                # Execute one instruction
                try:
                    result = cpu.step()
                    state = cpu.get_state()
                    
                    await websocket.send_json({
                        "event": "step_complete",
                        "execution_result": result,
                        "state": state
                    })
                except Exception as e:
                    await websocket.send_json({
                        "event": "error",
                        "message": f"Execution error: {str(e)}"
                    })
            
            elif command == "run":
                # Run continuously with delay
                speed = message.get("speed", 500)  # milliseconds
                cpu.running = True
                
                try:
                    while cpu.running and not cpu.halted:
                        result = cpu.step()
                        state = cpu.get_state()
                        
                        await websocket.send_json({
                            "event": "step_complete",
                            "execution_result": result,
                            "state": state
                        })
                        
                        # Small delay for visualization
                        await asyncio.sleep(speed / 1000.0)
                        
                        # Check if client sent pause command
                        try:
                            pause_data = await asyncio.wait_for(
                                websocket.receive_text(),
                                timeout=0.01
                            )
                            pause_msg = json.loads(pause_data)
                            if pause_msg.get("command") == "pause":
                                cpu.running = False
                                break
                        except asyncio.TimeoutError:
                            pass
                    
                    if cpu.halted:
                        await websocket.send_json({
                            "event": "execution_complete",
                            "state": cpu.get_state()
                        })
                
                except Exception as e:
                    await websocket.send_json({
                        "event": "error",
                        "message": f"Runtime error: {str(e)}"
                    })
            
            elif command == "pause":
                # Pause execution
                cpu.running = False
                await websocket.send_json({
                    "event": "paused",
                    "state": cpu.get_state()
                })
            
            elif command == "reset":
                # Reset CPU
                cpu.reset()
                await websocket.send_json({
                    "event": "reset_complete",
                    "state": cpu.get_state()
                })
            
            elif command == "get_memory":
                # Get memory region for visualization
                start = message.get("start", 0)
                length = message.get("length", 256)
                
                try:
                    memory_data = cpu.memory.get_region(start, length)
                    await websocket.send_json({
                        "event": "memory_data",
                        "start": start,
                        "data": memory_data
                    })
                except Exception as e:
                    await websocket.send_json({
                        "event": "error",
                        "message": f"Memory read error: {str(e)}"
                    })
            
            else:
                await websocket.send_json({
                    "event": "error",
                    "message": f"Unknown command: {command}"
                })
    
    except WebSocketDisconnect:
        # Clean up CPU instance
        if connection_id in cpu_instances:
            del cpu_instances[connection_id]
    except Exception as e:
        print(f"WebSocket error: {e}")
        if connection_id in cpu_instances:
            del cpu_instances[connection_id]


if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting 8086 Emulator Server...")
    print("📡 WebSocket endpoint: ws://localhost:8000/ws")
    print("🌐 Health check: http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)