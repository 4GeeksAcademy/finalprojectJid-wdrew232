import React, { useReducer, createContext } from "react";

export const initialStore = () => {
  const token = localStorage.getItem("token");
  const expiration = localStorage.getItem("token_expiration");

  const isExpired = expiration && Date.now() > parseInt(expiration, 10);

  if (isExpired) {
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiration");
  }

  return {
    token: isExpired ? null : token,
    user: null,
    message: null,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      }
    ]
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };

    case 'add_task':
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map(todo =>
          todo.id === id ? { ...todo, background: color } : todo
        )
      };

    case 'SET_TOKEN':
      return {
        ...store,
        token: action.payload
      };

    case 'SET_USER': // save user data
      return {
        ...store,
        user: action.payload
      };

    default:
      throw Error('Unknown action.');
  }
}

export const Context = createContext();

export const StoreProvider = ({ children }) => {
  const [store, dispatch] = useReducer(storeReducer, initialStore());

  return React.createElement(
    Context.Provider,
    { value: { store, dispatch } },
    children
  );
};
