'use client'

import { useUser } from '@/context/UserContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { Trophy, Zap, Users, Calendar, Star, Sword, Brain, Palette, Heart, Activity } from 'lucide-react'
import StatProgress from '@/components/StatProgress'
import Leaderboard from '@/components/Leaderboard'
import Notifications from '@/components/Notifications'

export default function Dashboard() {
  const { user } = useUser()

  const xpPercentage = (user.xp / user.xpToNextLevel) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Lvl Up</h1>
                <p className="text-sm text-gray-300">Gamified Event Discovery</p>
              </div>
            </div>
            <nav className="flex space-x-4">
              <Link href="/events">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <Calendar className="w-4 h-4 mr-2" />
                  Events
                </Button>
              </Link>
              <Link href="/avatar">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <Users className="w-4 h-4 mr-2" />
                  Avatar
                </Button>
              </Link>
              <Link href="/dungeon">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <Sword className="w-4 h-4 mr-2" />
                  Dungeons
                </Button>
              </Link>
              <Link href="/activity">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <Activity className="w-4 h-4 mr-2" />
                  Activity
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Notifications */}
      <Notifications />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <Card className="bg-black/40 border-white/10 text-white">
              <CardHeader className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <CardTitle className="text-2xl">{user.username}</CardTitle>
                <CardDescription className="text-gray-300">
                  Level {user.level} Adventurer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>XP Progress</span>
                    <span>{user.xp}/{user.xpToNextLevel}</span>
                  </div>
                  <Progress value={xpPercentage} className="h-3" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                    <div className="text-lg font-bold">{user.level}</div>
                    <div className="text-xs text-gray-400">Level</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <Star className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                    <div className="text-lg font-bold">{user.inventory.length}</div>
                    <div className="text-xs text-gray-400">Items</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Recent Badges</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.badges.length > 0 ? (
                      user.badges.slice(-3).map((badge, index) => (
                        <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-300">
                          {badge}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">No badges yet. Join events to earn them!</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="stats" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-black/40 border-white/10">
                <TabsTrigger value="stats" className="text-white data-[state=active]:bg-purple-600">
                  Stats
                </TabsTrigger>
                <TabsTrigger value="leaderboard" className="text-white data-[state=active]:bg-purple-600">
                  Leaderboard
                </TabsTrigger>
                <TabsTrigger value="events" className="text-white data-[state=active]:bg-purple-600">
                  Quick Events
                </TabsTrigger>
              </TabsList>

              <TabsContent value="stats">
                <StatProgress />
              </TabsContent>

              <TabsContent value="leaderboard">
                <Leaderboard />
              </TabsContent>

              <TabsContent value="events">
                <Card className="bg-black/40 border-white/10 text-white">
                  <CardHeader>
                    <CardTitle>Recommended Events</CardTitle>
                    <CardDescription className="text-gray-300">
                      Events perfect for your current level
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">Morning Yoga Session</h4>
                          <Badge className="bg-green-500/20 text-green-300">+15 XP</Badge>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">
                          Start your day with mindfulness and flexibility
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Heart className="w-4 h-4 text-red-400" />
                            <span className="text-xs">Strength +2</span>
                          </div>
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            Join Event
                          </Button>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">Tech Workshop</h4>
                          <Badge className="bg-blue-500/20 text-blue-300">+25 XP</Badge>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">
                          Learn the latest in web development
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Brain className="w-4 h-4 text-blue-400" />
                            <span className="text-xs">Intelligence +3</span>
                          </div>
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            Join Event
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Link href="/events">
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        View All Events
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
