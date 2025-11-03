
export enum ChatMessageRole {
  USER = 'user',
  MODEL = 'model',
  ERROR = 'error',
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets: {
        uri: string;
        snippet: string;
      }[];
    }[];
  };
}

export interface Message {
  id: string;
  role: ChatMessageRole;
  content: string;
  groundingChunks?: GroundingChunk[];
}

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
}
