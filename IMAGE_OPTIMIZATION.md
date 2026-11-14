# Image optimization

All 80 PNG/JPEG files have AVIF counterparts. HTML, CSS, responsive image sets, social metadata, and embedded Slider Revolution data now reference AVIF.

- Original dimensions retained, including responsive variants.
- Transparency retained; smoke, soldier, and logo alpha channels were checked after decoding.
- Encoder: sharp AVIF, quality 85, effort 6, 4:4:4 chroma.
- Converted image bytes: 18,069,904 -> 4,978,231 (72.45% reduction across the inventory, including duplicate copies and variants).
- Original files remain for rollback; these are not automatic browser fallbacks.
- The animated loading GIF and SVG font remain in their original formats to preserve their behavior.

Validation: all 479 local HTML/CSS file references and 52 embedded slider image references resolve; homepage slider and Support page verified in the browser without broken images or console errors.
