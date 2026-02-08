<svelte:options tag="my-rich-text-editor" />

<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import { get_current_component } from 'svelte/internal';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import pretty from 'pretty';

  const component = get_current_component();
  const originalDispatch = createEventDispatcher();

  // Web Components としてマウントした場合にも、イベントを捕捉できるようにする
  const dispatch = (name: string, detail: any) => {
    originalDispatch(name, detail);
    component?.dispatchEvent(new CustomEvent(name, { detail }));
  };

  let element: Element;
  let editor: Editor;

  onMount(() => {
    editor = new Editor({
      element: element,
      extensions: [StarterKit],
      content: value,
      onTransaction: () => {
        editor = editor;
      },
      onUpdate: ({ editor }) => {
        dispatch('updated', {
          target: { value: toValue(editor) },
        });
      },
    });
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });

  export let value: string;

  const toValue = (e: Editor) => pretty(e?.getHTML() ?? '');

  const setValue = (v: string) => {
    if (editor && v != toValue(editor)) {
      editor.chain().setContent(v).run();
    }
  };

  $: {
    value && setValue(value);
  }
</script>

<div class="editorWrapper">
  {#if editor}
    <button
      on:click="{() => editor.chain().focus().toggleBold().run()}"
      class:is-active="{editor.isActive('bold')}"
    >
      bold
    </button>
    <button
      on:click="{() => editor.chain().focus().toggleItalic().run()}"
      class:is-active="{editor.isActive('italic')}"
    >
      italic
    </button>
    <button
      on:click="{() => editor.chain().focus().toggleStrike().run()}"
      class:is-active="{editor.isActive('strike')}"
    >
      strike
    </button>
    <button
      on:click="{() => editor.chain().focus().toggleCode().run()}"
      class:is-active="{editor.isActive('code')}"
    >
      code
    </button>
    <button
      on:click="{() =>
        editor.chain().focus().toggleHeading({ level: 1 }).run()}"
      class:is-active="{editor.isActive('heading', { level: 1 })}"
    >
      h1
    </button>
    <button
      on:click="{() =>
        editor.chain().focus().toggleHeading({ level: 2 }).run()}"
      class:is-active="{editor.isActive('heading', { level: 2 })}"
    >
      h2
    </button>
    <button
      on:click="{() =>
        editor.chain().focus().toggleHeading({ level: 3 }).run()}"
      class:is-active="{editor.isActive('heading', { level: 3 })}"
    >
      h3
    </button>
    <button
      on:click="{() =>
        editor.chain().focus().toggleHeading({ level: 4 }).run()}"
      class:is-active="{editor.isActive('heading', { level: 4 })}"
    >
      h4
    </button>
    <button
      on:click="{() =>
        editor.chain().focus().toggleHeading({ level: 5 }).run()}"
      class:is-active="{editor.isActive('heading', { level: 5 })}"
    >
      h5
    </button>
    <button
      on:click="{() =>
        editor.chain().focus().toggleHeading({ level: 6 }).run()}"
      class:is-active="{editor.isActive('heading', { level: 6 })}"
    >
      h6
    </button>
    <button
      on:click="{() => editor.chain().focus().toggleBulletList().run()}"
      class:is-active="{editor.isActive('bulletList')}"
    >
      bullet list
    </button>
    <button
      on:click="{() => editor.chain().focus().toggleOrderedList().run()}"
      class:is-active="{editor.isActive('orderedList')}"
    >
      ordered list
    </button>
    <button
      on:click="{() => editor.chain().focus().toggleCodeBlock().run()}"
      class:is-active="{editor.isActive('codeBlock')}"
    >
      code block
    </button>
    <button on:click="{() => editor.chain().focus().setHorizontalRule().run()}">
      horizontal rule
    </button>
  {/if}
  <div class="editor" bind:this="{element}"></div>
</div>

{#if false}
  <!-- css維持用。WebComponents だと :global が使えない -->
  <div class="ProseMirror">
    <ul></ul>
    <ol></ol>
    <h1>h1</h1>
    <h2>h2</h2>
    <h3>h3</h3>
    <h4>h4</h4>
    <h5>h5</h5>
    <h6>h6</h6>
    <pre><code></code></pre>
    <img src="" alt="" />
    <blockquote></blockquote>
    <hr />
  </div>
{/if}

<style lang="scss">
  $red: #ff3e00;

  .editorWrapper {
    width: 640px;
    padding: 6px;
    border: solid 2px rgb($red, 0.4);
    border-radius: 6px;
  }

  .editor {
    height: 360px;
    overflow: auto;

    &:focus {
      border: solid 2px $red;
    }
  }

  .ProseMirror {
    outline: none;

    > * + * {
      margin-top: 0.75em;
    }

    ul,
    ol {
      padding: 0 1.5rem;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      line-height: 1.1;
    }

    code {
      background-color: rgba(#616161, 0.1);
      color: #616161;
    }

    pre {
      background: #0d0d0d;
      color: #fff;
      font-family: 'JetBrainsMono', monospace;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;

      code {
        color: inherit;
        padding: 0;
        background: none;
        font-size: 0.8rem;
      }
    }

    img {
      max-width: 100%;
      height: auto;
    }

    blockquote {
      padding-left: 1rem;
      border-left: 2px solid rgba(#0d0d0d, 0.1);
    }

    hr {
      border: none;
      border-top: 2px solid rgba(#0d0d0d, 0.1);
      margin: 2rem 0;
    }
  }

  .is-active {
    background: black;
    color: #fff;
    &:hover {
      background: gray;
    }
  }
  button {
    font-size: inherit;
    font-family: inherit;
    color: #000;
    margin: 0.1rem;
    border: 1px solid black;
    border-radius: 0.3rem;
    padding: 0.1rem 0.4rem;
    background: white;
    accent-color: black;
    &:hover {
      background: lightgray;
    }
  }
</style>
