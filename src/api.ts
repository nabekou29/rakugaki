import { Priority, Todo } from './todoSlice';

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

export async function registerTodoItem({
  title,
  priority,
}: {
  title: string;
  priority: Priority;
}): Promise<Todo> {
  await sleep(1000);
  return {
    id: Date.now().toString(),
    title,
    priority,
  };
}
