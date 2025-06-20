// Updated version with TypeScript fixes
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface Task {
  task: string;
  time: string;
  priority: string;
  notes: string;
  status: string;
}

interface CalendarTask {
  label: string;
  date: Date;
}

export default function ADHDPlannerMockup() {
  const [showGif, setShowGif] = useState(true);
  const [calendarTasks, setCalendarTasks] = useState<CalendarTask[]>([]);
  const [taskList, setTaskList] = useState<Task[]>([
    { task: "", time: "", priority: "Low", notes: "", status: "To Do" },
    { task: "", time: "", priority: "Low", notes: "", status: "To Do" },
    { task: "", time: "", priority: "Low", notes: "", status: "To Do" },
    { task: "", time: "", priority: "Low", notes: "", status: "To Do" },
    { task: "", time: "", priority: "Low", notes: "", status: "To Do" },
  ]);
  const [calendarInput, setCalendarInput] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("Planner");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [focusTask, setFocusTask] = useState<string>("");
  const [focusChecked, setFocusChecked] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowGif(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const now = new Date();
    const millisTillMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() -
      now.getTime();

    const resetTimer = setTimeout(() => {
      if (focusChecked) {
        setFocusChecked(false);
        setFocusTask("");
      }
    }, millisTillMidnight);

    return () => clearTimeout(resetTimer);
  }, [focusChecked]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleCalendarAdd = () => {
    if (calendarInput.trim()) {
      setCalendarTasks([
        ...calendarTasks,
        { label: calendarInput, date: selectedDate },
      ]);
      setTaskList((prev) => [
        {
          task: calendarInput,
          time: "",
          priority: "Low",
          notes: "",
          status: "To Do",
        },
        ...prev.slice(0, prev.length - 1),
      ]);
      setCalendarInput("");
    }
  };

  const handleTaskChange = (
    index: number,
    field: keyof Task,
    value: string
  ) => {
    const updatedTasks = [...taskList];
    updatedTasks[index] = {
      ...updatedTasks[index],
      [field]: value,
    };
    setTaskList(updatedTasks);
  };

  const renderTileContent = ({ date }: { date: Date }) => {
    const tasks = calendarTasks.filter(
      (task) => task.date?.toDateString() === date.toDateString()
    );
    return tasks.length > 0 ? <span className="text-xs">📌</span> : null;
  };

  const renderCalendar = () => (
    <div className="bg-pink-100 p-4 rounded-2xl shadow mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h2 className="text-xl font-semibold mb-4">📅 Date-Based Calendar</h2>
        <Calendar
          onChange={(value: Date) => setSelectedDate(value)}
          value={selectedDate}
          tileContent={renderTileContent}
        />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">
          📝 Tasks on {selectedDate.toDateString()}
        </h3>
        <ul className="text-sm text-left list-disc list-inside bg-white p-4 rounded-xl shadow">
          {calendarTasks
            .filter(
              (task) =>
                task.date?.toDateString() === selectedDate.toDateString()
            )
            .map((task, i) => (
              <li key={i}>{task.label}</li>
            ))}
          {calendarTasks.filter(
            (task) => task.date?.toDateString() === selectedDate.toDateString()
          ).length === 0 && (
            <li className="text-gray-500">No tasks scheduled.</li>
          )}
        </ul>
      </div>
    </div>
  );

  const renderPlanner = () => (
    <div className="grid gap-6">
      <div className="bg-blue-100 p-4 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4">🗒️ Task List</h2>
        {taskList.map((task, index) => (
          <div key={index} className="grid grid-cols-5 gap-2 mb-2 items-center">
            <input
              type="text"
              placeholder="Task"
              value={task.task}
              onChange={(e) => handleTaskChange(index, "task", e.target.value)}
              className="p-2 rounded border border-gray-300"
            />
            <input
              type="time"
              value={task.time}
              onChange={(e) => handleTaskChange(index, "time", e.target.value)}
              className="p-2 rounded border border-gray-300"
            />
            <select
              value={task.priority}
              onChange={(e) =>
                handleTaskChange(index, "priority", e.target.value)
              }
              className="p-2 rounded border border-gray-300"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <input
              type="text"
              placeholder="Notes"
              value={task.notes}
              onChange={(e) => handleTaskChange(index, "notes", e.target.value)}
              className="p-2 rounded border border-gray-300"
            />
            <select
              value={task.status}
              onChange={(e) =>
                handleTaskChange(index, "status", e.target.value)
              }
              className="p-2 rounded border border-gray-300"
            >
              <option>To Do</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-yellow-100 p-4 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">🎯 Focus Task</h2>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={focusChecked}
              onChange={() => setFocusChecked(!focusChecked)}
            />
            <textarea
              placeholder="What's your main goal today?"
              value={focusTask}
              onChange={(e) => setFocusTask(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 min-h-[100px]"
            />
          </div>
        </div>

        <div className="bg-purple-100 p-4 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">🧠 Brain Dump</h2>
          <textarea
            placeholder="Get it all out of your head..."
            className="w-full p-2 rounded border border-gray-300 min-h-[100px]"
          />
        </div>
      </div>

      <div className="flex justify-center">
        {showGif ? (
          <img
            src="https://www.dropbox.com/scl/fi/0jz5wwzh8x62tv9fwa81s/Buddy.gif?rlkey=f9e0lygt2nvf1a44zxrw4k2lq&raw=1"
            alt="Buddy wagging tail"
            className="w-40 h-40 rounded-full shadow-lg"
          />
        ) : (
          <img
            src="https://www.dropbox.com/scl/fi/ol3p0v4iwmuu5h1v75i5i/Buddy.png?rlkey=1040fdntm34e7mxrfanwjkbc1&raw=1"
            alt="Buddy"
            className="w-40 h-40 rounded-full shadow-lg"
          />
        )}
      </div>
    </div>
  );

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-900 text-black" : "bg-white text-gray-800"
      } min-h-screen p-6`}
    >
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={toggleTheme}
          className="absolute right-6 top-6 bg-gray-300 px-3 py-1 rounded shadow"
        >
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <h1
          className={`text-3xl font-bold text-center w-full ${
            isDarkMode ? "text-white" : ""
          }`}
        >
          My Focus Planner
        </h1>
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setActiveTab("Planner")}
          className={`px-4 py-2 mx-2 rounded-xl shadow ${
            activeTab === "Planner" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Planner
        </button>
        <button
          onClick={() => setActiveTab("Calendar")}
          className={`px-4 py-2 mx-2 rounded-xl shadow ${
            activeTab === "Calendar" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Calendar
        </button>
      </div>

      {activeTab === "Planner" && renderPlanner()}

      {activeTab === "Calendar" && (
        <>
          <div className="bg-green-100 p-4 rounded-2xl shadow mb-6">
            <h2 className="text-xl font-semibold mb-2">🗓️ Add to Calendar</h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={calendarInput}
                onChange={(e) => setCalendarInput(e.target.value)}
                placeholder="e.g. Meeting with Sam"
                className="p-2 flex-grow rounded-xl border border-gray-300"
              />
              <button
                onClick={handleCalendarAdd}
                className="bg-green-500 text-white px-4 py-2 rounded-xl shadow hover:bg-green-600"
              >
                Add
              </button>
            </div>
          </div>
          {renderCalendar()}
        </>
      )}
    </div>
  );
}
