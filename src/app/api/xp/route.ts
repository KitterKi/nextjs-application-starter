import { NextRequest, NextResponse } from 'next/server'

interface XPRequest {
  userId: string
  eventId?: string
  xpAmount: number
  statType?: 'strength' | 'intelligence' | 'creativity' | 'charisma'
  eventType?: 'regular' | 'dungeon'
}

interface LootRequest {
  userId: string
  challengeId: string
  difficulty: 'normal' | 'hard' | 'nightmare'
  teamSize: number
}

// Loot pools based on difficulty
const lootPools = {
  normal: [
    'Crystal Badge',
    'Team Spirit Pin',
    'Wisdom Scroll',
    'Friendship Bracelet',
    'Courage Medal',
    'Unity Emblem'
  ],
  hard: [
    'Dragon Scale',
    'Leadership Crown',
    'Power Crystal',
    'Epic Badge',
    'Valor Shield',
    'Master\'s Ring',
    'Phoenix Feather',
    'Storm Gem'
  ],
  nightmare: [
    'Nightmare Crown',
    'Legendary Artifact',
    'Master\'s Seal',
    'Cosmic Badge',
    'Infinity Stone',
    'Divine Relic',
    'Eternal Flame',
    'Void Crystal'
  ]
}

// XP multipliers based on event type and difficulty
const xpMultipliers = {
  regular: 1.0,
  dungeon: {
    normal: 1.5,
    hard: 2.0,
    nightmare: 3.0
  }
}

function generateRandomLoot(difficulty: 'normal' | 'hard' | 'nightmare', teamSize: number): string[] {
  const pool = lootPools[difficulty]
  const lootCount = Math.min(Math.floor(Math.random() * 3) + 1, teamSize) // 1-3 items, max team size
  const selectedLoot: string[] = []
  
  for (let i = 0; i < lootCount; i++) {
    const randomIndex = Math.floor(Math.random() * pool.length)
    const item = pool[randomIndex]
    if (!selectedLoot.includes(item)) {
      selectedLoot.push(item)
    }
  }
  
  return selectedLoot
}

function calculateStatGain(xpAmount: number, statType?: string): number {
  // Base stat gain is XP / 10, with some randomness
  const baseGain = Math.floor(xpAmount / 10)
  const randomBonus = Math.floor(Math.random() * 3) // 0-2 bonus
  return Math.max(1, baseGain + randomBonus)
}

function calculateLevelUp(currentXP: number, xpGain: number, currentLevel: number): { newLevel: number; newXPToNext: number } {
  const newTotalXP = currentXP + xpGain
  let newLevel = currentLevel
  let xpForNextLevel = currentLevel * 100 // Simple progression: level * 100 XP needed
  
  while (newTotalXP >= xpForNextLevel) {
    newLevel++
    xpForNextLevel = newLevel * 100
  }
  
  return {
    newLevel,
    newXPToNext: xpForNextLevel
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'gain_xp') {
      return handleXPGain(body)
    } else if (action === 'generate_loot') {
      return handleLootGeneration(body)
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid action. Use "gain_xp" or "generate_loot"' 
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error processing XP/Loot request:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process request' 
      },
      { status: 500 }
    )
  }
}

async function handleXPGain(data: XPRequest) {
  const { userId, eventId, xpAmount, statType, eventType = 'regular' } = data

  // Validate required fields
  if (!userId || !xpAmount) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Missing required fields: userId and xpAmount' 
      },
      { status: 400 }
    )
  }

  if (xpAmount < 0 || xpAmount > 1000) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'XP amount must be between 0 and 1000' 
      },
      { status: 400 }
    )
  }

  try {
    // Calculate final XP with multipliers
    let finalXP = xpAmount
    if (eventType === 'dungeon') {
      // For dungeon events, we'd need difficulty info, defaulting to normal
      finalXP = Math.floor(xpAmount * xpMultipliers.dungeon.normal)
    }

    // Calculate stat gain
    const statGain = statType ? calculateStatGain(finalXP, statType) : 0

    // Simulate level calculation (in real app, this would come from database)
    const mockCurrentLevel = 5
    const mockCurrentXP = 450
    const levelInfo = calculateLevelUp(mockCurrentXP, finalXP, mockCurrentLevel)

    // Generate achievement if applicable
    const achievements = []
    if (levelInfo.newLevel > mockCurrentLevel) {
      achievements.push(`Level Up! Reached Level ${levelInfo.newLevel}`)
    }
    if (finalXP >= 100) {
      achievements.push('High Achiever - Gained 100+ XP in one event!')
    }

    return NextResponse.json({
      success: true,
      result: {
        xpGained: finalXP,
        statGained: statGain,
        statType: statType || null,
        levelUp: levelInfo.newLevel > mockCurrentLevel,
        newLevel: levelInfo.newLevel,
        achievements,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error calculating XP gain:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to calculate XP gain' 
      },
      { status: 500 }
    )
  }
}

