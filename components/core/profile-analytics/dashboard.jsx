import Chart from './bar-chart';
import Select from 'react-select';
import LinkStats from './link-stats';
import useCurrentUser from '@/hooks/useCurrentUser';
import useAnalytics from '@/hooks/useAnalytics';
import { useState } from 'react';
import { LocationStats } from './location-stats';
import { DeviceStats } from './device-stats';
import useLocationAnalytics from '@/hooks/useLocationAnalytics';
import useDeviceAnalytics from '@/hooks/useDeviceAnalytics';

export function AnalyticsDashboard() {
  const options = [
    { value: 'last_hour', label: 'Last hour' },
    { value: 'last_24_hours', label: 'Last 24 hours' },
    { value: 'last_7_days', label: 'Last 7 days' },
    { value: 'last_30_days', label: 'Last 30 days' },
  ];

  const { data: currentUser } = useCurrentUser();
  const [filter, setFilter] = useState('last_24_hours');

  // Use our custom hooks to fetch analytics data
  const { data: visitAnalytics, isLoading: isLoadingVisits } = useAnalytics(filter, currentUser?.handle);
  const { data: locationAnalytics, isLoading: isLoadingLocation } = useLocationAnalytics(currentUser?.handle);
  const { data: deviceAnalytics, isLoading: isLoadingDevices } = useDeviceAnalytics(currentUser?.handle);

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <h3 className="text-xl font-semibold">Analytics</h3>
        <Select
          onChange={(option) => setFilter(option.value)}
          className="w-[170px]"
          defaultValue={options[1]} // Default to 24 hours
          options={options}
        />
      </div>

      <Chart analytics={visitAnalytics} isLoading={isLoadingVisits} />
      <LinkStats />
      <DeviceStats analytics={deviceAnalytics} isLoading={isLoadingDevices} />
      <LocationStats analytics={locationAnalytics} isLoading={isLoadingLocation} />
    </>
  );
}
