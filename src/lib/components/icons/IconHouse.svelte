<script lang="ts">
  // A floor plan, not a facade — the house as its rooms, which is how
  // this door holds it.
  let { size = 20, color = 'currentColor' }: { size?: number; color?: string } = $props();
</script>
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <rect x="4" y="4" width="16" height="16" rx="2" />
  <path d="M4 12h7" opacity="0.6" />
  <path d="M11 12v8" opacity="0.6" />
  <path d="M15 4v5" opacity="0.4" />
</svg>
