import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Guild {
  id: string;
  name: string;
  description: string;
  members: number;
  level: number;
  quests: number;
}

const SAMPLE_GUILDS: Guild[] = [
  {
    id: '1',
    name: 'Math Warriors',
    description: 'A guild focused on conquering mathematical challenges',
    members: 25,
    level: 10,
    quests: 15
  },
  {
    id: '2',
    name: 'Physics Pioneers',
    description: 'Exploring the mysteries of the physical world',
    members: 18,
    level: 8,
    quests: 12
  }
];

export default function GuildPage() {
  const [activeTab, setActiveTab] = useState('my-guilds');
  const { toast } = useToast();
  const [newGuild, setNewGuild] = useState({ name: '', description: '' });

  const handleCreateGuild = () => {
    // TODO: Implement guild creation logic
    toast({
      title: 'Guild created successfully',
      description: `Created guild: ${newGuild.name}`
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Guilds</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Guild</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Guild</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Guild Name</label>
                <Input
                  value={newGuild.name}
                  onChange={(e) => setNewGuild(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter guild name..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={newGuild.description}
                  onChange={(e) => setNewGuild(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your guild..."
                />
              </div>
              <Button onClick={handleCreateGuild} className="w-full">
                Create Guild
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="my-guilds">My Guilds</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="my-guilds">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_GUILDS.map(guild => (
              <Card key={guild.id} className="p-6">
                <h3 className="text-xl font-semibold mb-2">{guild.name}</h3>
                <p className="text-muted-foreground mb-4">{guild.description}</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Members</p>
                    <p className="text-muted-foreground">{guild.members}</p>
                  </div>
                  <div>
                    <p className="font-medium">Level</p>
                    <p className="text-muted-foreground">{guild.level}</p>
                  </div>
                  <div>
                    <p className="font-medium">Quests</p>
                    <p className="text-muted-foreground">{guild.quests}</p>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  View Details
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="discover">
          <Card className="p-6">
            <div className="mb-6">
              <Input placeholder="Search guilds..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Placeholder for discovered guilds */}
              {SAMPLE_GUILDS.map(guild => (
                <Card key={guild.id} className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{guild.name}</h3>
                  <p className="text-muted-foreground mb-4">{guild.description}</p>
                  <Button className="w-full">Join Guild</Button>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Top Guilds</h3>
            <div className="space-y-4">
              {SAMPLE_GUILDS.map((guild, index) => (
                <div
                  key={guild.id}
                  className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold">{index + 1}</span>
                    <div>
                      <h4 className="font-medium">{guild.name}</h4>
                      <p className="text-sm text-muted-foreground">Level {guild.level}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{guild.quests} Quests</p>
                    <p className="text-sm text-muted-foreground">{guild.members} Members</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}