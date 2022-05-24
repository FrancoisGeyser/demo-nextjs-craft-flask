import { useEditor } from '@craftjs/core'
import { Tooltip, Snackbar } from '@material-ui/core'
import cx from 'classnames'
import React from 'react'
import styled from 'styled-components'

import { API } from '@/api/api'

import Checkmark from '../../../public/icons/check.svg'
import Customize from '../../../public/icons/customize.svg'
import RedoSvg from '../../../public/icons/toolbox/redo.svg'
import UndoSvg from '../../../public/icons/toolbox/undo.svg'

import lz from 'lzutf8'

const HeaderDiv = styled.div`
  width: 100%;
  height: 45px;
  z-index: 99999;
  position: relative;
  padding: 0px 10px;
  background: #d4d4d4;
  display: flex;
`

const Btn = styled.a`
  display: flex;
  align-items: center;
  padding: 5px 15px;
  margin: 0 5px;
  border-radius: 3px;
  color: #fff;
  font-size: 13px;
  svg {
    margin-right: 6px;
    width: 12px;
    height: 12px;
    fill: #fff;
    opacity: 0.9;
  }
`

const InputContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
`
const Input = styled.input`
  color: gray;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  border: none;
  outline: none;
  padding-left: 5px;
`

const Item = styled.a<{ disabled?: boolean }>`
  margin-right: 10px;
  cursor: pointer;
  svg {
    width: 20px;
    height: 20px;
    fill: #707070;
  }
  ${(props) =>
    props.disabled &&
    `
    opacity:0.5;
    cursor: not-allowed;
  `}
`

export const Header = () => {
  const { enabled, canUndo, canRedo, actions, query } = useEditor(
    (state, query) => ({
      enabled: state.options.enabled,
      canUndo: query.history.canUndo(),
      canRedo: query.history.canRedo(),
    })
  )

  const [snackbarMessage, setSnackbarMessage] = React.useState()
  const [pageName, setPageName] = React.useState('Untitled')

  const getData = async () => {
    const dataReturned = await API.profile.getProfile()
    if (!dataReturned || !dataReturned?.profile) {
      setSnackbarMessage('Nothing to load')
      return
    }
    const { site, page_name } = await dataReturned.profile[dataReturned.profile.length - 1]
    setPageName(page_name)

    const json = lz.decompress(lz.decodeBase64(site));
    actions.deserialize(json)
    setSnackbarMessage('Loaded')
  }

  React.useEffect(()=>{
   getData()
  },[])

  return (
    <HeaderDiv className="header text-white transition w-full">
      <div className="items-center flex w-full px-4 justify-end">
        {enabled && (
          <div className="flex-1 flex">
            <Tooltip title="Undo" placement="bottom">
              <Item disabled={!canUndo} onClick={() => actions.history.undo()}>
                <UndoSvg />
              </Item>
            </Tooltip>
            <Tooltip title="Redo" placement="bottom">
              <Item disabled={!canRedo} onClick={() => actions.history.redo()}>
                <RedoSvg />
              </Item>
            </Tooltip>
            <InputContainer>
              <Input
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
              />
            </InputContainer>
          </div>
        )}
        <div className="flex px-4">
          <Btn
            className={cx([
              'transition cursor-pointer',
              {
                'bg-orange-400': !enabled,
                'bg-green-400': enabled,
              },
            ])}
            onClick={() => {
              actions.setOptions((options) => (options.enabled = !enabled))
            }}
          >
            {enabled ? 'Preview' : 'Edit'}
          </Btn>
          <Btn
            className={cx(['transition cursor-pointer', 'bg-red'])}
            onClick={() => {
              const json = query.serialize()
                const encodedJson = lz.encodeBase64(lz.compress(json))
              API.profile.update({ site: encodedJson, page_name: pageName })
              setSnackbarMessage('Saved')
            }}
          >
            <Customize />
            Save
          </Btn>
          <Btn
            className={cx(['transition cursor-pointer', 'bg-primary'])}
            onClick={() => getData()}
          >
            <Checkmark />
            Load
          </Btn>
        </div>
      </div>
      <Snackbar
        autoHideDuration={1000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={!!snackbarMessage}
        onClose={() => setSnackbarMessage(null)}
        message={<span>{snackbarMessage}</span>}
      />
    </HeaderDiv>
  )
}
