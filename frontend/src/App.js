import React, { useState } from "react";
import axios from "axios";
import "./App.css";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
 https://smart-task-manager-no6o.onrender.com
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  // LOGIN
  const login = async () => {
    try {
      const res = await axios.post(`${API}/auth/login`, {
        email,
        password,
      });
      setToken(res.data.token);
      fetchTasks(res.data.token);
    } catch {
      alert("Login failed");
    }
  };

  // FETCH TASKS
  const fetchTasks = async (tk = token) => {
    const res = await axios.get(`${API}/tasks`, {
      headers: { Authorization: "Bearer " + tk },
    });
    setTasks(res.data);
  };

  // ADD TASK
  const addTask = async () => {
    await axios.post(
      `${API}/tasks`,
      { title, priority, dueDate },
      { headers: { Authorization: "Bearer " + token } }
    );
    setTitle("");
    setDueDate("");
    fetchTasks();
  };

  // UPDATE STATUS
  const updateStatus = async (id, status) => {
    await axios.put(
      `${API}/tasks/${id}`,
      { status },
      { headers: { Authorization: "Bearer " + token } }
    );
    fetchTasks();
  };

  // DRAG DROP
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const id = result.draggableId;
    const newStatus = result.destination.droppableId;

    await updateStatus(id, newStatus);
  };

  // ✅ SAFE STATUS COUNT (handles wrong old data too)
  const count = (status) =>
    tasks.filter((t) => (t.status || "").trim() === status).length;

  // 🎨 CHART DATA (RED - YELLOW - GREEN)
  const chartData = {
    labels: ["To Do", "In Progress", "Completed"],
    datasets: [
      {
        data: [count("To Do"), count("In Progress"), count("Completed")],

        backgroundColor: [
          "#fca5a5", // red
          "#fde68a", // yellow
          "#86efac", // green
        ],

        borderColor: [
          "#ef4444",
          "#f59e0b",
          "#22c55e",
        ],

        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: "#475569",
          font: { size: 14 },
        },
      },
    },
  };

  return (
    <div className="container">
      <h1>🚀 Smart Task Manager</h1>

      {/* LOGIN */}
      <div className="card">
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={login}>Login</button>
      </div>

      {/* ADD TASK */}
      <div className="card">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task" />
        <select onChange={(e) => setPriority(e.target.value)}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* CHART */}
      <div className="card">
        <h2>📊 Task Analytics</h2>
        <Doughnut data={chartData} options={chartOptions} />
      </div>

      {/* KANBAN BOARD */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board">

          {["To Do", "In Progress", "Completed"].map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  className="column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h2>{status}</h2>

                  {tasks
                    .filter((t) => (t.status || "").trim() === status)
                    .map((t, index) => (
                      <Draggable
                        key={t._id}
                        draggableId={t._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className={`task ${t.priority} ${t.status}`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <h4>{t.title}</h4>
                            <p>{t.priority}</p>

                            <p>
                              {t.dueDate
                                ? new Date(t.dueDate).toLocaleDateString()
                                : ""}
                            </p>

                            {/* OVERDUE */}
                            {t.dueDate &&
                              new Date(t.dueDate) < new Date() &&
                              t.status !== "Completed" && (
                                <p className="overdue">⚠ Overdue</p>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}

        </div>
      </DragDropContext>
    </div>
  );
}

export default App;