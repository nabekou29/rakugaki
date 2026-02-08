<script lang="ts">
  import { flip } from 'svelte/animate';

  const Priorities = {
    High: 1,
    Mid: 2,
    Low: 3,
  } as const;
  type Priority = typeof Priorities[keyof typeof Priorities];

  const priorityNames = {
    [Priorities.High]: '高',
    [Priorities.Mid]: '中',
    [Priorities.Low]: '低',
  } as const;

  type TodoItem = {
    id: number;
    title: string;
    priority: Priority;
  };

  let title = '';
  let priority: number = 2;
  let todoList: TodoItem[] = [];

  $: disabledCreateButton = title === '';
  $: sortedTodoList = todoList.sort(
    (item1, item2) => item1.priority - item2.priority
  );

  // 作成ボタンを押したときの処理
  const handleClickCreateButton = () => {
    const id = new Date().getTime();
    if (priority === 1 || priority === 2 || priority === 3) {
      todoList = [...todoList, { id, title, priority }];
    }
    title = '';
  };

  // 完了処理
  const completeItem = (id: number) => {
    todoList = todoList.filter((todo) => todo.id !== id);
  };
</script>

<div class="container mt-3">
  <div class="row justify-content-center">
    <div class="col-lg-6 col-md-8">
      <h2>TODO アプリ</h2>
      <form>
        <div class="form-group">
          <label for="title">タイトル</label>
          <input id="title" class="form-control" bind:value={title} />
        </div>
        <div class="form-group">
          <label for="priority">優先度</label>
          <select id="priority" class="form-control" bind:value={priority}>
            {#each Object.entries(priorityNames) as [value, label]}
              <option value={Number(value)}>{label}</option>
            {/each}
          </select>
        </div>
        <div class="form-group text-center">
          <button
            class="btn btn-primary px-5"
            disabled={disabledCreateButton}
            on:click={handleClickCreateButton}>
            作成
          </button>
        </div>
      </form>
    </div>
  </div>
  <div class="row justify-content-center">
    <div class="col-lg-6 col-md-8">
      {#if todoList.length === 0}
        <div>アイテムを作成してください</div>
      {:else}
        <ul class="list-group">
          {#each sortedTodoList as todoItem (todoItem.id)}
            <li animate:flip class="list-group-item align-middle">
              <span
                class="badge m-1"
                class:badge-danger={todoItem.priority === Priorities.High}
                class:badge-warning={todoItem.priority === Priorities.Mid}
                class:badge-success={todoItem.priority === Priorities.Low}>
                {priorityNames[todoItem.priority]}
              </span>
              {todoItem.title}
              <button
                class="btn btn-sm btn-success float-right"
                on:click={() => completeItem(todoItem.id)}>
                ×
              </button>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
</div>
