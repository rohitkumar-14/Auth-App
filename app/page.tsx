"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TodoTable } from "./components/Todo";

export default function Home() {
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-up");
    } else if (user) {
      const savedTodos = JSON.parse(localStorage.getItem(user.id)) || [];
      setTodos(savedTodos);
    }
  }, [isLoaded, isSignedIn, user, router]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (todo.trim() === "") return;

    const newTodos = [
      ...todos,
      { text: todo, id: Date.now(), completed: false },
    ];
    setTodos(newTodos);
    setTodo("");
    setIsModalOpen(false);
    localStorage.setItem(user.id, JSON.stringify(newTodos));
  };

  const toggleCompleted = (id) => {
    const updatedTodos = todos.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setTodos(updatedTodos);
    localStorage.setItem(user.id, JSON.stringify(updatedTodos));
  };

  const deleteTodo = (id) => {
    const filteredTodos = todos.filter((item) => item.id !== id);
    setTodos(filteredTodos);
    localStorage.setItem(user.id, JSON.stringify(filteredTodos));
  };

  return (
    <>
      <div className="flex align-middle justify-between p-5">
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-gray-400 text-sm">
            Here's a list of your tasks for this month!
          </p>
        </div>
        <header className="flex items-center">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <div className="flex items-center space-x-4">
              <UserButton />
            </div>
          </SignedIn>
        </header>
      </div>

      <SignedIn>
        <div className="mt-8 p-5">
         
          <TodoTable />
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h3 className="text-xl font-bold mb-4">Add New To-Do</h3>
              <form onSubmit={handleAddTodo}>
              <Input
              type="text"
              value={todo}
              onChange={(e) => setTodo(e.target.value)}
              placeholder="Todo Title"
              required
            />
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Low">Low</option>
            </select>
            <Button type="submit">Add Todo</Button>
            <Button type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              </form>
            </div>
            </div>
        )}
      </SignedIn>
    </>
  );
}
