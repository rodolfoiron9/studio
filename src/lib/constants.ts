
import type { Track } from './types';

// NOTE: For a real application, the audio and lyric data would come from a CMS or API.
// The audio files are placeholders and do not exist.
// The lyric data is also simplified for this demo.

function generateLyrics(words: string[]): any[] {
    let time = 1; // start time
    return words.map((word, index) => {
        const duration = Math.random() * 0.3 + 0.2; // random duration between 0.2 and 0.5s
        const lyric = { time, duration, word, wordIndex: index };
        time += duration + 0.1; // add a small gap
        return lyric;
    });
}

export const ALBUM_TRACKS: Track[] = [
  { 
    title: "Rising Above", 
    duration: "3:45",
    audioSrc: "/music/rising_above.mp3",
    lyrics: generateLyrics("Feeling the pressure, rising up, breaking through the dark, finding my own spark".split(' ')),
  },
  { 
    title: "Breaking the Mould", 
    duration: "4:12",
    audioSrc: "/music/breaking_the_mould.mp3",
    lyrics: generateLyrics("Never fit in, always stand out, hear the rhythm, breaking the mould now".split(' ')),
  },
  { 
    title: "Samba B", 
    duration: "3:58",
    audioSrc: "/music/samba_b.mp3",
    lyrics: [],
  },
  { 
    title: "Fake Games", 
    duration: "4:05",
    audioSrc: "/music/fake_games.mp3",
    lyrics: generateLyrics("Tired of the drama, tired of the fake games, walking away, I'm calling out their names".split(' ')),
  },
  { 
    title: "Btz in the House", 
    duration: "3:30",
    audioSrc: "/music/btz_in_the_house.mp3",
    lyrics: [],
  },
  { 
    title: "Love Feels Fake", 
    duration: "4:20",
    audioSrc: "/music/love_feels_fake.mp3",
    lyrics: generateLyrics("Your words are empty, your touch is cold, a story often told, this love feels fake and old".split(' ')),
  },
  { 
    title: "Tonight", 
    duration: "3:55",
    audioSrc: "/music/tonight.mp3",
    lyrics: [],
  },
  { 
    title: "I Found", 
    duration: "4:10",
    audioSrc: "/music/i_found.mp3",
    lyrics: generateLyrics("Lost in the static, I found a way, a brand new day".split(' ')),
  },
  { 
    title: "Action", 
    duration: "3:48",
    audioSrc: "/music/action.mp3",
    lyrics: [],
  },
  { 
    title: "Shadows in the Rhythm", 
    duration: "4:02",
    audioSrc: "/music/shadows_in_the_rhythm.mp3",
    lyrics: [],
  },
  { 
    title: "Flow Do Tigre", 
    duration: "3:00",
    audioSrc: "/music/flow_do_tigre.mp3",
    lyrics: [],
  },
  { 
    title: "Lost in the Secret", 
    duration: "3:33",
    audioSrc: "/music/lost_in_the_secret.mp3",
    lyrics: [],
  },
  { 
    title: "Counting My Blessing", 
    duration: "4:01",
    audioSrc: "/music/counting_my_blessing.mp3",
    lyrics: [],
  },
  { 
    title: "Gol", 
    duration: "3:15",
    audioSrc: "/music/gol.mp3",
    lyrics: [],
  },
  { 
    title: "Precision", 
    duration: "3:59",
    audioSrc: "/music/precision.mp3",
    lyrics: [],
  },
  { 
    title: "Alone", 
    duration: "4:21",
    audioSrc: "/music/alone.mp3",
    lyrics: [],
  },
  { 
    title: "Echo of the Soul", 
    duration: "3:50",
    audioSrc: "/music/echo_of_the_soul.mp3",
    lyrics: [],
  },
  { 
    title: "Brilho Claro", 
    duration: "3:44",
    audioSrc: "/music/brilho_claro.mp3",
    lyrics: [],
  },
  { 
    title: "Tables Turns", 
    duration: "4:08",
    audioSrc: "/music/tables_turns.mp3",
    lyrics: [],
  },
  { 
    title: "The Rain", 
    duration: "3:56",
    audioSrc: "/music/the_rain.mp3",
    lyrics: [],
  },
];
