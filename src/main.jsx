import { useState, useEffect } from "react";
import { getAuthToken } from "../../utils/auth";
import { USE_MOCK_DATA } from "../../config/config";
import { getStoredUsers, addMockUser, deleteMockUser } from "../../data/mockData";
import {
  UserPlus,
  Trash2,
  Mail,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  X,
  Loader2,
  User as UserIcon,
  Search,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [newUser, setNewUser] = useState({ email: "", password: "", role: "user" });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      if (USE_MOCK_DATA) {
        await new Promise((res) => setTimeout(res, 300));
        setUsers(getStoredUsers());
        return;
      }
      const res = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      const data = await res.json();
      if (data.status === "success") setUsers(data.data);
    } catch (err) {
      console.error("Gagal memuat user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      if (USE_MOCK_DATA) {
        await new Promise((res) => setTimeout(res, 400));
        addMockUser(newUser.email, newUser.password, newUser.role);
        setMessage({ text: "User berhasil dibuat!", type: "success" });
        setTimeout(() => {
          setShowModal(false);
          fetchUsers();
          setNewUser({ email: "", password: "", role: "user" });
          setMessage({ text: "", type: "" });
        }, 1200);
        return;
      }

      const res = await fetch("http://localhost:5000/api/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ text: "User berhasil dibuat!", type: "success" });
        setTimeout(() => {
          setShowModal(false);
          fetchUsers();
          setNewUser({ email: "", password: "", role: "user" });
          setMessage({ text: "", type: "" });
        }, 1500);
      } else {
        setMessage({ text: data.message || "Gagal membuat user", type: "error" });
      }
    } catch (err) {
      setMessage({ text: err.message || "Kesalahan jaringan", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (email) => {
    try {
      if (USE_MOCK_DATA) {
        deleteMockUser(email);
        setShowDeleteConfirm(null);
        fetchUsers();
        return;
      }

      const res = await fetch("http://localhost:5000/api/delete-user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setShowDeleteConfirm(null);
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.message || "Gagal menghapus user");
      }
    } catch (err) {
      alert("Kesalahan jaringan");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 p-4 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Manajemen User</h2>
          <p className="text-slate-500 text-sm">Kelola akses dan perizinan sistem secara terpusat.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-95 font-bold text-sm"
        >
          <UserPlus size={18} />
          Tambah User Baru
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <UserIcon size={14} className="text-blue-500" />
            Daftar Akun Terdaftar
          </h3>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Cari user..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#4e73df] text-white text-xs uppercase font-bold tracking-wider">
                <th className="px-8 py-3.5 border-r border-blue-400/40 last:border-r-0">User</th>
                <th className="px-8 py-3.5 border-r border-blue-400/40 last:border-r-0">Peran (Role)</th>
                <th className="px-8 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-8 py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-blue-600 mb-2" size={32} />
                    <p className="text-slate-400 text-sm font-medium italic">Mengambil data user...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-8 py-20 text-center">
                    <AlertCircle className="mx-auto text-slate-200 mb-2" size={48} />
                    <p className="text-slate-400 text-sm font-medium italic">Tidak ada user ditemukan.</p>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.email} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold border-2 border-white shadow-md">
                          {u.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{u.email}</p>
                          <p className="text-[10px] text-slate-400">ID: {u.email.split("@")[0]}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          u.role === "admin"
                            ? "bg-purple-50 text-purple-600 border border-purple-100"
                            : "bg-blue-50 text-blue-600 border border-blue-100"
                        }`}
                      >
                        <ShieldCheck size={10} />
                        {u.role}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      {showDeleteConfirm === u.email ? (
                        <div className="flex items-center justify-end gap-2 animate-in fade-in slide-in-from-right-2">
                          <button onClick={() => handleDeleteUser(u.email)} className="bg-rose-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-rose-600 transition">
                            Ya, Hapus
                          </button>
                          <button onClick={() => setShowDeleteConfirm(null)} className="bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-slate-200 transition">
                            Batal
                          </button>
                        </div>
                      ) : u.role !== "admin" ? (
                        <button onClick={() => setShowDeleteConfirm(u.email)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                          <Trash2 size={18} />
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-300 font-medium italic pr-2">Fixed Account</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[999] animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-500 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 p-2 text-slate-400 hover:bg-slate-50 rounded-full transition">
              <X size={20} />
            </button>

            <div className="mb-8">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                <UserPlus className="text-blue-600" size={24} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Tambah User Baru</h3>
              <p className="text-slate-500 text-sm">Daftarkan akses user baru untuk melihat prediksi.</p>
            </div>

            <form onSubmit={handleAddUser} className="space-y-5">
              {message.text && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in-95 ${message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                  {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <p className="text-xs font-bold">{message.text}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    required
                    disabled={isSaving}
                    value={newUser.email}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all"
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    disabled={isSaving}
                    value={newUser.password}
                    className="w-full pl-12 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all"
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" disabled={isSaving} onClick={() => setShowModal(false)} className="flex-1 py-4 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-2xl font-bold text-sm transition-all active:scale-95 disabled:opacity-50">
                  Batal
                </button>
                <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-80 flex items-center justify-center gap-2">
                  {isSaving && <Loader2 size={16} className="animate-spin" />}
                  {isSaving ? "Menyimpan..." : "Simpan Akun"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
