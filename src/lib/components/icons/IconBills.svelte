<script lang="ts">
  let { size = 20, color = 'currentColor' }: { size?: number; color?: string } = $props();
</script>
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M6,2h9l5,5V22H6a1,1,0,0,1-1-1V3A1,1,0,0,1,6,2Z" />
  <path d="M14,2v6h6" />
  <path d="M9,13h6" /><path d="M9,17h6" />
</svg>
