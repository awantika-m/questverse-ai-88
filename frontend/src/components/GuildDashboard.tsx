import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ChartContainer } from '@/components/ui/chart';
import { Area, Line } from 'recharts';
import { useToast } from '@/hooks/use-toast';

interface Member {
  id: string;
  name: string;
  role: string;
  quests: number;
  joinDate: string;
}

interface GuildQuest {
  id: string;
  title: string;
  status: 'active' | 'completed';
  participants: number;
  deadline: string;
}

const SAMPLE_MEMBERS: Member[] = [
  {
    id: '1',
    name: 'John Doe',
    role: 'Leader',
    quests: 25,
    joinDate: '2025-08-15'
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'Officer',
    quests: 18,
    joinDate: '2025-08-20'
  }
];

const SAMPLE_QUESTS: GuildQuest[] = [
  {
    id: '1',
    title: 'Advanced Calculus Challenge',
    status: 'active',
    participants: 8,
    deadline: '2025-10-01'
  },
  {
    id: '2',
    title: 'Physics Lab Exploration',
    status: 'completed',
    participants: 12,
    deadline: '2025-09-25'
  }
];

const activityData = [
  { date: '2025-09-01', quests: 5, members: 15 },
  { date: '2025-09-08', quests: 8, members: 18 },
  { date: '2025-09-15', quests: 12, members: 22 },
  { date: '2025-09-22', quests: 15, members: 25 },
];

export default function GuildDashboard({ guildId }: { guildId: string }) {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  const handlePromoteMember = (memberId: string) => {
    toast({
      title: 'Member promoted',
      description: 'Member role has been updated'
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Math Warriors</h2>
            <p className="text-muted-foreground">Level 10 • 25 Members</p>
          </div>
          <Button>Edit Guild</Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="quests">Guild Quests</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Activity Overview</h3>
                <ChartContainer 
                  config={{ 
                    quests: { color: "#4338ca" }, 
                    members: { color: "#0ea5e9" } 
                  }} 
                  className="h-[300px]"
                >
                  {activityData && 
                    <>
                      <Area
                        type="monotone"
                        data={activityData}
                        dataKey="quests"
                        stroke="var(--color-quests)"
                        fill="var(--color-quests)"
                        fillOpacity={0.1}
                      />
                      <Line
                        type="monotone"
                        data={activityData}
                        dataKey="members"
                        stroke="var(--color-members)"
                        dot={false}
                      />
                    </>
                  }
                </ChartContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Recent Achievements</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <h4 className="font-medium">Top Mathematics Guild</h4>
                    <p className="text-sm text-muted-foreground">Completed most math quests this week</p>
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <h4 className="font-medium">Rising Stars</h4>
                    <p className="text-sm text-muted-foreground">Fastest growing guild in September</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="members">
            <div className="space-y-6 mt-6">
              <div className="flex justify-between items-center">
                <Input placeholder="Search members..." className="max-w-sm" />
                <Button>Invite Members</Button>
              </div>

              <div className="space-y-4">
                {SAMPLE_MEMBERS.map(member => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {member.role} • Joined {member.joinDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{member.quests} Quests</p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handlePromoteMember(member.id)}
                      >
                        Promote
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="quests">
            <div className="space-y-6 mt-6">
              <Button>Create Guild Quest</Button>

              <div className="space-y-4">
                {SAMPLE_QUESTS.map(quest => (
                  <Card key={quest.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{quest.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {quest.participants} participants • Due {quest.deadline}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          quest.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {quest.status}
                        </span>
                        <Button variant="outline">View Details</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6 mt-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Guild Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Guild Name</label>
                    <Input defaultValue="Math Warriors" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Input defaultValue="A guild focused on conquering mathematical challenges" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Privacy</label>
                    <select className="w-full border rounded-md p-2">
                      <option>Public</option>
                      <option>Private</option>
                      <option>Invite Only</option>
                    </select>
                  </div>
                  <Button>Save Changes</Button>
                </div>
              </Card>

              <Card className="p-6 border-red-200">
                <h3 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h3>
                <Button variant="destructive">Delete Guild</Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}