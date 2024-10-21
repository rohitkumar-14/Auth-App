"use client";

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
  description: string;
}

// Define your columns
export const columns: ColumnDef<ITodo>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
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
    accessorKey: "todo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Task
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("todo")}</div>, 
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("status") ? "Completed" : "Pending"}
      </div>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority");
      return (
        <div>{priority === 3 ? "High" : priority === 2 ? "Medium" : "Low"}</div>
      );
    },
  },
  {
    accessorKey: "description", 
    header: "Description",
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(todo._id)}>
              Copy Todo ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit Todo</DropdownMenuItem>
            <DropdownMenuItem >
              Delete Todo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function TodoTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [priority, setPriority] = useState(1);
  const [textInput, setTextInput] = useState<string>("");
  const [description, setDescription] = useState<string>("");
 
  // const addTodoAndGenerateText = async (e: React.FormEvent) => {
  //   e.preventDefault();
  
  //   // Generate text from the input
  //   try {
  //     const response = await fetch("/api/generate-text", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ prompt: textInput }),
  //     });
  
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  
  //     const result = await response.json();
  //     const generatedTextResult = result.generatedText || "No text generated";
  //     setGeneratedText(generatedTextResult);
  //     setTextInput(""); 
  
  //     const todoResponse = await fetch("/api/todos", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         todo: textInput,  
  //         priority,
  //         status: false,
  //         description: generatedTextResult, 
  //       }),
  //     });
  
  //     if (!todoResponse.ok) {
  //       throw new Error("Failed to add todo");
  //     }
  
  //     const newTodo = await todoResponse.json();
  //     setTodos((prevTodos) => [...prevTodos, newTodo]);
  //     setPriority(1); 
  //     setDescription("");
  //     setIsModalOpen(false);
  //   } catch (error) {
  //     console.error("Error:", error);
  //     setGeneratedText("Failed to generate text or add todo");
  //   }
  // };
  const addTodoAndGenerateText = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const textPrompt = `Generate a todo description based on: "${textInput}"`;
      const response = await fetch("/api/generate-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: textPrompt }),
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const result = await response.json();
      const generatedTextResult = result.generatedText || "No text generated";
      setDescription(generatedTextResult);
  
      const todoResponse = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          todo: textInput,  
          priority,
          status: false,
          description: generatedTextResult, // Use the generated description
        }),
      });
  
      if (!todoResponse.ok) {
        throw new Error("Failed to add todo");
      }
  
      const newTodo = await todoResponse.json();
      setTodos((prevTodos) => [...prevTodos, newTodo]);
  
      // Reset form values
      setPriority(1);
      setTextInput("");
      setDescription("");
      setIsModalOpen(false);
  
      fetchTodos();
    } catch (error) {
      console.error("Error:", error);
      setGeneratedText("Failed to generate text or add todo");
    }
  };
  
  const fetchTodos = async () => {
    const response = await fetch("/api/todos");
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
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button variant="outline" className="ml-2">
          Status
        </Button>
        <Button variant="outline" className="ml-2">
          Priority
        </Button>
        <Button
          variant="outline"
          className="ml-2"
          onClick={() => setIsModalOpen(true)}>
          Add Todo
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              View <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}>
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
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={row.getIsSelected() ? "bg-gray-100" : ""}>
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
      <div>
     
      </div>
           {/* Modal for adding a Todo */}
           {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-lg font-semibold">Add Todo</h2>
            <form onSubmit={addTodoAndGenerateText}>
              <Input
                placeholder="Describe your task..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="mb-2"
              />
              <select value={priority} onChange={(e) => setPriority(Number(e.target.value))}>
              <option value={1}>Low</option>
              <option value={2}>Medium</option>
              <option value={3}>High</option>
            </select>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
              <Button type="submit">Generate & Add Todo</Button>
              <Button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="ml-2"
              >
                Cancel
              </Button>
            </form>
          </div>
        </div>
      )}
    
    </div>
  );
}
