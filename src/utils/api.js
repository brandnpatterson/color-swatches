const baseUrl = 'https://www.thecolorapi.com';
const url = (h) =>
  `${baseUrl}/id?hsl=${h},${saturation.value}%,${lightness.value}%)`;

export async function fetchColor(hue) {
  try {
    const res = await fetch(url(hue));

    // 1-4 Red (4)
    // 5-13 Scarlet (9)
    // 14-18 Vermilion (5)
    // 19-21 International Orange (3)
    // 22-26 Blaze Orange (5)

    return await res.json();
  } catch (error) {
    return { error };
  }
}
