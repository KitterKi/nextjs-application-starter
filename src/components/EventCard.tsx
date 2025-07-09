'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { MapPin, Users, Clock, Star, Zap, Sword, Brain, Palette, Heart, Crown, Shield } from 'lucide-react'
import Image from 'next/image'

interface Event {
  id: string
  title: string
  description: string
  category: 'strength' | 'intelligence' | 'creativity' | 'charisma'
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  xpReward: number
  statReward: number
  requirements: {
    level?: number
    stats?: Partial<Record<'strength' | 'intelligence' | 'creativity' | 'charisma', number>>
  }
  location: string
  date: string
  time: string
  maxParticipants: number
  currentParticipants: number
  isPremium: boolean
  isDungeon: boolean
  image: string
}

interface EventCardProps {
  event: Event
  canJoin: { canJoin: boolean; reason: string }
  onJoin: () => void
}

const categoryIcons = {
  strength: Sword,
  intelligence: Brain,
  creativity: Palette,
  charisma: Heart
}

const categoryColors = {
  strength: 'text-red-400 bg-red-500/20',
  intelligence: 'text-blue-400 bg-blue-500/20',
  creativity: 'text-purple-400 bg-purple-500/20',
  charisma: 'text-pink-400 bg-pink-500/20'
}

const difficultyColors = {
  beginner: 'bg-green-500/20 text-green-300 border-green-500/30',
  intermediate: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  advanced: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  expert: 'bg-red-500/20 text-red-300 border-red-500/30'
}

export default function EventCard({ event, canJoin, onJoin }: EventCardProps) {
  const CategoryIcon = categoryIcons[event.category]
  const categoryColorClass = categoryColors[event.category]
  const difficultyColorClass = difficultyColors[event.difficulty]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const date = new Date()
    date.setHours(parseInt(hours), parseInt(minutes))
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const getRequirementsText = () => {
    const requirements = []
    if (event.requirements.level) {
      requirements.push(`Level ${event.requirements.level}`)
    }
    if (event.requirements.stats) {
      Object.entries(event.requirements.stats).forEach(([stat, value]) => {
        requirements.push(`${stat.charAt(0).toUpperCase() + stat.slice(1)} ${value}`)
      })
    }
    return requirements.length > 0 ? requirements.join(', ') : 'No requirements'
  }

  return (
    <Card className="bg-black/40 border-white/10 text-white overflow-hidden hover:bg-black/50 transition-all duration-300 group">
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {event.isPremium && (
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
          {event.isDungeon && (
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Shield className="w-3 h-3 mr-1" />
              Dungeon
            </Badge>
          )}
          <Badge className={`border ${difficultyColorClass}`}>
            {event.difficulty.charAt(0).toUpperCase() + event.difficulty.slice(1)}
          </Badge>
        </div>

        {/* Category Icon */}
        <div className={`absolute top-3 right-3 p-2 rounded-lg ${categoryColorClass}`}>
          <CategoryIcon className="w-4 h-4" />
        </div>

        {/* XP Reward */}
        <div className="absolute bottom-3 right-3">
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
            <Zap className="w-3 h-3 mr-1" />
            +{event.xpReward} XP
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
        <CardDescription className="text-gray-300 line-clamp-2">
          {event.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Event Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-300">
            <MapPin className="w-4 h-4 mr-2" />
            {event.location}
          </div>
          <div className="flex items-center text-gray-300">
            <Clock className="w-4 h-4 mr-2" />
            {formatDate(event.date)} at {formatTime(event.time)}
          </div>
          <div className="flex items-center text-gray-300">
            <Users className="w-4 h-4 mr-2" />
            {event.currentParticipants}/{event.maxParticipants} participants
          </div>
        </div>

        {/* Stat Reward */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Stat Bonus:</span>
          <div className="flex items-center space-x-1">
            <CategoryIcon className={`w-4 h-4 ${categoryColors[event.category].split(' ')[0]}`} />
            <span className="text-white">+{event.statReward} {event.category}</span>
          </div>
        </div>

        {/* Requirements */}
        {(event.requirements.level || event.requirements.stats) && (
          <div className="text-sm">
            <span className="text-gray-400">Requirements: </span>
            <span className={canJoin.canJoin ? 'text-green-400' : 'text-red-400'}>
              {getRequirementsText()}
            </span>
          </div>
        )}

        {/* Join Button */}
        {canJoin.canJoin ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Join Event
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-black/90 border-white/10 text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Join {event.title}?</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-300">
                  You will gain {event.xpReward} XP and +{event.statReward} {event.category} by participating in this event.
                  {event.isDungeon && (
                    <span className="block mt-2 text-purple-300">
                      This is a dungeon event! You'll be grouped with other participants for team challenges.
                    </span>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-gray-600 hover:bg-gray-700 text-white border-gray-500">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={onJoin}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Join Event
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button disabled className="w-full bg-gray-600 text-gray-400 cursor-not-allowed">
            {canJoin.reason}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
