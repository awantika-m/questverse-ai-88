import { useState } from 'react';
import { useQuests } from '@/hooks/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, Map, Sword, Book } from 'lucide-react';

export default function QuestsPage() {
  const { data: quests, isLoading } = useQuests();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const filteredQuests = quests?.filter((quest) => {
    const matchesSearch = quest.title.toLowerCase().includes(search.toLowerCase()) ||
      quest.description.toLowerCase().includes(search.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && quest.type === filter;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Available Quests</h1>
          <p className="text-muted-foreground">
            Discover new adventures and challenges
          </p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search quests..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter quests" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Quests</SelectItem>
              <SelectItem value="solo">Solo</SelectItem>
              <SelectItem value="group">Group</SelectItem>
              <SelectItem value="boss">Boss</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredQuests?.map((quest) => (
              <motion.div key={quest.id} variants={item}>
                <Card
                  className="cursor-pointer transition-all hover:shadow-lg"
                  onClick={() => navigate(`/quests/${quest.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{quest.title}</CardTitle>
                      <Badge
                        variant={
                          quest.difficulty === 'easy'
                            ? 'default'
                            : quest.difficulty === 'medium'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {quest.difficulty}
                      </Badge>
                    </div>
                    <CardDescription>
                      {quest.type === 'solo' ? (
                        <Book className="mr-1 inline-block h-4 w-4" />
                      ) : quest.type === 'group' ? (
                        <Map className="mr-1 inline-block h-4 w-4" />
                      ) : (
                        <Sword className="mr-1 inline-block h-4 w-4" />
                      )}
                      {quest.type} Quest
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {quest.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm">
                        <span className="font-medium">Rewards: </span>
                        {quest.rewards.experience} XP
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </ScrollArea>
    </div>
  );
}