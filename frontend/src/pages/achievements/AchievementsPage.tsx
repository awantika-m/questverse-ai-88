import { useState } from 'react';
import { useAchievements, useClaimAchievement } from '@/hooks/api';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Star, Trophy, Filter } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function AchievementsPage() {
  const { data: achievements, isLoading } = useAchievements();
  const claimAchievement = useClaimAchievement();
  const [filter, setFilter] = useState<string>('all');
  const { toast } = useToast();

  const filteredAchievements = achievements?.filter((achievement) => {
    if (filter === 'all') return true;
    return achievement.rarity === filter;
  });

  const handleClaim = async (achievementId: string) => {
    try {
      await claimAchievement.mutateAsync(achievementId);
      toast({
        title: 'Achievement Claimed!',
        description: 'Congratulations on your achievement!',
      });
    } catch (error) {
      toast({
        title: 'Failed to claim achievement',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  const getAchievementColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'text-yellow-500';
      case 'epic':
        return 'text-purple-500';
      case 'rare':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Achievements</h1>
          <p className="text-muted-foreground">
            Track your progress and claim rewards
          </p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by rarity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Rarities</SelectItem>
            <SelectItem value="common">Common</SelectItem>
            <SelectItem value="rare">Rare</SelectItem>
            <SelectItem value="epic">Epic</SelectItem>
            <SelectItem value="legendary">Legendary</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredAchievements?.map((achievement) => (
            <motion.div key={achievement.id} variants={item}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Star
                        className={`h-5 w-5 ${getAchievementColor(
                          achievement.rarity
                        )}`}
                      />
                      {achievement.title}
                    </CardTitle>
                    <Badge
                      variant={
                        achievement.rarity === 'legendary'
                          ? 'default'
                          : achievement.rarity === 'epic'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {achievement.rarity}
                    </Badge>
                  </div>
                  <CardDescription>{achievement.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>
                          {achievement.requirements.value} /{' '}
                          {achievement.requirements.value} {achievement.requirements.type}
                        </span>
                      </div>
                      <Progress
                        value={
                          (achievement.requirements.value /
                            achievement.requirements.value) *
                          100
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span>{achievement.rewards.experience} XP</span>
                        </div>
                        {achievement.rewards.items?.length > 0 && (
                          <span className="text-muted-foreground">
                            +{achievement.rewards.items.length} items
                          </span>
                        )}
                      </div>
                      <Button
                        className="w-full"
                        variant={
                          achievement.requirements.value >=
                          achievement.requirements.value
                            ? 'default'
                            : 'outline'
                        }
                        disabled={
                          achievement.requirements.value <
                            achievement.requirements.value ||
                          claimAchievement.isPending
                        }
                        onClick={() => handleClaim(achievement.id)}
                      >
                        {achievement.requirements.value >=
                        achievement.requirements.value
                          ? claimAchievement.isPending
                            ? 'Claiming...'
                            : 'Claim Reward'
                          : 'Keep Going!'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </ScrollArea>
    </div>
  );
}