import React from 'react';
import {
  Calendar,
  ArrowRight,
  Camera,
  Navigation,
  User,
  DollarSign,
  CheckSquare,
  MessageCircle,
  Shield,
  Plane,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router';
import { ROUTE_PATH } from '@/consts/RoutePath';
import keycloak from '@/keycloak-config';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const navigateToCreateTrip = () => {
    if (keycloak.authenticated) {
      return navigate(ROUTE_PATH.CREATE_TRIP);
    }
    keycloak.login();
  };

  const navigateToYourTrips = () => {
    if (keycloak.authenticated) {
      return navigate(ROUTE_PATH.TRIPS);
    }
    keycloak.login();
  };

  const features = [
    {
      icon: Calendar,
      title: 'Smart Itinerary Planning',
      description:
        'Create detailed day-by-day plans with location mapping, weather forecasts, and AI-powered destination suggestions.',
      iconBackground: 'bg-blue-600',
      background: 'bg-gradient-to-br from-blue-50 to-blue-100',
    },
    {
      icon: User,
      title: 'Collaborative Trip Management',
      description:
        'Invite friends, assign tasks, and plan together in real-time with seamless group coordination.',
      iconBackground: 'bg-purple-600',
      background: 'bg-gradient-to-br from-purple-50 to-purple-100',
    },
    {
      icon: DollarSign,
      title: 'Budget Tracking',
      description:
        'Set budgets, track expenses by category, and get real-time spending insights with visual summaries.',
      iconBackground: 'bg-pink-600',
      background: 'bg-gradient-to-br from-pink-50 to-pink-100',
    },
    {
      icon: CheckSquare,
      title: 'Packing & To-Do Lists',
      description:
        'Never forget essentials with smart checklists that adapt to your destination and trip duration.',
      iconBackground: 'bg-green-600',
      background: 'bg-gradient-to-br from-green-50 to-green-100',
    },
    {
      icon: MessageCircle,
      title: 'Real-time Group Chat',
      description:
        'Stay connected with instant messaging, powered by GraphQL subscriptions for lightning-fast communication.',
      iconBackground: 'bg-orange-600',
      background: 'bg-gradient-to-br from-orange-50 to-orange-100',
    },
    {
      icon: Shield,
      title: 'Secure Document Storage',
      description:
        'Store tickets, passports, and important documents securely in the cloud with AWS S3 integration.',
      iconBackground: 'bg-indigo-600',
      background: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
    },
  ];

  return (
    <>
      <section className="px-6 py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-8">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Plan Your Perfect Adventure
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Discover amazing destinations, create detailed itineraries,
                  and share unforgettable moments with AI-powered trip planning
                  that adapts to your style.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={navigateToCreateTrip}>
                  <span id="start-planning">Start Planning</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 right-10 opacity-20">
          <Camera className="h-16 w-16 text-blue-600 animate-bounce" />
        </div>
        <div className="absolute bottom-20 left-10 opacity-20">
          <Navigation className="h-12 w-12 text-purple-600 animate-pulse" />
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">
              Everything You Need for the Perfect Trip
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From inspiration to execution, we've got every aspect of your
              journey covered
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`${feature.background} hover:shadow-xl transition-all hover:scale-105 group`}>
                <CardContent>
                  <div>
                    <div
                      className={`${feature.iconBackground} w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="p-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Next Adventure?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who've discovered the joy of effortless
            trip planning. Your perfect adventure awaits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={navigateToCreateTrip}>
              <span>Create New Trip</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button onClick={navigateToYourTrips}>
              Your Trips
              <Plane className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
