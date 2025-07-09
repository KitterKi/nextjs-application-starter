'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/context/UserContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import Link from 'next/link'
import { ArrowLeft, Sword, Shield, Users, Trophy, Gift, Zap, Crown, Star, Flame } from 'lucide-react'
import { toast } from 'sonner'
import DungeonEvent from '@/components/DungeonEvent'

interface TeamMember {
  id: string
  username: string
  level: number
  primaryStat: string
  avatar: string
}

interface DungeonChallenge {
  id: string
  name: string
  description: string
  difficulty: 'normal' | 'hard' | 'nightmare'
  minLevel: number
  minTeamSize: number
  maxTeamSize: number
  xpReward: number
  lootPool: string[]
  duration: string
  requirements: string[]
}

const mockChallenges: DungeonChallenge[] = [
  {
    id: '1',
    name: 'Crystal Caverns',
    description: 'Navigate through mystical caverns filled with puzzles and teamwork challenges. Perfect for beginners.',
    difficulty: 'normal',
    minLevel: 3,
    minTeamSize: 3,
    maxTeamSize: 6,
    xpReward: 75,
    lootPool: ['Crystal Badge', 'Team Spirit Pin', 'Wisdom Scroll'],
    duration: '2 hours',
    requirements: ['Basic problem-solving', 'Team communication']
  },
  {
    id: '2',
    name: 'Dragon\'s Lair',
    description: 'Face the ultimate challenge! Complex puzzles, physical tasks, and strategic thinking required.',
    difficulty: 'hard',
    minLevel: 8,
    minTeamSize: 4,
    maxTeamSize: 8,
    xpReward: 150,
    lootPool: ['Dragon Scale', 'Leadership Crown', 'Power Crystal', 'Epic Badge'],
    duration: '4 hours',
    requirements: ['Advanced strategy', 'Physical endurance', 'Leadership skills']
  },
  {
    id: '3',
    name: 'Nightmare Realm',
    description: 'Only for the most experienced adventurers. Extreme challenges that test every skill.',
    difficulty: 'nightmare',
    minLevel: 15,
    minTeamSize: 6,
    maxTeamSize: 12,
    xpReward: 300,
    lootPool: ['Nightmare Crown', 'Legendary Artifact', 'Master\'s Seal', 'Cosmic Badge'],
    duration: '6 hours',
    requirements: ['Master-level skills', 'Extreme endurance', 'Perfect teamwork']
  }
]

const difficultyColors = {
  normal: 'bg-green-500/20 text-green-300 border-green-500/30',
  hard: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  nightmare: 'bg-red-500/20 text-red-300 border-red-500/30'
}

