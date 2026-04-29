import style from "./style.module.scss";

interface TypographyProps {
  variant?: "h1" | "h2" | "h3" | "body" | "small";
  children: React.ReactNode;
  className?: string;
}

const Typography = ({
  variant = "body",
  children,
  className,
}: TypographyProps) => {
  const Tag = variant === "h1" || variant === "h2" || variant === "h3" ? variant : "span";
  const classes = `${style[variant]} ${className || ""}`.trim();

  return (
    <Tag className={classes}>
      {children}
    </Tag>
  );
};

export default Typography;
