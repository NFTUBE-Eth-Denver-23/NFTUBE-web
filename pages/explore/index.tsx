export { default } from "containers/explore"

export const getServerSideProps = async (context: any) => {
  const { query } = context
  return {
    props: { tab: query.tab || "" },
  }
}
