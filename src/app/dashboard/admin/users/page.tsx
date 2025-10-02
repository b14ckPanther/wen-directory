// src/app/dashboard/admin/users/page.tsx
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Search, X, Building, Mail, Lock, User, Edit, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// --- Type Definitions ---
type AdminUserView = { id: string; username: string; email: string; role: string; business_id: number | null; business_name: string | null;};
type Business = { id: number; name: string; };
type FormSubscription = 'أساسي' | 'مميز' | 'ذهبي';

// --- Add/Edit User Modal Component ---
const UserModal = ({ isOpen, onClose, businesses, onUserAddedOrUpdated, editingUser, allUsers }: {
    isOpen: boolean; onClose: () => void; businesses: Business[];
    onUserAddedOrUpdated: () => void; editingUser: AdminUserView | null; allUsers: AdminUserView[];
}) => {
  const { session } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [businessId, setBusinessId] = useState<string>('');
  const [subscription, setSubscription] = useState<FormSubscription>('أساسي');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!editingUser;

  const isFormSubscription = (value: string): value is FormSubscription => ['أساسي', 'مميز', 'ذهبي'].includes(value);

  useEffect(() => {
    if (isOpen) {
        setError(''); setSuccess('');
        if (isEditing && editingUser) {
            setEmail(editingUser.email);
            setUsername(editingUser.username || '');
            setBusinessId(editingUser.business_id?.toString() || '');
            setPassword('');
        } else {
            setEmail(''); setPassword(''); setUsername(''); setBusinessId(''); setSubscription('أساسي');
        }
    }
  }, [editingUser, isEditing, isOpen]);

  // ✅ FIX: Correctly filter available businesses
  const availableBusinesses = useMemo(() => {
      const assignedBusinessIds = new Set(allUsers.map(u => u.business_id).filter(Boolean));
      return businesses.filter(b => !assignedBusinessIds.has(b.id) || b.id === editingUser?.business_id);
  }, [businesses, allUsers, editingUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !businessId) { setError('Username and an assigned business are required.'); return; }
    if (!isEditing && !password) { setError('Password is required for new users.'); return; }
    
    setIsSubmitting(true); setError(''); setSuccess('');
    if (!session) { setError('Authentication session not found.'); setIsSubmitting(false); return; }

    const apiEndpoint = isEditing ? `/api/admin/users/${editingUser!.id}` : '/api/admin/create-user';
    const method = isEditing ? 'PUT' : 'POST';
    const body = isEditing ? { username, business_id: Number(businessId), subscription, ...(password && { password }), } 
                           : { email, password, username, business_id: Number(businessId), subscription, };

    try {
        const response = await fetch(apiEndpoint, {
            method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        if (response.ok) {
            setSuccess(data.message || `User ${isEditing ? 'updated' : 'created'} successfully!`);
            onUserAddedOrUpdated();
            setTimeout(onClose, 1500);
        } else { setError(data.message || 'An unexpected error occurred.'); }
 } catch { 
  setError('A network error occurred.'); 
}

    finally { setIsSubmitting(false); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            className="bg-[#1B2A41] w-full max-w-lg rounded-2xl p-6 border border-gold/20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gold">{isEditing ? 'تعديل مالك العمل' : 'إضافة مالك عمل جديد'}</h2>
              <button onClick={onClose}><X className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
               {error && <p className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg flex items-center gap-2"><AlertCircle size={18}/> {error}</p>}
               {success && <p className="text-emerald-400 text-sm bg-emerald-500/10 p-3 rounded-lg flex items-center gap-2"><CheckCircle size={18}/> {success}</p>}
               <div className="relative">
                 <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gold/60" size={18} />
                 <input type="email" placeholder="البريد الإلكتروني للمالك" value={email} onChange={e => setEmail(e.target.value)} required disabled={isEditing} className="w-full bg-[#0A1024] pr-10 pl-4 py-2 rounded-lg border border-gray-700 disabled:opacity-50"/>
               </div>
               <div className="relative">
                 <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gold/60" size={18} />
                 <input type="password" placeholder={isEditing ? 'اتركه فارغًا لعدم التغيير' : 'كلمة المرور'} value={password} onChange={e => setPassword(e.target.value)} required={!isEditing} className="w-full bg-[#0A1024] pr-10 pl-4 py-2 rounded-lg border border-gray-700"/>
               </div>
               <div className="relative">
                 <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gold/60" size={18} />
                 <input type="text" placeholder="اسم المستخدم (للعرض)" value={username} onChange={e => setUsername(e.target.value)} required className="w-full bg-[#0A1024] pr-10 pl-4 py-2 rounded-lg border border-gray-700"/>
               </div>
               <div className="relative">
                 <Building className="absolute right-3 top-1/2 -translate-y-1/2 text-gold/60" size={18} />
                 <select value={businessId} onChange={e => setBusinessId(e.target.value)} required className="w-full bg-[#0A1024] pr-10 pl-4 py-2 rounded-lg border border-gray-700 appearance-none">
                   <option value="" disabled>-- اختر العمل التجاري --</option>
                   {availableBusinesses.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                 </select>
               </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">خطة الاشتراك</label>
                  <select value={subscription} onChange={e => { if (isFormSubscription(e.target.value)) setSubscription(e.target.value); }}
                    className="w-full bg-[#0A1024] p-2 rounded-lg border border-gray-700" >
                      <option value="أساسي">أساسي (صفحة ثابتة)</option>
                      <option value="مميز">مميز (إدارة المنتجات)</option>
                      <option value="ذهبي">ذهبي (إدارة + طلبات)</option>
                  </select>
               </div>
               <button type="submit" disabled={isSubmitting} className="w-full bg-gold text-navy font-bold py-2 rounded-lg disabled:opacity-50">
                 {isSubmitting ? 'جاري الحفظ...' : isEditing ? 'حفظ التغييرات' : 'إنشاء مستخدم'}
               </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


// --- Main Page Component ---
export default function ManageUsersPage() {
    const [users, setUsers] = useState<AdminUserView[]>([]);
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUserView | null>(null);
    const { session } = useAuth();
    const [pageMessage, setPageMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const fetchData = useCallback(async () => {
        if (!session) return;
        setLoading(true);
        try {
            const response = await fetch('/api/admin/users', {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
            if (!response.ok) {
                const errData = await response.json();
                console.error("Error fetching data:", errData);
                throw new Error(errData.message || 'Failed to fetch user data');
            }
            const data = await response.json();
            setUsers(data.users || []);
            setBusinesses(data.businesses || []);
        } catch (error) {
            console.error(error);
            setPageMessage({ type: 'error', text: 'Failed to load user data.' });
        } finally {
            setLoading(false);
        }
    }, [session]);

    useEffect(() => {
        if (session) {
            fetchData();
        }
    }, [session, fetchData]);

    const handleOpenAddModal = () => { setEditingUser(null); setIsModalOpen(true); };
    const handleOpenEditModal = (user: AdminUserView) => { setEditingUser(user); setIsModalOpen(true); };
    
    const handleDeleteUser = async (userToDelete: AdminUserView) => {
        if (!session) {
            setPageMessage({ type: 'error', text: "Authentication required." });
            return;
        }
        if (window.confirm(`Are you sure you want to delete "${userToDelete.username}"?`)) {
            setPageMessage(null);
            try {
                const response = await fetch(`/api/admin/users/${userToDelete.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${session.access_token}` }
                });
                const data = await response.json();
                if (response.ok) {
                    setPageMessage({ type: 'success', text: data.message });
                    fetchData();
                } else {
                    throw new Error(data.message);
                }
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Unknown error';
                setPageMessage({ type: 'error', text: `Failed to delete user: ${message}` });
            } finally {
                setTimeout(() => setPageMessage(null), 5000);
            }
        }
    };

  return (
    <>
    <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} businesses={businesses} onUserAddedOrUpdated={fetchData} editingUser={editingUser} allUsers={users} />
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="bg-[#1B2A41] p-4 md:p-6 rounded-2xl border border-gray-800 shadow-lg">
      
        <AnimatePresence>
            {pageMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                    className={`mb-4 flex items-center gap-3 p-3 rounded-lg text-sm ${
                        pageMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}
                >
                    {pageMessage.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span>{pageMessage.text}</span>
                </motion.div>
            )}
        </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
          <input type="text" placeholder="ابحث عن مالك أو عمل..."
            className="w-full bg-[#0A1024] border border-gray-700 rounded-full py-2 pl-12 pr-4 text-white"/>
        </div>
        <button onClick={handleOpenAddModal} className="w-full md:w-auto flex items-center justify-center gap-2 bg-gold text-navy font-bold py-2 px-4 rounded-lg">
          <UserPlus size={20} /><span>إضافة مستخدم جديد</span>
        </button>
      </div>
        {loading ? <p className="text-center text-gray-400">جاري تحميل المستخدمين...</p> : (
            <div className="overflow-x-auto">
                <table className="w-full text-right">
                    <thead className="border-b border-gray-700">
                      <tr>
                        <th className="p-3 text-sm font-semibold text-gray-400">اسم المستخدم</th>
                        <th className="p-3 text-sm font-semibold text-gray-400">البريد الإلكتروني</th>
                        <th className="p-3 text-sm font-semibold text-gray-400">العمل التجاري</th>
                        <th className="p-3 text-sm font-semibold text-gray-400">الدور</th>
                        <th className="p-3 text-sm font-semibold text-gray-400 text-center">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.id} className="border-b border-gray-800 hover:bg-[#0A1024]/50">
                        <td className="p-4 font-semibold text-white">{user.username}</td>
                        <td className="p-4 text-gray-300">{user.email}</td>
                        <td className="p-4 text-gray-300">{user.business_name || <span className="text-gray-500">غير معين</span>}</td>
                        <td className="p-4"><span className={`px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400`}>{user.role}</span></td>
                        <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-4">
                                <button onClick={() => handleOpenEditModal(user)} className="text-blue-400 hover:text-blue-300" title="تعديل"><Edit size={18} /></button>
                                <button onClick={() => handleDeleteUser(user)} className="text-red-400 hover:text-red-300" title="حذف"><Trash2 size={18} /></button>
                            </div>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        )}
    </motion.div>
    </>
  );
}