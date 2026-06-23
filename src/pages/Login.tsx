import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp, API_BASE_URL } from "../context/AppContext";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token);
        navigate("/admin");
      } else {
        setError("Sai tài khoản hoặc mật khẩu.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl border border-slate-200 overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="h-2 bg-[#2e7d32]" />
        
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-[#2e7d32] tracking-tight uppercase">CHECK ZONE</h1>
            <p className="text-slate-550 text-slate-500 text-sm mt-1">Đăng nhập cổng quản trị viên</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm font-semibold p-4 rounded-xl mb-6 border border-red-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Tên đăng nhập *</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">person</span>
                <input 
                  type="text"
                  required
                  className="w-full bg-slate-50/50 border border-slate-300 rounded-xl pl-11 pr-4 py-3 text-sm focus:border-[#2e7d32] focus:bg-white outline-none transition-all duration-200"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Mật khẩu *</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">lock</span>
                <input 
                  type="password"
                  required
                  className="w-full bg-slate-50/50 border border-slate-300 rounded-xl pl-11 pr-4 py-3 text-sm focus:border-[#2e7d32] focus:bg-white outline-none transition-all duration-200"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#2e7d32] hover:bg-[#205c22] text-white text-sm font-bold uppercase tracking-wide py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              type="button" 
              onClick={() => navigate("/")}
              className="text-xs text-slate-500 hover:text-[#2e7d32] font-semibold flex items-center justify-center gap-1 mx-auto"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Quay lại trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
