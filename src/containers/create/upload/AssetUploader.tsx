import { useCallback, useState } from "react"
import styled from "@emotion/styled"
import { useModal } from "hooks/useModal"
import { UploaderModal } from "components/Uploader"
import { Text } from "components/ui"
import Button from "components/ui/Buttons"
import { colors } from "constants/colors"

export function useAssetUploaderDialog() {
  const { open, close } = useModal()
  return useCallback(
    ({
      mediaUploadCallback,
      productUploadCallback,
    }: {
      mediaUploadCallback: (urls: Array<string>) => void
      productUploadCallback: (urls: Array<string>) => void
    }) => {
      open(
        <AssetUploaderModal
          close={close}
          mediaUploadCallback={mediaUploadCallback}
          productUploadCallback={productUploadCallback}
        />
      )
    },
    [open, close]
  )
}

export enum UploaderState {
  SELECT_MEDIA_OR_PRODUCT,
  MEDIA,
  PRODUCT,
}

function AssetUploaderModal({
  close,
  mediaUploadCallback,
  productUploadCallback,
}) {
  const [state, setState] = useState(UploaderState.SELECT_MEDIA_OR_PRODUCT)

  return (
    <span>
      {state == UploaderState.SELECT_MEDIA_OR_PRODUCT ? (
        <Container>
          <Text weight={700} size={25}>
            Select Asset Type
          </Text>
          <Text weight={600} size={17} color={colors.gray2}>
            This is an asset that will represent your NFT
          </Text>
          <Button onClick={async () => setState(UploaderState.MEDIA)}>
            Media
          </Button>
          <Button onClick={async () => setState(UploaderState.PRODUCT)}>
            Product
          </Button>
        </Container>
      ) : state == UploaderState.MEDIA ? (
        <UploaderModal
          multiple
          onClose={close}
          callback={mediaUploadCallback}
        />
      ) : (
        <UploaderModal
          multiple
          onClose={close}
          callback={productUploadCallback}
        />
      )}
    </span>
  )
}

const Container = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`
