import React, { useState } from 'react';
import styles from '../modules/Calendar.module.css';
import type { CalendarProps } from '../utils/types';

export const Calendar: React.FC<CalendarProps> = ({ plans = [], onDateSelect }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const monthNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];
    const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const handleDayClick = (day: number) => {
        const newDate = new Date(year, month, day);
        setSelectedDate(newDate);
        if (onDateSelect) onDateSelect(newDate);
    };

    return (
        <div className={styles.calendarWrapper}>
            <div className={styles.header}>
                <button onClick={prevMonth} className={styles.navButton}>&larr;</button>
                <div className={styles.monthYear}>{monthNames[month]} {year}</div>
                <button onClick={nextMonth} className={styles.navButton}>&rarr;</button>
            </div>

            <div className={styles.grid}>

                {daysOfWeek.map(day => (
                    <div key={day} className={styles.dayName}>{day}</div>
                ))}

                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                    <div key={`empty-${index}`} className={`${styles.dayCell} ${styles.empty}`} />
                ))}

                {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1;
                    const dateObj = new Date(year, month, day);
                    const dateKey = dateObj.toLocaleDateString('en-CA'); // 'YYYY-MM-DD' format

                    // Find plans specifically for this day
                    const dayPlans = plans.filter(p => p.dateKey === dateKey);
                    
                    // State checks for CSS classes
                    const isSelected = selectedDate?.toDateString() === dateObj.toDateString();
                    const isToday = new Date().toDateString() === dateObj.toDateString();

                    return (
                        <button
                            key={day}
                            onClick={() => handleDayClick(day)}
                            className={`
                                ${styles.dayCell} 
                                ${isSelected ? styles.selected : ""} 
                                ${isToday ? styles.today : ""}
                            `}
                        >
                            <span className={styles.dayNumber}>{day}</span>

                            {dayPlans.length > 0 && (
                                <div className={styles.eventDots}>
                                    {dayPlans.slice(0, 3).map((_, i) => (
                                        <span key={i} className={styles.eventDot} />
                                    ))}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};