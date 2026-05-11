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

  const API = "http://localhost:5000";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState("");

  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  // REGISTER
  const register = async () => {
    try {
      await axios.post(`${API}/auth/register`, {
        email,
        password,
      });

      alert("Registered Successfully");
    } catch (err) {
      console.log(err);
      console.log(err.response?.data);
alert(err.response?.data || "Register Failed");
    }
  };

  // LOGIN
  const login = async () => {
    try {

      const res = await axios.post(`${API}/auth/login`, {
        email,
        password,
      });

      setToken(res.data.token);

      fetchTasks(res.data.token);

      alert("Login Successful");

    } catch (err) {
      console.log(err);
      alert("Login Failed");
    }
  };

  // FETCH TASKS
  const fetchTasks = async (tk = token) => {
    try {

      const res = await axios.get(`${API}/tasks`, {
        headers: {
          Authorization: "Bearer " + tk,
        },
      });

      setTasks(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  // ADD TASK
  const addTask = async () => {
    try {

      await axios.post(
        `${API}/tasks`,
        {
          title,
          priority,
          dueDate,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      setTitle("");
      setDueDate("");

      fetchTasks();

    } catch (err) {
      console.log(err);
    }
  };

  // UPDATE STATUS
  const updateStatus = async (id, status) => {
    try {

      await axios.put(
        `${API}/tasks/${id}`,
        { status },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      fetchTasks();

    } catch (err) {
      console.log(err);
    }
  };

  // DRAG DROP
  const onDragEnd = async (result) => {

    if (!result.destination) return;

    const taskId = result.draggableId;

    const newStatus = result.destination.droppableId;

    updateStatus(taskId, newStatus);
  };

  // TASK COUNTS
  const count = (status) =>
    tasks.filter((t) => (t.status || "").trim() === status).length;

  // CHART DATA
  const chartData = {
    labels: ["To Do", "In Progress", "Completed"],

    datasets: [
      {
        data: [
          count("To Do"),
          count("In Progress"),
          count("Completed"),
        ],

        backgroundColor: [
          "#fca5a5",
          "#fde68a",
          "#86efac",
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

  return (
    <div className="container">

      <h1>🚀 Smart Task Manager</h1>

      {/* AUTH */}
      <div className="card">

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="btns">
          <button onClick={register}>Register</button>
          <button onClick={login}>Login</button>
        </div>

      </div>

      {/* ADD TASK */}
      <div className="card">

        <input
          value={title}
          placeholder="Task Title"
          onChange={(e) => setTitle(e.target.value)}
        />

        <select onChange={(e) => setPriority(e.target.value)}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <button onClick={addTask}>
          Add Task
        </button>

      </div>

      {/* CHART */}
      <div className="card">
        <h2>📊 Analytics</h2>

        <Doughnut data={chartData} />
      </div>

      {/* BOARD */}
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
                            className={`task ${t.priority}`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >

                            <h3>{t.title}</h3>

                            <p>Priority: {t.priority}</p>

                            <p>
                              Due:
                              {" "}
                              {t.dueDate
                                ? new Date(t.dueDate).toLocaleDateString()
                                : "No Date"}
                            </p>

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