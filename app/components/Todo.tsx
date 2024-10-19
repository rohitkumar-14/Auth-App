"use client"

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define your Todo type
interface ITodo {
  _id: string;
  todo: string;
  status: boolean;
  priority: number;
}
const deleteTodo = async (id: string) => {
  await fetch('/api/todos', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  setTodos(todos.filter(todo => todo._id !== id));
};

// Define your columns
export const columns: ColumnDef<ITodo>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "todo", // Ensure this matches the ITodo interface
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Task
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("todo")}</div>, // Displaying todo field
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <div className="capitalize">{row.getValue("status") ? "Completed" : "Pending"}</div>,
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority");
      return <div>{priority === 3 ? "High" : priority === 2 ? "Medium" : "Low"}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const todo = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(todo._id)}>
              Copy Todo ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit Todo</DropdownMenuItem>
            <DropdownMenuItem onClick={() => deleteTodo(todo._id)}>Delete Todo</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function TodoTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTodo, setNewTodo] = useState('');
  const [priority, setPriority] = useState(1);

  const fetchTodos = async () => {
    const response = await fetch('/api/todos');
    const data = await response.json();
    setTodos(data);
};
 useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-up");
    } else if (user && user.id) {
      fetchTodos();
    }
  }, [isLoaded, isSignedIn, user, router]);

  const addTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('/api/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ todo: newTodo, priority, status: false }),
        });
        const data = await response.json();
        setTodos([...todos, data]);
        setNewTodo('');
        setPriority(1);
    };
  //   const deleteTodo = async (id: string) => {
  //     await fetch('/api/todos', {
  //         method: 'DELETE',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ id }),
  //     });
  //     setTodos(todos.filter(todo => todo._id !== id));
  // };

  // const toggleCompleted = (id: number) => {
  //   const updatedTodos = todos.map((item) =>
  //     item.id === id ? { ...item, status: item.status === "completed" ? "pending" : "completed" } : item
  //   );
  //   setTodos(updatedTodos);
  //   if (user && user.id) {
  //     localStorage.setItem(user.id, JSON.stringify(updatedTodos));
  //   }
  // };

  // const deleteTodo = (id: number) => {
  //   const filteredTodos = todos.filter((item) => item.id !== id);
  //   setTodos(filteredTodos);
  //   if (user && user.id) {
  //     localStorage.setItem(user.id, JSON.stringify(filteredTodos));
  //   }
  // };

  const table = useReactTable({
    data: todos,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline" className="ml-2">Status</Button>
        <Button variant="outline" className="ml-2">Priority</Button>
        <Button variant="outline" className="ml-2" onClick={() => setIsModalOpen(true)}>
          Add Todo
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              View <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className={row.getIsSelected() ? "bg-gray-100" : ""}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h3 className="text-xl font-bold mb-4">Add New To-Do</h3>
              <form onSubmit={addTodo}>
              <Input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo"
              required
            />
            <select
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value))}
                >
                    <option value={1}>Low</option>
                    <option value={2}>Medium</option>
                    <option value={3}>High</option>
                </select><br  />
            <Button type="submit" className="mr-2">Add Todo</Button>
            <Button type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              </form>
            </div>
            </div>
        )}
    </div>
  );
}
