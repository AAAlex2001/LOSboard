import type { SVGProps } from "react";

const UrgentIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M31 10.8L30 10V2C30 0.8 29.2 0 28 0C26.8 0 26 0.8 26 2V3C22 4.8 16 8 10 8H5C2.2 8 0 10.4 0 13C0 14.8 1 16.4 2.4 17.2L4.6 29C4.6 29.6 5.2 30 6 30H6.4L13.6 28.6C14.4 28.4 14.8 27.8 14.6 27.2C14 26 13 24.2 12.2 23.6C11.8 23.4 11.2 21.8 10.8 20H12V18.2C17.4 18.8 24 21.4 26 23V24C26 25.2 26.8 26 28 26C29.2 26 30 25.2 30 24V16L30.8 15.4C31.6 14.8 32 14 32 13.2V12.8C32 12 31.6 11.4 31 10.8ZM4 10H10V12H4V10ZM11.2 25.2C11.4 25.2 11.8 25.8 12.2 26.6L6.6 28L4.6 18H8.4C8.8 20.6 9.6 24.4 11.2 25.2ZM26 20.6C22.8 19 17.2 16.6 12 16V10C17.2 9.4 22.8 7.2 26 5.4V20.6Z"
      fill="currentColor"
    />
  </svg>
);

export default UrgentIcon;
