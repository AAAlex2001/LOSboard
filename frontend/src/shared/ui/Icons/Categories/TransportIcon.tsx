interface IconProps {
  className?: string;
}

const TransportIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g clipPath="url(#transport_clip)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.78 25.98c2.21 0 4 1.78 4 3.97s-1.79 3.97-4 3.97-4-1.78-4-3.97 1.79-3.97 4-3.97zm23 0c2.21 0 4 1.78 4 3.97s-1.79 3.97-4 3.97-4-1.78-4-3.97 1.79-3.97 4-3.97zM22.44 12.09l.54.4 7.67 5.71 6.1 1.51c1.68.42 2.88 1.85 3.02 3.53l.01.32v6.94l-1.51.38-1.64.4c.1-.44.15-.89.15-1.34 0-3.28-2.69-5.95-6-5.95s-6 2.66-6 5.95c0 .69.12 1.36.34 1.98H13.44c.23-.64.34-1.31.34-1.98 0-3.29-2.69-5.95-6-5.95-3.31 0-6 2.66-6 5.95 0 .3.02.6.07.89L-.22 28.78v-9.47l.46-.55 5-5.95.6-.72h16.6zM21.11 16.06H7.71l-3.33 3.97h19.4l1.14-1.14-3.81-2.83z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="transport_clip">
        <rect width="40" height="40" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default TransportIcon;
