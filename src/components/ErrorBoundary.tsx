import { Component, type ErrorInfo, type ReactNode } from "react";
import styles from '../modules/ErrorBoundary.module.css'

interface Props{
    children?: ReactNode;
    title?:string;
    message?:string;
}

export interface State{
    hasError:boolean;
    error?:Error;
}

export class ErrorBoundary extends Component<Props,State>{
    
    public state:State = {hasError:false};

    static getDerivedStateFromError(error:Error): State{
        return {hasError:true,error};
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('ErrorBoundary caught an error:',error,errorInfo);
        
        // Later call an api to add to database
    }

    handleRetry = () => {
        this.setState({
            hasError: false,
            error: undefined
        });

        // Reload the page
        window.location.reload();
    };
    render(){

        if(this.state.hasError){
            return(
                <div className={styles.errorContainer}>
                    <h1 className={styles.errorTitle}>{this.props.title ?? "Opps! Something went wrong"}</h1>
                    <p className={styles.errorMessage}>
                        {this.props.message ?? "We encountered an unexpected error. Please try again."}
                    </p>
                    <button className={styles.reloadButton} onClick={() => window.location.reload()}>Reload Application</button>
                </div>
            )
        }
        return this.props.children
    }
}