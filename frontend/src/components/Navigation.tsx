import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Settings, Users, Map, Trophy, Sparkles, GraduationCap, Swords } from "lucide-react";
import avatarHero from "@/assets/avatar-hero.jpg";
import { NotificationBell } from "./NotificationBell";
import { ChatSystem } from "./ChatSystem";

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
            <Link to="/locations">
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                <Map className="h-4 w-4 mr-2" />
                Campus
              </Button>
            </Link>
            <Link to="/quests">
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                <Trophy className="h-4 w-4 mr-2" />
                Quests
              </Button>
            </Link>
            <Link to="/guilds">
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                <Users className="h-4 w-4 mr-2" />
                Guild
              </Button>
            </Link>
            <Link to="/arena">
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                <Swords className="h-4 w-4 mr-2" />
                Arena
              </Button>
            </Link>
            <Link to="/faculty-studio">
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                <GraduationCap className="h-4 w-4 mr-2" />
                Studio
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-muted/50 rounded-full px-3 py-1">
            <div className="w-2 h-2 bg-xp-primary rounded-full animate-pulse"></div>
            <span className="text-sm text-xp-primary font-medium">2,450 XP</span>
          </div>
          
          <NotificationBell />
          <ChatSystem />
          
          <Link to="/avatar">
            <Avatar className="h-8 w-8 ring-2 ring-primary/50 hover:ring-primary transition-colors">
              <AvatarImage src={avatarHero} alt="Player Avatar" />
              <AvatarFallback>QU</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;