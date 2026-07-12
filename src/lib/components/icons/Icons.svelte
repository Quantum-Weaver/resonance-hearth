<script lang="ts">
  import IconHome from './IconHome.svelte';
  import IconInsights from './IconInsights.svelte';
  import IconSettings from './IconSettings.svelte';
  import IconMe from './IconMe.svelte';
  import IconThings from './IconThings.svelte';
  import IconCare from './IconCare.svelte';
  import IconBills from './IconBills.svelte';

  export type IconName =
    | 'home'
    | 'insights'
    | 'settings'
    | 'me'
    | 'things'
    | 'care'
    | 'bills';

  let {
    name,
    size = 20,
    color = 'currentColor',
  }: {
    name: IconName;
    size?: number;
    color?: string;
  } = $props();

  const components: Record<IconName, any> = {
    'home': IconHome,
    'insights': IconInsights,
    'settings': IconSettings,
    'me': IconMe,
    'things': IconThings,
    'care': IconCare,
    'bills': IconBills,
  };

  const Component = $derived(components[name]);
</script>

{#if Component}
  <Component {size} {color} />
{/if}
