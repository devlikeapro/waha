// Text of an interactive message: header title, body and footer, then each carousel card
export function extractInteractiveBody(interactive): string | null {
  if (!interactive) {
    return null;
  }
  // GOWS carries the oneof under its Go field names
  const cards =
    interactive.carouselMessage?.cards ??
    interactive.InteractiveMessage?.CarouselMessage?.cards ??
    [];
  const parts = [
    interactive.header?.title,
    interactive.body?.text,
    interactive.footer?.text,
    ...cards.flatMap((card) => [card?.header?.title, card?.body?.text]),
  ];
  return parts.filter(Boolean).join('\n') || null;
}
