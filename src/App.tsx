import 'bootstrap/dist/css/bootstrap.min.css';

import {
  Priority,
  Todo,
  addItemAsync,
  isPriority,
  removeItem,
} from './todoSlice';
import { useDispatch, useSelector } from 'react-redux';

import React from 'react';
import { RootState } from './store';

const PriorityNames = {
  [Priority.High]: '高',
  [Priority.Mid]: '中',
  [Priority.Low]: '低',
} as const;

const TodoList: React.FC = () => {
  const dispatch = useDispatch();
  const todoList = useSelector((state: RootState) => state.todo.todoList);

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
            onClick={() => dispatch(removeItem({ id: todo.id }))}
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

  const todoList = useSelector((state: RootState) => state.todo.todoList);
  const dispatch = useDispatch();

  const handleClickCreateButton = React.useCallback(() => {
    dispatch(addItemAsync({ title, priority }));
    setTitle('');
  }, [dispatch, priority, title]);

  const counts = React.useMemo(() => countByPriority(todoList), [todoList]);

  const titleRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => titleRef.current?.focus(), []);

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
                if (isPriority(val)) {
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
              <TodoList></TodoList>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
