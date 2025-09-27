import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChartContainer } from '@/components/ui/chart';
import { Line, Bar, Area } from 'recharts';
import QuestDesigner from '@/components/QuestDesigner';
import { useToast } from '@/hooks/use-toast';

export default function FacultyStudioPage() {
  const [activeTab, setActiveTab] = useState('designer');
  const { toast } = useToast();

  const analyticsData = [
    { week: 'Week 1', engagement: 65, completion: 45 },
    { week: 'Week 2', engagement: 78, completion: 58 },
    { week: 'Week 3', engagement: 82, completion: 72 },
    { week: 'Week 4', engagement: 90, completion: 85 },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Faculty Studio</h1>
        <Button onClick={() => toast({ title: 'Changes saved successfully' })}>
          Save Changes
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="designer">Quest Designer</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="content">Content Management</TabsTrigger>
        </TabsList>

        <TabsContent value="designer">
          <QuestDesigner />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Student Engagement</h3>
              <ChartContainer config={{ engagement: { color: "#4338ca" } }} className="h-[300px]">
                <Line 
                  data={analyticsData}
                  dataKey="engagement" 
                  name="Engagement"
                  stroke="#4338ca"
                  dot={false}
                />
              </ChartContainer>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Quest Completion Rates</h3>
              <ChartContainer config={{ completion: { color: "#0ea5e9" } }} className="h-[300px]">
                <Bar 
                  data={analyticsData}
                  dataKey="completion"
                  name="Completion"
                  fill="#0ea5e9"
                />
              </ChartContainer>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Content Library</h3>
            <div className="space-y-4">
              <Input placeholder="Search content..." />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Content items */}
                <Card className="p-4">
                  <h4 className="font-medium">Basic Mathematics</h4>
                  <p className="text-sm text-gray-500">10 quests • 5 locations</p>
                </Card>
                <Card className="p-4">
                  <h4 className="font-medium">Advanced Physics</h4>
                  <p className="text-sm text-gray-500">8 quests • 3 locations</p>
                </Card>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}