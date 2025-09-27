import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Match {
  id: string;
  type: 'challenge' | 'tournament';
  players: string[];
  status: 'waiting' | 'in-progress' | 'completed';
  subject: string;
  createdAt: string;
}

interface Tournament {
  id: string;
  name: string;
  subject: string;
  participants: number;
  maxParticipants: number;
  startDate: string;
  status: 'upcoming' | 'in-progress' | 'completed';
}

const SAMPLE_MATCHES: Match[] = [
  {
    id: '1',
    type: 'challenge',
    players: ['John', 'Jane'],
    status: 'in-progress',
    subject: 'Mathematics',
    createdAt: '2025-09-27T10:00:00Z'
  },
  {
    id: '2',
    type: 'tournament',
    players: ['Alice', 'Bob'],
    status: 'waiting',
    subject: 'Physics',
    createdAt: '2025-09-27T11:00:00Z'
  }
];

const SAMPLE_TOURNAMENTS: Tournament[] = [
  {
    id: '1',
    name: 'Math Masters Championship',
    subject: 'Mathematics',
    participants: 14,
    maxParticipants: 16,
    startDate: '2025-10-01',
    status: 'upcoming'
  },
  {
    id: '2',
    name: 'Physics Showdown',
    subject: 'Physics',
    participants: 8,
    maxParticipants: 8,
    startDate: '2025-09-30',
    status: 'in-progress'
  }
];

export default function ArenaPage() {
  const [activeTab, setActiveTab] = useState('matches');
  const { toast } = useToast();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const handleQuickMatch = () => {
    toast({
      title: 'Searching for match',
      description: 'Looking for opponents...'
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Arena</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleQuickMatch}>Quick Match</Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create Tournament</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Tournament</DialogTitle>
              </DialogHeader>
              {/* Tournament creation form */}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="matches">Active Matches</TabsTrigger>
          <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="matches">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_MATCHES.map(match => (
              <Card 
                key={match.id} 
                className="p-6 cursor-pointer hover:bg-secondary/50 transition-colors"
                onClick={() => setSelectedMatch(match)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{match.type === 'challenge' ? 'Challenge Match' : 'Tournament Match'}</h3>
                    <p className="text-muted-foreground">{match.subject}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    match.status === 'in-progress' 
                      ? 'bg-green-100 text-green-700' 
                      : match.status === 'waiting'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {match.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex gap-2">
                    {match.players.map((player, index) => (
                      <span key={player}>
                        {player}
                        {index < match.players.length - 1 && ' vs '}
                      </span>
                    ))}
                  </div>
                  <p className="text-muted-foreground">
                    {new Date(match.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tournaments">
          <div className="space-y-6">
            {SAMPLE_TOURNAMENTS.map(tournament => (
              <Card key={tournament.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{tournament.name}</h3>
                    <p className="text-muted-foreground">{tournament.subject}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    tournament.status === 'in-progress'
                      ? 'bg-green-100 text-green-700'
                      : tournament.status === 'upcoming'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {tournament.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <p>Participants: {tournament.participants}/{tournament.maxParticipants}</p>
                    <p>Starts: {new Date(tournament.startDate).toLocaleDateString()}</p>
                  </div>
                  <Button variant="outline">
                    {tournament.status === 'upcoming' ? 'Join Tournament' : 'View Details'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Top Players</h3>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {[...Array(10)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold">{index + 1}</span>
                      <div>
                        <h4 className="font-medium">Player {index + 1}</h4>
                        <p className="text-sm text-muted-foreground">Rating: {1500 - index * 50}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{20 - index} Wins</p>
                      <p className="text-sm text-muted-foreground">{30 - index} Matches</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Match Details Dialog */}
      {selectedMatch && (
        <Dialog open={!!selectedMatch} onOpenChange={() => setSelectedMatch(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Match Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Players</h3>
                <p className="text-muted-foreground">{selectedMatch.players.join(' vs ')}</p>
              </div>
              <div>
                <h3 className="font-medium">Subject</h3>
                <p className="text-muted-foreground">{selectedMatch.subject}</p>
              </div>
              <div>
                <h3 className="font-medium">Status</h3>
                <p className="text-muted-foreground capitalize">{selectedMatch.status}</p>
              </div>
              {selectedMatch.status === 'in-progress' && (
                <Button className="w-full">Join Match</Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}