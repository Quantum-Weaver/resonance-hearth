<script lang="ts">
  let { size = 20, color = 'currentColor' }: { size?: number; color?: string } = $props();
</script>
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M12,21C7,16.5,3,13.3,3,9.2A4.7,4.7,0,0,1,7.7,4.5,5,5,0,0,1,12,7a5,5,0,0,1,4.3-2.5A4.7,4.7,0,0,1,21,9.2c0,4.1-4,7.3-9,11.8Z" />
</svg>
