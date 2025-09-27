import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Zap, Clock, Star, Target } from "lucide-react";
import { useState } from "react";

interface Location {
  id: string;
  name: string;
  description: string;
  questsAvailable: number;
  playersActive: number;
  difficulty: "Easy" | "Medium" | "Hard";
  rewards: number;
  type: "academic" | "social" | "challenge";
  position: { x: number; y: number };
  unlocked: boolean;
}

const locations: Location[] = [
  {
    id: "library",
    name: "Knowledge Nexus",
    description: "Ancient wisdom meets AI-powered learning",
    questsAvailable: 8,
    playersActive: 24,
    difficulty: "Medium",
    rewards: 150,
    type: "academic",
    position: { x: 25, y: 35 },
    unlocked: true
  },
  {
    id: "cafeteria",
    name: "Social Hub Central",
    description: "Where connections spark and stories unfold",
    questsAvailable: 5,
    playersActive: 42,
    difficulty: "Easy",
    rewards: 100,
    type: "social", 
    position: { x: 60, y: 25 },
    unlocked: true
  },
  {
    id: "lab",
    name: "Innovation Chamber",
    description: "Push the boundaries of possibility",
    questsAvailable: 12,
    playersActive: 18,
    difficulty: "Hard",
    rewards: 300,
    type: "challenge",
    position: { x: 40, y: 60 },
    unlocked: true
  },
  {
    id: "gym", 
    name: "Fitness Arena",
    description: "Physical challenges and team competitions",
    questsAvailable: 6,
    playersActive: 31,
    difficulty: "Medium", 
    rewards: 200,
    type: "challenge",
    position: { x: 75, y: 50 },
    unlocked: false
  },
  {
    id: "dorm",
    name: "Community Quarters",
    description: "Guild headquarters and social events",
    questsAvailable: 4,
    playersActive: 67,
    difficulty: "Easy",
    rewards: 75,
    type: "social",
    position: { x: 20, y: 70 },
    unlocked: true
  }
];

const CampusMap = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(locations[0]);

  const getDifficultyColor = (difficulty: Location['difficulty']) => {
    switch (difficulty) {
      case 'Easy': return 'bg-success text-background';
      case 'Medium': return 'bg-warning text-background';
      case 'Hard': return 'bg-destructive text-destructive-foreground';
    }
  };

  const getTypeIcon = (type: Location['type']) => {
    switch (type) {
      case 'academic': return <Star className="h-4 w-4" />;
      case 'social': return <Users className="h-4 w-4" />;
      case 'challenge': return <Target className="h-4 w-4" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Interactive Map */}
      <Card className="lg:col-span-2 bg-gradient-card border-primary/20 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Campus Exploration Map
          </CardTitle>
          <CardDescription>
            Click on locations to discover AI-powered quests and adventures
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative bg-muted/30 rounded-lg p-4 h-96 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg"></div>
            
            {/* Location markers */}
            {locations.map((location) => (
              <button
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                disabled={!location.unlocked}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 group ${
                  location.unlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                }`}
                style={{ left: `${location.position.x}%`, top: `${location.position.y}%` }}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  location.unlocked 
                    ? 'bg-gradient-primary shadow-glow hover:scale-110 animate-pulse-glow' 
                    : 'bg-muted border-2 border-muted-foreground/30'
                } ${selectedLocation?.id === location.id ? 'scale-125' : ''}`}>
                  {getTypeIcon(location.type)}
                </div>
                
                {location.unlocked && (
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-bold animate-bounce-in">
                    {location.questsAvailable}
                  </div>
                )}
                
                {location.playersActive > 0 && location.unlocked && (
                  <div className="absolute -bottom-1 -right-1 flex items-center gap-1 bg-background/90 rounded-full px-2 py-0.5 text-xs">
                    <div className="w-2 h-2 bg-online rounded-full animate-pulse"></div>
                    {location.playersActive}
                  </div>
                )}
              </button>
            ))}

            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Details */}
      <Card className="bg-gradient-card border-primary/20 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Location Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedLocation ? (
            <>
              <div>
                <h3 className="font-bold text-xl text-primary mb-2">{selectedLocation.name}</h3>
                <p className="text-muted-foreground">{selectedLocation.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-accent" />
                    <span className="text-sm">Quests Available</span>
                  </div>
                  <p className="text-2xl font-bold text-accent">{selectedLocation.questsAvailable}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-online" />
                    <span className="text-sm">Players Active</span>
                  </div>
                  <p className="text-2xl font-bold text-online">{selectedLocation.playersActive}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge className={getDifficultyColor(selectedLocation.difficulty)}>
                  {selectedLocation.difficulty}
                </Badge>
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-xp-primary" />
                  <span className="text-xp-primary font-bold">{selectedLocation.rewards} XP</span>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                disabled={!selectedLocation.unlocked}
              >
                <Clock className="h-4 w-4 mr-2" />
                {selectedLocation.unlocked ? 'Start Quest' : 'Location Locked'}
              </Button>

              {!selectedLocation.unlocked && (
                <p className="text-sm text-muted-foreground text-center">
                  Complete prerequisite quests to unlock
                </p>
              )}
            </>
          ) : (
            <div className="text-center text-muted-foreground">
              Select a location on the map to view details
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CampusMap;