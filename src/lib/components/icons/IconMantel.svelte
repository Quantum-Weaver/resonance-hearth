<script lang="ts">
  // The mantel shelf — a frame and a candle standing on it: what the
  // family places to be seen.
  let { size = 20, color = 'currentColor' }: { size?: number; color?: string } = $props();
</script>
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M3 13h18" />
  <path d="M5 13v3M19 13v3" opacity="0.5" />
  <rect x="6.5" y="6" width="5" height="7" rx="1" opacity="0.75" />
  <path d="M15.5 9v4" opacity="0.6" />
  <path d="M15.5 6.5v0.5" opacity="0.6" />
</svg>
