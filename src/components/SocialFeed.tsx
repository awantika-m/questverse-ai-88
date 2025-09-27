import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Trophy, 
  Zap, 
  Users, 
  MapPin, 
  Clock,
  Star,
  Target
} from "lucide-react";
import { useState } from "react";
import avatarHero from "@/assets/avatar-hero.jpg";

interface SocialPost {
  id: string;
  author: {
    name: string;
    avatar?: string;
    level: number;
    guild: string;
  };
  type: "achievement" | "quest_complete" | "social" | "challenge";
  content: string;
  timestamp: string;
  location?: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  metadata?: {
    questName?: string;
    xpGained?: number;
    achievementRarity?: "common" | "rare" | "legendary";
    participants?: number;
  };
}

const socialPosts: SocialPost[] = [
  {
    id: "1",
    author: {
      name: "Sarah Johnson",
      avatar: avatarHero,
      level: 15,
      guild: "Knowledge Seekers"
    },
    type: "achievement",
    content: "Just unlocked the legendary 'Campus Dragon Slayer' achievement! That AR boss battle was EPIC! 🐉⚔️",
    timestamp: "2 minutes ago",
    location: "Innovation Chamber",
    likes: 42,
    comments: 8,
    isLiked: false,
    metadata: {
      achievementRarity: "legendary",
      xpGained: 500
    }
  },
  {
    id: "2", 
    author: {
      name: "Mike Chen",
      level: 13,
      guild: "Tech Innovators"
    },
    type: "quest_complete",
    content: "Completed the AI-generated 'Ancient Algorithm Mystery' quest with my team! The AI storytelling was mind-blowing 🤖✨",
    timestamp: "15 minutes ago",
    location: "Knowledge Nexus",
    likes: 28,
    comments: 5,
    isLiked: true,
    metadata: {
      questName: "Ancient Algorithm Mystery",
      xpGained: 150,
      participants: 4
    }
  },
  {
    id: "3",
    author: {
      name: "Emily Rodriguez", 
      level: 12,
      guild: "Social Connectors"
    },
    type: "social",
    content: "Made 8 new friends today during the Social Fusion Challenge! Love how CampusQuest brings people together 💫👥",
    timestamp: "1 hour ago",
    location: "Social Hub Central",
    likes: 35,
    comments: 12,
    isLiked: false,
    metadata: {
      participants: 8
    }
  },
  {
    id: "4",
    author: {
      name: "David Kim",
      level: 11,
      guild: "Innovation Squad"
    },
    type: "challenge",
    content: "Cross-campus guild battle starting in 10 minutes! Tech Innovators vs Knowledge Seekers - who will dominate? 🏆⚡",
    timestamp: "3 hours ago",
    likes: 67,
    comments: 23,
    isLiked: true,
    metadata: {
      participants: 40
    }
  }
];

const SocialFeed = () => {
  const [posts, setPosts] = useState(socialPosts);

  const toggleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const getPostIcon = (type: SocialPost['type']) => {
    switch (type) {
      case 'achievement': return <Trophy className="h-5 w-5 text-achievement-gold" />;
      case 'quest_complete': return <Target className="h-5 w-5 text-primary" />;
      case 'social': return <Users className="h-5 w-5 text-accent" />;
      case 'challenge': return <Zap className="h-5 w-5 text-warning" />;
    }
  };

  const getTypeColor = (type: SocialPost['type']) => {
    switch (type) {
      case 'achievement': return 'bg-achievement-gold/20 text-achievement-gold';
      case 'quest_complete': return 'bg-primary/20 text-primary';
      case 'social': return 'bg-accent/20 text-accent'; 
      case 'challenge': return 'bg-warning/20 text-warning';
    }
  };

  const getRarityGlow = (rarity?: string) => {
    if (rarity === 'legendary') return 'animate-pulse-glow shadow-glow';
    if (rarity === 'rare') return 'shadow-accent-glow';
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Social Feed Header */}
      <Card className="bg-gradient-card border-primary/20 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Campus Social Feed
          </CardTitle>
          <CardDescription>
            See what your fellow adventurers are achieving across campus
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Live Activity Banner */}
      <Card className="bg-gradient-primary border-primary/20 shadow-glow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-primary-foreground rounded-full animate-pulse"></div>
              <span className="text-primary-foreground font-medium">
                Live Activity: 147 students currently on quests
              </span>
            </div>
            <Badge className="bg-primary-foreground/20 text-primary-foreground">
              Real-time
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Social Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card 
            key={post.id} 
            className={`bg-gradient-card border-primary/20 shadow-card hover:shadow-elevation transition-all duration-300 ${
              post.metadata?.achievementRarity ? getRarityGlow(post.metadata.achievementRarity) : ''
            }`}
          >
            <CardContent className="p-6">
              {/* Post Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/30">
                    <AvatarImage src={post.author.avatar} alt={post.author.name} />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                      {post.author.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{post.author.name}</h4>
                      <Badge className="bg-primary/20 text-primary text-xs">
                        Lv.{post.author.level}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{post.author.guild}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {getPostIcon(post.type)}
                  <Badge className={`text-xs ${getTypeColor(post.type)}`}>
                    {post.type.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-foreground leading-relaxed">{post.content}</p>
                
                {/* Quest/Achievement Metadata */}
                {post.metadata && (
                  <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-4 text-sm">
                      {post.metadata.questName && (
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3 text-primary" />
                          <span>{post.metadata.questName}</span>
                        </div>
                      )}
                      {post.metadata.xpGained && (
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-xp-primary" />
                          <span className="text-xp-primary font-medium">+{post.metadata.xpGained} XP</span>
                        </div>
                      )}
                      {post.metadata.participants && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-accent" />
                          <span>{post.metadata.participants} participants</span>
                        </div>
                      )}
                      {post.metadata.achievementRarity && (
                        <Badge className={`text-xs ${
                          post.metadata.achievementRarity === 'legendary' ? 'bg-achievement-gold/20 text-achievement-gold' :
                          post.metadata.achievementRarity === 'rare' ? 'bg-secondary/20 text-secondary' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {post.metadata.achievementRarity}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Post Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex items-center gap-4">
                  {post.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{post.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{post.timestamp}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`hover:bg-destructive/10 ${post.isLiked ? 'text-destructive' : 'text-muted-foreground'}`}
                    onClick={() => toggleLike(post.id)}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                    {post.likes}
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-primary/10 hover:text-primary">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {post.comments}
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-accent/10 hover:text-accent">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <Card className="bg-gradient-card border-primary/20 shadow-card">
        <CardContent className="p-4 text-center">
          <Button variant="outline" className="w-full hover:bg-primary/10">
            Load More Activity
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialFeed;