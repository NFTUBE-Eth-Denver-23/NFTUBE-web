import styled from "@emotion/styled"
import { Spacing, Text } from "components/ui"
import CollectionEdit from "components/CollectionEdit"
import { Collection } from "types/Collection"

export default function ConfigureCollection({
  editedCollection,
  setEditedCollection,
  onClick,
  onSuccess,
  isNew,
}: {
  editedCollection: Collection
  setEditedCollection: (editedCollection: Collection) => void
  onClick?: (editedCollection: Collection) => Promise<void>
  onSuccess?: () => void
  isNew?: boolean
}) {
  return (
    <Container>
      <TitleContainer>
        <Text weight={700} size={25}>
          Configure collection
        </Text>
      </TitleContainer>
      <Scroll>
        <CollectionEdit
          isNew
          editedCollection={editedCollection}
          setEditedCollection={setEditedCollection}
          onClick={onClick}
          onSuccess={onSuccess}
        />
      </Scroll>
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
`

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 20px;
`

const Scroll = styled.div`
  height: 100%;
  flex: 1;
  overflow: auto;
`
