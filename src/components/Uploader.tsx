import { useCallback, useState } from "react"

import { useModal } from "hooks/useModal"
import styled from "@emotion/styled"
import { Text } from "components/ui"
import Button from "components/ui/Buttons"
import { colors } from "constants/colors"
import { getS3SignedUrl, uploadFileToPresignedUrl } from "src/services/s3"
import { useUser } from "hooks/useAuth"
import { useDropzone } from "react-dropzone"
import { v4 as uuidv4 } from "uuid"
import { AssetType } from "types/Asset"

export function useUploaderDialog() {
  const { open, close } = useModal()
  return useCallback(
    ({
      multiple,
      callback,
    }: {
      multiple: boolean
      callback: (urls: Array<string>) => void
    }) => {
      open(
        <UploaderModal
          multiple={multiple}
          callback={callback}
          onClose={close}
        />
      )
    },
    [open, close]
  )
}

export function UploaderModal({
  multiple,
  onClose,
  callback,
}: {
  multiple: boolean
  onClose: () => void
  callback: (urls: Array<string>) => void
}) {
  const { user } = useUser()
  const [steps, setSteps] = useState(0)
  const [totalSteps, setTotalSteps] = useState(0)

  const { getRootProps } = useDropzone({
    multiple,
    onDrop: async (files) => {
      setTotalSteps(files.length)

      const assets = files.map((file) => {
        return {
          assetType: file.type.split("/")[0] as AssetType,
          fileType: file.type,
          assetId: `${uuidv4()}.${file.type.split("/")[1]}`,
        }
      })
      const presignedUrls = await getS3SignedUrl({
        userId: user?.userId,
        assets,
      })

      const uploadedUrls: Array<string> = []
      await Promise.all(
        presignedUrls?.map(async (presignedUrl, i) => {
          const uploadedUrl = await uploadFileToPresignedUrl(
            presignedUrl,
            files[i],
            files[i].type
          )
          uploadedUrls.push(uploadedUrl)
          setSteps(steps + 1)
        })
      )

      setTotalSteps(0)
      console.log("UP: ", uploadedUrls)
      callback(uploadedUrls)
      onClose()
    },
  })

  return (
    <Container {...getRootProps()}>
      <Button loading={totalSteps > 0 ? true : false} style={{ width: 200 }}>
        Upload a File
      </Button>
      {/* <Spinner></Spinner> */}
      <TextContainer>
        <Text weight={600} size={18} color={colors.gray2}>
          {totalSteps
            ? `${steps} out of ${totalSteps} uploaded`
            : "...or drag and drop a file."}
        </Text>
      </TextContainer>
    </Container>
  )
}

const Container = styled.div`
  max-width: 700px;
  min-width: 300px;
  min-height: 300px;
  width: 70vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
  border: dashed 2px ${colors.gray2};
  padding: 30px;
  margin-top: 35px;
  border-radius: 10px;
`

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`