export default function DungeonPage() {
  const { user, addXP, addLoot } = useUser()
  const [selectedChallenge, setSelectedChallenge] = useState<DungeonChallenge | null>(null)
  const [currentTeam, setCurrentTeam] = useState<TeamMember[]>([])
  const [isInDungeon, setIsInDungeon] = useState(false)

  const canJoinChallenge = (challenge: DungeonChallenge) => {
    if (user.level < challenge.minLevel) {
      return { canJoin: false, reason: `Requires level ${challenge.minLevel}` }
    }
    return { canJoin: true, reason: '' }
  }

  const generateRandomTeam = (challenge: DungeonChallenge) => {
    const teamSize = Math.floor(Math.random() * (challenge.maxTeamSize - challenge.minTeamSize + 1)) + challenge.minTeamSize
    const mockUsers = [
      'DragonSlayer99', 'MysticMage', 'ShadowNinja', 'FirePhoenix', 'IceQueen', 
      'ThunderBolt', 'StarGazer', 'CrystalHunter', 'StormRider', 'MoonWalker'
    ]
    
    const team: TeamMember[] = []
    for (let i = 0; i < teamSize - 1; i++) {
      team.push({
        id: `member-${i}`,
        username: mockUsers[Math.floor(Math.random() * mockUsers.length)],
        level: Math.floor(Math.random() * 10) + challenge.minLevel,
        primaryStat: ['strength', 'intelligence', 'creativity', 'charisma'][Math.floor(Math.random() * 4)],
        avatar: '🧙‍♂️'
      })
    }
    
    // Add current user
    team.push({
      id: user.id,
      username: user.username,
      level: user.level,
      primaryStat: 'strength', // Could be calculated based on highest stat
      avatar: '👤'
    })
    
    return team
  }

  const handleJoinChallenge = (challenge: DungeonChallenge) => {
    const { canJoin, reason } = canJoinChallenge(challenge)
    
    if (!canJoin) {
      toast.error('Cannot join challenge', {
        description: reason
      })
      return
    }

    const team = generateRandomTeam(challenge)
    setCurrentTeam(team)
    setSelectedChallenge(challenge)
    setIsInDungeon(true)
    
    toast.success('Team assembled!', {
      description: `You've been matched with ${team.length - 1} other adventurers.`,
      icon: <Users className="w-4 h-4 text-green-400" />
    })
  }

  const handleCompleteChallenge = () => {
    if (!selectedChallenge) return

    // Generate random loot
    const lootItem = selectedChallenge.lootPool[Math.floor(Math.random() * selectedChallenge.lootPool.length)]
    
    addXP(selectedChallenge.xpReward)
    addLoot(lootItem)
    
    toast.success('Challenge completed!', {
      description: `You gained ${selectedChallenge.xpReward} XP and found: ${lootItem}!`,
      icon: <Trophy className="w-4 h-4 text-yellow-400" />
    })

    setIsInDungeon(false)
    setSelectedChallenge(null)
    setCurrentTeam([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">Dungeon Challenges</h1>
                <p className="text-sm text-gray-300">Team up for epic adventures</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!isInDungeon ? (
          <div className="space-y-8">
            {/* Challenge Selection */}
            <Card className="bg-black/40 border-white/10 text-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sword className="w-5 h-5 text-red-400" />
                  <span>Available Challenges</span>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Choose your adventure and get matched with a team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockChallenges.map((challenge) => {
                    const { canJoin, reason } = canJoinChallenge(challenge)
                    
                    return (
                      <Card key={challenge.id} className="bg-white/5 border-white/10 text-white hover:bg-white/10 transition-all">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{challenge.name}</CardTitle>
                            <Badge className={`border ${difficultyColors[challenge.difficulty]}`}>
                              {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                            </Badge>
                          </div>
                          <CardDescription className="text-gray-300">
                            {challenge.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Min Level:</span>
                              <div className="font-semibold">{challenge.minLevel}</div>
                            </div>
                            <div>
                              <span className="text-gray-400">Duration:</span>
                              <div className="font-semibold">{challenge.duration}</div>
                            </div>
                            <div>
                              <span className="text-gray-400">Team Size:</span>
                              <div className="font-semibold">{challenge.minTeamSize}-{challenge.maxTeamSize}</div>
                            </div>
                            <div>
                              <span className="text-gray-400">XP Reward:</span>
                              <div className="font-semibold text-yellow-400">+{challenge.xpReward}</div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold mb-2">Possible Loot:</h4>
                            <div className="flex flex-wrap gap-1">
                              {challenge.lootPool.slice(0, 3).map((item, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {item}
                                </Badge>
                              ))}
                              {challenge.lootPool.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{challenge.lootPool.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          {canJoin ? (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
                                  <Sword className="w-4 h-4 mr-2" />
                                  Enter Challenge
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-black/90 border-white/10 text-white">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Enter {challenge.name}?</AlertDialogTitle>
                                  <AlertDialogDescription className="text-gray-300">
                                    You'll be matched with other adventurers for this challenge. 
                                    Are you ready to begin?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-gray-600 hover:bg-gray-700 text-white border-gray-500">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleJoinChallenge(challenge)}
                                    className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                                  >
                                    Enter Challenge
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          ) : (
                            <Button disabled className="w-full bg-gray-600 text-gray-400 cursor-not-allowed">
                              {reason}
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <DungeonEvent 
            challenge={selectedChallenge!}
            team={currentTeam}
            onComplete={handleCompleteChallenge}
          />
        )}
      </main>
    </div>
  )
}
