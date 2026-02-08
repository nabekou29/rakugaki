<svelte:options tag="myapp-counter" />

<script lang="ts">
  let count: number = 0;
  const increment = () => {
    count += 1;
  };
</script>

<button on:click="{increment}">
  Count: {count}
</button>

<style lang="scss">
  $red: #ff3e00;

  button {
    font-family: inherit;
    font-size: inherit;
    padding: 0.6em 1.2em;
    color: $red;
    background-color: rgba($red, 0.1);
    border-radius: 2em;
    border: 2px solid rgba($red, 0);
    outline: none;
    width: 160px;
    font-variant-numeric: tabular-nums;
    cursor: pointer;

    &:focus {
      border: 2px solid $red;
    }

    &:active {
      background-color: rgba($red, 0.2);
    }
  }
</style>
