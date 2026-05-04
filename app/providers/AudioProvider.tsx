"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { Howl } from "howler";

/* ============================================================
   AudioProvider — Gestion des effets sonores via Howler
   Direction esthétique : feedback audio subtil et immersif
   ============================================================ */

interface AudioContextValue {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (name: SoundName) => void;
}

type SoundName = "hover" | "select" | "glitch" | "terminal" | "whoosh";

const SOUND_CONFIG: Record<SoundName, { src: string; volume: number }> = {
  hover: { src: "/assets/audio/hover.ogg", volume: 0.2 },
  select: { src: "/assets/audio/select.ogg", volume: 0.3 },
  glitch: { src: "/assets/audio/glitch.ogg", volume: 0.25 },
  terminal: { src: "/assets/audio/terminal.ogg", volume: 0.15 },
  whoosh: { src: "/assets/audio/whoosh.ogg", volume: 0.2 },
};

const AudioContext = createContext<AudioContextValue>({
  isMuted: true,
  toggleMute: () => {},
  playSound: () => {},
});

export function useAudio() {
  return useContext(AudioContext);
}

export function AudioProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMuted, setIsMuted] = useState(true);
  const soundsRef = useRef<Map<string, Howl>>(new Map());
  const unlockedRef = useRef(false);

  useEffect(() => {
    /* Restauration de la préférence mute depuis le localStorage */
    const stored = localStorage.getItem("audio-muted");
    if (stored !== null) {
      setIsMuted(stored === "true");
    }

    /* Chargement lazy des sons — silencieux en cas de 404 */
    const loadedSounds = new Map<string, Howl>();
    (Object.keys(SOUND_CONFIG) as SoundName[]).forEach((name) => {
      const config = SOUND_CONFIG[name];
      const sound = new Howl({
        src: [config.src],
        volume: config.volume,
        html5: true,
        onloaderror: () => {
          /* Silencieux — les fichiers audio n'existent pas encore */
        },
      });
      loadedSounds.set(name, sound);
    });
    soundsRef.current = loadedSounds;

    return () => {
      loadedSounds.forEach((sound) => sound.unload());
    };
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem("audio-muted", String(next));
      return next;
    });
  }, []);

  const playSound = useCallback(
    (name: SoundName) => {
      if (isMuted) return;

      /* Déblocage de l'AudioContext au premier appel utilisateur */
      if (!unlockedRef.current && typeof window !== "undefined") {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        if (ctx.state === "suspended") {
          ctx.resume();
        }
        unlockedRef.current = true;
      }

      const sound = soundsRef.current.get(name);
      if (sound) {
        sound.play();
      }
    },
    [isMuted]
  );

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute, playSound }}>
      {children}
    </AudioContext.Provider>
  );
}
