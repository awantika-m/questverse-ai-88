import { useUser, useQuests, useAchievements } from '@/hooks/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Trophy,
  Map,
  Sword,
  Star,
  ArrowRight,
  ScrollText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { data: user } = useUser();
  const { data: quests } = useQuests();
  const { data: achievements } = useAchievements();
  const navigate = useNavigate();

  // Calculate experience progress to next level
  const calculateNextLevelExp = (level: number) => Math.floor(100 * Math.pow(1.1, level - 1));
  const nextLevelExp = calculateNextLevelExp(user?.level || 1);
  const expProgress = ((user?.experience || 0) / nextLevelExp) * 100;

  const activeQuests = quests?.filter(quest => quest.progress?.status === 'in-progress') || [];
  const recentAchievements = achievements?.slice(0, 3) || [];

  return (
    <div className="space-y-8">
      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Welcome back, {user?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium">Level {user?.level}</p>
              <Progress value={expProgress} />
              <p className="text-xs text-gray-500">
                {user?.experience} / {nextLevelExp} XP to next level
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">{user?.stats.achievementsEarned}</p>
                <p className="text-xs text-gray-500">Achievements</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Sword className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">{user?.stats.battlesWon}</p>
                <p className="text-xs text-gray-500">Battles Won</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Quests */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Quests</CardTitle>
            <Button variant="ghost" onClick={() => navigate('/quests')}>
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activeQuests.length > 0 ? (
            <div className="space-y-4">
              {activeQuests.map((quest) => (
                <div
                  key={quest.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center space-x-4">
                    <ScrollText className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{quest.title}</p>
                      <p className="text-sm text-gray-500">
                        Progress: {quest.progress?.currentStep || 0}/{quest.progress?.totalSteps || 0}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/quests/${quest.id}`)}
                  >
                    Continue
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p>No active quests</p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => navigate('/quests')}
              >
                Find New Quests
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Achievements</CardTitle>
            <Button variant="ghost" onClick={() => navigate('/achievements')}>
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentAchievements.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {recentAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center space-x-4 rounded-lg border p-4"
                >
                  <Star
                    className={`h-8 w-8 ${
                      achievement.rarity === 'legendary'
                        ? 'text-yellow-500'
                        : achievement.rarity === 'epic'
                        ? 'text-purple-500'
                        : achievement.rarity === 'rare'
                        ? 'text-blue-500'
                        : 'text-gray-500'
                    }`}
                  />
                  <div>
                    <p className="font-medium">{achievement.title}</p>
                    <p className="text-sm capitalize text-gray-500">
                      {achievement.rarity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p>No achievements yet</p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => navigate('/quests')}
              >
                Start Your Journey
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}