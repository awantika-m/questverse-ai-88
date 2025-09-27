import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface QuestForm {
  title: string;
  description: string;
  difficulty: string;
  type: string;
  location: string;
  rewards: string;
}

export default function QuestDesigner() {
  const [quest, setQuest] = useState<QuestForm>({
    title: '',
    description: '',
    difficulty: 'medium',
    type: 'exploration',
    location: '',
    rewards: ''
  });

  const handleChange = (field: keyof QuestForm, value: string) => {
    setQuest(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit quest data to backend
    console.log('Quest data:', quest);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Quest Title</label>
          <Input
            value={quest.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Enter quest title..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={quest.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe the quest..."
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Difficulty</label>
            <Select
              value={quest.difficulty}
              onValueChange={(value) => handleChange('difficulty', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Quest Type</label>
            <Select
              value={quest.type}
              onValueChange={(value) => handleChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exploration">Exploration</SelectItem>
                <SelectItem value="puzzle">Puzzle</SelectItem>
                <SelectItem value="challenge">Challenge</SelectItem>
                <SelectItem value="collection">Collection</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <Input
            value={quest.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="Quest location..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Rewards</label>
          <Input
            value={quest.rewards}
            onChange={(e) => handleChange('rewards', e.target.value)}
            placeholder="Quest rewards..."
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit">Create Quest</Button>
        </div>
      </form>
    </Card>
  );
}