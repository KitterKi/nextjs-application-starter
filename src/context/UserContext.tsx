'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface UserStats {
  strength: number
  intelligence: number
  creativity: number
  charisma: number
}

export interface UserProfile {
  id: string
  username: string
  level: number
  xp: number
  xpToNextLevel: number
  stats: UserStats
  avatar: {
    hair: string
    outfit: string
    accessory: string
    background: string
  }
  inventory: string[]
  badges: string[]
}

interface UserContextType {
  user: UserProfile
  updateUser: (updates: Partial<UserProfile>) => void
  addXP: (amount: number, statType?: keyof UserStats) => void
  addLoot: (item: string) => void
  updateAvatar: (avatarUpdates: Partial<UserProfile['avatar']>) => void
}

const defaultUser: UserProfile = {
  id: '1',
  username: 'Player',
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  stats: {
    strength: 10,
    intelligence: 10,
    creativity: 10,
    charisma: 10
  },
  avatar: {
    hair: 'short-brown',
    outfit: 'casual-blue',
    accessory: 'none',
    background: 'forest'
  },
  inventory: [],
  badges: []
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(defaultUser)

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }))
  }

  const addXP = (amount: number, statType?: keyof UserStats) => {
    setUser(prev => {
      const newXP = prev.xp + amount
      let newLevel = prev.level
      let newXPToNext = prev.xpToNextLevel
      
      // Level up logic
      if (newXP >= prev.xpToNextLevel) {
        newLevel += 1
        newXPToNext = newLevel * 100 // Simple progression formula
      }

      const newStats = { ...prev.stats }
      if (statType) {
        newStats[statType] += Math.floor(amount / 10) // Stat gain based on XP
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        xpToNextLevel: newXPToNext,
        stats: newStats
      }
    })
  }

  const addLoot = (item: string) => {
    setUser(prev => ({
      ...prev,
      inventory: [...prev.inventory, item]
    }))
  }

  const updateAvatar = (avatarUpdates: Partial<UserProfile['avatar']>) => {
    setUser(prev => ({
      ...prev,
      avatar: { ...prev.avatar, ...avatarUpdates }
    }))
  }

  return (
    <UserContext.Provider value={{
      user,
      updateUser,
      addXP,
      addLoot,
      updateAvatar
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
