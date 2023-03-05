import { useRecoilState } from "recoil"
import { userState } from "store/user/userState"

export function useUser() {
  const [user, setUser] = useRecoilState(userState)

  // useEffect(() => {
  //   Hub.listen("auth", async ({ payload: { event, data } }) => {
  //     switch (event) {
  //       case "signUp":
  //         break
  //       case "signIn":
  //         const signinData = await getUser()
  //         setUser({
  //           ...user,
  //           accessToken: signinData?.signInUserSession.accessToken.jwtToken,
  //           userId: signinData?.username,
  //         })
  //       case "cognitoHostedUI":
  //         const hostedUIData = await getUser()
  //         setUser({
  //           ...user,
  //           accessToken: hostedUIData?.signInUserSession.accessToken.jwtToken,
  //           userId: hostedUIData?.username,
  //         })
  //         break
  //       case "signOut":
  //         setUser({})
  //         break
  //       case "signIn_failure":
  //       case "cognitoHostedUI_failure":
  //         console.log("Sign in failure", data)
  //         break
  //     }
  //   })
  // }, [])

  return { user, setUser }
}
