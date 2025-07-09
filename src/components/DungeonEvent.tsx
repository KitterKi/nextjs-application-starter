'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Users, Trophy, Gift, Zap, Clock, Star, Flame, Shield, Sword } from 'lucide-react'
import Image from 'next/image'

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

interface DungeonEventProps {
  challenge: DungeonChallenge
  team: TeamMember[]
  onComplete: () => void
}

const challengeImages = {
  'Crystal Caverns': 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg',
  'Dragon\'s Lair': 'https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg',
  'Nightmare Realm': 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg'
}

const phases = [
  { name: 'Team Assembly', description: 'Getting to know your teammates', duration: 30 },
  { name: 'Challenge Briefing', description: 'Understanding the mission', duration: 20 },
  { name: 'Main Challenge', description: 'The core adventure begins', duration: 60 },
  { name: 'Final Boss', description: 'Face the ultimate test', duration: 40 },
  { name: 'Loot Distribution', description: 'Claim your rewards', duration: 10 }
]

export default function DungeonEvent({ challenge, team, onComplete }: DungeonEventProps) {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [phaseProgress, setPhaseProgress] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([])

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setPhaseProgress(prev => {
        if (prev >= 100) {
          if (currentPhase < phases.length - 1) {
            setCurrentPhase(curr => curr + 1)
            return 0
          } else {
            setIsActive(false)
            return 100
          }
        }
        return prev + (100 / phases[currentPhase].duration) // Progress based on phase duration
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, currentPhase])

  const startChallenge = () => {
    setIsActive(true)
    setCurrentPhase(0)
    setPhaseProgress(0)
  }

  const handleChallengeComplete = (challengeName: string) => {
    setCompletedChallenges(prev => [...prev, challengeName])
  }

  const miniChallenges = [
    { name: 'Puzzle Solving', description: 'Work together to solve ancient riddles', icon: '🧩' },
    { name: 'Team Coordination', description: 'Navigate obstacles as a group', icon: '🤝' },
    { name: 'Resource Management', description: 'Allocate limited resources wisely', icon: '⚖️' },
    { name: 'Strategic Planning', description: 'Plan your approach to the final boss', icon: '🎯' }
  ]

  const backgroundImage = challengeImages[challenge.name as keyof typeof challengeImages] || challengeImages['Crystal Caverns']

  return (
    <div className="space-y-6">
      {/* Challenge Header */}
      <Card className="bg-black/40 border-white/10 text-white overflow-hidden">
        <div className="relative h-48">
          <Image
            src={backgroundImage}
            alt={challenge.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-3xl font-bold mb-2">{challenge.name}</h2>
            <p className="text-gray-200">{challenge.description}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Panel */}
        <Card className="bg-black/40 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span>Your Team</span>
            </CardTitle>
            <CardDescription className="text-gray-300">
              {team.length} adventurers ready for action
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {team.map((member) => (
              <div key={member.id} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    {member.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold">
                    {member.username}
                    {member.username === 'Player' && (
                      <span className="ml-2 text-xs text-purple-400">(You)</span>
                    )}
                  </h4>
                  <p className="text-sm text-gray-400">
                    Level {member.level} • {member.primaryStat.charAt(0).toUpperCase() + member.primaryStat.slice(1)}
                  </p>
                </div>
              </div>
            ))}
            
            <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <h4 className="font-semibold mb-2 text-blue-300">Team Synergy</h4>
              <div className="text-sm text-gray-300">
                <p>• Balanced skill distribution</p>
                <p>• Strong communication potential</p>
                <p>• Ready for {challenge.difficulty} difficulty</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Challenge Progress */}
        <Card className="bg-black/40 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <span>Challenge Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isActive && currentPhase === 0 ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                  <Sword className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Ready to Begin?</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Your team is assembled and ready for the challenge!
                  </p>
                  <Button 
                    onClick={startChallenge}
                    className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                  >
                    Start Challenge
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{phases[currentPhase]?.name}</h3>
                    <Badge className="bg-orange-500/20 text-orange-300">
                      Phase {currentPhase + 1}/{phases.length}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">
                    {phases[currentPhase]?.description}
                  </p>
                  <Progress value={phaseProgress} className="h-3" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Progress</span>
                    <span>{Math.round(phaseProgress)}%</span>
                  </div>
                </div>

                {currentPhase === phases.length - 1 && phaseProgress >= 100 && (
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-yellow-400">Challenge Complete!</h3>
                      <p className="text-sm text-gray-400 mb-3">
                        Congratulations! Your team has successfully completed the challenge.
                      </p>
                      <Button 
                        onClick={onComplete}
                        className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                      >
                        <Gift className="w-4 h-4 mr-2" />
                        Claim Rewards
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mini Challenges */}
        <Card className="bg-black/40 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>Challenge Tasks</span>
            </CardTitle>
            <CardDescription className="text-gray-300">
              Complete these to progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {miniChallenges.map((miniChallenge, index) => {
              const isCompleted = completedChallenges.includes(miniChallenge.name)
              const isActive = currentPhase > 1 && index <= currentPhase - 2
              
              return (
                <div 
                  key={miniChallenge.name}
                  className={`p-3 rounded-lg border transition-all ${
                    isCompleted 
                      ? 'bg-green-500/20 border-green-500/30' 
                      : isActive 
                        ? 'bg-yellow-500/20 border-yellow-500/30' 
                        : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{miniChallenge.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{miniChallenge.name}</h4>
                      <p className="text-xs text-gray-400">{miniChallenge.description}</p>
                    </div>
                    {isCompleted && (
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    {isActive && !isCompleted && (
                      <Button 
                        size="sm" 
                        onClick={() => handleChallengeComplete(miniChallenge.name)}
                        className="bg-yellow-600 hover:bg-yellow-700 text-xs"
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Rewards Preview */}
      <Card className="bg-black/40 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gift className="w-5 h-5 text-purple-400" />
            <span>Potential Rewards</span>
          </CardTitle>
          <CardDescription className="text-gray-300">
            What you could earn from this challenge
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Guaranteed Rewards</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded bg-white/5">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span>Experience Points</span>
                  </div>
                  <Badge className="bg-yellow-500/20 text-yellow-300">
                    +{challenge.xpReward} XP
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-white/5">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-purple-400" />
                    <span>Team Achievement</span>
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-300">
                    Badge
                  </Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Possible Loot</h4>
              <div className="flex flex-wrap gap-2">
                {challenge.lootPool.map((item, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30"
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
