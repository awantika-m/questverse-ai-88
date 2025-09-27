import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, Users, Zap, Trophy, Sparkles, Play, ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import CampusMap from "@/components/CampusMap";
import QuestSystem from "@/components/QuestSystem";
import PlayerAvatar from "@/components/PlayerAvatar";
import heroImage from "@/assets/hero-campus.jpg";

const Index = () => {
  const [activeTab, setActiveTab] = useState("map");

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />
      
      <main className="container py-8 space-y-8">
        {/* Hero Section */}
        <Card className="relative overflow-hidden bg-gradient-card border-primary/20 shadow-glow">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="relative z-10">
            <CardHeader className="text-center space-y-4 py-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="h-8 w-8 text-primary animate-pulse-glow" />
                <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  CampusQuest Ultimate
                </h1>
                <Sparkles className="h-8 w-8 text-primary animate-pulse-glow" />
              </div>
              
              <p className="text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
                Transform your campus into an AI-powered metaverse where every location becomes 
                a portal to unique adventures, social connections, and verified achievements.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <Badge className="bg-gradient-primary text-primary-foreground px-4 py-2 text-sm animate-bounce-in">
                  🤖 AI-Generated Quests
                </Badge>
                <Badge className="bg-gradient-secondary text-accent-foreground px-4 py-2 text-sm animate-bounce-in" style={{ animationDelay: '0.1s' }}>
                  🌐 WebAR Experience
                </Badge>
                <Badge className="bg-accent/20 text-accent border-accent/40 px-4 py-2 text-sm animate-bounce-in" style={{ animationDelay: '0.2s' }}>
                  🏆 Blockchain Achievements  
                </Badge>
              </div>

              <div className="flex justify-center gap-4 mt-8">
                <Button 
                  size="lg" 
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-3"
                  onClick={() => setActiveTab("map")}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Adventure
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary/50 hover:bg-primary/10 text-lg px-8 py-3"
                  onClick={() => setActiveTab("quests")}
                >
                  View Quests
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </CardHeader>
          </div>
        </Card>

        {/* Live Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-card border-primary/20 shadow-card">
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-online" />
              <p className="text-2xl font-bold text-online">147</p>
              <p className="text-sm text-muted-foreground">Players Online</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-primary/20 shadow-card">
            <CardContent className="p-4 text-center">
              <Map className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold text-primary">12</p>
              <p className="text-sm text-muted-foreground">Active Locations</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-primary/20 shadow-card">
            <CardContent className="p-4 text-center">
              <Sparkles className="h-6 w-6 mx-auto mb-2 text-accent animate-pulse" />
              <p className="text-2xl font-bold text-accent">34</p>
              <p className="text-sm text-muted-foreground">AI Quests Today</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-primary/20 shadow-card">
            <CardContent className="p-4 text-center">
              <Trophy className="h-6 w-6 mx-auto mb-2 text-achievement-gold" />
              <p className="text-2xl font-bold text-achievement-gold">89</p>
              <p className="text-sm text-muted-foreground">Achievements Unlocked</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-lg">
            <TabsTrigger 
              value="map" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:shadow-glow"
            >
              <Map className="h-4 w-4" />
              Campus Map
            </TabsTrigger>
            <TabsTrigger 
              value="quests"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:shadow-glow"
            >
              <Sparkles className="h-4 w-4" />
              Quest Hub
            </TabsTrigger>
            <TabsTrigger 
              value="profile"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:shadow-glow"
            >
              <Zap className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="animate-fade-in">
            <CampusMap />
          </TabsContent>

          <TabsContent value="quests" className="animate-fade-in">
            <QuestSystem />
          </TabsContent>

          <TabsContent value="profile" className="animate-fade-in">
            <PlayerAvatar />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
