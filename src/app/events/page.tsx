'use client'

import { useState } from 'react'
import { useUser } from '@/context/UserContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import Link from 'next/link'
import { ArrowLeft, Search, Filter, Calendar, MapPin, Users, Zap, Sword, Brain, Palette, Heart, Clock, Star } from 'lucide-react'
import { toast } from 'sonner'
import EventCard from '@/components/EventCard'

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

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Morning Yoga Session',
    description: 'Start your day with mindfulness and flexibility. Perfect for beginners looking to improve their physical wellness.',
    category: 'strength',
    difficulty: 'beginner',
    xpReward: 15,
    statReward: 2,
    requirements: {},
    location: 'Central Park',
    date: '2024-01-15',
    time: '07:00',
    maxParticipants: 20,
    currentParticipants: 12,
    isPremium: false,
    isDungeon: false,
    image: 'https://images.pexels.com/photos/317157/pexels-photo-317157.jpeg'
  },
  {
    id: '2',
    title: 'Advanced Web Development Workshop',
    description: 'Deep dive into React, TypeScript, and modern web technologies. Build a full-stack application.',
    category: 'intelligence',
    difficulty: 'advanced',
    xpReward: 50,
    statReward: 5,
    requirements: {
      level: 5,
      stats: { intelligence: 25 }
    },
    location: 'Tech Hub Downtown',
    date: '2024-01-16',
    time: '14:00',
    maxParticipants: 15,
    currentParticipants: 8,
    isPremium: true,
    isDungeon: false,
    image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg'
  },
  {
    id: '3',
    title: 'Digital Art Masterclass',
    description: 'Learn advanced digital painting techniques and create stunning artwork using professional tools.',
    category: 'creativity',
    difficulty: 'intermediate',
    xpReward: 30,
    statReward: 3,
    requirements: {
      stats: { creativity: 15 }
    },
    location: 'Art Studio',
    date: '2024-01-17',
    time: '10:00',
    maxParticipants: 12,
    currentParticipants: 5,
    isPremium: false,
    isDungeon: false,
    image: 'https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg'
  },
  {
    id: '4',
    title: 'Networking Mixer: Tech Professionals',
    description: 'Connect with like-minded professionals, share experiences, and build lasting relationships.',
    category: 'charisma',
    difficulty: 'beginner',
    xpReward: 20,
    statReward: 3,
    requirements: {},
    location: 'Business Center',
    date: '2024-01-18',
    time: '18:00',
    maxParticipants: 50,
    currentParticipants: 23,
    isPremium: false,
    isDungeon: false,
    image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg'
  },
  {
    id: '5',
    title: 'Dragon\'s Lair Challenge',
    description: 'Ultimate team-based dungeon event! Work together to solve puzzles, overcome challenges, and claim epic loot.',
    category: 'strength',
    difficulty: 'expert',
    xpReward: 100,
    statReward: 10,
    requirements: {
      level: 10,
      stats: { strength: 30, intelligence: 20 }
    },
    location: 'Adventure Park',
    date: '2024-01-20',
    time: '09:00',
    maxParticipants: 24,
    currentParticipants: 18,
    isPremium: true,
    isDungeon: true,
    image: 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg'
  }
]

export default function EventsPage() {
  const { user, addXP } = useUser()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter
    const matchesDifficulty = difficultyFilter === 'all' || event.difficulty === difficultyFilter
    const matchesPremium = !showPremiumOnly || event.isPremium

    return matchesSearch && matchesCategory && matchesDifficulty && matchesPremium
  })

  const canJoinEvent = (event: Event) => {
    if (event.requirements.level && user.level < event.requirements.level) {
      return { canJoin: false, reason: `Requires level ${event.requirements.level}` }
    }
    
    if (event.requirements.stats) {
      for (const [stat, required] of Object.entries(event.requirements.stats)) {
        if (user.stats[stat as keyof typeof user.stats] < required) {
          return { canJoin: false, reason: `Requires ${stat} ${required}` }
        }
      }
    }

    if (event.currentParticipants >= event.maxParticipants) {
      return { canJoin: false, reason: 'Event is full' }
    }

    return { canJoin: true, reason: '' }
  }

  const handleJoinEvent = (event: Event) => {
    const { canJoin, reason } = canJoinEvent(event)
    
    if (!canJoin) {
      toast.error('Cannot join event', {
        description: reason
      })
      return
    }

    // Simulate joining the event
    addXP(event.xpReward, event.category)
    toast.success('Event joined successfully!', {
      description: `You gained ${event.xpReward} XP and +${event.statReward} ${event.category}!`,
      icon: <Zap className="w-4 h-4 text-yellow-400" />
    })
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
                <h1 className="text-2xl font-bold text-white">Event Discovery</h1>
                <p className="text-sm text-gray-300">Find events to level up your character</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="bg-black/40 border-white/10 text-white mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Find Your Next Adventure</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="strength">Strength</SelectItem>
                  <SelectItem value="intelligence">Intelligence</SelectItem>
                  <SelectItem value="creativity">Creativity</SelectItem>
                  <SelectItem value="charisma">Charisma</SelectItem>
                </SelectContent>
              </Select>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              canJoin={canJoinEvent(event)}
              onJoin={() => handleJoinEvent(event)}
            />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <Card className="bg-black/40 border-white/10 text-white text-center py-12">
            <CardContent>
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">No events found</h3>
              <p className="text-gray-400 mb-4">
                Try adjusting your search criteria or check back later for new events.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('')
                  setCategoryFilter('all')
                  setDifficultyFilter('all')
                  setShowPremiumOnly(false)
                }}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
