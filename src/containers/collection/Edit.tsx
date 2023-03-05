import React, { useEffect, useState } from "react"
import CollectionEdit from "components/CollectionEdit"
import { MainNavbar } from "components/MainNavbar"
import { Spacing, Text } from "components/ui"
import styled from "@emotion/styled"
import { DefaultCollection } from "types/Collection"
import { queryCollection } from "api/collections"
import { Path } from "utils/url"
import { useQuery } from "react-query"

export default function Edit() {
  const [editedCollection, setEditedCollection] = useState(DefaultCollection)
  const id = Path.get("id")

  const { data: collectionData, isLoading: collectionLoading } = useQuery(
    id && ["query_collection_by_id", id],
    async () => {
      return await queryCollection(id)
    }
  )

  useEffect(() => {
    if (collectionData?.collectionId) {
      setEditedCollection(collectionData)
    }
  }, [collectionData])

  return (
    <React.Fragment>
      <MainNavbar />
      <Spacing height={40} />
      <TitleContainer>
        <Text weight={700} size={25}>
          Edit your collection
        </Text>
      </TitleContainer>
      <Spacing height={20} />
      <CollectionEdit
        isLoading={collectionLoading}
        editedCollection={editedCollection}
        setEditedCollection={setEditedCollection}
      />
    </React.Fragment>
  )
}

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`
