import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, User, Trophy, Zap, Star, Users, Crown, Palette } from "lucide-react";
import avatarHero from "@/assets/avatar-hero.jpg";

interface PlayerStats {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  totalQuests: number;
  completionRate: number;
  rank: string;
  guild: string;
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  rarity: "common" | "rare" | "legendary";
  earnedDate: string;
}

const playerStats: PlayerStats = {
  level: 12,
  currentXP: 2450,
  nextLevelXP: 3000,
  totalQuests: 47,
  completionRate: 89,
  rank: "Campus Explorer",
  guild: "Tech Innovators",
  achievements: [
    {
      id: "first-quest",
      name: "First Steps",
      description: "Complete your first campus quest",
      rarity: "common",
      earnedDate: "2024-01-15"
    },
    {
      id: "social-butterfly",
      name: "Social Butterfly", 
      description: "Connect with 25 fellow students",
      rarity: "rare",
      earnedDate: "2024-02-20"
    },
    {
      id: "ai-whisperer",
      name: "AI Whisperer",
      description: "Successfully collaborate with AI on 10 quests",
      rarity: "legendary", 
      earnedDate: "2024-03-01"
    }
  ]
};

const PlayerAvatar = () => {
  const xpProgress = (playerStats.currentXP / playerStats.nextLevelXP) * 100;

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-muted text-muted-foreground';
      case 'rare': return 'bg-secondary text-secondary-foreground';
      case 'legendary': return 'bg-achievement-gold text-background';
    }
  };

  const getRarityGlow = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return '';
      case 'rare': return 'shadow-accent-glow';
      case 'legendary': return 'shadow-glow animate-pulse-glow';
    }
  };

  return (
    <div className="space-y-6">
      {/* Avatar & Basic Info */}
      <Card className="bg-gradient-card border-primary/20 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Player Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-4 ring-primary/50 shadow-glow">
                <AvatarImage src={avatarHero} alt="Player Avatar" />
                <AvatarFallback className="text-2xl font-bold">QU</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-glow">
                {playerStats.level}
              </div>
            </div>
            
            <div className="flex-1 space-y-2">
              <div>
                <h3 className="text-xl font-bold">Alex Chen</h3>
                <p className="text-muted-foreground">{playerStats.rank}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-accent" />
                <span className="text-sm">{playerStats.guild}</span>
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                  Guild Member
                </Badge>
              </div>
            </div>

            <Button variant="outline" className="hover:bg-primary/10">
              <Palette className="h-4 w-4 mr-2" />
              Customize
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* XP & Progress */}
      <Card className="bg-gradient-card border-primary/20 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-xp-primary" />
            Experience & Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Level {playerStats.level}</span>
              <span className="text-sm text-muted-foreground">
                {playerStats.currentXP} / {playerStats.nextLevelXP} XP
              </span>
            </div>
            <Progress value={xpProgress} className="h-3 bg-muted">
              <div className="h-full bg-gradient-to-r from-xp-secondary to-xp-primary rounded-full transition-all duration-500" />
            </Progress>
            <p className="text-xs text-center text-muted-foreground">
              {playerStats.nextLevelXP - playerStats.currentXP} XP to next level
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-primary">{playerStats.totalQuests}</p>
              <p className="text-sm text-muted-foreground">Quests Complete</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-success">{playerStats.completionRate}%</p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Showcase */}
      <Card className="bg-gradient-card border-primary/20 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-achievement-gold" />
            Recent Achievements
          </CardTitle>
          <CardDescription>
            Unlock rare badges and NFT collectibles through your campus adventures
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {playerStats.achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-300 hover:scale-105 ${getRarityGlow(achievement.rarity)}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  achievement.rarity === 'legendary' ? 'bg-gradient-primary' : 
                  achievement.rarity === 'rare' ? 'bg-secondary' : 'bg-muted'
                }`}>
                  {achievement.rarity === 'legendary' ? (
                    <Crown className="h-6 w-6 text-primary-foreground" />
                  ) : achievement.rarity === 'rare' ? (
                    <Star className="h-6 w-6 text-secondary-foreground" />
                  ) : (
                    <Trophy className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{achievement.name}</h4>
                    <Badge className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                      {achievement.rarity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Earned {new Date(achievement.earnedDate).toLocaleDateString()}
                  </p>
                </div>

                {achievement.rarity === 'legendary' && (
                  <Sparkles className="h-5 w-5 text-achievement-gold animate-pulse" />
                )}
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full mt-4 hover:bg-primary/10">
            View All Achievements ({playerStats.achievements.length + 15} total)
          </Button>
        </CardContent>
      </Card>

      {/* AI Personality Settings */}
      <Card className="bg-gradient-secondary border-accent/20 shadow-accent-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent-foreground">
            <Sparkles className="h-5 w-5 animate-pulse" />
            AI Avatar Personality
          </CardTitle>
          <CardDescription className="text-accent-foreground/80">
            Your AI companion learns and adapts to enhance your campus experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-accent-foreground">Personality Type:</span>
            <Badge className="bg-accent-foreground/20 text-accent-foreground">
              Adventurous Explorer
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-accent-foreground">Voice Model:</span>
            <Badge className="bg-accent-foreground/20 text-accent-foreground">
              Friendly Mentor
            </Badge>
          </div>
          <Button variant="secondary" className="w-full bg-accent-foreground text-accent hover:bg-accent-foreground/90">
            Customize AI Companion
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerAvatar;