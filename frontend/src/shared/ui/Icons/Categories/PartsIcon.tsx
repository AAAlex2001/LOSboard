interface IconProps {
  className?: string;
}

const PartsIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M12.3 6.72a6.66 6.66 0 0 1 6.82-1.48c.4.15.47.65.17.95l-2.9 2.9a1.25 1.25 0 0 0 0 1.77l1.13 1.13a1.25 1.25 0 0 0 1.77 0l2.9-2.9c.3-.3.8-.22.95.17a6.66 6.66 0 0 1-8.71 8.71c-.41-.13-.87-.05-1.18.25L7.91 23.45a2.21 2.21 0 0 1-3.12.05 2.21 2.21 0 0 1 .05-3.12L10.62 14.6a1.25 1.25 0 0 0 .25-1.18 6.66 6.66 0 0 1 1.43-6.7z"
      stroke="#1129BD"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M27.24 29.05a1.93 1.93 0 1 0 0-3.87 1.93 1.93 0 0 0 0 3.87z"
      stroke="#1129BD"
      strokeWidth="2"
    />
    <path
      d="M21.44 27.11h3.87M29.17 27.11h3.87M24.34 32.14l1.93-3.35M28.21 25.44l1.93-3.35M30.14 32.14l-1.93-3.35M26.27 25.44l-1.93-3.35M22.41 18.74a9.66 9.66 0 0 1 14.5 8.37 9.66 9.66 0 0 1-19.33 0c0-1.76.47-3.41 1.29-4.83"
      stroke="#1129BD"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M30.14 32.14a5.8 5.8 0 0 1-7.5-1.49 5.8 5.8 0 0 1-1.19-3.91 5.8 5.8 0 0 1 1.69-3.7 5.8 5.8 0 0 1 3.7-1.69 5.8 5.8 0 0 1 3.91 1.18 5.8 5.8 0 0 1 2.13 3.47 5.8 5.8 0 0 1-.65 4.03"
      stroke="#1129BD"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default PartsIcon;
