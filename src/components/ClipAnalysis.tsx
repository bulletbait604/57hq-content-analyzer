'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ClipAnalysis() {
  return (
    <Card className="bg-black border-green-500/30">
      <CardHeader>
        <CardTitle className="text-green-400">Clip Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center text-gray-400">
          <p>Clip analysis feature coming soon...</p>
        </div>
      </CardContent>
    </Card>
  )
}
