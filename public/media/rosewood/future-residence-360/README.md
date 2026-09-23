# Future residence — 360 frame sequence (Mode B)

## Directory

```text
frontend/public/media/rosewood/future-residence-360/
```

## Required manifest

Create `manifest.json` in this folder:

```json
{
  "frameCount": 72,
  "pattern": "frame-{index}.webp",
  "pad": 3,
  "width": 1600,
  "height": 1200
}
```

## Frames

Name files to match the pattern, 1-based, zero-padded:

```text
frame-001.webp
frame-002.webp
…
frame-072.webp
```

Camera orbit should be **evenly spaced** around the building (equal yaw steps). Frame 001 should continue seamlessly into frame N when looping.

## Recommendations

| Spec | Recommendation |
|------|----------------|
| Frame count | **72** ideal (48–96 OK) |
| Format | **WebP** (AVIF optional alternate later) |
| Desktop resolution | **1600×1200** (or 1600 on long edge) |
| Mobile-oriented alt | 1280 on long edge if you ship a second set |
| WebP quality | **75–85** |
| Lighting | Luxury dusk / evening architectural |
| Background | Dark charcoal / dusk — no cartoon skyline |

## Interaction

The viewer scrubs frames on horizontal drag with inertia and optional very slow idle rotation. Keep motion calm — this is a luxury presentation, not a spinner toy.

## Performance

- Prefer WebP/AVIF over PNG
- Keep total sequence under ~8–15 MB when possible
- Progressive loading is built into the viewer (nearby frames first)
