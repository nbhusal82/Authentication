import { useNavigate } from "react-router-dom";
import api from "../api";
import { useDark } from "../DarkModeContext";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  const { dark, toggle } = useDark();

  const handleLogout = async () => {
    await api.post("/signout");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col items-center justify-center">
      <button
        onClick={toggle}
        className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-yellow-300 hover:scale-110 transition"
      >
        {dark ? "☀️" : "🌙"}
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-10 text-center w-full max-w-sm">
        <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-2xl mx-auto mb-4">
          👤
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome, {user.username}!</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{user.email}</p>
        <button
          onClick={handleLogout}
          className="mt-6 w-full py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
