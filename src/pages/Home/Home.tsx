import React from 'react';
import { motion } from 'framer-motion';
import {
  Group,
  CalendarToday,
  AttachMoney,
  CheckBox,
  Chat,
  Description,
  ArrowForward,
  Security,
  CloudUpload,
  Speed,
  Star,
} from '@mui/icons-material';
import './home.css';
import { useNavigate } from 'react-router';
import { ROUTE_PATH } from '../../const/RoutePath';
import keycloakConfig from '../../keycloak-config';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const navigateToTrip = () => {
    if (keycloakConfig.authenticated) {
      return navigate(ROUTE_PATH.TRIPS);
    }
    keycloakConfig.login();
  };

  const features = [
    {
      icon: CalendarToday,
      title: 'Smart Itinerary Planning',
      description:
        'Create detailed day-by-day plans with location mapping, weather forecasts, and AI-powered destination suggestions.',
      gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    },
    {
      icon: Group,
      title: 'Collaborative Trip Management',
      description:
        'Invite friends, assign tasks, and plan together in real-time with seamless group coordination.',
      gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    },
    {
      icon: AttachMoney,
      title: 'Budget Tracking',
      description:
        'Set budgets, track expenses by category, and get real-time spending insights with visual summaries.',
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
    },
    {
      icon: CheckBox,
      title: 'Packing & To-Do Lists',
      description:
        'Never forget essentials with smart checklists that adapt to your destination and trip duration.',
      gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    },
    {
      icon: Chat,
      title: 'Real-time Group Chat',
      description:
        'Stay connected with instant messaging, powered by GraphQL subscriptions for lightning-fast communication.',
      gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    },
    {
      icon: Description,
      title: 'Secure Document Storage',
      description:
        'Store tickets, passports, and important documents securely in the cloud with AWS S3 integration.',
      gradient: 'linear-gradient(135deg, #14b8a6, #3b82f6)',
    },
  ];

  const benefits = [
    {
      icon: Security,
      title: 'Enterprise Security',
      desc: 'Advanced authentication with industry-standard security protocols to keep your data safe',
      gradient: 'linear-gradient(135deg, #ef4444, #ec4899)',
    },
    {
      icon: CloudUpload,
      title: 'Cloud-First Architecture',
      desc: 'Scalable cloud infrastructure ensures your documents are always accessible and secure',
      gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    },
    {
      icon: Speed,
      title: 'Lightning Fast',
      desc: 'Real-time updates and instant messaging keep your entire group synchronized',
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
    },
  ];

  const stats = [
    { number: '10K+', label: 'Trips Planned' },
    { number: '50K+', label: 'Happy Travelers' },
    { number: '99.9%', label: 'Uptime' },
  ];

  return (
    <>
      <section className='hero-section'>
        <div className='container-max text-center'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}>
            <h1 className='hero-title'>
              <span className='gradient-text'>Plan Your Perfect</span>
              <br />
              <span>Group Adventure</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='hero-subtitle'>
            The all-in-one platform that transforms chaotic group travel
            planning into seamless collaboration. From itineraries to budgets,
            we've got everything covered.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className='hero-buttons'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='btn-primary'
              onClick={navigateToTrip}>
              <span>Start Planning</span>
              <ArrowForward style={{ width: '20px', height: '20px' }} />
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className='stats-grid'>
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05 }}
                className='card text-center'>
                <div className='stat-number gradient-text'>{stat.number}</div>
                <div className='stat-label'>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      <section
        id='features'
        className='section'>
        <div className='container-max'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center'
            style={{ marginBottom: '64px' }}>
            <h2 className='section-title'>
              <span className='gradient-text'>Everything You Need</span>
            </h2>
            <p className='section-subtitle'>
              Powerful features designed to make group travel planning
              effortless and enjoyable
            </p>
          </motion.div>

          <div className='features-grid'>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.03 }}
                className='card feature-card'>
                <div
                  className='feature-icon'
                  style={{ background: feature.gradient }}>
                  <feature.icon
                    style={{ width: '32px', height: '32px', color: 'white' }}
                  />
                </div>

                <h3 className='feature-title'>{feature.title}</h3>
                <p className='feature-description'>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className='section'>
        <div className='container-max'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center'
            style={{ marginBottom: '64px' }}>
            <h2 className='section-title'>
              <span className='gradient-text-green'>
                Why Choose Plan Voyage?
              </span>
            </h2>
            <p className='section-subtitle'>
              Built for modern travelers who demand security, performance, and
              seamless collaboration
            </p>
          </motion.div>

          <div className='benefits-grid'>
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className='card benefit-card'>
                <div
                  className='benefit-icon'
                  style={{ background: benefit.gradient }}>
                  <benefit.icon
                    style={{ width: '32px', height: '32px', color: 'white' }}
                  />
                </div>
                <h3 className='feature-title'>{benefit.title}</h3>
                <p className='benefit-description'>{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className='section'>
        <div className='container-medium'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center'>
            <div className='testimonial-stars'>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className='star-icon'
                />
              ))}
            </div>
            <blockquote className='testimonial-quote'>
              "Plan Voyage transformed how our group organizes trips. What used
              to take weeks of back-and-forth messages now happens seamlessly in
              one place. The collaboration features are game-changing!"
            </blockquote>
            <div className='testimonial-author'>
              <div className='author-avatar'>
                <span style={{ color: 'white', fontWeight: 'bold' }}>JD</span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div className='author-name'>Jessica Davis</div>
                <div className='author-title'>Travel Enthusiast</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <section className='cta-section'>
        <div
          className='container-medium text-center'
          style={{ position: 'relative', zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <h2
              className='section-title'
              style={{ lineHeight: '1.2' }}>
              Ready to Transform Your
              <br />
              <span className='gradient-text'>Group Travel Experience?</span>
            </h2>

            <p
              className='section-subtitle'
              style={{ marginBottom: '48px' }}>
              Join thousands of travelers who have revolutionized their trip
              planning with Plan Voyage
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='btn-cta'
              onClick={navigateToTrip}>
              <span>Start Your Journey</span>
              <ArrowForward style={{ width: '24px', height: '24px' }} />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
