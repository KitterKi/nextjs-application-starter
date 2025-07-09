import { NextRequest, NextResponse } from 'next/server'

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

// Mock events data
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
  },
  {
    id: '6',
    title: 'Creative Writing Workshop',
    description: 'Unleash your storytelling potential with guided exercises and peer feedback.',
    category: 'creativity',
    difficulty: 'beginner',
    xpReward: 25,
    statReward: 3,
    requirements: {},
    location: 'Library Community Room',
    date: '2024-01-19',
    time: '15:00',
    maxParticipants: 16,
    currentParticipants: 9,
    isPremium: false,
    isDungeon: false,
    image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg'
  },
  {
    id: '7',
    title: 'Rock Climbing Adventure',
    description: 'Challenge yourself physically and mentally on our indoor climbing walls.',
    category: 'strength',
    difficulty: 'intermediate',
    xpReward: 35,
    statReward: 4,
    requirements: {
      stats: { strength: 15 }
    },
    location: 'Climbing Gym',
    date: '2024-01-21',
    time: '11:00',
    maxParticipants: 10,
    currentParticipants: 6,
    isPremium: false,
    isDungeon: false,
    image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg'
  },
  {
    id: '8',
    title: 'Public Speaking Masterclass',
    description: 'Build confidence and charisma through practical speaking exercises and expert coaching.',
    category: 'charisma',
    difficulty: 'intermediate',
    xpReward: 40,
    statReward: 4,
    requirements: {
      level: 3,
      stats: { charisma: 12 }
    },
    location: 'Conference Center',
    date: '2024-01-22',
    time: '13:00',
    maxParticipants: 20,
    currentParticipants: 14,
    isPremium: true,
    isDungeon: false,
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const premium = searchParams.get('premium')

    let filteredEvents = mockEvents

    // Apply filters
    if (category && category !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.category === category)
    }

    if (difficulty && difficulty !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.difficulty === difficulty)
    }

    if (premium === 'true') {
      filteredEvents = filteredEvents.filter(event => event.isPremium)
    }

    return NextResponse.json({
      success: true,
      events: filteredEvents,
      total: filteredEvents.length
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch events',
        events: [],
        total: 0
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId, userId, userLevel, userStats } = body

    // Validate required fields
    if (!eventId || !userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: eventId and userId' 
        },
        { status: 400 }
      )
    }

    // Find the event
    const event = mockEvents.find(e => e.id === eventId)
    if (!event) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Event not found' 
        },
        { status: 404 }
      )
    }

    // Check if event is full
    if (event.currentParticipants >= event.maxParticipants) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Event is full' 
        },
        { status: 400 }
      )
    }

    // Validate level requirements
    if (event.requirements.level && userLevel < event.requirements.level) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Requires level ${event.requirements.level}` 
        },
        { status: 400 }
      )
    }

    // Validate stat requirements
    if (event.requirements.stats && userStats) {
      for (const [stat, required] of Object.entries(event.requirements.stats)) {
        if (userStats[stat] < required) {
          return NextResponse.json(
            { 
              success: false, 
              error: `Requires ${stat} ${required}` 
            },
            { status: 400 }
          )
        }
      }
    }

    // Simulate joining the event (increment participants)
    event.currentParticipants += 1

    return NextResponse.json({
      success: true,
      message: 'Successfully joined event',
      event: {
        id: event.id,
        title: event.title,
        xpReward: event.xpReward,
        statReward: event.statReward,
        category: event.category
      }
    })
  } catch (error) {
    console.error('Error joining event:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to join event' 
      },
      { status: 500 }
    )
  }
}
