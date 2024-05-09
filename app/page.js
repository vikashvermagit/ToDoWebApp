'use client'
import Image from "next/image";
import { db } from "./firebaseConfig"
import { collection, addDoc, getDocs, deleteDoc, serverTimestamp, query, orderBy, doc, updateDoc } from "firebase/firestore";
import React, { useState, useEffect } from 'react';
import { async } from "@firebase/util";



async function addTodoFirebase(title, details, dueDate) {
  try {
    const docRef = await addDoc(collection(db, "todos"), {
      title: title,
      details: details,
      dueDate: dueDate,
      createdAt: serverTimestamp(),
    });
    console.log("Todo added with ID: ", docRef.id);
    alert("data added");
    return true;
  } catch (error) {
    console.error("Error adding todo :", error);
    return false;
  }
}

async function fetchTodosFromFirestore() {
  const todoscollection = collection(db, "todos");
  const querySnapshot = await getDocs(query(todoscollection, orderBy("createdAt", "desc")));
  const todos = [];
  querySnapshot.forEach((doc) => {
    const todoData = doc.data();
    todos.push({ id: doc.id, ...todoData });
  });
  return todos;
}

async function deleteTodoFromFirestore(todoId) {
  try {
    console.log("Attempting to delete todo with ID: ", todoId);
    await deleteDoc(doc(db, "todos", todoId));
    return todoId;
  } catch (error) {
    console.log("Error deleting todo: ", error);
    return null;
  }

}

export default function Home() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("")
  const [dueDate, setdueDate] = useState("")

  // state to hold the list of todos
  const [todos, setTodos] = useState([]);

  // state to hold the selected todo for update
  const [selectedTodo, setSelectedTodo] = useState(null);

  // state to track whether the form is in update mode
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUpdateMode) {
      if (selectedTodo) {
        try {
          const updatedTodo = {
            title,
            details,
            dueDate,
          };
          const todoRef = doc(db, "todos", selectedTodo.id);
          await updateDoc(todoRef, updatedTodo);

          //reset the form fields
          setTitle("");
          setDetails("");
          setdueDate("");
          setSelectedTodo(null);
          setIsUpdateMode(false);

          alert("Todo updated successfully !!")
        } catch (error) {
          console.error("Error updating todo:", error)
        }
      }
    } else {
      const added = await addTodoFirebase(title, details, dueDate);
      if (added) {
        setTitle("");
        setDetails("");
        setdueDate("");

        alert("Todo added to firestore successfully !! ")
      }
    }
  };

  // fetch todos from firestore on components mount

  useEffect(() => {
    async function fetchTodos() {
      const todos = await fetchTodosFromFirestore();
      setTodos(todos);
    }
    fetchTodos();
  }, []);

  // function to handle "update button click"
  const handleUpdateClick = (todo) => {
    //set the selected todos values to the from fields 
    setTitle(todo.title || "");
    setDetails(todo.details || "");
    setdueDate(todo.dueDate || "");

    setSelectedTodo(todo);
    setIsUpdateMode(true);
  }
  // fetch todos from firestor on components mount 
  useEffect(() => {
    async function fetchTodos() {

      const todos = await fetchTodosFromFirestore();
      setTodos(todos);
    }
    fetchTodos();
  }, []);

  return (
    <main className="flex flex-1 items-center justify-center flex-col md:flex-row min-h-screen ">
      <section className=" flex  items-center md:flex-col md:justify-start mx-auto ">


        <h1> Todo List </h1>

        <div className='p-6 md:p-12 mt-10 rounded-lg shadow-xl w-full max-w-lg bg-white'>
          <h2 className="text-center text-2xl font-bold leading-9 text-gray-700">create todo</h2>

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            {/* for title*/}
            <div>
              <lable htmlFor='title' className="block text-sm font-medium leading-6 text-gray-300">
                Title
              </lable>
              <div className="mt-2">
                <input
                  id="title"
                  name='title'
                  type='text'
                  autoComplete='off'
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className='w-full rounded border py-2 pl-2 text-gray-900 shadow ring'     >
                </input>
              </div>
            </div>

            {/* for Details*/}

            <div>
              <lable htmlFor='title' className="block text-sm font-medium leading-6 text-gray-300">
                Details
              </lable>
              <div className="mt-2">
                <textarea
                  id="details"
                  name='details'
                  rows="4"
                  autoComplete='off'
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className='w-full rounded border py-2 pl-2 text-gray-900 shadow ring'     >
                </textarea>
              </div>
            </div>


            {/* for Date */}

            <div>
              <lable htmlFor='dueDate' className="block text-sm font-medium leading-6 text-gray-300">
                DueDate
              </lable>
              <div className="mt-2">
                <input
                  id="dueDate"
                  name='dueDate'
                  type='date'
                  autoComplete='off'
                  required
                  value={dueDate}
                  onChange={(e) => setdueDate(e.target.value)}
                  className='w-full rounded border py-2 pl-2 text-gray-900 shadow ring'     >
                </input>
              </div>
            </div>

            <div>
              <button type='submit' className="  w-full text-white bg-black rounded-md p-2 shadow ring-5 font-bold hover:bg-gray-950">
                {isUpdateMode ? "Update Todo" : "Save Note"}

              </button>
            </div>
          </form>
        </div>
      </section>

      {/* right section */}

      <section className="md:w 1/2 md:max-h-screen overflow-y-auto md:ml-10 mt-0 mx-auto">
        {/*Todo List*/}

        <div className="p-1 md:p-10 mt-10 rounded-lg shadow-xl w-full max-w-lg bg-white">
          <h2 className="text-center text-2xl font-bold leading-9 text-gray-900">
            Todo List
          </h2>

          {/*Todo Item*/}
          <div className="mt-6 space-y-6">
            {todos.map((todo) => (
              <div key={todo.id} className="border p-4 rounded-md shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 break-words">{todo.title} </h3>

                <p className="text-gray-900 multiline break-words">
                  {todo.details}
                </p>
                <p className=" text-sm text-gray-500">
                  Due Date: {todo.dueDate}
                </p>

                <div className="mt-4 space-x-6">
                   <button
                   type="button"
                   className="px-3 py-1 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                   onClick={()=>handleUpdateClick(todo)}
                   >
                    Update
                   </button>
                   <button
                   type="button"
                   className="px-3 py-1 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md"
                   onClick={async()=>{
                    const deletedTodoId = await deleteTodoFromFirestore(todo.id);
                    if(deletedTodoId){
                      const updatedTodo = todos.filter((t)=>t.id !== deletedTodoId);
                      setTodos(updatedTodo);
                    }
                   }}
                   >
                    Delete
                   </button>

                   
                </div>
              </div>
            ))}
          </div>

        </div>

      </section>
    </main>
  );
}
