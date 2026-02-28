import Vapi from "https://esm.sh/@vapi-ai/web";
import { VAPI_VR_PUBLIC_KEY, VAPI_VR_ASSISTANT_ID } from "./vapi-config.js";

// Mapping of 3D VR routes directly relative to this folder
export const vrRoutes = {
  ar: "/VR/ar.html",
  charminar: "/VR/charminar.html",
  charminarCopy: "/VR/charminar copy.html",
  hampiStone: "/VR/hampiStone.html",
  indiaGate: "/VR/indiaGate.html",
  medicaps: "/VR/medicaps.html",
  ramMandir: "/VR/ramMandir.html",
  sanchiStupa: "/VR/sanchiStupa.html",
  shivaji: "/VR/shivaji.html",
  statueOfUnity: "/VR/statueOfUnity.html",
  tajMahal: "/VR/tajMahal.html",
};

// Initialize Vapi with the VR tour guide public key
const vapi = new Vapi(VAPI_VR_PUBLIC_KEY);

// Function to start the voice agent in the background for a VR experience
// Replace 'your-assistant-id' with your actual assistant id when calling
export const startVoiceAgent = (
  assistantId = VAPI_VR_ASSISTANT_ID,
) => {
  // Extract the file name from the URL to use as the model name
  const pathParts = window.location.pathname.split("/");
  let fileName = pathParts[pathParts.length - 1] || "";
  fileName = decodeURIComponent(fileName).replace(/\.html$/, "");

  const overrides = {
    variableValues: {
      MonumentName: fileName || "Unknown Monument",
    },
  };

  vapi.start(assistantId, overrides);
  console.log("Starting Vapi with overrides:", overrides);
};

let isListening = false;
let vapiActive = false;
let recognitionInstance = null;

export const initializeWakeWord = (
  wakeWords = ["hey", "hello", "nimbus"],
  assistantId = VAPI_VR_ASSISTANT_ID,
) => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.error("Speech Recognition API is not supported in this browser.");
    return;
  }

  // Prevent multiple recognition loops
  if (isListening || vapiActive) return;

  if (!recognitionInstance) {
    recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
  }

  const recognition = recognitionInstance;

  recognition.onstart = () => {
    isListening = true;
    const wordsDisplay = Array.isArray(wakeWords)
      ? wakeWords.join(", ")
      : wakeWords;
    console.log(`Listening for wake words: "${wordsDisplay}"...`);
  };

  recognition.onresult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript.toLowerCase().trim();
      console.log(`Voice detected: ${transcript}`);

      const isWakeWordDetected = Array.isArray(wakeWords)
        ? wakeWords.some((word) => transcript.includes(word.toLowerCase()))
        : transcript.includes(wakeWords.toLowerCase());

      if (isWakeWordDetected) {
        startVoiceAgent(assistantId);
        console.log("Wake word detected! Starting Voice Agent...");
        vapiActive = true;
        isListening = false;
        recognition.stop();
      }
    }
  };

  recognition.onerror = (event) => {
    console.warn("Speech Recognition Error:", event.error);
    isListening = false;

    // If we get an error but Vapi isn't supposed to be running,
    // we should try to restart after a short delay
    if (
      !vapiActive &&
      (event.error === "no-speech" ||
        event.error === "network" ||
        event.error === "aborted")
    ) {
      setTimeout(() => {
        if (!isListening && !vapiActive) {
          try {
            recognition.start();
          } catch (e) {
            console.log("Restart failed on error:", e);
          }
        }
      }, 1000);
    }
  };

  recognition.onend = () => {
    isListening = false;
    if (!vapiActive) {
      console.log(
        "Speech recognition ended unexpectedly. Automatically restarting...",
      );
      setTimeout(() => {
        if (!isListening && !vapiActive) {
          try {
            recognition.start();
          } catch (e) {
            console.log("Restart failed on end:", e);
          }
        }
      }, 1000);
    } else {
      console.log("Speech recognition stopped because Voice Agent is active.");
    }
  };

  try {
    if (!isListening) {
      recognition.start();
    }
  } catch (e) {
    console.error("Failed to start speech recognition:", e);
  }

  return recognition;
};

// Function to stop the voice agent when exiting VR
export const stopVoiceAgent = () => {
  vapi.stop();
};

// Expose mute controls over the VAPI
export const setMuted = (muted) => {
  vapi.setMuted(muted);
};

export const isMuted = () => {
  return vapi.isMuted();
};

export const say = (message, endCallAfterSpoken = false) => {
  vapi.say(message, endCallAfterSpoken);
};

// VAPI Events for Voice Agent

// Silence detection: if volume is zero and user isn't speaking for
// more than `silenceTimeoutMs`, stop the Vapi agent.
const silenceTimeoutMs = 7000; // 7 seconds
let silenceTimer = null;
let lastVolume = null;
let assistantSpeaking = false;

function clearSilenceTimer() {
  if (silenceTimer) {
    clearTimeout(silenceTimer);
    silenceTimer = null;
  }
}

function startSilenceTimer() {
  clearSilenceTimer();
  silenceTimer = setTimeout(() => {
    console.log(
      `No speech detected for ${silenceTimeoutMs}ms — stopping Vapi agent.`,
    );
    try {
      vapi.stop();
    } catch (e) {
      console.error("Failed to stop Vapi:", e);
    }
    silenceTimer = null;
  }, silenceTimeoutMs);
}

function startTimerIfNeeded() {
  // Only start the timer when assistant is NOT speaking and volume is zero/unknown
  if (assistantSpeaking) return;
  if (lastVolume === 0 || lastVolume === null) {
    if (!silenceTimer) startSilenceTimer();
  }
}

vapi.on("speech-start", () => {
  assistantSpeaking = true;
  console.log("Speech has started");
  clearSilenceTimer();
});

vapi.on("speech-end", () => {
  assistantSpeaking = false;
  console.log("Speech has ended");
  // After assistant finishes speaking, re-evaluate whether we should start the timer
  startTimerIfNeeded();
});

vapi.on("call-start", () => {
  console.log("Call has started");
  assistantSpeaking = false;
  // When the call starts, decide whether to start the silence timer
  startTimerIfNeeded();
});

vapi.on("call-end", () => {
  console.log("Call has stopped");
  clearSilenceTimer();

  // Restart the wake word listener now that the call is over
  console.log("Restarting wake word listener...");
  vapiActive = false;
  initializeWakeWord();
});

vapi.on("volume-level", (volume) => {
  // volume is expected to be numeric (0..1 or 0..100). Treat <= 0 as silence.
  lastVolume = typeof volume === "number" ? volume : null;
  console.log(`Assistant volume level: ${volume}`);

  if (typeof lastVolume === "number" && lastVolume > 0) {
    // Activity detected: clear any silence timer
    clearSilenceTimer();
  } else {
    // No volume; start the timer if assistant isn't speaking
    startTimerIfNeeded();
  }
});

// Function calls and transcripts will be sent via messages
vapi.on("message", (message) => {
  console.log(message);
  // Treat incoming messages (transcripts/function calls) as activity from the user
  clearSilenceTimer();

  // Dispatch custom event for captions when the AI is speaking
  if (
    message.type === "transcript" &&
    message.transcriptType === "final" &&
    message.role === "assistant"
  ) {
    const event = new CustomEvent("vapi-transcript", {
      detail: { text: message.transcript },
    });
    window.dispatchEvent(event);
  }
});

vapi.on("error", (e) => {
  console.error(e);
});

export default vapi;
