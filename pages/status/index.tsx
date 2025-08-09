import { useEffect } from 'react';
import { ErrorLayout } from '@/components/layout/BaseLayout';
import { Activity, CheckCircle, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

const StatusRedirect = () => {
    useEffect(() => {
        // Redirect to status page after 3 seconds
        const timer = setTimeout(() => {
            window.location.href = 'https://lynkrapp.instatus.com';
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <ErrorLayout
            metaProps={{
                title: "System Status - Lynkr",
                description: "Check the current status and uptime of Lynkr services"
            }}
        >
            <div className="max-w-md mx-auto text-center">
                <div className="mb-6">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-600 rounded-full">
                        <Activity className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="mb-2 text-2xl font-bold text-gray-900">Checking Status...</h1>
                    <p className="text-gray-600">You'll be redirected to our status page in a few seconds.</p>
                </div>

                <div className="p-6 mb-6 rounded-lg bg-green-50">
                    <div className="flex items-center justify-center mb-4">
                        <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                        <span className="font-medium text-green-800">System Monitoring</span>
                    </div>
                    <ul className="space-y-2 text-sm text-green-700">
                        <li>• Real-time service status</li>
                        <li>• Uptime and performance metrics</li>
                        <li>• Incident reports and updates</li>
                        <li>• Maintenance notifications</li>
                        <li>• Historical data and trends</li>
                    </ul>
                </div>

                <div className="space-y-3">
                    <a
                        href="https://lynkrapp.instatus.com"
                        className="inline-flex items-center px-6 py-3 font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                    >
                        <Activity className="w-4 h-4 mr-2" />
                        View Status Page
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </a>

                    <div className="flex justify-center space-x-4">
                        <a
                            href="https://lynkrapp.instatus.com/subscribe"
                            className="inline-flex items-center px-4 py-2 text-sm text-green-600 border border-green-300 rounded-lg hover:bg-green-50"
                        >
                            <Clock className="w-4 h-4 mr-2" />
                            Subscribe to Updates
                        </a>
                    </div>

                    <div>
                        <Link href="/" className="text-gray-500 hover:text-gray-700">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </ErrorLayout>
    );
};

export default StatusRedirect;