import styles from "../../modules/Skeleton.module.css";
import type { Props } from "../../types/skeleton";


export const Skeleton: React.FC<Props> = ({width = "100%", height = "20px", borderRadius = "8px"}) => {
    return (
        <div
            className={styles.skeleton}
            style={{ width, height, borderRadius }}
        />
    );
};