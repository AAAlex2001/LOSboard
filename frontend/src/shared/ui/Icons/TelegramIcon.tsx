interface TelegramIconProps {
  className?: string;
}

const TelegramIcon = ({ className }: TelegramIconProps) => (
  <svg
    className={className}
    width="35"
    height="30"
    viewBox="0 0 35 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M32.6376 0.197257L1.63428 12.416C-0.481562 13.2846 -0.469322 14.4909 1.24609 15.0289L9.20587 17.5666L27.6225 5.69098C28.4933 5.14947 29.2889 5.44078 28.6349 6.03411L13.7138 19.797H13.7103L13.7138 19.7988L13.1648 28.1841C13.9691 28.1841 14.3241 27.807 14.7753 27.362L18.6415 23.5197L26.6835 29.5906C28.1663 30.4252 29.2312 29.9963 29.6002 28.1877L34.8793 2.76004C35.4196 0.545753 34.0522 -0.456842 32.6376 0.197257Z"
      fill="white"
    />
  </svg>
);

export default TelegramIcon;
