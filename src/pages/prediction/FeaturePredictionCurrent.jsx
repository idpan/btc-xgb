import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Loader2, Bitcoin } from "lucide-react";

import { USE_MOCK_DATA } from "../../config/config";
import { getStoredUsers } from "../../data/mockData";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        const users = getStoredUsers();
        const found = users.find(
          (u) =>
            u.email.toLowerCase() === formData.email.trim().toLowerCase() &&
            u.password === formData.password,
        );

        if (found) {
          localStorage.setItem("token", `mock-jwt-token-${Date.now()}`);
          localStorage.setItem("role", found.role);
          localStorage.setItem("email", found.email);
          navigate("/dashboard");
          return;
        }

        setError("Email atau password salah. (Default: admin@gmail.com / admin)");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.status === "success") {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("role", data.user.role);
        navigate("/dashboard");
      } else {
        setError(data.message || "Email atau password salah");
      }
    } catch (err) {
      setError("Kesalahan koneksi ke server");
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-4 font-sans selection:bg-blue-100 selection:text-blue-700">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="bg-blue-600 p-4 rounded-[1.5rem] shadow-2xl shadow-blue-500/30 mb-4 group hover:scale-110 transition-transform duration-500 cursor-default">
              <Bitcoin size={40} className="text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
              BitcoinPredict
            </h1>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.2em] mt-1 pr-1">
              Predictive Analytics Platform
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 animate-in fade-in zoom-in-95 duration-700"
          >
            <div className="mb-8">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Selamat Datang
              </h2>
              <p className="text-slate-400 text-xs">
                Silakan masuk untuk melanjutkan.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-2xl flex items-center gap-2 animate-in shake duration-500">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="Alamat Email"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  disabled={loading}
                />
              </div>

              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Kata Sandi"
                  className="w-full pl-12 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-slate-300 hover:text-slate-500 focus:outline-none transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="mt-8">
              <button
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm tracking-widest uppercase shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Masuk Sekarang"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="absolute top-[300px] right-10">
        <div className="bg-white p-5 text-indigo mt-10">
          <b>Admin</b>
          <br />
          email: admin@gmail.com <br />
          password: admin
          <div>
            <br />
            <b>User</b>
            <br />
            email: user@gmail.com
            <br /> password: user
          </div>
        </div>
      </div>
    </>
  );
}
