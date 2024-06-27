export function isLightColor(color: string) {
  const hexcolor = color.replace('#', '');
  const opacity = hexcolor.length === 8; // Check if the color includes opacity

  let r, g, b, a;
  if (opacity) {
    r = parseInt(hexcolor.substring(0, 2), 16);
    g = parseInt(hexcolor.substring(2, 4), 16);
    b = parseInt(hexcolor.substring(4, 6), 16);
    a = parseInt(hexcolor.substring(6, 8), 16);
  } else {
    r = parseInt(hexcolor.substring(0, 2), 16);
    g = parseInt(hexcolor.substring(2, 4), 16);
    b = parseInt(hexcolor.substring(4, 6), 16);
    a = 255; // Default to full opacity if not provided
  }

  // Calculate the luminance using the alpha-premultiplied formula
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  // Check if the color is light enough based on luminance and opacity
  return yiq > 155 || a < 128;
}

export function isValidColorCode(colorCode: string) {
  const colorRegex = /^#*([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|([A-Fa-f0-9]{8}|[A-Fa-f0-9]{4}))$/;
  return colorRegex.test(colorCode);
}
