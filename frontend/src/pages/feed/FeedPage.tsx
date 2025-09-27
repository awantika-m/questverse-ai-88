import { useState } from 'react';
import { useFeed, useCreatePost } from '@/hooks/api';
import { useUser } from '@/hooks/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Heart, MessageCircle, Share2, MoreVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

export default function FeedPage() {
  const { data: posts = [], isLoading } = useFeed();
  const { data: user } = useUser();
  const createPost = useCreatePost();
  const [content, setContent] = useState('');
  const { toast } = useToast();

  const handleCreatePost = async () => {
    if (!content.trim()) return;

    try {
      await createPost.mutateAsync({ content });
      setContent('');
      toast({
        title: 'Post created!',
        description: 'Your post has been shared with the community.',
      });
    } catch (error) {
      toast({
        title: 'Failed to create post',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

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

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Share your thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex justify-end">
          <Button
            disabled={!content.trim() || createPost.isPending}
            onClick={handleCreatePost}
          >
            {createPost.isPending ? 'Posting...' : 'Post'}
          </Button>
        </CardFooter>
      </Card>

      <ScrollArea className="h-[calc(100vh-16rem)]">
        <motion.div variants={container} initial="hidden" animate="show">
          <AnimatePresence>
            {posts.map((post) => (
              <motion.div key={post.id} variants={item} layout>
                <Card className="mb-4">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{post.author.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(post.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Report Post</DropdownMenuItem>
                          {post.author.id === user?.id && (
                            <DropdownMenuItem className="text-destructive">
                              Delete Post
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{post.content}</p>
                    {post.media && (
                      <img
                        src={post.media}
                        alt="Post attachment"
                        className="mt-4 rounded-lg"
                      />
                    )}
                  </CardContent>
                  <CardFooter>
                    <div className="flex w-full items-center gap-4">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Heart
                          className={`h-4 w-4 ${
                            post.likes > 0 ? 'fill-current text-red-500' : ''
                          }`}
                        />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <MessageCircle className="h-4 w-4" />
                        {post.comments.length}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </ScrollArea>
    </div>
  );
}