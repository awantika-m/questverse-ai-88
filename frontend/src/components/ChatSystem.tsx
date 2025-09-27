import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

const SAMPLE_CHATS: Chat[] = [
  {
    id: '1',
    name: 'Math Warriors Guild',
    lastMessage: 'Great job on the quest!',
    timestamp: '2025-09-27T10:00:00Z',
    unread: 2
  },
  {
    id: '2',
    name: 'Physics Study Group',
    lastMessage: 'When is the next meeting?',
    timestamp: '2025-09-27T09:30:00Z',
    unread: 0
  }
];

const SAMPLE_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'John',
    content: 'Hey, need help with the calculus quest!',
    timestamp: '2025-09-27T10:00:00Z',
    isCurrentUser: false
  },
  {
    id: '2',
    sender: 'You',
    content: 'Sure, what part are you stuck on?',
    timestamp: '2025-09-27T10:01:00Z',
    isCurrentUser: true
  }
];

export function ChatSystem() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'You',
      content: newMessage,
      timestamp: new Date().toISOString(),
      isCurrentUser: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          Chat
          {SAMPLE_CHATS.reduce((sum, chat) => sum + chat.unread, 0) > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {SAMPLE_CHATS.reduce((sum, chat) => sum + chat.unread, 0)}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0">
        <div className="flex h-full">
          {/* Chat List */}
          <div className="w-[200px] border-r">
            <SheetHeader className="p-4 border-b">
              <SheetTitle>Chats</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-5rem)]">
              {SAMPLE_CHATS.map(chat => (
                <div
                  key={chat.id}
                  className={cn(
                    'p-4 cursor-pointer hover:bg-secondary/50',
                    selectedChat?.id === chat.id && 'bg-secondary'
                  )}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium truncate">{chat.name}</h4>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(chat.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {chat.lastMessage}
                  </p>
                  {chat.unread > 0 && (
                    <span className="inline-block px-2 py-0.5 bg-red-500 text-white text-xs rounded-full mt-1">
                      {chat.unread}
                    </span>
                  )}
                </div>
              ))}
            </ScrollArea>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 flex flex-col">
            <SheetHeader className="p-4 border-b">
              <SheetTitle>{selectedChat?.name || 'Select a chat'}</SheetTitle>
            </SheetHeader>

            {selectedChat ? (
              <>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map(message => (
                      <div
                        key={message.id}
                        className={cn(
                          'flex',
                          message.isCurrentUser ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <div
                          className={cn(
                            'max-w-[80%] rounded-lg p-3',
                            message.isCurrentUser
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary'
                          )}
                        >
                          {!message.isCurrentUser && (
                            <p className="text-xs font-medium mb-1">
                              {message.sender}
                            </p>
                          )}
                          <p>{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t flex gap-2"
                >
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button type="submit">Send</Button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a chat to start messaging
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}