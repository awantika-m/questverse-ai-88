import { useState } from 'react';
import { useLocations } from '@/hooks/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Search, GamepadIcon, Puzzle } from 'lucide-react';

export default function LocationsPage() {
  const { data: locations, isLoading } = useLocations();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredLocations = locations?.filter((location) =>
    location.name.toLowerCase().includes(search.toLowerCase())
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'model':
        return <MapPin className="h-5 w-5 text-blue-500" />;
      case 'game':
        return <GamepadIcon className="h-5 w-5 text-green-500" />;
      case 'puzzle':
        return <Puzzle className="h-5 w-5 text-purple-500" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">AR Locations</h1>
          <p className="text-muted-foreground">
            Discover interactive AR experiences around campus
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search locations..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredLocations?.map((location) => (
            <motion.div key={location.id} variants={item}>
              <Card
                className="cursor-pointer transition-all hover:shadow-lg"
                onClick={() => navigate(`/locations/${location.id}`)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {getLocationIcon(location.arExperience?.type || '')}
                      {location.name}
                    </CardTitle>
                    <Badge>
                      {location.type.charAt(0).toUpperCase() +
                        location.type.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {location.coordinates.latitude.toFixed(6)},{' '}
                      {location.coordinates.longitude.toFixed(6)}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                    {location.description}
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Experience
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </ScrollArea>
    </div>
  );
}