export interface CartridgeType {
  name: string;
  id: string;
  offsetX: number;
  offsetY: number;
  description: string;
  pathToVideo: string;
  year: number;
}

export const cartridges: CartridgeType[] = [
  {
    name: "Pokemon Red and Blue Commercial",
    id: "redblue",
    offsetX: -0.2,
    offsetY: -0.6,
    description: "",
    pathToVideo: "",
    year: 1998,
  },
];
