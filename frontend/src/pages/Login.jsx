import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { useDark } from "../DarkModeContext";

export default function Login() {
  const { dark, toggle } = useDark();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [step, setStep] = useState(0); // 0=closed,1=email,2=otp,3=newpass
  const [fpEmail, setFpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [fpMsg, setFpMsg] = useState("");
  const [fpErr, setFpErr] = useState("");
  const [loading, setLoading] = useState(false);

  // 1 min countdown
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    setTimer(60);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) { clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/login", form);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const closeModal = () => {
    clearInterval(timerRef.current);
    setStep(0); setFpEmail(""); setOtp(""); setNewPassword("");
    setFpMsg(""); setFpErr(""); setTimer(0);
  };

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setFpErr(""); setLoading(true);
    try {
      await api.post("/send-otp", { email: fpEmail });
      setFpMsg("OTP sent! Check your email.");
      setStep(2);
      startTimer();
    } catch (err) {
      setFpErr(err.response?.data?.message || "Failed to send OTP");
    } finally { setLoading(false); }
  };

  const handleResendOtp = async () => {
    setFpErr(""); setOtp(""); setLoading(true);
    try {
      await api.post("/send-otp", { email: fpEmail });
      setFpMsg("New OTP sent!");
      startTimer();
    } catch (err) {
      setFpErr(err.response?.data?.message || "Failed to resend OTP");
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (timer === 0) {
      setFpErr("OTP expired. Please resend.");
      return;
    }
    setFpErr("");
    setStep(3);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setFpErr(""); setLoading(true);
    try {
      await api.post("/verify-otp", { email: fpEmail, otp, newPassword });
      clearInterval(timerRef.current);
      setFpMsg("Password reset successfully! You can now login.");
      setStep(0);
    } catch (err) {
      setFpErr(err.response?.data?.message || "Failed to reset password");
      setStep(2);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Left - Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-8 py-12 relative">
        <button onClick={toggle}
          className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-yellow-300 hover:scale-110 transition">
          {dark ? "☀️" : "🌙"}
        </button>

        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">Welcome back</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">Sign in to your account</p>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input type="email" placeholder="john@example.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} placeholder="••••••••" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })} required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400 cursor-pointer">
                <input type="checkbox" className="rounded" /> Remember me
              </label>
              <button type="button" onClick={() => setStep(1)}
                className="text-blue-600 hover:underline dark:text-blue-400">
                Forgot password?
              </button>
            </div>

            <button type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
              Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Register</Link>
          </p>
        </div>
      </div>

      {/* Right - Banner */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 flex-col justify-center items-center text-white px-12">
        <h1 className="text-4xl font-bold mb-4">Sign in</h1>
        <p className="text-lg text-blue-100 text-center leading-relaxed">
          Sign in to your account and explore a world of possibilities. Your journey begins here.
        </p>
      </div>

      {/* Forgot Password Modal */}
      {step > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 w-full max-w-sm shadow-xl">

            {/* Step indicators */}
            <div className="flex items-center gap-2 mb-6">
              {["Email", "OTP", "New Password"].map((label, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                    ${step > i + 1 ? "bg-green-500 text-white" : step === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-600 text-gray-500"}`}>
                    {step > i + 1 ? "✓" : i + 1}
                  </div>
                  <span className={`text-xs ${step === i + 1 ? "text-blue-600 dark:text-blue-400 font-medium" : "text-gray-400"}`}>{label}</span>
                  {i < 2 && <div className="w-6 h-px bg-gray-300 dark:bg-gray-600" />}
                </div>
              ))}
            </div>

            {fpMsg && <p className="text-green-500 text-sm mb-3">{fpMsg}</p>}
            {fpErr && <p className="text-red-500 text-sm mb-3">{fpErr}</p>}

            {/* Step 1: Email */}
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Forgot Password</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Enter your registered email to receive OTP</p>
                <input type="email" placeholder="your@email.com" value={fpEmail}
                  onChange={(e) => setFpEmail(e.target.value)} required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <div className="flex gap-3">
                  <button type="submit" disabled={loading}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-lg transition">
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                  <button type="button" onClick={closeModal}
                    className="flex-1 py-2.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: OTP */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Enter OTP</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  OTP sent to <span className="font-medium text-blue-600 dark:text-blue-400">{fpEmail}</span>
                </p>

                <input type="text" placeholder="6-digit OTP" value={otp} maxLength={6}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest" />

                {/* Timer */}
                <div className="text-center">
                  {timer > 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      OTP expires in{" "}
                      <span className={`font-bold ${timer <= 15 ? "text-red-500" : "text-blue-600 dark:text-blue-400"}`}>
                        0:{timer.toString().padStart(2, "0")}
                      </span>
                    </p>
                  ) : (
                    <p className="text-sm text-red-500">
                      OTP expired.{" "}
                      <button type="button" onClick={handleResendOtp} disabled={loading}
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium disabled:opacity-60">
                        {loading ? "Sending..." : "Resend OTP"}
                      </button>
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button type="submit" disabled={timer === 0}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition">
                    Verify OTP
                  </button>
                  <button type="button" onClick={closeModal}
                    className="flex-1 py-2.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">New Password</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Set your new password</p>
                <input type="password" placeholder="New password (min 6 chars)" value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)} required minLength={6}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <div className="flex gap-3">
                  <button type="submit" disabled={loading}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-lg transition">
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                  <button type="button" onClick={closeModal}
                    className="flex-1 py-2.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
