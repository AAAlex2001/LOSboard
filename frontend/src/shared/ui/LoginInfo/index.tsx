import style from "./style.module.scss";
import Typography from "@/src/shared/ui/Typography";
import AddIcon from "../Icons/AddIcon";
import ChartIcon from "../Icons/ChartIcon";
import LikeIcon from "../Icons/LikeIcon";
import TimelineIcon from "../Icons/TimelineIcon";
import WriteIcon from "../Icons/WriteIcon";


const features = [
    {
        icon: <AddIcon />,
        title: "Размещайте объявления",
    },
    {
        icon: <WriteIcon />,
        title: "Общаться в чатах",
    },
    {   icon: <ChartIcon />,
        title: "Размещайте рекламу",
    },
    {   icon: <LikeIcon />,
        title: "Добавлять в избранное",
    },
    {   icon: <TimelineIcon />,
        title: "Смотреть статистику",
    },
]


export const LoginInfo = () => {
    return (
        <div className={style.loginInfo}>
            <Typography variant="h1">Что даёт аккаунт LOS</Typography>
            <div className={style.features}>
                {features.map((feature, index) => (
                    <div key={index} className={style.feature}>
                        <div className={style.icon}>{feature.icon}</div>
                        <Typography variant="h2">{feature.title}</Typography>
                    </div>
                ))}
            </div>
        </div>
    );
}