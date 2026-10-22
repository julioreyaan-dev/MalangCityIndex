export interface TransitRoute {
  id: string;
  code: string;
  name: string;
  colorHex: string;
  terminalOrigin: string;
  terminalDestination: string;
  fleetCountEstimate: number;
  coordinates: [number, number][];
}

export const MALANG_TRANSIT_ROUTES: TransitRoute[] = [
  {
    id: "trayek-al",
    code: "AL",
    name: "Arjosari - Landungsari",
    colorHex: "#2563eb",
    terminalOrigin: "Terminal Arjosari (Blimbing)",
    terminalDestination: "Terminal Landungsari (Lowokwaru)",
    fleetCountEstimate: 145,
    coordinates: [
      [112.6580, -7.9250],
      [112.6450, -7.9450],
      [112.6280, -7.9550],
      [112.6150, -7.9500],
      [112.5920, -7.9350],
    ],
  },
  {
    id: "trayek-ldg",
    code: "LDG",
    name: "Landungsari - Dinoyo - Gadang",
    colorHex: "#059669",
    terminalOrigin: "Terminal Landungsari",
    terminalDestination: "Terminal Gadang (Hamid Rusdi)",
    fleetCountEstimate: 110,
    coordinates: [
      [112.5920, -7.9350],
      [112.6120, -7.9490],
      [112.6280, -7.9730],
      [112.6310, -8.0050],
      [112.6300, -8.0220],
    ],
  },
  {
    id: "trayek-gl",
    code: "GL",
    name: "Gadang - Landungsari",
    colorHex: "#d97706",
    terminalOrigin: "Terminal Gadang",
    terminalDestination: "Terminal Landungsari",
    fleetCountEstimate: 95,
    coordinates: [
      [112.6300, -8.0220],
      [112.6180, -7.9950],
      [112.6120, -7.9650],
      [112.5980, -7.9450],
      [112.5920, -7.9350],
    ],
  },
  {
    id: "trayek-abg",
    code: "ABG",
    name: "Arjosari - Borobudur - Gadang",
    colorHex: "#7c3aed",
    terminalOrigin: "Terminal Arjosari",
    terminalDestination: "Terminal Gadang",
    fleetCountEstimate: 80,
    coordinates: [
      [112.6580, -7.9250],
      [112.6380, -7.9480],
      [112.6330, -7.9800],
      [112.6310, -8.0050],
      [112.6300, -8.0220],
    ],
  },
];
