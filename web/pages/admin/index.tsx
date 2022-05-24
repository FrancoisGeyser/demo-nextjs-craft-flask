import { Editor, Frame, Element } from '@craftjs/core'
import { NextSeo } from 'next-seo'
import React from 'react'

import { Viewport, RenderNode } from '@/components/editor'
import { Container, Text } from '@/components/selectors'
import { Button } from '@/components/selectors/Button'
import { Custom1, OnlyButtons } from '@/components/selectors/Custom1'
import { Custom2, Custom2VideoDrop } from '@/components/selectors/Custom2'
import { Custom3, Custom3BtnDrop } from '@/components/selectors/Custom3'
import { Video } from '@/components/selectors/Video'
import { useAuthOnly } from '@/hooks/useAuth'

function App() {
  useAuthOnly()
  const [enabled, setEnabled] = React.useState(true)

  return (
    <div className="h-full h-screen">
      <NextSeo
        title="Admin page"
        description="Using CraftJS framework for building drag-n-drop page editors."
      />
      <Editor
        resolver={{
          Container,
          Text,
          Custom1,
          Custom2,
          Custom2VideoDrop,
          Custom3,
          Custom3BtnDrop,
          OnlyButtons,
          Button,
          Video,
        }}
        enabled={enabled}
        onRender={RenderNode}
      >
        <Viewport>
          <Frame>
            <Element
              canvas
              is={Container}
              width="100%"
              height="auto"
              background={{ r: 255, g: 255, b: 255, a: 1 }}
              padding={['40', '40', '40', '40']}
              custom={{ displayName: 'App' }}
            />
          </Frame>
        </Viewport>
      </Editor>
    </div>
  )
}

export default App
