'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Trophy, Medal, Award, Crown } from 'lucide-react'

interface LeaderboardEntry {
  id: string
  username: string
  level: number
  xp: number
  totalStats: number
  rank: number
}

// Mock leaderboard data
const mockLeaderboard: LeaderboardEntry[] = [
  { id: '1', username: 'DragonSlayer99', level: 15, xp: 2450, totalStats: 180, rank: 1 },
  { id: '2', username: 'MysticMage', level: 14, xp: 2200, totalStats: 165, rank: 2 },
  { id: '3', username: 'ShadowNinja', level: 13, xp: 1980, totalStats: 155, rank: 3 },
  { id: '4', username: 'FirePhoenix', level: 12, xp: 1750, totalStats: 145, rank: 4 },
  { id: '5', username: 'IceQueen', level: 11, xp: 1520, totalStats: 135, rank: 5 },
  { id: '6', username: 'ThunderBolt', level: 10, xp: 1300, totalStats: 125, rank: 6 },
  { id: '7', username: 'StarGazer', level: 9, xp: 1100, totalStats: 115, rank: 7 },
  { id: '8', username: 'Player', level: 1, xp: 0, totalStats: 40, rank: 8 }, // Current user
]

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-5 h-5 text-yellow-400" />
    case 2:
      return <Trophy className="w-5 h-5 text-gray-300" />
    case 3:
      return <Medal className="w-5 h-5 text-amber-600" />
    default:
      return <Award className="w-5 h-5 text-gray-500" />
  }
}

const getRankBadgeColor = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
    case 2:
      return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    case 3:
      return 'bg-amber-600/20 text-amber-300 border-amber-600/30'
    default:
      return 'bg-gray-600/20 text-gray-400 border-gray-600/30'
  }
}

export default function Leaderboard() {
  return (
    <Card className="bg-black/40 border-white/10 text-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span>Community Leaderboard</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockLeaderboard.map((player) => (
            <div
              key={player.id}
              className={`p-4 rounded-lg border transition-all duration-200 hover:bg-white/5 ${
                player.username === 'Player'
                  ? 'bg-purple-500/10 border-purple-500/30'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getRankIcon(player.rank)}
                    <Badge
                      variant="outline"
                      className={`${getRankBadgeColor(player.rank)} border`}
                    >
                      #{player.rank}
                    </Badge>
                  </div>
                  
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      {player.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h4 className="font-semibold">
                      {player.username}
                      {player.username === 'Player' && (
                        <span className="ml-2 text-xs text-purple-400">(You)</span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-400">
                      Level {player.level} • {player.xp.toLocaleString()} XP
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-300">
                    {player.totalStats}
                  </div>
                  <div className="text-xs text-gray-400">Total Stats</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
          <h4 className="font-semibold mb-2 text-blue-300">Weekly Challenge</h4>
          <p className="text-sm text-gray-300 mb-3">
            Attend 5 events this week to climb the leaderboard!
          </p>
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-400">
              Progress: 0/5 events
            </div>
            <Badge className="bg-blue-500/20 text-blue-300">
              +100 XP Bonus
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
