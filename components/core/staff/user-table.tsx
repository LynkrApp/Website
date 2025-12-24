import React, { useState } from 'react';
import { 
  Search, 
  Ban, 
  Unlock,
  Shield, 
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  UserCog,
  User as UserIcon
} from 'lucide-react';
import { UserAvatar } from '@/components/utils/avatar';
import { UserRole } from '@/types/index';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
const AlertDialog = AlertDialogPrimitive as any;
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  handle: string;
  image: string;
  email: string;
  role: UserRole;
  isBanned: boolean;
  linkCount: number;
  createdAt: string;
}

interface StaffUserTableProps {
  users: User[];
  onUpdate: () => void;
}

const StaffUserTable = ({ users, onUpdate }: StaffUserTableProps) => {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'ADMIN' | 'BANNED'>('ALL');
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.ADMIN);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUserRole = (session?.user as any)?.role;
  const isSuperAdmin = currentUserRole === 'SUPERADMIN';

  const filteredUsers = (users || []).filter((user) => {
    const handle = user.handle || '';
    const name = user.name || '';
    const email = user.email || '';
    
    const matchesSearch = 
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'ADMIN') return matchesSearch && (user.role === UserRole.ADMIN || user.role === UserRole.SUPERADMIN);
    if (filter === 'BANNED') return matchesSearch && user.isBanned;
    return matchesSearch;
  });

  const handleBan = async () => {
    if (!targetUser) return;
    setIsSubmitting(true);
    try {
      await axios.post('/api/staff/ban', { userId: targetUser.id, ban: !targetUser.isBanned });
      toast.success(`User ${targetUser.isBanned ? 'unbanned' : 'banned'} successfully`);
      setIsBanModalOpen(false);
      setTargetUser(null);
      onUpdate();
    } catch (err) {
      toast.error('Failed to update ban status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePromote = async () => {
    if (!targetUser || !isSuperAdmin) return;
    setIsSubmitting(true);
    
    try {
      await axios.post('/api/staff/promote', { userId: targetUser.id, role: selectedRole });
      toast.success(`User updated to ${selectedRole} successfully`);
      setIsPromoteModalOpen(false);
      setTargetUser(null);
      onUpdate();
    } catch (err) {
      toast.error('Failed to update user role');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('ADMIN')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'ADMIN' ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
          >
            Admins
          </button>
          <button 
            onClick={() => setFilter('BANNED')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'BANNED' ? 'bg-red-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
          >
            Banned
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Links</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar src={user.image} name={user.name || user.handle} className="w-10 h-10 ring-2 ring-white" />
                    <div>
                      <div className="font-semibold text-slate-900">{user.name || 'Anonymous'}</div>
                      <div className="text-sm text-slate-500">@{user.handle || 'no-handle'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                    user.role === UserRole.SUPERADMIN 
                      ? 'bg-purple-100 text-purple-700' 
                      : user.role === UserRole.ADMIN 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {user.role === UserRole.SUPERADMIN ? <Shield size={12} strokeWidth={3} /> : <UserIcon size={12} strokeWidth={3} />}
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {user.isBanned ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-tight">
                      <Ban size={12} /> Banned
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-tight">
                      <CheckCircle2 size={12} /> Active
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-slate-700">{user.linkCount} links</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link 
                      href={`/${user.handle}`} 
                      target="_blank"
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="View Profile"
                    >
                      <ExternalLink size={18} />
                    </Link>
                    
                    {isSuperAdmin && user.role !== 'SUPERADMIN' && (
                      <button 
                        onClick={() => {
                          setTargetUser(user);
                          setSelectedRole(user.role);
                          setIsPromoteModalOpen(true);
                        }}
                        className={`p-2 rounded-lg transition-all ${
                          user.role === UserRole.ADMIN 
                            ? 'text-slate-400 hover:text-orange-600 hover:bg-orange-50' 
                            : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                        title="Change Role"
                      >
                        <UserCog size={18} />
                      </button>
                    )}

                    {user.id !== session?.user?.id && (
                      <button 
                        onClick={() => {
                          setTargetUser(user);
                          setIsBanModalOpen(true);
                        }}
                        className={`p-2 rounded-lg transition-all ${
                          user.isBanned 
                            ? 'text-green-500 hover:bg-green-50' 
                            : 'text-red-500 hover:bg-red-50'
                        }`}
                        title={user.isBanned ? 'Unban User' : 'Ban User'}
                      >
                        {user.isBanned ? <Unlock size={18} /> : <Ban size={18} />}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
              <Search size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No users found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Confirmation Modals */}
      <StaffConfirmationModal 
        isOpen={isBanModalOpen}
        onClose={() => setIsBanModalOpen(false)}
        onConfirm={handleBan}
        title={targetUser?.isBanned ? 'Unban User' : 'Ban User'}
        description={`Are you sure you want to ${targetUser?.isBanned ? 'unban' : 'ban'} @${targetUser?.handle}? ${targetUser?.isBanned ? 'They will regain access to their account.' : 'They will be immediately logged out and restricted from accessing the application.'}`}
        confirmText={targetUser?.isBanned ? 'Confirm Unban' : 'Confirm Ban'}
        confirmColor={targetUser?.isBanned ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
        isLoading={isSubmitting}
      />

      <StaffConfirmationModal 
        isOpen={isPromoteModalOpen}
        onClose={() => setIsPromoteModalOpen(false)}
        onConfirm={handlePromote}
        title="Update User Role"
        description={`Manage the role for @${targetUser?.handle}. Choose the desired authorization level below.`}
        confirmText="Update Role"
        confirmColor="bg-blue-600 hover:bg-blue-700"
        isLoading={isSubmitting}
      >
        <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Role</label>
          <div className="grid grid-cols-2 gap-2">
            {[UserRole.USER, UserRole.ADMIN, UserRole.SUPERADMIN].filter(r => r !== UserRole.SUPERADMIN || isSuperAdmin).map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-3 py-2.5 rounded-lg border text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  selectedRole === role 
                    ? 'bg-white border-blue-500 text-blue-600 shadow-sm ring-2 ring-blue-500/10' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {role === UserRole.SUPERADMIN && <Shield size={14} className="text-purple-500" />}
                {role === UserRole.ADMIN && <ShieldCheck size={14} className="text-blue-500" />}
                {role === UserRole.USER && <UserIcon size={14} className="text-slate-500" />}
                {role}
              </button>
            ))}
          </div>
        </div>
      </StaffConfirmationModal>
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  confirmColor: string;
  isLoading: boolean;
  children?: React.ReactNode;
}

const StaffConfirmationModal = ({ isOpen, onClose, onConfirm, title, description, confirmText, confirmColor, isLoading, children }: ModalProps) => (
  <AlertDialog.Root open={isOpen} onOpenChange={onClose}>
    <AlertDialog.Portal>
      <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" />
      <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200 focus:outline-none">
        <AlertDialog.Title className="text-xl font-bold text-slate-900 flex items-center gap-2" asChild>
          <h2>
            {title.startsWith('Unban') ? (
              <CheckCircle2 className="text-green-500" size={24} />
            ) : title.includes('Ban') ? (
              <AlertTriangle className="text-red-500" size={24} />
            ) : title.includes('Role') ? (
              <UserCog className="text-blue-500" size={24} />
            ) : (
              <Shield className="text-blue-500" size={24} />
            )}
            {title}
          </h2>
        </AlertDialog.Title>
        <AlertDialog.Description className="mt-3 text-slate-600 leading-relaxed" asChild>
          <p>{description}</p>
        </AlertDialog.Description>
        
        {children}

        <div className="mt-6 flex justify-end gap-3">
          <AlertDialog.Cancel disabled={isLoading} asChild>
            <button 
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
          </AlertDialog.Cancel>
          <AlertDialog.Action disabled={isLoading} asChild>
            <button 
              onClick={(e) => {
                e.preventDefault();
                onConfirm();
              }}
              className={`px-4 py-2 text-sm font-bold text-white rounded-lg transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 ${confirmColor}`}
            >
              {isLoading && <Loader2 className="animate-spin" size={16} />}
              {confirmText}
            </button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);

export default StaffUserTable;
