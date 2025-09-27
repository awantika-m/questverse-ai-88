import { redirect } from 'react-router-dom';
import { createRouter } from '@/lib/router';
import { UNSAFE_DataRouterContext, UNSAFE_NavigationContext, UNSAFE_RouteContext } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import QuestsPage from '@/pages/quests/QuestsPage';
import QuestDetailPage from '@/pages/quests/QuestDetailPage';
import LocationsPage from '@/pages/locations/LocationsPage';
import LocationDetailPage from '@/pages/locations/LocationDetailPage';
import FeedPage from '@/pages/feed/FeedPage';
import AchievementsPage from '@/pages/achievements/AchievementsPage';
import AdminPage from '@/pages/admin/AdminPage';
import FacultyStudioPage from '@/pages/faculty';
import GuildPage from '@/pages/guild';
import ArenaPage from '@/pages/arena';
import AvatarPage from '@/pages/avatar';

// Auth guard for protected routes
const requireAuth = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return redirect('/login');
  }
  return null;
};

const router = createRouter(
  [
    {
      path: '/',
      element: <Layout />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
        loader: requireAuth,
      },
      {
        path: '/quests',
        element: <QuestsPage />,
        loader: requireAuth,
      },
      {
        path: '/quests/:id',
        element: <QuestDetailPage />,
        loader: requireAuth,
      },
      {
        path: '/locations',
        element: <LocationsPage />,
        loader: requireAuth,
      },
      {
        path: '/locations/:id',
        element: <LocationDetailPage />,
        loader: requireAuth,
      },
      {
        path: '/feed',
        element: <FeedPage />,
        loader: requireAuth,
      },
      {
        path: '/achievements',
        element: <AchievementsPage />,
        loader: requireAuth,
      },
      {
        path: '/faculty-studio',
        element: <FacultyStudioPage />,
        loader: requireAuth,
      },
      {
        path: '/guilds',
        element: <GuildPage />,
        loader: requireAuth,
      },
      {
        path: '/arena',
        element: <ArenaPage />,
        loader: requireAuth,
      },
      {
        path: '/avatar',
        element: <AvatarPage />,
        loader: requireAuth,
      },
      {
        path: '/admin',
        element: <AdminPage />,
        loader: () => {
          const result = requireAuth();
          if (result) return result;
          
          // Check if user is admin
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          if (user.role !== 'admin') {
            return redirect('/dashboard');
          }
          return null;
        },
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
]);

export default router;