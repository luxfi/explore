declare module '@luxfi/ui/skeleton' {
  export const Skeleton: React.ForwardRefExoticComponent<any>;
  export const SkeletonCircle: React.ForwardRefExoticComponent<any>;
  export const SkeletonText: React.ForwardRefExoticComponent<any>;
  export interface SkeletonProps {
    loading: boolean | undefined;
    [key: string]: any;
  }
}

declare module '@luxfi/ui/button' {
  export const Button: React.ForwardRefExoticComponent<any>;
  export interface ButtonProps { [key: string]: any; }
}

declare module '@luxfi/ui/*' {
  const component: any;
  export default component;
  export const _: any;
}
