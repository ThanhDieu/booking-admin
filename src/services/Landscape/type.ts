export interface LandscapePayload {
  title: string;
  icons: {
    dark: string;
    light: string;
  };
  extendedData?: {
    [key: string]: {
      [key: string]: string;
    };
  };
  description?: string;
}
export interface LandscapeType extends LandscapePayload {
  name: string;
  landscapeId: string;
}
