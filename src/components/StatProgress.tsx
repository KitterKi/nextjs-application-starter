'use client'

import { useUser } from '@/context/UserContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Sword, Brain, Palette, Heart } from 'lucide-react'

const statIcons = {
  strength: Sword,
  intelligence: Brain,
  creativity: Palette,
  charisma: Heart
}

const statColors = {
  strength: 'text-red-400',
  intelligence: 'text-blue-400',
  creativity: 'text-purple-400',
  charisma: 'text-pink-400'
}

const statBgColors = {
  strength: 'bg-red-500/20',
  intelligence: 'bg-blue-500/20',
  creativity: 'bg-purple-500/20',
  charisma: 'bg-pink-500/20'
}

export default function StatProgress() {
  const { user } = useUser()

  const getStatPercentage = (statValue: number) => {
    // Assuming max stat is 100 for progress bar calculation
    return Math.min((statValue / 100) * 100, 100)
  }

  return (
    <Card className="bg-black/40 border-white/10 text-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sword className="w-5 h-5 text-purple-400" />
          <span>Character Stats</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(user.stats).map(([statName, statValue]) => {
          const Icon = statIcons[statName as keyof typeof statIcons]
          const colorClass = statColors[statName as keyof typeof statColors]
          const bgColorClass = statBgColors[statName as keyof typeof statBgColors]
          
          return (
            <div key={statName} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${bgColorClass}`}>
                    <Icon className={`w-5 h-5 ${colorClass}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold capitalize">{statName}</h4>
                    <p className="text-sm text-gray-400">
                      {statName === 'strength' && 'Physical activities & sports'}
                      {statName === 'intelligence' && 'Workshops & learning events'}
                      {statName === 'creativity' && 'Art & creative meetups'}
                      {statName === 'charisma' && 'Social & networking events'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{statValue}</div>
                  <div className="text-xs text-gray-400">
                    {Math.floor(getStatPercentage(statValue))}%
                  </div>
                </div>
              </div>
              
              <Progress 
                value={getStatPercentage(statValue)} 
                className="h-2"
              />
              
              <div className="flex justify-between text-xs text-gray-400">
                <span>Beginner</span>
                <span>Expert</span>
              </div>
            </div>
          )
        })}
        
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
          <h4 className="font-semibold mb-2 text-purple-300">Stat Bonuses</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Power:</span>
              <span className="text-white font-semibold">
                {Object.values(user.stats).reduce((sum, stat) => sum + stat, 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Avg Level:</span>
              <span className="text-white font-semibold">
                {Math.round(Object.values(user.stats).reduce((sum, stat) => sum + stat, 0) / 4)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
