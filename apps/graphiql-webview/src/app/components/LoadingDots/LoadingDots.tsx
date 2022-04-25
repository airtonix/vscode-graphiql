import React from 'react'

import styles from './LoadingDots.module.css';

type LoadingDotsProps = {

}
export const LoadingDots = ({ }: LoadingDotsProps) => {
    return (
        <div className={styles.block}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
        </div>
    )

}
