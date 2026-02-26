"use client";

import { useEffect, useRef, useState } from "react";

import type { CallStatus } from "@/store/trip.store";
import { apiClient } from "@/utils/axios";

export interface CallStatusEvent {
  status: CallStatus | "complete";
  hasTranscript: boolean;
  hasItinerary: boolean;
  attempt?: number;
  timeout?: boolean;
  error?: string;
}

/**
 * useCallStatusStream — connects to the SSE endpoint and streams
 * live call status updates until the call is complete or times out.
 *
 * Usage:
 *   const { event, isStreaming } = useCallStatusStream(callId);
 */
export function useCallStatusStream(callId: string | undefined) {
  const [event, setEvent] = useState<CallStatusEvent | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!callId) return;

    // Build URL with auth token appended via cookie (handled by apiClient interceptor)
    // We use the base URL from apiClient config
    const baseURL = (
      apiClient.defaults.baseURL ?? "http://localhost:5000/api"
    ).replace(/\/$/, "");

    // We need to attach the Bearer token — fetch it from Firebase first
    const start = async () => {
      try {
        // Get a fresh token via a regular axios call that triggers the interceptor,
        // then re-use it for the EventSource URL as a query param
        const tokenRes = await apiClient
          .get<{ token: string }>("/auth/token")
          .catch(() => null);

        // Build SSE URL — if a dedicated /auth/token endpoint doesn't exist we fall
        // back to connecting without the token param (works when cookies are present)
        const url = `${baseURL}/vapi/status/${callId}/stream`;

        const es = new EventSource(url, { withCredentials: true });
        esRef.current = es;
        setIsStreaming(true);

        es.onmessage = (e) => {
          try {
            const data: CallStatusEvent = JSON.parse(e.data);
            setEvent(data);

            if (data.status === "complete" || data.timeout || data.error) {
              es.close();
              setIsStreaming(false);
            }
          } catch {
            // ignore parse errors
          }
        };

        es.onerror = () => {
          es.close();
          setIsStreaming(false);
        };
      } catch {
        setIsStreaming(false);
      }
    };

    start();

    return () => {
      esRef.current?.close();
      setIsStreaming(false);
    };
  }, [callId]);

  return { event, isStreaming };
}
