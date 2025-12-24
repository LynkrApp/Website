import React from 'react';
import Layout from '@/components/layout/Layout';
import { AdminPageMeta } from '@/components/meta/metadata';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
  Users, 
  Link as LinkIcon, 
  Eye, 
  Ban, 
  ShieldCheck,
  TrendingUp,
  Loader2
} from 'lucide-react';
import StaffUserTable from '@/components/core/staff/user-table';
import { motion } from 'framer-motion';

const StaffDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['staff-stats'],
    queryFn: async () => {
      const { data } = await axios.get('/api/staff/stats');
      return data;
    },
    refetchInterval: 30000,
  });

  const { data: users, isLoading: usersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ['staff-users'],
    queryFn: async () => {
      const { data } = await axios.get('/api/staff/users');
      return data;
    },
  });

  const isLoading = statsLoading || usersLoading;

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: <Users className="text-blue-600" size={24} />,
      color: 'bg-blue-50',
      description: 'Total registrations',
    },
    {
      title: 'Active Linkers',
      value: stats?.usersWithLinks || 0,
      icon: <LinkIcon className="text-green-600" size={24} />,
      color: 'bg-green-50',
      description: 'Users with at least 1 link',
    },
    {
      title: 'Total Views',
      value: stats?.totalViews?.toLocaleString() || 0,
      icon: <Eye className="text-purple-600" size={24} />,
      color: 'bg-purple-50',
      description: 'Across all profiles',
    },
    {
      title: 'Banned',
      value: stats?.bannedUsers || 0,
      icon: <Ban className="text-red-600" size={24} />,
      color: 'bg-red-50',
      description: 'Restricted accounts',
    },
  ];

  return (
    <>
      <AdminPageMeta pageType="staff" />
      <Layout>
        <div className="w-full h-full min-h-screen bg-slate-50/50 p-4 md:p-8 lg:basis-full overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <ShieldCheck className="text-blue-600" size={32} />
                  Staff Dashboard
                </h1>
                <p className="text-slate-500 mt-1">Manage users, see growth, and oversee platform activity mr overseer!!.</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-xl ${card.color}`}>
                      {card.icon}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-bold text-slate-900">
                      {statsLoading ? <Loader2 className="animate-spin text-slate-300" size={24} /> : card.value}
                    </div>
                    <div className="text-sm font-semibold text-slate-600 uppercase tracking-wider mt-1">{card.title}</div>
                    <p className="text-xs text-slate-400 mt-2">{card.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* User Table Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  User Management
                  {usersLoading && <Loader2 className="animate-spin text-blue-500" size={20} />}
                </h2>
                <div className="text-sm text-slate-500">
                  {users?.length || 0} total users found
                </div>
              </div>
              
              {usersLoading ? (
                <div className="w-full h-96 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Users size={24} className="text-blue-500" />
                    </div>
                  </div>
                  <p className="text-slate-500 font-medium">Loading users...</p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <StaffUserTable users={users || []} onUpdate={refetchUsers} />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default StaffDashboard;
