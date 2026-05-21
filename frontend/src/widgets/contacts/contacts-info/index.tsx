import style from "./style.module.scss";

export const ContactsInfo = () => {
  return (
    <div className={style.info}>
      <section className={style.section}>
        <h2 className={style.sectionTitle}>Контактные данные «LOS»</h2>

        <div className={style.cardsRow}>
          <div className={style.card}>
            <div className={style.entry}>
              <span className={style.entryLabel}>
                Связь с оператором через колл-центр по телефону:
              </span>
              <a href="tel:+79407361475" className={style.entryValue}>
                +7 940 736-14-75
              </a>
            </div>
            <div className={style.entry}>
              <span className={style.entryLabel}>
                Связь со специалистом через Чат Бот в Telegram канале:
              </span>
              <a href="tel:+79409707577" className={style.entryValue}>
                +7 940 970-75-77
              </a>
            </div>
          </div>

          <div className={style.card}>
            <div className={style.entryTight}>
              <span className={style.entryLabel}>Электронная почта:</span>
              <a
                href="mailto:landofsoulweb@yandex.com"
                className={`${style.entryValue} ${style.entryValueUnderline}`}
              >
                landofsoulweb@yandex.com
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className={style.section}>
        <h2 className={style.sectionTitle}>График работы офиса «LOS»</h2>

        <div className={style.workingHours}>
          <div className={style.card}>
            <div className={style.entryTight}>
              <span className={style.entryLabel}>Понедельник–суббота</span>
              <span className={style.entryValue}>с 9:00 до 18:00</span>
            </div>
          </div>
          <span className={style.dayOff}>Воскресенье — выходной</span>
        </div>
      </section>
    </div>
  );
};
