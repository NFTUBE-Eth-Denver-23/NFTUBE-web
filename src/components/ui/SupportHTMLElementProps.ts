export type ElementType = keyof JSX.IntrinsicElements

export interface SupportHTMLElementProps<T extends ElementType>
  extends Omit<React.AllHTMLAttributes<T>, "as"> {
  as?: T
}
