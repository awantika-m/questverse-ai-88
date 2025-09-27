import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  Users, 
  TrendingUp, 
  Sparkles, 
  Play, 
  Plus,
  BarChart3,
  Settings,
  Target,
  Clock,
  CheckCircle
} from "lucide-react";

const FacultyDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Faculty Header */}
      <Card className="bg-gradient-card border-primary/20 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <GraduationCap className="h-6 w-6 text-primary" />
            Faculty Quest Designer Studio
          </CardTitle>
          <CardDescription className="text-lg">
            Create engaging AI-powered campus experiences and track student learning outcomes
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1 rounded-lg">
          <TabsTrigger 
            value="overview"
            className="data-[state=active]:bg-gradient-primary data-[state=active]:shadow-glow"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="designer"
            className="data-[state=active]:bg-gradient-primary data-[state=active]:shadow-glow"
          >
            Quest Designer
          </TabsTrigger>
          <TabsTrigger 
            value="analytics"
            className="data-[state=active]:bg-gradient-primary data-[state=active]:shadow-glow"
          >
            Analytics
          </TabsTrigger>
          <TabsTrigger 
            value="students"
            className="data-[state=active]:bg-gradient-primary data-[state=active]:shadow-glow"
          >
            Student Progress
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 animate-fade-in">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-card border-primary/20 shadow-card">
              <CardContent className="p-4 text-center">
                <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-primary">12</p>
                <p className="text-sm text-muted-foreground">Active Quests</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-primary/20 shadow-card">
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-online" />
                <p className="text-2xl font-bold text-online">247</p>
                <p className="text-sm text-muted-foreground">Students Engaged</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-primary/20 shadow-card">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-success" />
                <p className="text-2xl font-bold text-success">94%</p>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-primary/20 shadow-card">
              <CardContent className="p-4 text-center">
                <Sparkles className="h-6 w-6 mx-auto mb-2 text-accent animate-pulse" />
                <p className="text-2xl font-bold text-accent">8</p>
                <p className="text-sm text-muted-foreground">AI-Generated</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-gradient-card border-primary/20 shadow-card">
            <CardHeader>
              <CardTitle>Recent Quest Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Library Research Challenge", students: 34, completion: 87, type: "AI-Generated" },
                  { name: "Campus History Tour", students: 28, completion: 92, type: "Custom" },
                  { name: "Social Innovation Lab", students: 19, completion: 76, type: "AI-Generated" }
                ].map((quest, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                        <Target className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium">{quest.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-3 w-3" />
                          {quest.students} students
                          {quest.type === "AI-Generated" && (
                            <Badge className="bg-accent/20 text-accent text-xs">AI</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-success">{quest.completion}%</p>
                      <p className="text-xs text-muted-foreground">completion</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quest Designer Tab */}
        <TabsContent value="designer" className="space-y-6 animate-fade-in">
          <Card className="bg-gradient-secondary border-accent/20 shadow-accent-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent-foreground">
                <Sparkles className="h-5 w-5 animate-pulse" />
                AI Quest Designer Assistant
              </CardTitle>
              <CardDescription className="text-accent-foreground/80">
                Describe your learning objectives and let AI generate engaging campus experiences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  className="h-20 bg-accent-foreground/20 border-accent-foreground/30 text-accent-foreground hover:bg-accent-foreground/30 flex flex-col gap-2"
                  variant="outline"
                >
                  <Sparkles className="h-6 w-6" />
                  Generate New Quest
                </Button>
                <Button 
                  className="h-20 bg-accent-foreground/20 border-accent-foreground/30 text-accent-foreground hover:bg-accent-foreground/30 flex flex-col gap-2"
                  variant="outline"
                >
                  <Settings className="h-6 w-6" />
                  Customize Template
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-card border-primary/20 shadow-card">
              <CardHeader>
                <CardTitle>Quick Start Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Campus Scavenger Hunt", difficulty: "Easy", duration: "30 min" },
                  { name: "Historical Discovery Tour", difficulty: "Medium", duration: "45 min" },
                  { name: "Innovation Challenge", difficulty: "Hard", duration: "60 min" },
                  { name: "Social Connection Game", difficulty: "Easy", duration: "20 min" }
                ].map((template, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer">
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{template.difficulty}</Badge>
                        <Badge variant="outline" className="text-xs">{template.duration}</Badge>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-primary/20 shadow-card">
              <CardHeader>
                <CardTitle>Your Recent Quests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Library Research Skills", status: "Active", participants: 45 },
                  { name: "Campus Sustainability", status: "Completed", participants: 32 },
                  { name: "Tech Innovation Lab", status: "Draft", participants: 0 },
                  { name: "Leadership Challenge", status: "Active", participants: 28 }
                ].map((quest, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <h4 className="font-medium">{quest.name}</h4>
                      <p className="text-sm text-muted-foreground">{quest.participants} participants</p>
                    </div>
                    <Badge className={
                      quest.status === "Active" ? "bg-success/20 text-success" :
                      quest.status === "Completed" ? "bg-primary/20 text-primary" :
                      "bg-muted text-muted-foreground"
                    }>
                      {quest.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-card border-primary/20 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Engagement Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Daily Active Students</span>
                    <span className="font-bold text-primary">184</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Quest Completion Rate</span>
                    <span className="font-bold text-success">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Student Satisfaction</span>
                    <span className="font-bold text-accent">4.8/5</span>
                  </div>
                  <Progress value={96} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-primary/20 shadow-card">
              <CardHeader>
                <CardTitle>Learning Outcomes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { skill: "Problem Solving", improvement: "+32%" },
                    { skill: "Collaboration", improvement: "+28%" },
                    { skill: "Digital Literacy", improvement: "+45%" },
                    { skill: "Critical Thinking", improvement: "+24%" }
                  ].map((outcome, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <span className="font-medium">{outcome.skill}</span>
                      <Badge className="bg-success/20 text-success">
                        {outcome.improvement}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Student Progress Tab */}
        <TabsContent value="students" className="space-y-6 animate-fade-in">
          <Card className="bg-gradient-card border-primary/20 shadow-card">
            <CardHeader>
              <CardTitle>Top Performing Students</CardTitle>
              <CardDescription>
                Students who have shown exceptional engagement and achievement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Sarah Johnson", level: 15, quests: 28, achievements: 12 },
                  { name: "Mike Chen", level: 13, quests: 24, achievements: 9 },
                  { name: "Emily Rodriguez", level: 12, quests: 22, achievements: 11 },
                  { name: "David Kim", level: 11, quests: 20, achievements: 8 }
                ].map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-medium">{student.name}</h4>
                        <p className="text-sm text-muted-foreground">Level {student.level}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{student.quests} quests</p>
                      <p className="text-xs text-muted-foreground">{student.achievements} achievements</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FacultyDashboard;