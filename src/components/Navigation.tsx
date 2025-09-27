import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Settings, Users, Map, Trophy, Sparkles } from "lucide-react";
import avatarHero from "@/assets/avatar-hero.jpg";

const Navigation = () => {
  return (
    <nav className="border-b border-border bg-gradient-card backdrop-blur-xl sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary animate-pulse-glow" />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              CampusQuest Ultimate
            </span>
          </div>
          
          <div className="flex items-center space-x-2 ml-8">
            <Button variant="ghost" size="sm" className="hover:bg-primary/10">
              <Map className="h-4 w-4 mr-2" />
              Campus
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-primary/10">
              <Trophy className="h-4 w-4 mr-2" />
              Quests
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-primary/10">
              <Users className="h-4 w-4 mr-2" />
              Guild
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-muted/50 rounded-full px-3 py-1">
            <div className="w-2 h-2 bg-xp-primary rounded-full animate-pulse"></div>
            <span className="text-sm text-xp-primary font-medium">2,450 XP</span>
          </div>
          
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-accent text-accent-foreground text-xs">
              3
            </Badge>
          </Button>
          
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          
          <Avatar className="h-8 w-8 ring-2 ring-primary/50">
            <AvatarImage src={avatarHero} alt="Player Avatar" />
            <AvatarFallback>QU</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;