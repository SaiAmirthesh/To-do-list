import { supabase } from "./supabaseClient";
import { useEffect, useState } from "react";
import Button from "./components/Button";
import IconButton from "./components/IconButton";
import Navbar from "./components/Navbar";

const TodoList = ({ onGoToProfile }) => {
  const [user, setUser] = useState(null);
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);


  useEffect(() => {
    if (user) {
      const fetchTodos = async () => {
        const { data, error } = await supabase
          .from("ToDos")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Fetch error:", error);
        } else {
          setTasks(data);
        }
      };
      fetchTodos();
    }
  }, [user]);

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from("ToDos")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Fetch error:", error);
    } else {
      setTasks(data);
    }
  };

  const addTask = async () => {
    if (newTask.trim() === "") return;

    const { error } = await supabase.from("ToDos").insert({
      task: newTask,
      user_id: user.id,
      completed: false,
    });

    if (error) {
      console.error("Insert error:", error);
    } else {
      setNewTask("");
      fetchTodos(); // refresh UI
    }
  };

  const toggleTask = async (id, completed) => {
    const { error } = await supabase
      .from("ToDos")
      .update({ completed: !completed })
      .eq("id", id);

    if (error) {
      console.error("Toggle error:", error);
    } else {
      fetchTodos();
    }
  };

  const deleteTask = async (id) => {
    const { error } = await supabase.from("ToDos").delete().eq("id", id);

    if (error) {
      console.error("Delete error:", error);
    } else {
      fetchTodos();
    }
  };

  return (
    <>
      <div className="w-screen h-screen bg-linear-to-br from-rose-500 via-rose-600 to-rose-500 flex items-center justify-center p-4">
        <Navbar onGoToProfile={onGoToProfile} />
        <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl p-6">
          <h1 className="text-3xl font-bold text-center text-rose-500 mb-6">
            Todo List
          </h1>

          <div className="flex gap-2 mb-6">
            <input
              onChange={(e) => {
                setNewTask(e.target.value);
              }}
              type="text"
              placeholder="Enter new task"
              value={newTask}
              className="flex-1 px-4 py-2 border text-rose-300  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
            <Button
              onClick={addTask}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              Add
            </Button>
          </div>

          <div className="space-y-2">
            <ol className="space-y-2">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between bg-rose-200 p-3 rounded-lg shadow-sm hover:shadow-md hover:bg-rose-500 transition duration-200"
                >
                  <span className={`text-gray-800 ${task.completed ? 'line-through' : ''}`}>{task.task}</span>
                  <div className="flex gap-1">
                    <IconButton
                      onClick={() => toggleTask(task.id, task.completed)}
                      className="p-1 text-green-500 hover:bg-green-100 rounded transition duration-200"
                    >
                      {task.completed ? '✅' : '⬜'}
                    </IconButton>
                    <IconButton
                      variant="danger"
                      onClick={() => deleteTask(task.id)}
                      className="p-1 text-red-500 hover:bg-red-100 rounded transition duration-200"
                    >
                      🗑️
                    </IconButton>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};

export default TodoList;
