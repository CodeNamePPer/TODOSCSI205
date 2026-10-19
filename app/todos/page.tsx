'use client';

import { useEffect, useState } from "react";
import { Toggle } from "@/components/tailgrids/core/toggle";
import { Spinner } from "@/components/tailgrids/core/spinner";
import {
    NativeSelect,
    NativeSelectOption
} from "@/components/tailgrids/core/native-select";
import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRoot,
    TableRow
} from "@/components/tailgrids/core/table";
import { Button } from "@/components/tailgrids/core/button";
import {
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/tailgrids/core/dialog";
import { Input } from "@/components/tailgrids/core/input";
import { Label } from "@/components/tailgrids/core/label";
import { Trash1, Check, ClockThree, Plus, ArrowLeft, ArrowRight } from "@tailgrids/icons";
import { fetchTodos } from "../data/todos";
import type { TodoType } from "../data/todos";


export default function TodosPage() {
    const [loading, setLoading] = useState<boolean>(true);
    const [todosRaw, setTodosRaw] = useState<TodoType[]>([]);
    const [onlyWaiting, setOnlyWaiting] = useState<boolean>(false);
    const [todos, setTodos] = useState<TodoType[]>([]);
    const [itemsPerPage, setItemsPerPage] = useState<number>(5);
    const [numPages, setNumPages] = useState<number>(1);
    const [curPage, setCurPage] = useState<number>(1);

    const deleteClick = (id: number) => {
        setTodosRaw(
            todosRaw.filter((todo) => {
                return todo.id !== id;
            })
        );
    };

    const waitingClick = (id: number) => {
        const selectedItem = todosRaw.find((todo) => {
            return todo.id === id;
        });
        if (selectedItem) {
            selectedItem.completed = true;
            setTodosRaw([...todosRaw]);
        }
    };

    const handlePageChange = (page: number) => {
        setCurPage(page);
    };

    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
    const [newTodoTitle, setNewTodoTitle] = useState<string>("");

    const addClick = () => {
        setNewTodoTitle("");
        setIsAddDialogOpen(true);
    };

    const handleAddTodo = () => {
        if (newTodoTitle.trim()) {
            const nextId = todosRaw.length > 0 ? Math.max(...todosRaw.map((t) => t.id)) + 1 : 1;
            const newTodo: TodoType = {
                id: nextId,
                title: newTodoTitle.trim(),
                completed: false,
            };
            setTodosRaw([newTodo, ...todosRaw]);
            setNewTodoTitle("");
            setIsAddDialogOpen(false);
        }
    };
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(() => {
        const storedTodos = localStorage.getItem('todosRaw');
        if (storedTodos !== null) {
            try {
                setTodosRaw(JSON.parse(storedTodos) as TodoType[]);
                setLoading(false);
                setIsLoaded(true);
                return;
            } catch (error) {
                console.error("Failed to parse todos from localStorage:", error);
            }
        }

        fetchTodos()
            .then((data) => {
                setTodosRaw(data);
            })
            .catch(() => {
                setTodosRaw([]);
            })
            .finally(() => {
                setLoading(false);
                setIsLoaded(true);
            });
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('todosRaw', JSON.stringify(todosRaw));
        }
    }, [todosRaw, isLoaded]);
    //waiting
    useEffect(() => {
        const selectedItems = todosRaw.filter(
            (todo) => !onlyWaiting || !todo.completed
        );
        
        setTodos(selectedItems);
    }, [todosRaw, onlyWaiting]);

    useEffect(() => {
        
        setNumPages(Math.ceil(todos.length / itemsPerPage));
    }, [todos, itemsPerPage]);

    useEffect(() => { 
        if (numPages === 0) setCurPage(0);
        else if (curPage === 0) setCurPage(1);
        else if (curPage > numPages) setCurPage(numPages);

    }, [numPages]);

    const safePage = Math.max(1, curPage);
    const startIndex = (safePage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedTodos = todos.slice(startIndex, endIndex);

    return (
        <div className="w-[750px] max-w-full mx-auto mt-6 mb-12 px-4">
            <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-2 select-none">
                    <Toggle
                        checked={onlyWaiting}
                        onChange={(e) => setOnlyWaiting(e.target.checked)}
                    />
                    <span className="text-sm font-semibold text-gray-800">Show only</span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f59e0b] text-white text-xs font-semibold rounded-full shadow-sm">
                        Waiting
                        <ClockThree className="size-3.5" />
                    </span>
                </div>

                <div className="w-48">
                    <NativeSelect
                        value={itemsPerPage.toString()}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    >
                        <NativeSelectOption value="5">5 items per page</NativeSelectOption>
                        <NativeSelectOption value="10">10 items per page</NativeSelectOption>
                        <NativeSelectOption value="50">50 items per page</NativeSelectOption>
                    </NativeSelect>
                </div>
            </div>

            <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white">
                <TableRoot>
                    <TableHeader>
                        <TableRow className="bg-black hover:bg-black text-white border-b-0">
                            <TableHead className="w-20 text-center font-bold text-white text-sm py-3.5">
                                ID
                            </TableHead>
                            <TableHead className="font-bold text-white text-sm py-3.5 text-center">
                                Title
                            </TableHead>
                            <TableHead className="w-48 text-right font-bold text-white text-sm py-3.5 pr-4">
                                <div className="flex items-center justify-end gap-2.5">
                                    <span>Completed</span>
                                    <button
                                        type="button"
                                        onClick={addClick}
                                        className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white p-1 rounded-md transition flex items-center justify-center size-6 shadow-sm"
                                        title="Add Todo"
                                    >
                                        <Plus className="size-4 stroke-[2.5]" />
                                    </button>
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {loading && (
                            <TableRow>
                                <TableCell colSpan={3} className="py-12 text-center">
                                    <Spinner className="mx-auto" />
                                    <span className="block mt-2 text-xs text-gray-400">Loading todos...</span>
                                </TableCell>
                            </TableRow>
                        )}

                        {!loading && displayedTodos.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="py-10 text-center text-gray-400 text-sm">
                                    No todos found
                                </TableCell>
                            </TableRow>
                        )}

                        {!loading && displayedTodos.map((todo) => (
                            <TableRow
                                key={todo.id}
                                className="border-b border-gray-100 hover:bg-gray-50/75 transition duration-150"
                            >
                                <TableCell className="text-center py-3.5">
                                    <span className="inline-flex items-center justify-center min-w-8 px-2 py-0.5 bg-[#5a6474] text-white font-bold text-xs rounded-lg shadow-sm">
                                        {todo.id}
                                    </span>
                                </TableCell>
                                <TableCell className="py-3.5 text-sm text-gray-700 font-normal">
                                    {todo.title}
                                </TableCell>
                                <TableCell className="py-3.5 pr-4 text-right">
                                    <div className="flex items-center justify-end gap-2.5">
                                        {!todo.completed ? (
                                            <button
                                                type="button"
                                                onClick={() => waitingClick(todo.id)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f59e0b] hover:bg-[#d97706] active:scale-95 text-white text-xs font-semibold rounded-full shadow-sm transition"
                                                title="Click to complete"
                                            >
                                                Waiting
                                                <ClockThree className="size-3.5" />
                                            </button>
                                        ) : (
                                            <span
                                                className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#059669] text-white text-xs font-semibold rounded-full shadow-sm select-none"
                                            >
                                                Done
                                                <Check className="size-3.5 stroke-[2.5]" />
                                            </span>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => deleteClick(todo.id)}
                                            className="inline-flex items-center justify-center size-7 bg-[#dc2626] hover:bg-[#b91c1c] active:scale-95 text-white rounded-md shadow-sm transition"
                                            aria-label="Delete todo"
                                        >
                                            <Trash1 className="size-3.5" />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </TableRoot>
            </div>
            {todos.length > 0 && (
                <div className="mt-4 flex items-center justify-center gap-1">
                    <Button
                        appearance="outline"
                        size="sm"
                        disabled={curPage <= 1}
                        onClick={() => handlePageChange(1)}
                        className="h-10 px-3.5 text-sm"
                    >
                        First
                    </Button>

                    <Button
                        appearance="outline"
                        size="sm"
                        disabled={curPage <= 1}
                        onClick={() => handlePageChange(curPage - 1)}
                        className="h-10"
                        iconOnly
                        aria-label="Previous page"
                    >
                        <ArrowLeft className="size-5" />
                    </Button>

                    {(() => {
                        const maxVisible = 3;
                        let start = Math.max(1, safePage - Math.floor(maxVisible / 2));
                        const end = Math.min(numPages, start + maxVisible - 1);
                        start = Math.max(1, end - maxVisible + 1);

                        return Array.from({ length: end - start + 1 }, (_, i) => start + i).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                aria-current={curPage === page ? "page" : undefined}
                                aria-label={`Go to page ${page}`}
                                className={`size-10 shrink-0 rounded-lg text-sm font-medium transition ${
                                    curPage === page
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-500 hover:bg-gray-100"
                                }`}
                            >
                                {page}
                            </button>
                        ));
                    })()}

                    <Button
                        appearance="outline"
                        size="sm"
                        disabled={curPage >= numPages}
                        onClick={() => handlePageChange(curPage + 1)}
                        className="h-10"
                        iconOnly
                        aria-label="Next page"
                    >
                        <ArrowRight className="size-5" />
                    </Button>

                    <Button
                        appearance="outline"
                        size="sm"
                        disabled={curPage >= numPages}
                        onClick={() => handlePageChange(numPages)}
                        className="h-10 px-3.5 text-sm"
                    >
                        Last
                    </Button>
                </div>
            )}

            <Dialog
                isOpen={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
            >
                {({ close }) => (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleAddTodo();
                        }}
                    >
                        <DialogHeader>
                            <DialogTitle>Add New Todo</DialogTitle>
                            <DialogDescription>
                                Enter a title for the new todo item.
                            </DialogDescription>
                        </DialogHeader>

                        <DialogBody>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="new-todo-title">Title</Label>
                                <Input
                                    id="new-todo-title"
                                    className="w-full"
                                    value={newTodoTitle}
                                    onChange={(e) => setNewTodoTitle(e.target.value)}
                                    placeholder="Enter todo title..."
                                    autoFocus
                                />
                            </div>
                        </DialogBody>

                        <DialogFooter>
                            <Button
                                type="button"
                                appearance="outline"
                                onPress={close}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={!newTodoTitle.trim()}
                            >
                                Add Todo
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </Dialog>
        </div>
    );
}