async function handleLootGeneration(data: LootRequest) {
  const { userId, challengeId, difficulty, teamSize } = data

  // Validate required fields
  if (!userId || !challengeId || !difficulty || !teamSize) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Missing required fields: userId, challengeId, difficulty, teamSize' 
      },
      { status: 400 }
    )
  }

  if (!['normal', 'hard', 'nightmare'].includes(difficulty)) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Invalid difficulty. Must be normal, hard, or nightmare' 
      },
      { status: 400 }
    )
  }

  if (teamSize < 1 || teamSize > 12) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Team size must be between 1 and 12' 
      },
      { status: 400 }
    )
  }

  try {
    // Generate random loot
    const loot = generateRandomLoot(difficulty, teamSize)
    
    // Calculate bonus XP for dungeon completion
    const baseXP = {
      normal: 75,
      hard: 150,
      nightmare: 300
    }
    
    const bonusXP = Math.floor(baseXP[difficulty] * (1 + (teamSize - 1) * 0.1)) // 10% bonus per additional team member
    
    // Generate special rewards for higher difficulties
    const specialRewards = []
    if (difficulty === 'hard' && Math.random() < 0.3) {
      specialRewards.push('Rare Skill Unlock')
    }
    if (difficulty === 'nightmare' && Math.random() < 0.5) {
      specialRewards.push('Legendary Title')
      if (Math.random() < 0.2) {
        specialRewards.push('Exclusive Avatar Customization')
      }
    }

    return NextResponse.json({
      success: true,
      result: {
        loot,
        bonusXP,
        specialRewards,
        difficulty,
        teamSize,
        challengeId,
        timestamp: new Date().toISOString(),
        rarity: difficulty === 'nightmare' ? 'legendary' : difficulty === 'hard' ? 'epic' : 'rare'
      }
    })
  } catch (error) {
    console.error('Error generating loot:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate loot' 
      },
      { status: 500 }
    )
  }
}

// GET endpoint for retrieving user's XP history or loot inventory
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type') // 'xp_history' or 'inventory'

    if (!userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing userId parameter' 
        },
        { status: 400 }
      )
    }

    if (type === 'xp_history') {
      // Mock XP history
      const xpHistory = [
        {
          id: '1',
          eventName: 'Morning Yoga Session',
          xpGained: 15,
          statGained: 2,
          statType: 'strength',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          eventName: 'Tech Workshop',
          xpGained: 50,
          statGained: 5,
          statType: 'intelligence',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
        }
      ]

      return NextResponse.json({
        success: true,
        xpHistory,
        totalXP: xpHistory.reduce((sum, entry) => sum + entry.xpGained, 0)
      })
    } else if (type === 'inventory') {
      // Mock inventory
      const inventory = [
        {
          id: '1',
          name: 'Crystal Badge',
          rarity: 'rare',
          source: 'Crystal Caverns',
          acquiredAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          name: 'Team Spirit Pin',
          rarity: 'common',
          source: 'Team Building Event',
          acquiredAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString()
        }
      ]

      return NextResponse.json({
        success: true,
        inventory,
        totalItems: inventory.length
      })
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid type parameter. Use "xp_history" or "inventory"' 
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch user data' 
      },
      { status: 500 }
    )
  }
}
