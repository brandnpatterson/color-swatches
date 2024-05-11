import { BATCH_SIZE, MAX_HUE } from '../utils/constants';

export async function fetchColor(hue, saturation, lightness) {
  try {
    const res = await fetch(
      `https://www.thecolorapi.com/id?hsl=${hue},${saturation}%,${lightness}%`
    );

    return await res.json();
  } catch (error) {
    return { error };
  }
}

export async function generateColorBatch(index, saturation, lightness) {
  const batch = [];

  for (let i = index; batch.length <= BATCH_SIZE - 1; i++) {
    batch.push(i);
  }

  const batchPromises = await batch.map(async (hue) => {
    return await fetchColor(hue, saturation, lightness);
  });
  const colors = await Promise.all(batchPromises);

  // if any request from the batch has an error, stop the proccess and display the error
  const error = colors.find((i) => i.error);

  if (error) {
    return { error };
  }

  return { colors, index: batch[batch.length - 1] + 1 };
}
