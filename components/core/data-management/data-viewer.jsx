import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingDots from '@/components/utils/loading-dots';
import { 
  ChevronDown, 
  ChevronRight, 
  User, 
  Link as LinkIcon, 
  Folder, 
  BarChart3, 
  Palette,
  ExternalLink,
  Eye,
  EyeOff,
  Calendar,
  MousePointer
} from 'lucide-react';

const DataViewer = ({ onClose }) => {
  const [expandedSections, setExpandedSections] = useState({
    profile: true,
    statistics: true,
    links: false,
    sections: false,
    customization: false,
    linkedAccounts: false,
  });

  const { data: userData, isLoading, error } = useQuery({
    queryKey: ['user-data-view'],
    queryFn: async () => {
      const response = await axios.get('/api/user/data-view');
      return response.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to load data');
    },
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getThemeColors = (themePalette) => {
    if (!themePalette?.palette) return [];
    return themePalette.palette;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingDots color="#6366F1" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-500">Failed to load your data</p>
        <button 
          onClick={onClose}
          className="px-4 py-2 mt-4 text-white bg-gray-500 rounded-md hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Account Data</h2>
        <button
          onClick={onClose}
          className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600"
        >
          Close
        </button>
      </div>

      {/* Profile Section */}
      <div className="mb-6 border rounded-lg">
        <button
          onClick={() => toggleSection('profile')}
          className="flex items-center justify-between w-full p-4 hover:bg-gray-50"
        >
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Profile Information</h3>
          </div>
          {expandedSections.profile ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
        {expandedSections.profile && (
          <div className="p-4 border-t bg-gray-50">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="text-gray-900">{userData.profile.name || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Handle</label>
                <p className="text-gray-900">@{userData.profile.handle || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900">{userData.profile.email || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Total Profile Views</label>
                <p className="text-gray-900">{userData.profile.totalViews || 0}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Bio</label>
                <p className="text-gray-900">{userData.profile.bio || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Account Created</label>
                <p className="text-gray-900">{formatDate(userData.profile.createdAt)}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistics Section */}
      <div className="mb-6 border rounded-lg">
        <button
          onClick={() => toggleSection('statistics')}
          className="flex items-center justify-between w-full p-4 hover:bg-gray-50"
        >
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold">Statistics</h3>
          </div>
          {expandedSections.statistics ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
        {expandedSections.statistics && (
          <div className="p-4 border-t bg-gray-50">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="p-3 text-center bg-white rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{userData.statistics.totalLinks}</p>
                <p className="text-sm text-gray-600">Total Links</p>
              </div>
              <div className="p-3 text-center bg-white rounded-lg">
                <p className="text-2xl font-bold text-green-600">{userData.statistics.activeLinks}</p>
                <p className="text-sm text-gray-600">Active Links</p>
              </div>
              <div className="p-3 text-center bg-white rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{userData.statistics.totalClicks}</p>
                <p className="text-sm text-gray-600">Total Clicks</p>
              </div>
              <div className="p-3 text-center bg-white rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{userData.statistics.totalSections}</p>
                <p className="text-sm text-gray-600">Sections</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Links Section */}
      <div className="mb-6 border rounded-lg">
        <button
          onClick={() => toggleSection('links')}
          className="flex items-center justify-between w-full p-4 hover:bg-gray-50"
        >
          <div className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Links ({userData.statistics.totalLinks})</h3>
          </div>
          {expandedSections.links ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
        {expandedSections.links && (
          <div className="p-4 border-t bg-gray-50">
            <div className="space-y-3 overflow-y-auto max-h-64">
              {userData.links.map((link) => (
                <div key={link.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">{link.title}</h4>
                      {link.isSocial && <span className="px-2 py-1 text-xs text-blue-600 bg-blue-100 rounded">Social</span>}
                      {link.archived ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-green-500" />}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{link.url}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MousePointer className="w-3 h-3" />
                        {link.clicks} clicks
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(link.createdAt)}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sections */}
      <div className="mb-6 border rounded-lg">
        <button
          onClick={() => toggleSection('sections')}
          className="flex items-center justify-between w-full p-4 hover:bg-gray-50"
        >
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold">Sections ({userData.statistics.totalSections})</h3>
          </div>
          {expandedSections.sections ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
        {expandedSections.sections && (
          <div className="p-4 border-t bg-gray-50">
            <div className="space-y-3">
              {userData.sections.map((section) => (
                <div key={section.id} className="p-3 bg-white rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{section.name}</h4>
                    <div className="flex items-center gap-2">
                      {section.visible ? <Eye className="w-4 h-4 text-green-500" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                      <span className="text-sm text-gray-600">{section.links.length} links</span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Created {formatDate(section.createdAt)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Customization */}
      <div className="mb-6 border rounded-lg">
        <button
          onClick={() => toggleSection('customization')}
          className="flex items-center justify-between w-full p-4 hover:bg-gray-50"
        >
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-pink-600" />
            <h3 className="text-lg font-semibold">Customization Settings</h3>
          </div>
          {expandedSections.customization ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
        {expandedSections.customization && (
          <div className="p-4 border-t bg-gray-50">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Theme Palette</label>
                <div className="flex gap-2 mt-1">
                  {getThemeColors(userData.customization.themePalette).map((color, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 border-2 border-gray-300 rounded-full"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Button Style</label>
                <p className="text-gray-900">{userData.customization.buttonStyle || 'Default'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Links Location</label>
                <p className="text-gray-900">{userData.customization.linksLocation || 'top'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Linked Accounts */}
      <div className="mb-6 border rounded-lg">
        <button
          onClick={() => toggleSection('linkedAccounts')}
          className="flex items-center justify-between w-full p-4 hover:bg-gray-50"
        >
          <div className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold">Linked Accounts ({userData.statistics.linkedAccountsCount})</h3>
          </div>
          {expandedSections.linkedAccounts ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
        {expandedSections.linkedAccounts && (
          <div className="p-4 border-t bg-gray-50">
            <div className="space-y-2">
              {userData.linkedAccounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
                      <span className="text-xs font-medium">{account.provider[0].toUpperCase()}</span>
                    </div>
                    <span className="font-medium capitalize">{account.provider}</span>
                  </div>
                  <span className="text-sm text-gray-600 capitalize">{account.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataViewer;
