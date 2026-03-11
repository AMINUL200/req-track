import React, { useState } from 'react';
import {
  Building2,
  Users,
  Briefcase,
  UserCheck,
  Truck,
  Activity,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Download,
  Calendar,
  Filter,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Home,
  BarChart3,
  Shield,
  Globe,
  DollarSign,
  Award
} from 'lucide-react';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');

  // Stats data
  const statsData = [
    {
      title: 'Total Organizations',
      value: '156',
      change: '+12',
      trend: 'up',
      icon: Building2,
      color: '#2563EB',
      bgColor: '#DBEAFE'
    },
    {
      title: 'Total Users',
      value: '2,845',
      change: '+245',
      trend: 'up',
      icon: Users,
      color: '#14B8A6',
      bgColor: '#CCFBF1'
    },
    {
      title: 'Total Jobs',
      value: '892',
      change: '+67',
      trend: 'up',
      icon: Briefcase,
      color: '#8B5CF6',
      bgColor: '#EDE9FE'
    },
    {
      title: 'Total Candidates',
      value: '5,673',
      change: '+892',
      trend: 'up',
      icon: UserCheck,
      color: '#F59E0B',
      bgColor: '#FEF3C7'
    },
    {
      title: 'Total Vendors',
      value: '234',
      change: '-3',
      trend: 'down',
      icon: Truck,
      color: '#EF4444',
      bgColor: '#FEE2E2'
    },
    {
      title: 'System Activity',
      value: '98%',
      change: '+2.5%',
      trend: 'up',
      icon: Activity,
      color: '#06B6D4',
      bgColor: '#CFFAFE'
    }
  ];

  // Recent organizations data
  const recentOrganizations = [
    { id: 1, name: 'TechCorp Solutions', users: 45, jobs: 23, status: 'active', date: '2024-03-15' },
    { id: 2, name: 'InnovateLabs Inc', users: 28, jobs: 15, status: 'active', date: '2024-03-14' },
    { id: 3, name: 'Digital Dynamics', users: 52, jobs: 31, status: 'active', date: '2024-03-13' },
    { id: 4, name: 'Future Systems', users: 18, jobs: 9, status: 'pending', date: '2024-03-12' },
    { id: 5, name: 'Global Solutions', users: 34, jobs: 19, status: 'active', date: '2024-03-11' }
  ];

  // System activity data
  const activityData = [
    { id: 1, action: 'New Organization Registered', organization: 'TechStart Inc', time: '5 minutes ago', type: 'create' },
    { id: 2, action: 'User Login Attempt Failed', organization: 'Global Corp', time: '15 minutes ago', type: 'alert' },
    { id: 3, action: 'New Job Posted', organization: 'InnovateLabs', time: '32 minutes ago', type: 'job' },
    { id: 4, action: 'Candidate Application Submitted', organization: 'TechCorp', time: '1 hour ago', type: 'candidate' },
    { id: 5, action: 'Vendor Registration Approved', organization: 'RecruitPro', time: '2 hours ago', type: 'vendor' },
    { id: 6, action: 'System Backup Completed', organization: 'System', time: '3 hours ago', type: 'system' }
  ];

  // Quick action buttons
  const quickActions = [
    { label: 'Add Organization', icon: Building2, color: '#2563EB' },
    { label: 'Create Admin', icon: Shield, color: '#14B8A6' },
    { label: 'View Reports', icon: BarChart3, color: '#8B5CF6' },
    { label: 'System Settings', icon: Settings, color: '#64748B' }
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F1F5F9' }}>
     

      {/* Main Content */}
      <div className="flex-1">
      

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Quick Actions */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ color: '#0F172A' }}>Quick Actions</h2>
              <button className="text-sm flex items-center space-x-1" style={{ color: '#2563EB' }}>
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="p-4 rounded-lg flex flex-col items-center justify-center space-y-2 transition-all hover:scale-105"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}
                >
                  <div className="p-3 rounded-full" style={{ backgroundColor: `${action.color}10` }}>
                    <action.icon className="w-6 h-6" style={{ color: action.color }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: '#0F172A' }}>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ color: '#0F172A' }}>Overview</h2>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="text-sm rounded-lg px-3 py-2"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    color: '#0F172A'
                  }}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
                <button className="p-2 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                  <Download className="w-4 h-4" style={{ color: '#64748B' }} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {statsData.map((stat, index) => (
                <div
                  key={index}
                  className="rounded-lg p-6"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: stat.bgColor }}>
                      <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full" style={{
                      backgroundColor: stat.trend === 'up' ? '#DCFCE7' : '#FEE2E2',
                      color: stat.trend === 'up' ? '#22C55E' : '#EF4444'
                    }}>
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium mb-1" style={{ color: '#64748B' }}>{stat.title}</h3>
                  <p className="text-2xl font-bold" style={{ color: '#0F172A' }}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Organizations and Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Organizations */}
            <div className="lg:col-span-2">
              <div className="rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <div className="p-4 border-b" style={{ borderColor: '#E2E8F0' }}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold" style={{ color: '#0F172A' }}>Recent Organizations</h3>
                    <button className="text-sm" style={{ color: '#2563EB' }}>View All</button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead style={{ backgroundColor: '#F1F5F9' }}>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Organization</th>
                        <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Users</th>
                        <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Jobs</th>
                        <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrganizations.map((org) => (
                        <tr key={org.id} className="border-t" style={{ borderColor: '#E2E8F0', hover: { backgroundColor: '#F8FAFC' } }}>
                          <td className="px-4 py-3">
                            <span className="text-sm font-medium" style={{ color: '#0F172A' }}>{org.name}</span>
                          </td>
                          <td className="px-4 py-3 text-sm" style={{ color: '#64748B' }}>{org.users}</td>
                          <td className="px-4 py-3 text-sm" style={{ color: '#64748B' }}>{org.jobs}</td>
                          <td className="px-4 py-3">
                            <span className="text-xs px-2 py-1 rounded-full" style={{
                              backgroundColor: org.status === 'active' ? '#DCFCE7' : '#FEF3C7',
                              color: org.status === 'active' ? '#22C55E' : '#F59E0B'
                            }}>
                              {org.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm" style={{ color: '#64748B' }}>{org.date}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2">
                              <button className="p-1 rounded hover:bg-gray-100">
                                <Eye className="w-4 h-4" style={{ color: '#64748B' }} />
                              </button>
                              <button className="p-1 rounded hover:bg-gray-100">
                                <Edit className="w-4 h-4" style={{ color: '#64748B' }} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* System Activity */}
            <div className="lg:col-span-1">
              <div className="rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <div className="p-4 border-b" style={{ borderColor: '#E2E8F0' }}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold" style={{ color: '#0F172A' }}>System Activity</h3>
                    <Activity className="w-4 h-4" style={{ color: '#64748B' }} />
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {activityData.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
                            backgroundColor: 
                              activity.type === 'create' ? '#DBEAFE' :
                              activity.type === 'alert' ? '#FEE2E2' :
                              activity.type === 'job' ? '#EDE9FE' :
                              activity.type === 'candidate' ? '#FEF3C7' : '#CCFBF1'
                          }}>
                            {activity.type === 'create' && <Building2 className="w-4 h-4" style={{ color: '#2563EB' }} />}
                            {activity.type === 'alert' && <AlertCircle className="w-4 h-4" style={{ color: '#EF4444' }} />}
                            {activity.type === 'job' && <Briefcase className="w-4 h-4" style={{ color: '#8B5CF6' }} />}
                            {activity.type === 'candidate' && <UserCheck className="w-4 h-4" style={{ color: '#F59E0B' }} />}
                            {activity.type === 'vendor' && <Truck className="w-4 h-4" style={{ color: '#14B8A6' }} />}
                            {activity.type === 'system' && <Activity className="w-4 h-4" style={{ color: '#06B6D4' }} />}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium" style={{ color: '#0F172A' }}>{activity.action}</p>
                          <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{activity.organization}</p>
                          <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-lg p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm" style={{ color: '#64748B' }}>Active Jobs</span>
                <Briefcase className="w-4 h-4" style={{ color: '#2563EB' }} />
              </div>
              <p className="text-xl font-bold" style={{ color: '#0F172A' }}>678</p>
              <p className="text-xs mt-1" style={{ color: '#22C55E' }}>↑ 12% from last month</p>
            </div>
            <div className="rounded-lg p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm" style={{ color: '#64748B' }}>New Candidates</span>
                <UserCheck className="w-4 h-4" style={{ color: '#14B8A6' }} />
              </div>
              <p className="text-xl font-bold" style={{ color: '#0F172A' }}>1,234</p>
              <p className="text-xs mt-1" style={{ color: '#22C55E' }}>↑ 8% from last month</p>
            </div>
            <div className="rounded-lg p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm" style={{ color: '#64748B' }}>Pending Approvals</span>
                <Clock className="w-4 h-4" style={{ color: '#F59E0B' }} />
              </div>
              <p className="text-xl font-bold" style={{ color: '#0F172A' }}>23</p>
              <p className="text-xs mt-1" style={{ color: '#EF4444' }}>↑ 5 from yesterday</p>
            </div>
            <div className="rounded-lg p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm" style={{ color: '#64748B' }}>Revenue (MTD)</span>
                <DollarSign className="w-4 h-4" style={{ color: '#8B5CF6' }} />
              </div>
              <p className="text-xl font-bold" style={{ color: '#0F172A' }}>$45.2K</p>
              <p className="text-xs mt-1" style={{ color: '#22C55E' }}>↑ 15% from last month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminDashboard;