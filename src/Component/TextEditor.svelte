<svelte:options tag="my-text-editor" />

<script lang="ts">
  export let value: string;
</script>

<textarea bind:value></textarea>

<style lang="scss">
  $red: #ff3e00;

  textarea {
    width: 440px;
    height: 180px;
    padding: 6px;
    resize: none;
    outline: none;
    border: solid 2px rgb($red, 0.4);
    border-radius: 6px;

    &:focus {
      border: solid 2px $red;
    }
  }
</style>
