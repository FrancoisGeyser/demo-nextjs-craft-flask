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
import { API } from '@/api/api'
import { useEditor } from '@craftjs/core'
import { Snackbar } from '@material-ui/core'
import lz from 'lzutf8'

const ViewWrapper = ({ setSnackbarMessage }) => {
  const { actions } = useEditor()
  const [pageName, setPageName] = React.useState('Untitled')

  const getData = async () => {
    const dataReturned = await API.profile.getProfile()
    if (!dataReturned || !dataReturned?.profile) {
      setSnackbarMessage('Nothing to load')
      return
    }
    const { site, page_name } = await dataReturned.profile[
      dataReturned.profile.length - 1
    ]
    setPageName(page_name)
    const json = lz.decompress(lz.decodeBase64(site));
    actions.deserialize(json)
    setSnackbarMessage('Loaded')
  }

  React.useEffect(() => {
    getData()
  }, [])

  return (
    <Frame>
      <Element
        canvas
        is={Container}
        width="800px"
        height="auto"
        background={{ r: 255, g: 255, b: 255, a: 1 }}
        padding={['40', '40', '40', '40']}
        custom={{ displayName: 'App' }}
      />
    </Frame>
  )
}

function App() {
  useAuthOnly()
  const [snackbarMessage, setSnackbarMessage] = React.useState()

  return (
    <div className="h-full h-screen">
      <NextSeo
        title="User page"
        description="Using CraftJS framework for building drag-n-drop page editors."
      />
      <div className="flex h-full overflow-hidden flex-row w-full fixed">
        <div className="craftjs-renderer flex-1 h-full w-full transition pb-8 overflow-auto">
          <div className="relative flex-col flex items-center">
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
              enabled={false}
            >
              <ViewWrapper setSnackbarMessage={setSnackbarMessage} />
            </Editor>
          </div>
        </div>
      </div>
      <Snackbar
        autoHideDuration={1000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={!!snackbarMessage}
        onClose={() => setSnackbarMessage(null)}
        message={<span>{snackbarMessage}</span>}
      />
    </div>
  )
}

export default App
