import { useEffect, useRef, useState, useCallback } from 'react';
import { CPUState, WebSocketMessage } from '../types';

export const useWebSocket = (url: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [cpuState, setCpuState] = useState<CPUState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const messageHandlersRef = useRef<Map<string, (data: any) => void>>(new Map());

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      console.log('Received message:', message);

      // Update CPU state if present
      if (message.state) {
        setCpuState(message.state);
      }

      // Handle errors
      if (message.event === 'error') {
        setError(message.message);
      }

      // Call registered handlers
      const handler = messageHandlersRef.current.get(message.event);
      if (handler) {
        handler(message);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('WebSocket connection error');
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
      setError('WebSocket is not connected');
    }
  }, []);

  const registerHandler = useCallback((event: string, handler: (data: any) => void) => {
    messageHandlersRef.current.set(event, handler);
  }, []);

  const unregisterHandler = useCallback((event: string) => {
    messageHandlersRef.current.delete(event);
  }, []);

  return {
    isConnected,
    cpuState,
    error,
    sendMessage,
    registerHandler,
    unregisterHandler,
    clearError: () => setError(null),
  };
};