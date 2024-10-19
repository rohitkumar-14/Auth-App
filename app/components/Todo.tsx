// "use client"

// import * as React from "react"
// import {
//   ColumnDef,
//   ColumnFiltersState,
//   SortingState,
//   VisibilityState,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table"
// import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import { useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Input } from "@/components/ui/input"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"

// // Define your Todo type
// export type Todo = {
//   id: string
//   title: string
//   status: "completed" | "pending" | "in-progress"
//   dueDate: string
// }

// // Sample todo data
// const data: Todo[] = [
//   { id: "1", title: "Buy groceries", status: "completed", dueDate: "2024-10-15" },
//   { id: "2", title: "Read a book", status: "in-progress", dueDate: "2024-10-20" },
//   { id: "3", title: "Write code", status: "pending", dueDate: "2024-10-25" },
//   { id: "4", title: "Clean the house", status: "completed", dueDate: "2024-10-18" },
//   { id: "5", title: "Do laundry", status: "pending", dueDate: "2024-10-22" },
// ]

// // Define your columns
// export const columns: ColumnDef<Todo>[] = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && "indeterminate")
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "title",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Title
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       )
//     },
//     cell: ({ row }) => <div>{row.getValue("title")}</div>,
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//     cell: ({ row }) => (
//       <div className="capitalize">{row.getValue("status")}</div>
//     ),
//   },
//   {
//     accessorKey: "dueDate",
//     header: () => <div>Due Date</div>,
//     cell: ({ row }) => {
//       return <div>{row.getValue("dueDate")}</div>
//     },
//   },
//   {
//     id: "actions",
//     enableHiding: false,
//     cell: ({ row }) => {
//       const todo = row.original

//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0">
//               <span className="sr-only">Open menu</span>
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem onClick={() => navigator.clipboard.writeText(todo.id)}>
//               Copy Todo ID
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>Edit Todo</DropdownMenuItem>
//             <DropdownMenuItem>Delete Todo</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     },
//   },
// ]

// export function TodoTable() {
//   const [sorting, setSorting] = React.useState<SortingState>([])
//   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
//   const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
//   const [rowSelection, setRowSelection] = React.useState({})
//   const { isSignedIn, isLoaded, user } = useUser();
//   const router = useRouter();
//   const [todo, setTodo] = useState("");
//   const [todos, setTodos] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   useEffect(() => {
//     if (isLoaded && !isSignedIn) {
//       router.push("/sign-up");
//     } else if (user) {
//       const savedTodos = JSON.parse(localStorage.getItem(user.id)) || [];
//       setTodos(savedTodos);
//     }
//   }, [isLoaded, isSignedIn, user, router]);

//   const handleAddTodo = (e) => {
//     e.preventDefault();
//     if (todo.trim() === "") return;

//     const newTodos = [
//       ...todos,
//       { text: todo, id: Date.now(), completed: false },
//     ];
//     setTodos(newTodos);
//     setTodo("");
//     setIsModalOpen(false);
//     localStorage.setItem(user.id, JSON.stringify(newTodos));
//   };

//   const toggleCompleted = (id) => {
//     const updatedTodos = todos.map((item) =>
//       item.id === id ? { ...item, completed: !item.completed } : item
//     );
//     setTodos(updatedTodos);
//     localStorage.setItem(user.id, JSON.stringify(updatedTodos));
//   };

//   const deleteTodo = (id) => {
//     const filteredTodos = todos.filter((item) => item.id !== id);
//     setTodos(filteredTodos);
//     localStorage.setItem(user.id, JSON.stringify(filteredTodos));
//   };
//   const table = useReactTable({
//     data,
//     columns,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//     },
//   })

//   return (
//     <div className="w-full">
//       <div className="flex items-center py-4">
//         <Input
//           placeholder="Filter titles..."
//           value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
//           onChange={(event) =>
//             table.getColumn("title")?.setFilterValue(event.target.value)
//           }
//           className="max-w-sm"
//         />
//         <Button variant="outline" onClick={() => setIsModalOpen(true)}>
//               Add Todo
//             </Button>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" className="ml-auto">
//               Columns <ChevronDown className="ml-2 h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             {table
//               .getAllColumns()
//               .filter((column) => column.getCanHide())
//               .map((column) => (
//                 <DropdownMenuCheckboxItem
//                   key={column.id}
//                   className="capitalize"
//                   checked={column.getIsVisible()}
//                   onCheckedChange={(value) => column.toggleVisibility(!!value)}
//                 >
//                   {column.id}
//                 </DropdownMenuCheckboxItem>
//               ))}
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <TableHead key={header.id}>
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={columns.length} className="h-24 text-center">
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//       <div className="flex items-center justify-end space-x-2 py-4">
//         <div className="flex-1 text-sm text-muted-foreground">
//           {table.getFilteredSelectedRowModel().rows.length} of{" "}
//           {table.getFilteredRowModel().rows.length} row(s) selected.
//         </div>
//         <div className="space-x-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//           >
//             Previous
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//       {isModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
//               <h3 className="text-xl font-bold mb-4">Add New To-Do</h3>
//               <form onSubmit={handleAddTodo}>
//                 <Input
//                   type="text"
//                   value={todo}
//                   placeholder="Enter your to-do"
//                   className="border px-4 py-2 rounded w-full"
//                   onChange={(e) => setTodo(e.target.value)}
//                 />
//                 <div className="flex justify-between mt-4">
//                   <Button
//                     type="button"
//                     variant="destructive"
//                     onClick={() => setIsModalOpen(false)}
//                   >
//                     Cancel
//                   </Button>
//                   <Button variant="outline" className="bg-blue-700 text-white" type="submit">
//                     Add Todo
//                   </Button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//     </div>
//   )
// }
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
export type Todo = {
  id: number; // Changed to number to match Date.now()
  title: string;
  status: "completed" | "pending" | "in-progress";
  priority: "Medium" | "High" | "Low";
};

// Define your columns
export const columns: ColumnDef<Todo>[] = [
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
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("title")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("priority")}</div>
    ),
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
              onClick={() => navigator.clipboard.writeText(todo.id.toString())}>
              Copy Todo ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit Todo</DropdownMenuItem>
            <DropdownMenuItem onClick={() => deleteTodo(todo.id)}>
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
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [priority, setPriority] = useState("Medium");

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-up");
    } else if (user && user.id) {
      const savedTodos = JSON.parse(localStorage.getItem(user.id)) || [];
      setTodos(savedTodos);
    }
  }, [isLoaded, isSignedIn, user, router]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (todo.trim() === "") return;

    const newTodo: Todo = {
      id: Date.now(),
      title: todo,
      status: "pending",
      priority,
    };

    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
    setTodo("");
    setIsModalOpen(false);
    if (user && user.id) {
      localStorage.setItem(user.id, JSON.stringify(newTodos));
    }
  };

  // const toggleCompleted = (id: number) => {
  //   const updatedTodos = todos.map((item) =>
  //     item.id === id
  //       ? {
  //           ...item,
  //           status: item.status === "completed" ? "pending" : "completed",
  //         }
  //       : item
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

      {/* {isModalOpen && (
        <div className="modal">
          <h2>Add Todo</h2>
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
      )} */}
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
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="py-2 px-4 bg-slate-100 border border-slate-400 m-2 rounded">
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Low">Low</option>
              </select>
              <br />
              <Button type="submit" className="mr-2">
                Add Todo
              </Button>
              <Button type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
