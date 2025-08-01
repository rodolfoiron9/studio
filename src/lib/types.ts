
export type CubeCustomization = {
  faceColor1: string;
  faceColor2: string;
  faceColor3: string;
  faceColor4: string;
  faceColor5: string;
  faceColor6: string;
  edgeStyle: 'sharp' | 'round' | 'bevel';
  materialStyle: 'solid' | 'wireframe' | 'cartoon' | 'realist' | 'draw' | 'quantum dist';
  wireframe: boolean; // This can be deprecated in favor of materialStyle
  roundness: number;
  background: 'snow' | 'particles' | 'image' | 'video';
  particleColor1: string;
  particleColor2: string;
  particleColor3: string;
  text1: string;
  text2: string;
  text3: string;
  text4: string;
  text5: string;
  text6: string;
  animation: string;
  environmentImage?: string;
  environmentVideo?: string;
};

export type Lyric = {
  time: number;
  duration: number;
  word: string;
  wordIndex: number;
};

export type Track = {
  title: string;
  duration: string;
  audioSrc: string;
  lyrics: Lyric[];
};
