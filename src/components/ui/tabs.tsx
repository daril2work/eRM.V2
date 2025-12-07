"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Tabs = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { defaultValue?: string; value?: string; onValueChange?: (value: string) => void }
>(({ className, defaultValue, value, onValueChange, children, ...props }, ref) => {
    // Simple state machine for tabs if needed, but for now just a wrapper.
    // Actually, Radix/Shadcn Tabs are complex. Implementing a simple context-based one is better.
    const [activeTab, setActiveTab] = React.useState(value || defaultValue || "");

    React.useEffect(() => {
        if (value !== undefined) setActiveTab(value);
    }, [value]);

    const handleTabChange = (val: string) => {
        if (onValueChange) onValueChange(val);
        else setActiveTab(val);
    };

    return (
        <div ref={ref} className={cn("", className)} {...props} data-active={activeTab}>
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as any, { activeTab, setActiveTab: handleTabChange });
                }
                return child;
            })}
        </div>
    )
})
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { activeTab?: string; setActiveTab?: (val: string) => void }
>(({ className, activeTab, setActiveTab, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500",
            className
        )}
        {...props}
    >
        {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child as any, { activeTab, setActiveTab });
            }
            return child;
        })}
    </div>
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string; activeTab?: string; setActiveTab?: (val: string) => void }
>(({ className, value, activeTab, setActiveTab, ...props }, ref) => (
    <button
        ref={ref}
        className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            activeTab === value ? "bg-white text-slate-950 shadow-sm" : "hover:bg-slate-200/50",
            className
        )}
        onClick={() => setActiveTab && setActiveTab(value)}
        type="button"
        {...props}
    />
))
TabsTrigger.displayName = "TabsTrigger"

// @ts-ignore
const TabsContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string; activeTab?: string; setActiveTab?: any }
>(({ className, value, activeTab, setActiveTab, ...props }, ref) => {
    if (value !== activeTab) return null;
    return (
        <div
            ref={ref}
            className={cn(
                "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                className
            )}
            {...props}
        />
    )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
