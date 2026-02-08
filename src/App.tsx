import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';

enum Priority {
  High = 1,
  Mid = 2,
  Low = 3,
}

const PriorityNames = {
  [Priority.High]: '高',
  [Priority.Mid]: '中',
  [Priority.Low]: '低',
} as const;

interface Todo {
  id: string;
  title: string;
  priority: Priority;
}

const TodoList: React.FC<{
  todoList: Todo[];
  onClickDeleteButton: (i: number) => () => void;
}> = ({ todoList, onClickDeleteButton }) => {
  return (
    <ul className="list-group">
      {todoList.map((todo, i) => (
        <li key={todo.id} className="list-group-item align-middle">
          <span
            className={
              'badge m-1 ' +
              (todo.priority === Priority.High
                ? 'badge-danger'
                : todo.priority === Priority.Mid
                ? 'badge-warning'
                : todo.priority === Priority.Low
                ? 'badge-success'
                : '')
            }
          >
            {PriorityNames[todo.priority]}
          </span>
          {todo.title}
          <button
            className="btn btn-sm btn-danger float-right"
            onClick={onClickDeleteButton(i)}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
};

const countByPriority = (todoList: Todo[]) => {
  for (let i = 0; i < 10 ** 8; i++);
  return todoList
    .map((todo) => todo.priority)
    .reduce((c, p) => {
      c[p] = (c[p] ?? 0) + 1;
      return c;
    }, {} as Partial<Record<Priority, number>>);
};

const App: React.FC = () => {
  const [title, setTitle] = React.useState('');
  const [priority, setPriority] = React.useState<Priority>(2);
  const [todoList, setTodoList] = React.useState<Todo[]>([]);

  const handleClickCreateButton = React.useCallback(() => {
    setTodoList([...todoList, { id: Date.now().toString(), title, priority }]);
    setTitle('');
  }, [priority, title, todoList]);

  const handleClickDeleteButton = (index: number) => () => {
    setTodoList(todoList.filter((_, i) => i !== index));
  };

  const counts = React.useMemo(() => countByPriority(todoList), [todoList]);

  const titleRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => console.log(titleRef.current?.value), []);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          <div className="form-group">
            <label>タイトル</label>
            <input
              ref={titleRef}
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>優先度</label>
            <select
              className="form-control"
              value={priority}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val === 1 || val === 2 || val === 3) {
                  setPriority(val);
                }
              }}
            >
              {Object.entries(PriorityNames).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group text-center">
            <button
              className={
                'btn btn-primary px-5 ' + (!title ? 'btn-disabled' : '')
              }
              onClick={handleClickCreateButton}
              disabled={!title}
            >
              作成
            </button>
          </div>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          {todoList.length === 0 ? (
            <div>アイテムを作成してください</div>
          ) : (
            <React.Fragment>
              {Object.entries(PriorityNames).map(([value, label]) => (
                <span key={value} className="mx-2">
                  {label}: {counts[Number(value) as Priority] ?? 0}
                </span>
              ))}
              <TodoList
                todoList={todoList}
                onClickDeleteButton={handleClickDeleteButton}
              ></TodoList>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
