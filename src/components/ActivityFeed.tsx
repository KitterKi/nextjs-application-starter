'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/context/UserContext'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Trophy, Zap, Sword, Brain, Palette, Heart, Gift, Star, Award, Clock, Activity } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface ActivityItem {
  id: string
  type: 'xp_gain' | 'level_up' | 'loot_found' | 'event_completed' | 'achievement'
  title: string
  description: string
  xpGained?: number
  statGained?: number
  statType?: 'strength' | 'intelligence' | 'creativity' | 'charisma'
  lootItem?: string
  timestamp: string
  eventName?: string
  image?: string
}

const activityIcons = {
  xp_gain: Zap,
  level_up: Trophy,
  loot_found: Gift,
  event_completed: Star,
  achievement: Award
}

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

// Mock activity data - in a real app, this would come from the API
const generateMockActivities = (userId: string): ActivityItem[] => {
  const now = new Date()
  return [
    {
      id: '1',
      type: 'event_completed',
      title: 'Event Completed',
      description: 'Successfully completed Morning Yoga Session',
      xpGained: 15,
      statGained: 2,
      statType: 'strength',
      eventName: 'Morning Yoga Session',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      image: 'https://images.pexels.com/photos/317157/pexels-photo-317157.jpeg'
    },
    {
      id: '2',
      type: 'loot_found',
      title: 'Loot Acquired',
      description: 'Found Crystal Badge in dungeon challenge',
      lootItem: 'Crystal Badge',
      timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      image: 'https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg'
    },
    {
      id: '3',
      type: 'xp_gain',
      title: 'XP Gained',
      description: 'Earned experience from Tech Workshop',
      xpGained: 50,
      statGained: 5,
      statType: 'intelligence',
      eventName: 'Advanced Web Development Workshop',
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg'
    },
    {
      id: '4',
      type: 'level_up',
      title: 'Level Up!',
      description: 'Congratulations! You reached Level 2',
      timestamp: new Date(now.getTime() - 25 * 60 * 60 * 1000).toISOString(),
      image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg'
    },
    {
      id: '5',
      type: 'achievement',
      title: 'Achievement Unlocked',
      description: 'First Steps - Completed your first event',
      timestamp: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
      image: 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg'
    },
    {
      id: '6',
      type: 'event_completed',
      title: 'Event Completed',
      description: 'Successfully completed Digital Art Masterclass',
      xpGained: 30,
      statGained: 3,
      statType: 'creativity',
      eventName: 'Digital Art Masterclass',
      timestamp: new Date(now.getTime() - 72 * 60 * 60 * 1000).toISOString(),
      image: 'https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg'
    }
  ]
}

const formatTimeAgo = (timestamp: string): string => {
  const now = new Date()
  const past = new Date(timestamp)
  const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else {
    const days = Math.floor(diffInMinutes / 1440)
    return `${days} day${days > 1 ? 's' : ''} ago`
  }
}

export default function ActivityFeed() {
  const { user } = useUser()
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // In a real app, this would be:
        // const response = await fetch(`/api/xp?userId=${user.id}&type=xp_history`)
        // const data = await response.json()
        
        // For now, use mock data
        const mockData = generateMockActivities(user.id)
        setActivities(mockData)
      } catch (err) {
        console.error('Error fetching activities:', err)
        setError('Failed to load activity feed. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    if (user.id) {
      fetchActivities()
    }
  }, [user.id])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <Card key={index} className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="w-12 h-12 rounded-full bg-white/10" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4 bg-white/10" />
                  <Skeleton className="h-3 w-1/2 bg-white/10" />
                </div>
                <Skeleton className="w-16 h-6 bg-white/10" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
          <Award className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Unable to Load Activity</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
          <Activity className="w-8 h-8 text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No Recent Activity</h3>
        <p className="text-gray-400 mb-4">
          Start participating in events to see your activity timeline!
        </p>
        <Link href="/events">
          <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all">
            Explore Events
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = activityIcons[activity.type]
        const StatIcon = activity.statType ? statIcons[activity.statType] : null
        const statColor = activity.statType ? statColors[activity.statType] : ''
        
        return (
          <Card 
            key={activity.id} 
            className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-200 group"
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                {/* Activity Icon */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        {activity.description}
                      </p>
                      
                      {/* Activity Details */}
                      <div className="flex items-center space-x-4 mt-2">
                        {activity.xpGained && (
                          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                            +{activity.xpGained} XP
                          </Badge>
                        )}
                        
                        {activity.statGained && activity.statType && StatIcon && (
                          <Badge className={`bg-white/10 border-white/20 ${statColor}`}>
                            <StatIcon className="w-3 h-3 mr-1" />
                            +{activity.statGained} {activity.statType}
                          </Badge>
                        )}
                        
                        {activity.lootItem && (
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                            <Gift className="w-3 h-3 mr-1" />
                            {activity.lootItem}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Activity Image */}
                    {activity.image && (
                      <div className="flex-shrink-0 ml-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5">
                          <Image
                            src={activity.image}
                            alt={activity.title}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Timestamp */}
                  <div className="flex items-center space-x-1 mt-3 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
      
      {/* Load More Button */}
      <div className="text-center pt-4">
        <button className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-lg transition-all">
          Load More Activities
        </button>
      </div>
    </div>
  )
}
