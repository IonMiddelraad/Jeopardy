function isDarkColor(hex: string): boolean {
  if (!hex) return false;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance < 70;
}

export function getFittingTextColor(color?: string): string {
  const hex = color || "#ffffff";
  return isDarkColor(hex) ? "text-white" : "text-black";

}
