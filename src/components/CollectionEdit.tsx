import styled from "@emotion/styled"
import { Input, Select, Spacing, TextArea, TextButton } from "components/ui"
import DiscordIcon from "components/icons/DiscordIcon"
import WebsiteIcon from "components/icons/WebsiteIcon"
import TwitterIcon from "components/icons/TelegramIcon"
import TelegramIcon from "components/icons/TelegramIcon"
import MediumIcon from "components/icons/MediumIcon"
import Button from "components/ui/Buttons"
import { Upload } from "components/Upload"
import { Collection, CollectionType } from "./explore-tab-bar"
import { useUploaderDialog } from "./Uploader"
import { saveCollection } from "src/api/collections"
import { useUser } from "hooks/useAuth"
import { useMutation } from "react-query"
import { Toast } from "./ui/Toast"
import { useWeb3React } from "@web3-react/core"
import React from "react"
import useURLFormatInput, {
  urlFormatRefReturnType,
} from "hooks/common/useURLFormatInput"
import { validateURLsFormat } from "utils/format/url"

export default function CollectionEdit({
  editedCollection,
  setEditedCollection,
  onClick,
  onSuccess,
  isLoading,
  isNew,
}: {
  editedCollection: Collection
  setEditedCollection: (editedCollection: Collection) => void
  onClick?: (editedCollection: Collection) => Promise<void>
  onSuccess?: () => void
  isLoading?: boolean
  isNew?: boolean
}) {
  const { user } = useUser()
  const openUploader = useUploaderDialog()
  const { account } = useWeb3React()

  const [myProjectRef, myProjectValidationRes]: urlFormatRefReturnType =
    useURLFormatInput("project")
  const [
    twitterProjectRef,
    twitterProjectValidationRes,
  ]: urlFormatRefReturnType = useURLFormatInput("twitter")
  const [
    discordProjectRef,
    discordProjectValidationRes,
  ]: urlFormatRefReturnType = useURLFormatInput("discord")
  const [
    telegramProjectRef,
    telegramProjectValidationRes,
  ]: urlFormatRefReturnType = useURLFormatInput("telegram")
  const [mediumProjectRef, mediumProjectValidationRes]: urlFormatRefReturnType =
    useURLFormatInput("medium")

  const { mutate, isLoading: saveLoading } = useMutation(
    ["collection_save"],
    async () => {
      if (onClick) {
        await onClick({ ...editedCollection })
      } else {
        await saveCollection({
          collection: { ...editedCollection },
        })
      }
    },
    {
      onSuccess: () => {
        onSuccess ? onSuccess() : null
        Toast.success("Collection saved!")
      },
      onError: (error) => {
        Toast.error("Could not save collection. Please try again later.")
        console.log("save_collection error: ", error)
      },
    }
  )

  return (
    <Container>
      <DetailsContainer>
        {/* IMAGE */}
        <DetailsContent>
          <Upload
            src={editedCollection.mainPhoto}
            title="Featured image"
            label="Choose the cover photo of this collection"
            height="150"
            width="150"
            style={{
              borderRadius: "50%",
            }}
            callback={() =>
              openUploader({
                multiple: false,
                callback: (urls: Array<string>) => {
                  setEditedCollection({
                    ...editedCollection,
                    mainPhoto: urls[0],
                  })
                },
              })
            }
          />
          {/* COVER PHOTO */}
          <Upload
            src={editedCollection.coverPhoto}
            label="Choose the cover photo of this collection"
            height="150"
            callback={() =>
              openUploader({
                multiple: false,
                callback: (urls: Array<string>) => {
                  setEditedCollection({
                    ...editedCollection,
                    coverPhoto: urls[0],
                  })
                },
              })
            }
          />
          {/* NAME */}
          <Input
            value={editedCollection.name}
            onChange={(e) => {
              setEditedCollection({ ...editedCollection, name: e.target.value })
            }}
            title="Name"
            size={20}
            placeholder="Collection Name"
          />
          {/* DESCRIPTION */}
          <TextArea
            value={editedCollection.description}
            onChange={(e) => {
              setEditedCollection({
                ...editedCollection,
                description: e.target.value,
              })
            }}
            title="Description"
            label={
              <span>
                The description will be included in this collection’s detail
                page underneath the image.
                <TextButton size={15}>Markdown syntax</TextButton> is supported.
              </span>
            }
            placeholder="Provide a detailed description about this collection."
          />
          {/* LISTED */}
          <Select
            value={
              editedCollection.isListed
                ? LISTING_LABEL_BY_TYPE[ListingType.LISTED]
                : LISTING_LABEL_BY_TYPE[ListingType.HIDDEN]
            }
            onChange={(value) => {
              setEditedCollection({
                ...editedCollection,
                isListed: value.id == ListingType.LISTED,
              })
            }}
            title="Listed"
            label="Do you want to make this collection visible on NFTube?"
            options={Object.keys(ListingType).map((id: ListingType) => ({
              id,
              name: LISTING_LABEL_BY_TYPE[id],
            }))}
            placeholder="Is Listed"
          />
          {/* CATEGORY */}
          <Select
            value={CATEGORY_LABEL_BY_TYPE[editedCollection.category]}
            onChange={(value) => {
              setEditedCollection({
                ...editedCollection,
                category: value.id,
              })
            }}
            listHeight={300}
            title="Category"
            label="Adding a category will make your collection easily discoverable on NFTube."
            options={(
              Object.keys(CollectionType) as Array<keyof typeof CollectionType>
            ).map((id: string) => {
              return {
                id: CollectionType[id],
                name: CATEGORY_LABEL_BY_TYPE[CollectionType[id]],
              }
            })}
            placeholder="Category"
          />
          <Button
            loading={saveLoading || isLoading}
            onClick={() => {
              const isAllLinkValid = validateURLsFormat([
                myProjectValidationRes,
                twitterProjectValidationRes,
                discordProjectValidationRes,
                telegramProjectValidationRes,
                mediumProjectValidationRes,
              ])
              if (isAllLinkValid) {
                mutate()
              }
            }}
          >
            {isNew ? "Next" : "Save"}
          </Button>
        </DetailsContent>
      </DetailsContainer>
      <Spacing height={30} />
    </Container>
  )
}

export enum ListingType {
  LISTED = "LISTED",
  HIDDEN = "HIDDEN",
}

export enum BooleanType {
  TRUE = "TRUE",
  FALSE = "FALSE",
}

const BOOLEAN_BY_TYPE = {
  [BooleanType.TRUE]: "Yes",
  [BooleanType.FALSE]: "No",
}

const LISTING_LABEL_BY_TYPE = {
  [ListingType.LISTED]: "Listed",
  [ListingType.HIDDEN]: "Hidden",
}

const CATEGORY_LABEL_BY_TYPE = {
  [CollectionType.ALL]: "All",
  [CollectionType.ART]: "Art",
  [CollectionType.FASHION]: "Fashion",
  [CollectionType.DIGITAL]: "Digital",
  [CollectionType.CELEBRITY]: "Celebrity",
  [CollectionType.GAME]: "Game",
  [CollectionType.BRANDS]: "Brands",
  [CollectionType.COLLECTIBLES]: "Collectibles",
  [CollectionType.SPORTS]: "Sports",
  [CollectionType.MUSIC]: "Music",
}

const Container = styled.div`
  flex-direction: column;
  height: 100vh;
`

const DetailsContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`

const DetailsContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 700px;
  padding: 0px 24px;
  gap: 25px;
`

const SocialLinks = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 5px;
`
