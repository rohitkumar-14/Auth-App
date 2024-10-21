// app/api/todos/route.ts
import dbConnect from '../../lib/dbConnect';
import Todo from '../../models/Todo';
import { NextResponse } from 'next/server';

export async function GET() {
    await dbConnect();
    const todos = await Todo.find({});
    return NextResponse.json(todos);
}

export async function POST(request: Request) {
    await dbConnect();
    const { todo, status, priority, description } = await request.json(); 
    const newTodo = new Todo({
        todo,
        status,
        priority,
        description 
    });
    await newTodo.save();
    return NextResponse.json(newTodo);
}

export async function DELETE(request: Request) {
    await dbConnect();
    const { id } = await request.json();
    await Todo.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Todo deleted' });
}
