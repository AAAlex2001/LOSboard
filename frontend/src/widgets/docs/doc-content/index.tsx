import style from "./style.module.scss";

export type DocBlock =
  | { type: "paragraph"; text: string; bold?: boolean }
  | { type: "list"; items: string[] };

export interface DocSection {
  heading?: string;
  blocks: DocBlock[];
}

interface DocContentProps {
  sections: DocSection[];
}

export const DocContent = ({ sections }: DocContentProps) => {
  return (
    <div className={style.content}>
      {sections.map((section, index) => (
        <section key={index} className={style.section}>
          {section.heading && (
            <h2 className={style.sectionTitle}>{section.heading}</h2>
          )}
          {section.blocks.map((block, blockIndex) => {
            if (block.type === "list") {
              return (
                <ul key={blockIndex} className={style.list}>
                  {block.items.map((item, i) => (
                    <li key={i} className={style.listItem}>
                      {item}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p
                key={blockIndex}
                className={`${style.paragraph} ${
                  block.bold ? style.paragraphBold : ""
                }`}
              >
                {block.text}
              </p>
            );
          })}
        </section>
      ))}
    </div>
  );
};
