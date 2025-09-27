import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AvatarPart {
  id: string;
  name: string;
  type: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  owned: boolean;
  preview: string;
}

const SAMPLE_PARTS: AvatarPart[] = [
  {
    id: '1',
    name: 'Scholar\'s Hat',
    type: 'headwear',
    rarity: 'rare',
    owned: true,
    preview: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'Lab Coat',
    type: 'outfit',
    rarity: 'epic',
    owned: true,
    preview: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'Math Book',
    type: 'accessory',
    rarity: 'common',
    owned: true,
    preview: '/placeholder.svg'
  }
];

const SAMPLE_EMOTIONS = [
  'happy', 'thinking', 'excited', 'confused', 'proud', 'focused'
];

export default function AvatarPage() {
  const [activeTab, setActiveTab] = useState('customize');
  const { toast } = useToast();
  const [currentEmotion, setCurrentEmotion] = useState('happy');
  
  // Avatar customization states
  const [selectedParts, setSelectedParts] = useState({
    headwear: '1',
    outfit: '2',
    accessory: '3'
  });

  const [avatarSettings, setAvatarSettings] = useState({
    skin: 50,
    hair: 50,
    height: 50
  });

  const handleSettingChange = (setting: keyof typeof avatarSettings, value: number) => {
    setAvatarSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handlePartSelect = (type: keyof typeof selectedParts, partId: string) => {
    setSelectedParts(prev => ({
      ...prev,
      [type]: partId
    }));
  };

  const handleSave = () => {
    toast({
      title: 'Avatar Updated',
      description: 'Your changes have been saved successfully'
    });
  };

  const getRarityColor = (rarity: AvatarPart['rarity']) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-500';
      case 'epic': return 'text-purple-500';
      case 'rare': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Avatar Customization</h1>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Preview */}
        <Card className="p-6 lg:col-span-1">
          <div className="aspect-square bg-secondary rounded-lg mb-4 flex items-center justify-center">
            {/* Placeholder for 3D avatar preview */}
            <div className="text-center p-4">
              <img
                src="/placeholder.svg"
                alt="Avatar Preview"
                className="w-full h-full object-cover rounded-lg"
              />
              <p className="mt-2 text-sm text-muted-foreground">Current Emotion: {currentEmotion}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Emotions</h3>
            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_EMOTIONS.map(emotion => (
                <Button
                  key={emotion}
                  variant={currentEmotion === emotion ? 'default' : 'outline'}
                  className="w-full capitalize"
                  onClick={() => setCurrentEmotion(emotion)}
                >
                  {emotion}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Customization Options */}
        <Card className="p-6 lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="customize">Customize</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="shop">Shop</TabsTrigger>
            </TabsList>

            <TabsContent value="customize">
              <div className="space-y-6">
                {/* Basic Settings */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Skin Tone</label>
                    <Slider
                      value={[avatarSettings.skin]}
                      onValueChange={([value]) => handleSettingChange('skin', value)}
                      max={100}
                      step={1}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Hair Color</label>
                    <Slider
                      value={[avatarSettings.hair]}
                      onValueChange={([value]) => handleSettingChange('hair', value)}
                      max={100}
                      step={1}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Height</label>
                    <Slider
                      value={[avatarSettings.height]}
                      onValueChange={([value]) => handleSettingChange('height', value)}
                      max={100}
                      step={1}
                    />
                  </div>
                </div>

                {/* Equipment Slots */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Equipment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(selectedParts).map(([type, partId]) => {
                      const part = SAMPLE_PARTS.find(p => p.id === partId);
                      return (
                        <Card key={type} className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-secondary rounded">
                              <img src={part?.preview} alt={part?.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h4 className="font-medium capitalize">{type}</h4>
                              <p className="text-sm text-muted-foreground">{part?.name}</p>
                              <p className={`text-xs ${getRarityColor(part?.rarity || 'common')}`}>
                                {part?.rarity}
                              </p>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="inventory">
              <ScrollArea className="h-[500px] pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SAMPLE_PARTS.map(part => (
                    <Card key={part.id} className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-secondary rounded">
                          <img src={part.preview} alt={part.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{part.name}</h4>
                          <p className="text-sm text-muted-foreground capitalize">{part.type}</p>
                          <p className={`text-xs ${getRarityColor(part.rarity)}`}>
                            {part.rarity}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePartSelect(part.type as keyof typeof selectedParts, part.id)}
                        >
                          Equip
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="shop">
              <div className="text-center py-8">
                <h3 className="text-xl font-semibold mb-2">Avatar Shop</h3>
                <p className="text-muted-foreground">Coming soon! Check back later for awesome avatar items.</p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}