import { useEffect, useState } from "react";
import { Navigation } from "../components/Navigation";
import { Calendar } from "../components/Calendar";
import { Footer } from "../components/Footer";
import { CalendarSkeleton } from "../skeletons/pages/CalendarSkeleton";
import { useUser } from "../contexts/UserContext";
import { API } from "../utils/API";
import { eventColors, times, type EventType } from "../utils/types";
import style from '../modules/CalendarPage.module.css';
import { formatTime, getToken, isPermitted, resetCalendarForm } from "../utils/Utils";
import { Toast, type PartialToast } from "../modals/Toast";
import { RedirectUser } from "../components/RedirectUser";

export interface Plan extends PartialPlan {
    id: number;
    dateKey: string;

}
export interface PartialPlan {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    color: string;
    eventType: EventType;
}


export const CalendarPage = () => {
    const { user, isLoading: userLoading } = useUser();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [toast, setToast] = useState<PartialToast | null>(null);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [updatingPlans, setUpdatingPlans] = useState<Set<number>>(new Set());
    const [deletingPlans, setDeletingPlans] = useState<Set<number>>(new Set());
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSaving,setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<PartialPlan>({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        color: '#2563eb',
        eventType: 'GENERAL' as EventType
    });

    const dateKey = selectedDate.toLocaleDateString('en-CA');
    const formattedDate = selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const todaysPlans = plans.filter(plan => plan.dateKey === dateKey);

    const timeOptions = times.map((time) => (<option key={time} value={time}>{time}</option>))
    const fetchAllEvents = async () => {
        try {
            const response = await fetch(`${API}/event/events`, { 
                method: 'GET',
                credentials: "include",
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                } 
            });
            if (!response.ok) {
                const error = await response.json();
                setToast({message: error.message ?? "Failed to find all events.",type:"error"});
                return;
                
            }
            const data = await response.json();
            setPlans(data);
        } catch (err) { 
            setToast({message: "Something went wrong. Please try again",type:"error"}); 
        }
        finally { 
            setIsPageLoading(false); 
        }
    };

    useEffect(() => {
        if (user) fetchAllEvents();
    }, [user]);

    const handleSavePlan = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsSaving(true);
        const currentEditingId = editingId;
        const tempId = Date.now();

        if (currentEditingId !== null) {
            setUpdatingPlans(prev => new Set(prev).add(currentEditingId));
        }

        const url = currentEditingId !== null ? `${API}/event/events/${currentEditingId}` : `${API}/event/addEvent`;

        const method = currentEditingId !== null ? "PUT" : "POST";

        const optimisticPlan: Plan = {
            id: currentEditingId ?? tempId,
            dateKey,
            ...formData,
        };

        const originalPlan = currentEditingId !== null ? plans.find(plan => plan.id === currentEditingId) ?? null : null;

        setPlans(prev => currentEditingId !== null ? prev.map(plan => plan.id === currentEditingId ? optimisticPlan : plan) : [...prev, optimisticPlan]);

        
        try {

            const response = await fetch(url, {
                method,
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({ ...formData, dateKey }),
            });

            if (!response.ok) {
                const error = await response.json();
                setToast({message: error.message ?? "Failed to save plan.",type:"error"});
                return;
            }

            const savedPlan: Plan = await response.json();

            setPlans(prev => currentEditingId !== null ? prev.map(plan => plan.id === currentEditingId ? savedPlan : plan) : prev.map(plan => plan.id === tempId ? savedPlan : plan));

            setFormData(resetCalendarForm())
            setIsFormOpen(false);
            setEditingId(null);

            setToast({message: "Successfully added event. Check inbox/Announcements",type:"success"});
        } catch (err) {
            setToast({message: "Something went wrong. Please try again",type:"error"});

            rollBackChanges(currentEditingId,tempId,originalPlan);
        } finally {
            if (currentEditingId !== null) {
                setUpdatingPlans(prev => {
                    const next = new Set(prev);
                    next.delete(currentEditingId);
                    return next;
                });
                setIsSaving(false)
            }
        }
    };

    const handleEditPlan = (plan: Plan) => {
        setEditingId(plan.id);

        setFormData({
            title: plan.title,
            description: plan.description,
            startTime: plan.startTime,
            endTime: plan.endTime,
            color: plan.color,
            eventType: plan.eventType
        });

        setIsFormOpen(true);
    };

    const handleDeletePlan = async (id: number) => {
        setDeletingPlans(prev => new Set(prev).add(id));
        try {
            const response = await fetch(`${API}/event/events/${id}`, { method: "DELETE", credentials: "include" });
            setPlans(prev => prev.filter(p => p.id !== id));
            
            if(!response.ok){
                const error = await response.json();
                setToast({message: error.message ?? "Failed to save plan.",type:"error"});
                return;
            }
            setToast({message: "Successfully deleted event",type:"success"});
        } catch (err) { 
            setToast({message: "Something went wrong. Please try again",type:"error"});
        }
        finally {
            setDeletingPlans(prev => {
                const next = new Set(prev);
                next.delete(id)
                return next;
            });
        }
    };

    const rollBackChanges = (currentEditingId:number | null,tempId:number,originalPlan:Plan|null) => {
        setPlans(prev => {
            if(currentEditingId === null){
                return prev.filter(plan => plan.id !== tempId);
            }

            return prev.map(plan => plan.id === currentEditingId && originalPlan ? originalPlan : plan)
        })
    }

    if (!user) return <RedirectUser/>;
    if (userLoading || isPageLoading) return <CalendarSkeleton />;

    return (
        <>
            <Navigation title='Calendar' />
            <div className={style.pageWrapper}>
                <div className={style.contentContainer}>
                    <div className={style.calendarSection}>
                        <Calendar plans={plans} onDateSelect={(date) => { setSelectedDate(date); setIsFormOpen(false); }} />
                    </div>
                    <div className={style.eventsPanel}>
                        <div className={style.panelHeader}>
                            <h2>{formattedDate}</h2>
                            {isPermitted(user.roles) ?
                                (!isFormOpen && <button className={style.addBtn} onClick={() => setIsFormOpen(true)}>+ Add Plan</button>)
                                : (<div />)}
                        </div>

                        {isFormOpen ? (
                            <form className={style.planForm} onSubmit={handleSavePlan}>
                                <input placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className={style.inputField} required />
                                <input placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className={style.inputField} />
                                <p className={`${style.characterCount} ${formData.description.length > 230 ? style.danger : formData.description.length >= 180 ? style.warning : ""}`}>Letter limit: <strong>{formData.description.length}/250</strong></p>
                                <div className={style.timeRow}>
                                    <select value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} required className={style.timeSelect}>
                                        <option value="" disabled>Select start time</option>
                                        {timeOptions}
                                    </select>
                                    <span className={style.timeSeparator}>→</span>
                                    <select value={formData.endTime} onChange={e => setFormData({ ...formData, endTime: e.target.value })} required className={style.timeSelect}>
                                        <option value="" disabled>Select end time</option>
                                        {timeOptions}
                                    </select>
                                </div>
                                <select value={formData.eventType} onChange={(e) => setFormData({ ...formData, eventType: e.target.value as EventType, color: eventColors[e.target.value as EventType] })} className={style.inputField}>
                                    <option value="GENERAL" >General</option>
                                    <option value="MEETING" >Meeting</option>
                                    <option value="WORSHIP" >Worship</option>
                                    <option value="URGENT" >Urgent</option>
                                    <option value="ACTIVITY">Activity</option>

                                </select>
                                <div className={style.formActions}>
                                    <button type="button" onClick={() => {
                                        setFormData(resetCalendarForm())
                                        setIsFormOpen(false);
                                        setEditingId(null);
                                    }} className={style.cancelBtn}>Cancel</button>
                                    <button type="submit" className={style.addBtn} disabled={isSaving || (editingId !== null && updatingPlans.has(editingId)) || formData.description.length > 250}>{editingId !== null && updatingPlans.has(editingId) ? "Update Plan" : editingId !== null ? "Update Plan" : isSaving ? "Saving..." : "Save Plan"}</button>
                                </div>


                            </form>
                        ) : (
                            <div className={`${style.eventList} ${todaysPlans.length > 4 ? style.scrollable : ""}`}>
                                {todaysPlans.map(plan => (
                                    <div key={plan.id} className={style.eventCard} style={{ borderLeftColor: plan.color }}>
                                        <h4>{plan.title}</h4>
                                        <p>{formatTime(plan.startTime)} - {formatTime(plan.endTime)}</p>
                                        {isPermitted(user.roles) ? (
                                            <div>
                                                <button disabled={updatingPlans.has(plan.id)} onClick={() => handleEditPlan(plan)} className={style.editBtn}>{updatingPlans.has(plan.id) ? "Updating..." : "Edit"}</button>
                                                <button disabled={deletingPlans.has(plan.id)} onClick={() => handleDeletePlan(plan.id)} className={style.deleteBtn}>{deletingPlans.has(plan.id) ? "Deleting..." : "Delete"}</button>
                                            </div>
                                        ) : <div />}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {toast && (<Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />)}
            <Footer />
        </>
    );
};