import { cn } from '@/lib/utils';
import { useUI } from '@/store';
import { useUser } from '@/hooks/api';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Map,
  Users,
  Trophy,
  ScrollText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useUI();
  const { data: user } = useUser();
  const navigate = useNavigate();

  const sidebarItems = [
    {
      title: 'Dashboard',
      icon: Home,
      href: '/dashboard',
    },
    {
      title: 'Quests',
      icon: ScrollText,
      href: '/quests',
    },
    {
      title: 'Locations',
      icon: Map,
      href: '/locations',
    },
    {
      title: 'Guilds',
      icon: Users,
      href: '/guilds',
    },
    {
      title: 'Achievements',
      icon: Trophy,
      href: '/achievements',
    },
  ];

  return (
    <div
      className={cn(
        'fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full border-r bg-background transition-transform',
        isSidebarOpen && 'translate-x-0'
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-3">
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <div className="space-y-1">
                {sidebarItems.map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate(item.href)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Button>
                ))}
              </div>
            </div>
            {user?.role === 'faculty' && (
              <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold">Faculty</h2>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate('/studio')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Quest Studio
                </Button>
              </div>
            )}
            {user?.role === 'admin' && (
              <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold">Admin</h2>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate('/admin')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Admin Panel
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
        {user && (
          <div className="mt-auto border-t p-4">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">Level {user.level}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}