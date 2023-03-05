import React, { useState, useRef, useImperativeHandle, forwardRef } from "react"
import styled from "@emotion/styled"
import Lottie from "react-lottie"
import animationData from "public/lotties/splash.json"
import { colors } from "constants/colors"
export type SplashScreenHandlerType = {
  complete: () => void
  loading: () => void
}

const SplashScreen = (_: any, ref: React.Ref<any>) => {
  const [loading, setLoading] = useState(true)

  useImperativeHandle(ref, () => {
    return {
      complete: () => setLoading(false),
      loading: () => setLoading(true),
    }
  })
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid",
    },
  }

  return loading ? (
    <Container>
      <Layout>
        <Lottie options={defaultOptions} />
      </Layout>
    </Container>
  ) : null
}

export default forwardRef(SplashScreen)

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${colors.white};
`
const Layout = styled.div`
  width: 50%;
  height: 50%;
`
