import { baseURL } from '@/utils/api.util';

export const buildStreamUrl = (videoPath: string): string => {
  return `${baseURL}/video/${encodeURIComponent(videoPath)}`;
};
