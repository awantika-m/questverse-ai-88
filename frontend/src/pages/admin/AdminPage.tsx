import { useAdminMetrics, useAdminUsers } from '@/hooks/api';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  Trophy,
  Star,
  Activity,
  Flag,
  TrendingUp,
} from 'lucide-react';

export default function AdminPage() {
  const { data: metrics, isLoading: metricsLoading } = useAdminMetrics();
  const { data: users, isLoading: usersLoading } = useAdminUsers();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  const mockData = [
    { name: 'Week 1', users: 400, quests: 240, engagement: 67 },
    { name: 'Week 2', users: 430, quests: 280, engagement: 72 },
    { name: 'Week 3', users: 448, quests: 310, engagement: 75 },
    { name: 'Week 4', users: 470, quests: 350, engagement: 78 },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor system performance and manage users
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.users.total}</div>
            <p className="text-xs text-muted-foreground">
              +{metrics?.users.new} this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Quests</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.quests.active}</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.quests.completionRate}% completion rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Engagement
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.engagement.averageLevel}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.engagement.postsPerUser} posts per user
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Open Reports
            </CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.moderation.openReports}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.moderation.resolvedReports} resolved this week
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="quests">Quests</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Growth Overview</CardTitle>
              <CardDescription>
                Platform metrics over the past month
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#8884d8"
                    name="Users"
                  />
                  <Line
                    type="monotone"
                    dataKey="quests"
                    stroke="#82ca9d"
                    name="Quests"
                  />
                  <Line
                    type="monotone"
                    dataKey="engagement"
                    stroke="#ffc658"
                    name="Engagement %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Role Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.entries(metrics?.users.byRole || {}).map(
                  ([role, count]) => (
                    <div key={role} className="mb-4 space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="capitalize">{role}</span>
                        <span>{count}</span>
                      </div>
                      <Progress
                        value={(count as number / metrics?.users.total!) * 100}
                      />
                    </div>
                  )
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Button className="justify-start">
                    <Star className="mr-2 h-4 w-4" />
                    Configure Rewards
                  </Button>
                  <Button className="justify-start" variant="outline">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                  <Button className="justify-start" variant="outline">
                    <Flag className="mr-2 h-4 w-4" />
                    Review Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                View and manage all users in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {/* User management table implementation */}
                <p className="text-center text-muted-foreground">
                  User management table to be implemented
                </p>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quests">
          <Card>
            <CardHeader>
              <CardTitle>Quest Management</CardTitle>
              <CardDescription>
                Monitor and manage active quests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {/* Quest management implementation */}
                <p className="text-center text-muted-foreground">
                  Quest management interface to be implemented
                </p>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Moderation Queue</CardTitle>
              <CardDescription>
                Review and handle reported content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {/* Reports management implementation */}
                <p className="text-center text-muted-foreground">
                  Moderation queue interface to be implemented
                </p>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}