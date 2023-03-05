import { MainNavbar } from "components/MainNavbar"
import styled from "@emotion/styled"
import { useRouter } from "next/router"
import { Input, Text, TextArea, TextButton } from "components/ui"
import DiscordIcon from "components/icons/DiscordIcon"
import WebsiteIcon from "components/icons/WebsiteIcon"
import TwitterIcon from "components/icons/TelegramIcon"
import TelegramIcon from "components/icons/TelegramIcon"
import MediumIcon from "components/icons/MediumIcon"
import Button from "components/ui/Buttons"
import { Upload } from "components/Upload"
import { useEffect, useState } from "react"
import { useUser } from "hooks/useAuth"
import { useMutation, useQuery } from "react-query"
import { useUploaderDialog } from "components/Uploader"
import { Toast } from "components/ui/Toast"
import { DefaultUser, User } from "types/User"
import { queryUserById, saveUser } from "api/users"
import { validateUserTag } from "components/auth/validate"
import { useLayoutEffect } from "react"

export default function ProfileEdit() {
  const { user, setUser } = useUser()
  const { push, replace } = useRouter()
  const openUploader = useUploaderDialog()

  const [editedUser, setEditedUser] = useState<User>(DefaultUser)

  const { isLoading: userLoading, data: userData } = useQuery(
    user.userId && ["query_user", user.userId],
    async () => {
      return await queryUserById(user.userId)
    },
    {
      // enabled: false,
      staleTime: Infinity,
    }
  )

  const { mutate, isLoading: saveLoading } = useMutation(
    ["user_update"],
    async () => {
      return await saveUser({
        user: {
          ...editedUser,
        },
      })
    },
    {
      onSuccess: (data) => {
        setUser({
          ...user,
          ...data,
        })
        Toast.success("Info updated!")
      },
      onError: (error) => {
        Toast.error("Could not update info. Please try again later.")
        console.log("user_update error: ", error)
      },
    }
  )

  useLayoutEffect(() => {
    if (!user.hasOwnProperty("userId")) {
      replace("/")
    }
  }, [user])
  useEffect(() => {
    if (userData?.userId) {
      setEditedUser(userData)
    }
  }, [userData])

  const onUserSave = async () => {
    if (
      editedUser.userTag != user.userTag
        ? await validateUserTag(editedUser.userTag)
        : true
    ) {
      mutate()
    }
  }

  return (
    <Container>
      <MainNavbar />
      <DetailsContainer>
        <DetailsContent>
          <TitleContainer>
            <Text weight={700} size={25}>
              Edit your profile
            </Text>
          </TitleContainer>
          <Upload
            src={editedUser.profilePhoto}
            title="Profile Image"
            label="Upload your profile photo"
            height="150"
            width="150"
            style={{
              borderRadius: "50%",
            }}
            callback={() =>
              openUploader({
                multiple: false,
                callback: (urls: Array<string>) => {
                  setEditedUser({ ...editedUser, profilePhoto: urls[0] })
                },
              })
            }
          />
          <Upload
            src={editedUser.coverPhoto}
            title="Cover image"
            label="Upload your profile cover photo"
            height="150"
            callback={() =>
              openUploader({
                multiple: false,
                callback: (urls: Array<string>) => {
                  setEditedUser({ ...editedUser, coverPhoto: urls[0] })
                },
              })
            }
          />
          <Input
            value={editedUser.userTag || ""}
            onChange={(e) => {
              setEditedUser({ ...editedUser, userTag: e.target.value })
            }}
            disabled={userLoading}
            title="ID"
            size={20}
            placeholder="(ex. 0xNFTube)"
          />
          <TextArea
            value={editedUser.description || ""}
            onChange={(e) => {
              setEditedUser({ ...editedUser, description: e.target.value })
            }}
            disabled={userLoading}
            title="Description"
            label={
              <span>
                The description will be included in your profile page underneath
                the image. <TextButton size={15}>Markdown syntax</TextButton> is
                supported.
              </span>
            }
            placeholder="Provide a detailed description about yourself."
          />
          <SocialLinks>
            <Input
              value={editedUser.socialLinks?.website || ""}
              onChange={(e) => {
                const socialLinks = { ...editedUser.socialLinks }
                setEditedUser({
                  ...editedUser,
                  socialLinks: {
                    ...socialLinks,
                    website: e.target.value,
                  },
                })
              }}
              disabled={userLoading}
              size={20}
              title="Links"
              label={<span>Adding links will help you promote yourself!</span>}
              placeholder="yoursite.io"
              left={<WebsiteIcon width={20} height={20} />}
            />
            <Input
              value={editedUser.socialLinks?.twitter || ""}
              onChange={(e) => {
                const socialLinks = { ...editedUser.socialLinks }
                setEditedUser({
                  ...editedUser,
                  socialLinks: {
                    ...socialLinks,
                    twitter: e.target.value,
                  },
                })
              }}
              disabled={userLoading}
              size={20}
              placeholder="https://twitter.com/your-self"
              left={<TwitterIcon width={20} height={20} />}
            />
            <Input
              value={editedUser.socialLinks?.discord || ""}
              onChange={(e) => {
                const socialLinks = { ...editedUser.socialLinks }
                setEditedUser({
                  ...editedUser,
                  socialLinks: {
                    ...socialLinks,
                    discord: e.target.value,
                  },
                })
              }}
              disabled={userLoading}
              size={20}
              placeholder="https://discord.com/your-self"
              left={<DiscordIcon width={20} height={20} />}
            />
            <Input
              value={editedUser.socialLinks?.telegram || ""}
              onChange={(e) => {
                const socialLinks = { ...editedUser.socialLinks }
                setEditedUser({
                  ...editedUser,
                  socialLinks: {
                    ...socialLinks,
                    telegram: e.target.value,
                  },
                })
              }}
              disabled={userLoading}
              size={20}
              placeholder="https://telegram.com/your-self"
              left={<TelegramIcon width={20} height={20} />}
            />
            <Input
              value={editedUser.socialLinks?.medium || ""}
              onChange={(e) => {
                const socialLinks = { ...editedUser.socialLinks }
                setEditedUser({
                  ...editedUser,
                  socialLinks: {
                    ...socialLinks,
                    medium: e.target.value,
                  },
                })
              }}
              disabled={userLoading}
              size={20}
              placeholder="https://medium.com/your-self"
              left={<MediumIcon width={20} height={20} />}
            />
          </SocialLinks>
          <Button loading={saveLoading} onClick={onUserSave}>
            Save
          </Button>
        </DetailsContent>
      </DetailsContainer>
    </Container>
  )
}

const Container = styled.div`
  flex-direction: column;
  height: 100vh;
`

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const DetailsContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 20px 0px;
`

const DetailsContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 700px;
  padding: 40px 24px;
  gap: 25px;
`

const SocialLinks = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 5px;
`
