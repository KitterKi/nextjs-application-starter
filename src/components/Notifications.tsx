'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/context/UserContext'
import { toast } from 'sonner'
import { Bell, Gift, Zap, Trophy, Users } from 'lucide-react'

interface Notification {
  id: string
  type: 'xp' | 'loot' | 'event' | 'achievement' | 'social'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

export default function Notifications() {
  const { user } = useUser()
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Mock notifications for demo
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'xp',
        title: 'XP Gained!',
        message: 'You earned 25 XP from the Tech Workshop event!',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        read: false
      },
      {
        id: '2',
        type: 'achievement',
        title: 'Level Up!',
        message: 'Congratulations! You reached Level 2!',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        read: false
      },
      {
        id: '3',
        type: 'event',
        title: 'New Event Available',
        message: 'Morning Yoga Session is now open for registration!',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        read: true
      }
    ]

    setNotifications(mockNotifications)

    // Show toast notifications for unread notifications
    mockNotifications
      .filter(n => !n.read)
      .forEach(notification => {
        const icon = getNotificationIcon(notification.type)
        toast(notification.title, {
          description: notification.message,
          icon: icon,
          duration: 5000,
        })
      })
  }, [])

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'xp':
        return <Zap className="w-4 h-4 text-yellow-400" />
      case 'loot':
        return <Gift className="w-4 h-4 text-purple-400" />
      case 'event':
        return <Bell className="w-4 h-4 text-blue-400" />
      case 'achievement':
        return <Trophy className="w-4 h-4 text-gold-400" />
      case 'social':
        return <Users className="w-4 h-4 text-green-400" />
      default:
        return <Bell className="w-4 h-4 text-gray-400" />
    }
  }

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly show notifications for demo purposes
      if (Math.random() < 0.1) { // 10% chance every 10 seconds
        const randomNotifications = [
          {
            type: 'xp' as const,
            title: 'XP Milestone!',
            message: 'You\'re halfway to your next level!'
          },
          {
            type: 'event' as const,
            title: 'Event Reminder',
            message: 'Don\'t forget about the Creative Workshop starting in 1 hour!'
          },
          {
            type: 'social' as const,
            title: 'Friend Activity',
            message: 'DragonSlayer99 just completed a dungeon event!'
          },
          {
            type: 'loot' as const,
            title: 'Daily Reward',
            message: 'Your daily login bonus is ready to claim!'
          }
        ]

        const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)]
        const icon = getNotificationIcon(randomNotification.type)
        
        toast(randomNotification.title, {
          description: randomNotification.message,
          icon: icon,
          duration: 4000,
        })
      }
    }, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [])

  // Show welcome notification on first load
  useEffect(() => {
    const hasShownWelcome = localStorage.getItem('hasShownWelcome')
    if (!hasShownWelcome) {
      setTimeout(() => {
        toast('Welcome to Lvl Up!', {
          description: 'Start your adventure by joining events and leveling up your character!',
          icon: <Trophy className="w-4 h-4 text-purple-400" />,
          duration: 6000,
        })
        localStorage.setItem('hasShownWelcome', 'true')
      }, 2000)
    }
  }, [])

  // This component doesn't render anything visible - it just manages toast notifications
  return null
}
