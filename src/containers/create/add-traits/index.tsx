import styled from "@emotion/styled"
import { Input, Spacing, Text } from "components/ui"
import AddCircleIcon from "components/icons/AddCircleIcon"
import { colors } from "constants/colors"
import Button from "components/ui/Buttons"
import Image from "next/image"
import { useAddTraitDialog } from "./AddTraitModal"
import { NFT } from "types/NFT"
import XIcon from "components/icons/XIcon"
import { insert, remove } from "utils/format/array"

export default function AddTraits({
  editedNFTs,
  setEditedNFTs,
  isLoading,
  onClick,
}: {
  editedNFTs: Array<NFT>
  setEditedNFTs: (nfts: Array<NFT>) => void
  isLoading: boolean
  onClick: () => void
}) {
  return (
    <Container>
      <Header>
        <TitleContainer>
          <Text weight={700} size={25}>
            Add traits to NFTs (optional)
          </Text>
        </TitleContainer>
        <Spacing height={10} />
      </Header>
      <Scroll>
        <TraitHeader editedNFTs={editedNFTs} setEditedNFTs={setEditedNFTs} />
        {editedNFTs.map((nft: NFT, index) => {
          return (
            <TraitRow
              key={index}
              editedNFTs={editedNFTs}
              setEditedNFTs={setEditedNFTs}
              index={index}
            />
          )
        })}
      </Scroll>
      <Spacing height={20} />
      <StyledButton loading={isLoading} onClick={onClick}>
        Next
      </StyledButton>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  max-width: 1248px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Header = styled.div`
  padding-bottom: 20px;
`

const Scroll = styled.div`
  height: 100%;
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
  min-width: 1000px;
`

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 7px;
`

const AddNewContainer = styled.div`
  display: flex;
  align-items: center;
  flex-basis: 200px;
  flex-grow: 0;
  flex-shrink: 0;
  gap: 10px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`

const StyledButton = styled(Button)`
  max-width: 790px;
  width: 100%;
  margin-bottom: 30px;
`

function TraitRow({
  editedNFTs,
  setEditedNFTs,
  index,
}: {
  editedNFTs: Array<NFT>
  setEditedNFTs: (nfts: Array<NFT>) => void
  index: number
}) {
  const nft = editedNFTs[index]
  return (
    <Row>
      <NFTContainer>
        <ImageContainer>
          <Image
            width={100}
            height={100}
            src={nft.imageURL}
            layout="fill"
            objectFit="cover"
          ></Image>
        </ImageContainer>
        <Text weight={700} style={{ width: 200, textAlign: "center" }}>
          {nft.name}
        </Text>
      </NFTContainer>
      {nft?.traits?.map((trait, i) => {
        return (
          <InputContainer key={i}>
            <Input
              value={trait.value}
              onChange={(e) => {
                const newTraits = insert(
                  nft.traits,
                  { ...trait, value: e.target.value },
                  i
                )
                const newNFT = { ...nft, traits: newTraits }
                const newNFTs: Array<NFT> = insert(editedNFTs, newNFT, index)
                setEditedNFTs(newNFTs)
              }}
              placeholder={trait.trait_type}
              size={20}
            ></Input>
          </InputContainer>
        )
      })}
      <InputContainer>
        <Input disabled size={20} value="" placeholder=""></Input>
      </InputContainer>
    </Row>
  )
}

function TraitHeader({
  editedNFTs,
  setEditedNFTs,
}: {
  editedNFTs: Array<NFT>
  setEditedNFTs: (nfts: Array<NFT>) => void
}) {
  const openAddTraitDialog = useAddTraitDialog()
  return (
    <Row>
      <Spacing width={270} />
      {editedNFTs[0]?.traits?.map((trait, index) => {
        return (
          <InputContainer key={index}>
            <Text size={20} weight={700}>
              {trait.trait_type}
            </Text>
            <StyledXIcon
              onClick={() => {
                const newNFTs = editedNFTs.map((nft: NFT) => {
                  const newTraits = remove(nft.traits, index)
                  return { ...nft, traits: newTraits }
                })
                setEditedNFTs(newNFTs)
              }}
              width={13}
              height={13}
            />
          </InputContainer>
        )
      })}
      <AddNewContainer
        onClick={() =>
          openAddTraitDialog({
            callback: (trait) => {
              const newNFTs = editedNFTs.map((nft: NFT) => {
                const newTraits = [
                  ...nft.traits,
                  {
                    trait_type: trait,
                    value: "",
                  },
                ]
                return { ...nft, traits: newTraits }
              })

              setEditedNFTs(newNFTs)
            },
          })
        }
      >
        <AddCircleIcon color={colors.gray1} width={28} height={28} />
        <Text weight={600} size={20} color={colors.gray1}>
          Add New
        </Text>
      </AddNewContainer>
    </Row>
  )
}

const Row = styled.div`
  display: flex;
  max-width: 1000px;
  align-items: center;
  gap: 20px;
  height: 30px;
`

const NFTContainer = styled.div`
  flex-basis: 200px;
  flex-grow: 0;
  flex-shrink: 0;
  border-radius: 10px;
  gap: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const ImageContainer = styled.div`
  position: relative;
  width: 50px;
  height: 50px;
  overflow: hidden;
  border-radius: 10px;
  background-color: ${colors.gray4};
`

const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-basis: 200px;
  flex-grow: 0;
  flex-shrink: 0;
`

const StyledXIcon = styled(XIcon)`
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`
