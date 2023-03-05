import styled from "@emotion/styled"
import { ChangeEvent, useCallback, useState } from "react"

import { useModal } from "hooks/useModal"
import { Input, Select, Text } from "components/ui"
import Button from "components/ui/Buttons"
import { colors } from "constants/colors"
import { formatNumberConsideringFloat } from "utils/format/NumberFormat"

export function useLazyMintingOptionModal() {
  const { open, close } = useModal()
  return useCallback(
    ({
      callback,
    }: {
      callback: ({
        isMinted,
        mintPrice,
        isNFTImageScannable,
      }: {
        isMinted: boolean
        mintPrice: number
        isNFTImageScannable: boolean
      }) => Promise<void>
    }) => {
      open(<LazyMintingOptionModal onClose={close} callback={callback} />)
    },
    [open]
  )
}

function LazyMintingOptionModal({
  onClose,
  callback,
}: {
  onClose: () => void
  callback: ({
    isMinted,
    mintPrice,
    isNFTImageScannable,
  }: {
    isMinted: boolean
    mintPrice: number
    isNFTImageScannable: boolean
  }) => Promise<void>
}) {
  const [isNFTImageScannable, setIsNFTImageScannable] = useState<boolean>(false)
  const [isMinted, setIsMinted] = useState<boolean>(false)
  const [mintPrice, setMintPrice] = useState<number>(0)
  return (
    <Container>
      <Text weight={700} size={25}>
        Configure Minting
      </Text>
      <Text weight={600} size={17} color={colors.gray2}>
        Add a trait for this collection. (ex. Eyes, Hairstyle)
      </Text>
      <Select
        value={
          isNFTImageScannable
            ? BOOLEAN_BY_TYPE[BooleanType.TRUE]
            : BOOLEAN_BY_TYPE[BooleanType.FALSE]
        }
        onChange={(value) => {
          setIsNFTImageScannable(value.id == BooleanType.TRUE)
        }}
        title="Encode NFT Image"
        label="Assets become scannable images. Should the NFT images be scannable too?"
        options={Object.keys(BooleanType).map((id: BooleanType) => ({
          id,
          name: BOOLEAN_BY_TYPE[id],
        }))}
        placeholder="Requires shipping"
      />
      <Select
        value={
          !isMinted
            ? BOOLEAN_BY_TYPE[BooleanType.TRUE]
            : BOOLEAN_BY_TYPE[BooleanType.FALSE]
        }
        onChange={(value) => {
          setIsMinted(value.id != BooleanType.TRUE)
        }}
        title="Create for free (Lazy Mint)"
        label="Do you want to skip minting for now?"
        options={Object.keys(BooleanType).map((id: BooleanType) => ({
          id,
          name: BOOLEAN_BY_TYPE[id],
        }))}
        placeholder="Requires shipping"
      />
      {!isMinted && (
        <Input
          type="number"
          value={mintPrice}
          onChange={(e) => {
            const currentData: any = e.nativeEvent
            e.target.value = formatNumberConsideringFloat(
              e.target.value,
              currentData.data
            )
            setMintPrice(parseFloat(e.target.value))
          }}
          title="Mint Price in ETH"
          label="This is the price in ETH people will pay to mint each NFT"
          size={20}
          placeholder="0.0 ETH"
        />
      )}
      <Button
        onClick={async () => {
          await callback({
            isMinted,
            mintPrice,
            isNFTImageScannable,
          })
          onClose()
        }}
      >
        Continue
      </Button>
    </Container>
  )
}

const Container = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`

export enum BooleanType {
  TRUE = "TRUE",
  FALSE = "FALSE",
}

const BOOLEAN_BY_TYPE = {
  [BooleanType.TRUE]: "Yes",
  [BooleanType.FALSE]: "No",
}
