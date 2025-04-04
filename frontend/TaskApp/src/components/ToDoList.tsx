import React, { JSX, useState, useEffect } from "react";
import api from "../api/axiosInstance.ts";
import "./ToDoList.css";

const API_URL = "http://127.0.0.1:8000/task/add";
const FETCH_API_URL = "http://127.0.0.1:8000/task/";
const DELETE_API_URL = "http://127.0.0.1:8000/task/remove/";
const UPDATE_API_URL = "http://127.0.0.1:8000/task/update";

interface Task {
  id: number;
  task: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'In progress' | 'Complete';
}

// Priority sorting order
const priorityOrder: Record<'High' | 'Medium' | 'Low', number> = {
  High: 1, 
  Medium: 2, 
  Low: 3,
};

function ToDoList(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>("Medium");
  const [editMode, setEditMode] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [editPriority, setEditPriority] = useState<'High' | 'Medium' | 'Low'>("Medium");
  const [editStatus, setEditStatus] = useState<'In progress' | 'Complete'>("In progress");

  //mount everytime the page is refreshed
  useEffect(() => {
    fetchTasks();
  }, []);

  // check if the token recieved
  const token = sessionStorage.getItem("token");
    if (!token) { 
      console.error("No token found, user not authenticated.");
    }
  
  // requesting tasks from backend
  async function fetchTasks() {
    try {
      const response = await api.get(FETCH_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Sort task by priority
      const sortedTasks = response.data.sort(
        (a: Task, b: Task) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
  
      setTasks(sortedTasks);
    } catch (error) {
      console.error("Silly error:", error);
    }
  }
  
  //handle adding new task
  async function addTask() {
    const userId = sessionStorage.getItem("user_id");
    if (!userId) return;
  
    if (newTask.trim() !== "") {
      try {
        const newTaskData = {
          task: newTask,
          priority: newPriority,
          status: "In progress",
          owner_id: parseInt(userId),
        };
        const response = await api.post(API_URL, newTaskData, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        // Update tasks and sort them
        const updatedTasks = [...tasks, response.data].sort(
          (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
        );
  
        setTasks(updatedTasks);
        setNewTask(""); // Reset task input
        setNewPriority("Medium");
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  }
  
  // hadle delete a task
  async function deleteTask(id: number) {
    try {
      await api.delete(`${DELETE_API_URL}${id}`, 
        {headers: {Authorization: `Bearer ${token}`}}
      );
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }
  // updating and existed task
  async function handleUpdateTask(id: number) {
    if (editText.trim() === "") return;
    try {
      const updatedTaskData = {
        task: editText,
        priority: editPriority,
        status: editStatus
      };
      const response=await api.put(`${UPDATE_API_URL}/${id}`, updatedTaskData,
        {headers: {Authorization: `Bearer ${token}`}}
      );
      console.log("Response:", response.data);
      fetchTasks();
      setEditMode(null);
      setEditText("");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  return (
    <div className="to-do-list">
      <h1>Task Management</h1>
      <div className="input-container">
        <input className="task-input"
          type="text"
          placeholder="Enter a task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <select
          className="priority-select"
          value={newPriority}
          onChange={(e) =>
            setNewPriority(e.target.value as "High" | "Medium" | "Low")
          }
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button className="add-button" onClick={addTask}>
          Add
        </button>
      </div>

      <ol className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            {editMode === task.id ? (
              <div className="edit-container">
                <input className="task-input"
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <select
                  className="edit-priority"
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as 'High' | 'Medium' | 'Low')}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <select
                  className="edit-status"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as 'In progress' | 'Complete')}
                >
                  <option value="In progress">In Progress</option>
                  <option value="Complete">Complete</option>
                </select>
                <button className="update-button" onClick={() => handleUpdateTask(task.id)}>
                  Save
                </button>
                <button className="cancel-button" onClick={() => setEditMode(null)}>
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <span className="task-input">{task.task}</span>
                <div className="task-info">
                  <span className={`priority ${task.priority.toLowerCase()}`}>
                    P: {task.priority}
                  </span>
                  <span className={`status ${task.status.replace(" ", "-").toLowerCase()}`}>
                    S: {task.status}
                  </span>
                  <div className="button-group">
                    <button
                      className="edit-button"
                      onClick={() => {
                        setEditMode(task.id);
                        setEditText(task.task);
                        setEditPriority(task.priority);
                        setEditStatus(task.status);
                      }}
                    >
                      Edit
                    </button>
                    <button className="delete-button" onClick={() => deleteTask(task.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default ToDoList;






