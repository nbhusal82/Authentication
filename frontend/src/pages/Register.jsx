import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { useDark } from "../DarkModeContext";

export default function Register() {
  const { dark, toggle } = useDark();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    const letters = (pwd.match(/[a-zA-Z]/g) || []).length;
    const numbers = (pwd.match(/[0-9]/g) || []).length;
    if (letters < 3) return "Password must have at least 3 letters";
    if (numbers < 4) return "Password must have at least 4 numbers";
    return null;
  };

  const passError = form.password ? validatePassword(form.password) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validErr = validatePassword(form.password);
    if (validErr) return setError(validErr);
    try {
      await api.post("/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Left - Banner */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 flex-col justify-center items-center text-white px-12">
        <h1 className="text-4xl font-bold mb-4">Create Account</h1>
        <p className="text-lg text-indigo-100 text-center leading-relaxed">
          Join us today and start your journey. It only takes a minute to get started.
        </p>
      </div>

      {/* Right - Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-8 py-12 relative">
        <button
          onClick={toggle}
          className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-yellow-300 hover:scale-110 transition"
        >
          {dark ? "☀️" : "🌙"}
        </button>

        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">Register</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">Create your free account</p>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
              <input
                type="text"
                placeholder="johndoe"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="e.g. abc1234"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 pr-10
                    ${passError ? "border-red-400 focus:ring-red-400" : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
              {/* Live validation hints */}
              {form.password && (
                <div className="mt-2 space-y-1">
                  <div className={`flex items-center gap-2 text-xs ${
                    (form.password.match(/[a-zA-Z]/g) || []).length >= 3 ? "text-green-500" : "text-red-400"}`}>
                    {(form.password.match(/[a-zA-Z]/g) || []).length >= 3 ? "✓" : "✗"} At least 3 letters
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${
                    (form.password.match(/[0-9]/g) || []).length >= 4 ? "text-green-500" : "text-red-400"}`}>
                    {(form.password.match(/[0-9]/g) || []).length >= 4 ? "✓" : "✗"} At least 4 numbers
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
