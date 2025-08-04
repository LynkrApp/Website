import Link from 'next/link';
import { ArrowLeft, Heart, Code, Users, Globe, Zap, Coffee, Target } from 'lucide-react';
import { ContentLayout } from '@/components/layout/BaseLayout';

const Careers = () => {
    const openRoles = [];

    const benefits = [
        {
            icon: <Globe className="w-6 h-6 text-blue-500" />,
            title: "Remote First",
            description: "Work from anywhere in the world. We've been remote since day one."
        },
        {
            icon: <Heart className="w-6 h-6 text-red-500" />,
            title: "Open Source Impact",
            description: "Your work directly impacts thousands of creators and contributes to the open-source ecosystem."
        },
        {
            icon: <Zap className="w-6 h-6 text-yellow-500" />,
            title: "Fast Growth",
            description: "Join a rapidly growing platform with millions of page views and engaged users."
        },
        {
            icon: <Coffee className="w-6 h-6 text-brown-500" />,
            title: "Flexible Hours",
            description: "Work when you're most productive. We care about results, not hours logged."
        },
        {
            icon: <Target className="w-6 h-6 text-green-500" />,
            title: "Mission Driven",
            description: "Help democratize the web by making powerful tools accessible to everyone, for free."
        },
        {
            icon: <Users className="w-6 h-6 text-purple-500" />,
            title: "Small Team",
            description: "Work closely with a passionate, talented team where your voice matters."
        }
    ];

    return (
        <ContentLayout
            title="Join Our Team"
            description="Help us build the future of link-in-bio platforms and democratize the web for creators everywhere."
        >
            {/* Back Link */}
            <Link
                href="/"
                className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
            </Link>

            {/* Mission Statement */}
            <div className="p-8 mb-12 border border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
                <h2 className="flex items-center mb-4 text-2xl font-semibold text-gray-900">
                    <Heart className="w-6 h-6 mr-3 text-red-500" />
                    Our Mission
                </h2>
                <p className="text-lg leading-relaxed text-gray-700">
                    At Lynkr, we believe powerful tools should be accessible to everyone. We're building the ultimate free,
                    open-source link-in-bio platform that puts creators first. Join us in democratizing the web and
                    empowering millions of users worldwide.
                </p>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
                <section className="mb-12">
                    <h2 className="mb-6 text-2xl font-semibold text-gray-900">
                        Why Work at Lynkr?
                    </h2>

                    <div className="grid gap-6 mb-8 md:grid-cols-2">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="p-6 bg-white border border-gray-200 rounded-lg">
                                <div className="flex items-center mb-4">
                                    {benefit.icon}
                                    <h3 className="ml-3 text-xl font-semibold text-gray-900">{benefit.title}</h3>
                                </div>
                                <p className="text-gray-700">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                        Open Positions
                    </h2>
                    <p className="mb-8 leading-relaxed text-gray-700">
                        We're always looking for talented individuals who share our passion for open-source software
                        and democratizing the web. Here are our current openings:
                    </p>

                    <div className="space-y-6">
                        {openRoles.map((role, index) => (
                            <div key={index} className="p-6 border border-gray-200 rounded-lg bg-gray-50">
                                <div className="flex flex-col justify-between mb-4 md:flex-row md:items-center">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">{role.title}</h3>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className="px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full">
                                                {role.department}
                                            </span>
                                            <span className="px-3 py-1 text-sm text-green-800 bg-green-100 rounded-full">
                                                {role.location}
                                            </span>
                                            <span className="px-3 py-1 text-sm text-purple-800 bg-purple-100 rounded-full">
                                                {role.type}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <p className="mb-4 text-gray-700">{role.description}</p>
                                <div className="flex gap-3">
                                    <Link
                                        href={`mailto:careers@lynkr.link?subject=Application: ${role.title}`}
                                        className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                                    >
                                        Apply Now
                                    </Link>
                                    <Link
                                        href={`mailto:careers@lynkr.link?subject=Questions about: ${role.title}`}
                                        className="px-4 py-2 text-blue-600 transition-colors border border-blue-600 rounded-lg hover:bg-blue-50"
                                    >
                                        Learn More
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                        Our Culture
                    </h2>
                    <div className="p-6 rounded-lg bg-gray-50">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <h3 className="mb-3 text-lg font-semibold text-gray-900">🚀 Innovation First</h3>
                                <p className="text-gray-700">
                                    We embrace new technologies and aren't afraid to experiment. Every team member
                                    is encouraged to propose and implement innovative solutions.
                                </p>
                            </div>
                            <div>
                                <h3 className="mb-3 text-lg font-semibold text-gray-900">🤝 Open Collaboration</h3>
                                <p className="text-gray-700">
                                    Transparency is core to our values. We share knowledge openly, make decisions
                                    collectively, and support each other's growth.
                                </p>
                            </div>
                            <div>
                                <h3 className="mb-3 text-lg font-semibold text-gray-900">🎯 User Focused</h3>
                                <p className="text-gray-700">
                                    Every decision we make considers our users first. We build features that
                                    solve real problems and create genuine value.
                                </p>
                            </div>
                            <div>
                                <h3 className="mb-3 text-lg font-semibold text-gray-900">🌱 Continuous Learning</h3>
                                <p className="text-gray-700">
                                    We invest in our team's growth through learning opportunities, conferences,
                                    and dedicated time for skill development.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                        Application Process
                    </h2>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="flex items-center justify-center w-8 h-8 text-white bg-blue-600 rounded-full">
                                1
                            </div>
                            <div>
                                <h3 className="mb-2 font-semibold text-gray-900">Submit Application</h3>
                                <p className="text-gray-700">
                                    Send us your resume, cover letter, and portfolio (if applicable) via email.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center justify-center w-8 h-8 text-white bg-blue-600 rounded-full">
                                2
                            </div>
                            <div>
                                <h3 className="mb-2 font-semibold text-gray-900">Initial Screen</h3>
                                <p className="text-gray-700">
                                    We'll review your application and schedule a brief call to get to know you better.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center justify-center w-8 h-8 text-white bg-blue-600 rounded-full">
                                3
                            </div>
                            <div>
                                <h3 className="mb-2 font-semibold text-gray-900">Technical Interview</h3>
                                <p className="text-gray-700">
                                    Depending on the role, we'll have a technical discussion or code review session.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center justify-center w-8 h-8 text-white bg-blue-600 rounded-full">
                                4
                            </div>
                            <div>
                                <h3 className="mb-2 font-semibold text-gray-900">Team Meet</h3>
                                <p className="text-gray-700">
                                    Meet with team members you'll be working with directly and ask any questions.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center justify-center w-8 h-8 text-white bg-green-600 rounded-full">
                                5
                            </div>
                            <div>
                                <h3 className="mb-2 font-semibold text-gray-900">Welcome Aboard!</h3>
                                <p className="text-gray-700">
                                    If it's a good fit, we'll make an offer and welcome you to the team!
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                        Don't See a Perfect Fit?
                    </h2>
                    <p className="mb-6 leading-relaxed text-gray-700">
                        We're always interested in connecting with talented people, even if we don't have
                        an open position that matches your skills right now. Send us your information and
                        tell us what you're passionate about!
                    </p>
                    <div className="text-center">
                        <Link
                            href="mailto:careers@lynkr.link?subject=General Interest"
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                            Get in Touch
                        </Link>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <div className="pt-8 mt-12 border-t border-gray-200">
                <div className="text-center">
                    <p className="mb-2 text-sm text-gray-500">
                        Questions about working at Lynkr?
                    </p>
                    <div className="flex justify-center space-x-6 text-sm">
                        <Link href="/about" className="text-blue-600 hover:text-blue-800">
                            About Us
                        </Link>
                        <Link href="/contact" className="text-blue-600 hover:text-blue-800">
                            Contact
                        </Link>
                        <Link
                            href="https://github.com/LynkrApp/Website"
                            className="text-blue-600 hover:text-blue-800"
                            target="_blank"
                        >
                            GitHub
                        </Link>
                    </div>
                </div>
            </div>
        </ContentLayout>
    );
};

export default Careers;
