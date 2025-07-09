'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

interface AvatarProps {
  hair: string
  outfit: string
  accessory: string
  background: string
}

interface AvatarCustomizationProps {
  avatar: AvatarProps
  onChange: (updates: Partial<AvatarProps>) => void
}

const backgroundImages = {
  forest: 'https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg',
  city: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg',
  space: 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg',
  beach: 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg',
  mountain: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg',
  library: 'https://images.pexels.com/photos/2041540/pexels-photo-2041540.jpeg'
}

const hairStyles = {
  'short-brown': { color: '#8B4513', style: 'Short & Neat' },
  'long-blonde': { color: '#FFD700', style: 'Long & Flowing' },
  'curly-black': { color: '#000000', style: 'Curly & Bold' },
  'pixie-red': { color: '#FF4500', style: 'Pixie Cut' },
  'braided-purple': { color: '#8A2BE2', style: 'Braided' },
  'mohawk-blue': { color: '#0000FF', style: 'Mohawk' }
}

const outfitStyles = {
  'casual-blue': { color: '#4169E1', name: 'Casual Wear' },
  'formal-black': { color: '#000000', name: 'Formal Suit' },
  'sporty-red': { color: '#FF0000', name: 'Athletic Gear' },
  'artistic-purple': { color: '#8A2BE2', name: 'Artist Outfit' },
  'tech-gray': { color: '#708090', name: 'Tech Casual' },
  'adventure-green': { color: '#228B22', name: 'Adventure Gear' }
}

const accessories = {
  'none': { name: 'None', icon: '🚫' },
  'glasses-round': { name: 'Round Glasses', icon: '👓' },
  'glasses-square': { name: 'Square Glasses', icon: '🤓' },
  'hat-cap': { name: 'Baseball Cap', icon: '🧢' },
  'hat-beanie': { name: 'Beanie', icon: '🎩' },
  'earrings-gold': { name: 'Gold Earrings', icon: '💎' },
  'necklace-silver': { name: 'Silver Necklace', icon: '📿' }
}

export default function AvatarCustomization({ avatar, onChange }: AvatarCustomizationProps) {
  const backgroundImage = backgroundImages[avatar.background as keyof typeof backgroundImages]
  const hairInfo = hairStyles[avatar.hair as keyof typeof hairStyles]
  const outfitInfo = outfitStyles[avatar.outfit as keyof typeof outfitStyles]
  const accessoryInfo = accessories[avatar.accessory as keyof typeof accessories]

  return (
    <div className="space-y-6">
      {/* Avatar Display */}
      <div className="relative">
        <Card className="overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
          <CardContent className="p-0">
            <div className="relative h-80 w-full">
              {/* Background */}
              <Image
                src={backgroundImage}
                alt={`${avatar.background} background`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
              
              {/* Character Silhouette */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Character Base */}
                  <div className="w-32 h-40 bg-gradient-to-b from-amber-200 to-amber-300 rounded-full relative shadow-lg">
                    {/* Hair */}
                    <div 
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-20 h-16 rounded-full shadow-md"
                      style={{ backgroundColor: hairInfo.color }}
                    />
                    
                    {/* Face */}
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-16 h-20 bg-amber-200 rounded-full">
                      {/* Eyes */}
                      <div className="absolute top-6 left-3 w-2 h-2 bg-black rounded-full" />
                      <div className="absolute top-6 right-3 w-2 h-2 bg-black rounded-full" />
                      {/* Mouth */}
                      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-pink-400 rounded-full" />
                    </div>
                    
                    {/* Outfit */}
                    <div 
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-20 rounded-t-lg shadow-md"
                      style={{ backgroundColor: outfitInfo.color }}
                    />
                    
                    {/* Accessory */}
                    {avatar.accessory !== 'none' && (
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-2xl">
                        {accessoryInfo.icon}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Character Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
                  <div className="grid grid-cols-2 gap-2 text-xs text-white">
                    <div>
                      <span className="text-gray-300">Hair:</span>
                      <div className="font-semibold">{hairInfo.style}</div>
                    </div>
                    <div>
                      <span className="text-gray-300">Outfit:</span>
                      <div className="font-semibold">{outfitInfo.name}</div>
                    </div>
                    <div>
                      <span className="text-gray-300">Accessory:</span>
                      <div className="font-semibold">{accessoryInfo.name}</div>
                    </div>
                    <div>
                      <span className="text-gray-300">Scene:</span>
                      <div className="font-semibold capitalize">{avatar.background}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Style Badges */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-300">Current Style</h4>
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant="secondary" 
            className="bg-purple-500/20 text-purple-300 border-purple-500/30"
          >
            {hairInfo.style}
          </Badge>
          <Badge 
            variant="secondary" 
            className="bg-blue-500/20 text-blue-300 border-blue-500/30"
          >
            {outfitInfo.name}
          </Badge>
          {avatar.accessory !== 'none' && (
            <Badge 
              variant="secondary" 
              className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
            >
              {accessoryInfo.name}
            </Badge>
          )}
          <Badge 
            variant="secondary" 
            className="bg-green-500/20 text-green-300 border-green-500/30"
          >
            {avatar.background.charAt(0).toUpperCase() + avatar.background.slice(1)} Scene
          </Badge>
        </div>
      </div>

      {/* Style Tips */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
        <h4 className="font-semibold mb-2 text-blue-300">Style Tips</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Mix and match different styles to create your unique look</li>
          <li>• Earn new customization options by participating in events</li>
          <li>• Some accessories provide small XP bonuses</li>
          <li>• Your background reflects your adventure preferences</li>
        </ul>
      </div>
    </div>
  )
}
