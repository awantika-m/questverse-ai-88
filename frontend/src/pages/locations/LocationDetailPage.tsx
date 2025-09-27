import { useParams } from 'react-router-dom';
import { useLocation } from '@/hooks/api';
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
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, GamepadIcon, Puzzle, Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function LocationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: location, isLoading } = useLocation(id!);
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      await navigator.share({
        title: location?.name,
        text: location?.description,
        url: window.location.href,
      });
    } catch (err) {
      toast({
        title: 'Could not share location',
        description: 'Your browser might not support sharing',
        variant: 'destructive',
      });
    }
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'model':
        return <MapPin className="h-6 w-6 text-blue-500" />;
      case 'game':
        return <GamepadIcon className="h-6 w-6 text-green-500" />;
      case 'puzzle':
        return <Puzzle className="h-6 w-6 text-purple-500" />;
      default:
        return <MapPin className="h-6 w-6" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[400px] w-full" />
            </CardContent>
          </Card>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!location) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getLocationIcon(location.arExperience?.type || '')}
          <div>
            <h1 className="text-3xl font-bold">{location.name}</h1>
            <p className="text-muted-foreground">
              <MapPin className="mr-1 inline-block h-4 w-4" />
              {location.coordinates.latitude.toFixed(6)},{' '}
              {location.coordinates.longitude.toFixed(6)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge>
            {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
          </Badge>
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>AR Experience</CardTitle>
            <CardDescription>
              {location.arExperience?.type.charAt(0).toUpperCase() +
                location.arExperience?.type.slice(1)}{' '}
              Experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
              {/* Placeholder for AR experience viewer */}
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-muted-foreground">
                  AR Experience Viewer
                  <br />
                  (Implementation required)
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Button className="w-full">Launch AR Experience</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{location.description}</p>
            </CardContent>
          </Card>

          {location.type === 'quest' && (
            <Card>
              <CardHeader>
                <CardTitle>Related Quest</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Quest Details
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Getting There</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                {/* Placeholder for location map */}
                <div className="flex h-full items-center justify-center">
                  <p className="text-center text-muted-foreground">
                    Location Map
                    <br />
                    (Implementation required)
                  </p>
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full">
                Open in Maps
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}