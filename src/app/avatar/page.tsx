'use client'

import { useState } from 'react'
import { useUser } from '@/context/UserContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { ArrowLeft, Save, RotateCcw, Palette, Shirt, Glasses, Mountain } from 'lucide-react'
import { toast } from 'sonner'
import AvatarCustomization from '@/components/AvatarCustomization'

export default function AvatarPage() {
  const { user, updateAvatar } = useUser()
  const [tempAvatar, setTempAvatar] = useState(user.avatar)
  const [hasChanges, setHasChanges] = useState(false)

  const handleAvatarChange = (updates: Partial<typeof user.avatar>) => {
    setTempAvatar(prev => ({ ...prev, ...updates }))
    setHasChanges(true)
  }

  const handleSave = () => {
    updateAvatar(tempAvatar)
    setHasChanges(false)
    toast.success('Avatar saved successfully!', {
      description: 'Your character has been updated.',
    })
  }

  const handleReset = () => {
    setTempAvatar(user.avatar)
    setHasChanges(false)
    toast.info('Changes reset', {
      description: 'Avatar reverted to last saved state.',
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
                <h1 className="text-2xl font-bold text-white">Avatar Customization</h1>
                <p className="text-sm text-gray-300">Personalize your character</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {hasChanges && (
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              )}
              <Button 
                onClick={handleSave}
                disabled={!hasChanges}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Avatar Preview */}
          <div className="space-y-6">
            <Card className="bg-black/40 border-white/10 text-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-5 h-5 text-purple-400" />
                  <span>Avatar Preview</span>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  See how your character looks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AvatarCustomization 
                  avatar={tempAvatar}
                  onChange={handleAvatarChange}
                />
              </CardContent>
            </Card>

            {/* Character Stats */}
            <Card className="bg-black/40 border-white/10 text-white">
              <CardHeader>
                <CardTitle>Character Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <div className="text-2xl font-bold text-purple-400">{user.level}</div>
                    <div className="text-sm text-gray-400">Level</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <div className="text-2xl font-bold text-yellow-400">{user.xp}</div>
                    <div className="text-sm text-gray-400">Total XP</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Equipped Items</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Hair:</span>
                      <span className="capitalize">{tempAvatar.hair.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Outfit:</span>
                      <span className="capitalize">{tempAvatar.outfit.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Accessory:</span>
                      <span className="capitalize">{tempAvatar.accessory === 'none' ? 'None' : tempAvatar.accessory.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Background:</span>
                      <span className="capitalize">{tempAvatar.background}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customization Options */}
          <div className="space-y-6">
            <Card className="bg-black/40 border-white/10 text-white">
              <CardHeader>
                <CardTitle>Customization Options</CardTitle>
                <CardDescription className="text-gray-300">
                  Customize your avatar's appearance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="hair" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4 bg-black/40 border-white/10">
                    <TabsTrigger value="hair" className="text-white data-[state=active]:bg-purple-600">
                      <Palette className="w-4 h-4 mr-1" />
                      Hair
                    </TabsTrigger>
                    <TabsTrigger value="outfit" className="text-white data-[state=active]:bg-purple-600">
                      <Shirt className="w-4 h-4 mr-1" />
                      Outfit
                    </TabsTrigger>
                    <TabsTrigger value="accessory" className="text-white data-[state=active]:bg-purple-600">
                      <Glasses className="w-4 h-4 mr-1" />
                      Accessory
                    </TabsTrigger>
                    <TabsTrigger value="background" className="text-white data-[state=active]:bg-purple-600">
                      <Mountain className="w-4 h-4 mr-1" />
                      Background
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="hair" className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Hair Style</label>
                      <Select 
                        value={tempAvatar.hair} 
                        onValueChange={(value) => handleAvatarChange({ hair: value })}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short-brown">Short Brown</SelectItem>
                          <SelectItem value="long-blonde">Long Blonde</SelectItem>
                          <SelectItem value="curly-black">Curly Black</SelectItem>
                          <SelectItem value="pixie-red">Pixie Red</SelectItem>
                          <SelectItem value="braided-purple">Braided Purple</SelectItem>
                          <SelectItem value="mohawk-blue">Mohawk Blue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="outfit" className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Outfit Style</label>
                      <Select 
                        value={tempAvatar.outfit} 
                        onValueChange={(value) => handleAvatarChange({ outfit: value })}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="casual-blue">Casual Blue</SelectItem>
                          <SelectItem value="formal-black">Formal Black</SelectItem>
                          <SelectItem value="sporty-red">Sporty Red</SelectItem>
                          <SelectItem value="artistic-purple">Artistic Purple</SelectItem>
                          <SelectItem value="tech-gray">Tech Gray</SelectItem>
                          <SelectItem value="adventure-green">Adventure Green</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="accessory" className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Accessory</label>
                      <Select 
                        value={tempAvatar.accessory} 
                        onValueChange={(value) => handleAvatarChange({ accessory: value })}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="glasses-round">Round Glasses</SelectItem>
                          <SelectItem value="glasses-square">Square Glasses</SelectItem>
                          <SelectItem value="hat-cap">Baseball Cap</SelectItem>
                          <SelectItem value="hat-beanie">Beanie</SelectItem>
                          <SelectItem value="earrings-gold">Gold Earrings</SelectItem>
                          <SelectItem value="necklace-silver">Silver Necklace</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="background" className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Background Scene</label>
                      <Select 
                        value={tempAvatar.background} 
                        onValueChange={(value) => handleAvatarChange({ background: value })}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="forest">Mystical Forest</SelectItem>
                          <SelectItem value="city">Modern City</SelectItem>
                          <SelectItem value="space">Cosmic Space</SelectItem>
                          <SelectItem value="beach">Tropical Beach</SelectItem>
                          <SelectItem value="mountain">Snow Mountain</SelectItem>
                          <SelectItem value="library">Ancient Library</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Inventory */}
            <Card className="bg-black/40 border-white/10 text-white">
              <CardHeader>
                <CardTitle>Inventory</CardTitle>
                <CardDescription className="text-gray-300">
                  Items you've collected from events
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user.inventory.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {user.inventory.map((item, index) => (
                      <Badge key={index} variant="secondary" className="justify-center p-2">
                        {item}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Glasses className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No items yet</p>
                    <p className="text-sm">Join events to collect items!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
