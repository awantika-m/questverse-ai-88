import { useParams } from 'react-router-dom';
import { useQuest, useStartQuest, useCompleteQuest } from '@/hooks/api';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Book, Map, Sword, Trophy, Star, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function QuestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: quest, isLoading } = useQuest(id!);
  const startQuest = useStartQuest();
  const completeQuest = useCompleteQuest();
  const { toast } = useToast();

  const handleStartQuest = async () => {
    try {
      await startQuest.mutateAsync(id!);
      toast({
        title: 'Quest Started!',
        description: 'Good luck on your adventure!',
      });
    } catch (error) {
      toast({
        title: 'Failed to start quest',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  const handleCompleteQuest = async () => {
    try {
      await completeQuest.mutateAsync(id!);
      toast({
        title: 'Quest Completed!',
        description: 'You earned the rewards!',
      });
    } catch (error) {
      toast({
        title: 'Failed to complete quest',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quest) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{quest.title}</h1>
          <p className="text-muted-foreground">
            {quest.type === 'solo' ? (
              <Book className="mr-1 inline-block h-4 w-4" />
            ) : quest.type === 'group' ? (
              <Map className="mr-1 inline-block h-4 w-4" />
            ) : (
              <Sword className="mr-1 inline-block h-4 w-4" />
            )}
            {quest.type} Quest
          </p>
        </div>
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

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{quest.description}</p>
            {quest.progress && (
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span>
                    {quest.progress.currentStep}/{quest.progress.totalSteps} steps
                  </span>
                </div>
                <Progress
                  value={
                    (quest.progress.currentStep / quest.progress.totalSteps) * 100
                  }
                />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span>{quest.rewards.experience} XP</span>
                </div>
                {quest.rewards.achievements?.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-purple-500" />
                    <span>{achievement.title}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Level</span>
                  <span>{quest.requirements.level}</span>
                </div>
                {quest.requirements.quests?.length > 0 && (
                  <div className="pt-2">
                    <span className="text-sm font-medium">Required Quests:</span>
                    <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
                      {quest.requirements.quests.map((questId) => (
                        <li key={questId}>{questId}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {quest.progress?.status === 'not-started' ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full">Start Quest</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Start this quest?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will begin your journey on this quest. Make sure you meet
                    all requirements before starting.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleStartQuest}>
                    Start Quest
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : quest.progress?.status === 'in-progress' ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="w-full"
                  disabled={
                    quest.progress.currentStep !== quest.progress.totalSteps
                  }
                >
                  Complete Quest
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Complete this quest?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will receive all rewards upon completion. This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCompleteQuest}>
                    Complete Quest
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <div className="rounded-lg border border-green-500 bg-green-50 p-4 text-center text-green-700">
              Quest Completed! 🎉
            </div>
          )}

          {quest.progress?.status === 'in-progress' &&
            quest.progress.currentStep !== quest.progress.totalSteps && (
              <div className="rounded-lg border border-yellow-500 bg-yellow-50 p-4 text-center text-yellow-700">
                <AlertCircle className="mx-auto mb-2 h-6 w-6" />
                Complete all steps to finish the quest
              </div>
            )}
        </div>
      </div>
    </motion.div>
  );
}