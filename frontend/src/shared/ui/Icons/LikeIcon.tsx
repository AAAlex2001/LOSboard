interface LikeIconProps {
  className?: string;
}

const LikeIcon = ({ className }: LikeIconProps) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.66602 6.66666C8.66602 6.66666 8.6775 6.68332 8.03268 5.83333C7.29935 4.86666 6.21602 4.16666 4.91602 4.16666C2.84102 4.16666 1.16602 5.84166 1.16602 7.91666C1.16602 8.69166 1.39935 9.40833 1.79935 10C2.47435 11.0083 8.66602 17.5 8.66602 17.5M8.66602 6.66666C8.66602 6.66666 8.66602 7.08333 9.29935 5.83333C10.0327 4.86666 11.116 4.16666 12.416 4.16666C14.491 4.16666 16.166 5.84166 16.166 7.91666C16.166 8.69166 15.9327 9.40833 15.5327 10C14.8577 11.0083 8.66602 17.5 8.66602 17.5"
      stroke="#1129BD"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default LikeIcon;
