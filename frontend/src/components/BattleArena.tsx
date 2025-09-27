import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  health: number;
}

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface BattleProps {
  matchId: string;
  onMatchEnd?: () => void;
}

const SAMPLE_PLAYERS: Player[] = [
  {
    id: '1',
    name: 'Player 1',
    avatar: '/placeholder.svg',
    score: 0,
    health: 100
  },
  {
    id: '2',
    name: 'Player 2',
    avatar: '/placeholder.svg',
    score: 0,
    health: 100
  }
];

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: '1',
    text: 'What is the derivative of x²?',
    options: ['x', '2x', '2', 'x²'],
    correctAnswer: 1
  },
  {
    id: '2',
    text: 'What is the integral of 2x?',
    options: ['x²', 'x²+C', 'x', '2x²+C'],
    correctAnswer: 1
  }
];

export default function BattleArena({ matchId, onMatchEnd }: BattleProps) {
  const [players, setPlayers] = useState<Player[]>(SAMPLE_PLAYERS);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(SAMPLE_QUESTIONS[0]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion]);

  const handleTimeUp = () => {
    if (selectedAnswer === null) {
      damagePlayer(players[0].id, 20);
    }
    loadNextQuestion();
  };

  const damagePlayer = (playerId: string, damage: number) => {
    setPlayers(prev =>
      prev.map(player =>
        player.id === playerId
          ? { ...player, health: Math.max(0, player.health - damage) }
          : player
      )
    );
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    
    if (answerIndex === currentQuestion.correctAnswer) {
      // Correct answer
      setPlayers(prev =>
        prev.map(player =>
          player.id === '1'
            ? { ...player, score: player.score + 100 }
            : player
        )
      );
      damagePlayer('2', 20); // Damage opponent
      toast({
        title: 'Correct Answer!',
        description: '+100 points'
      });
    } else {
      // Wrong answer
      damagePlayer('1', 20); // Self damage
      toast({
        title: 'Wrong Answer',
        variant: 'destructive'
      });
    }

    loadNextQuestion();
  };

  const loadNextQuestion = () => {
    const nextIndex = SAMPLE_QUESTIONS.findIndex(q => q.id === currentQuestion.id) + 1;
    if (nextIndex < SAMPLE_QUESTIONS.length) {
      setCurrentQuestion(SAMPLE_QUESTIONS[nextIndex]);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      endMatch();
    }
  };

  const endMatch = () => {
    const winner = players.reduce((prev, current) => 
      (prev.score > current.score) ? prev : current
    );
    
    toast({
      title: 'Match Ended',
      description: `${winner.name} wins with ${winner.score} points!`
    });

    onMatchEnd?.();
  };

  return (
    <div className="container max-w-4xl mx-auto p-6">
      {/* Players Status */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {players.map((player, index) => (
          <Card key={player.id} className="p-4">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={player.avatar}
                alt={player.name}
                className="w-12 h-12 rounded-full bg-secondary"
              />
              <div>
                <h3 className="font-medium">{player.name}</h3>
                <p className="text-sm text-muted-foreground">Score: {player.score}</p>
              </div>
            </div>
            <Progress value={player.health} className="h-2" />
          </Card>
        ))}
      </div>

      {/* Timer */}
      <div className="mb-8 text-center">
        <div className="inline-block px-4 py-2 bg-secondary rounded-full">
          <span className="text-2xl font-bold">{timeLeft}s</span>
        </div>
      </div>

      {/* Question */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">{currentQuestion.text}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === index ? 'default' : 'outline'}
              className="h-auto py-4 px-6 text-left"
              onClick={() => handleAnswerSelect(index)}
              disabled={selectedAnswer !== null}
            >
              {option}
            </Button>
          ))}
        </div>
      </Card>

      {/* Battle Log */}
      <Card className="p-4 bg-secondary/50">
        <div className="text-sm text-muted-foreground">
          <p>Last action: Player 1 answered correctly! (+100 points)</p>
          <p>Previous: Player 2 took 20 damage</p>
        </div>
      </Card>
    </div>
  );
}