import React, { ReactNode } from "react";
import useChatbot from "../hooks/useChatbot";
import ArchitectureFlow from "./ArchitectureFlow";

interface LayoutProps {
    children: ReactNode;
    chatbotState: ReturnType<typeof useChatbot>;
}

const Layout: React.FC<LayoutProps> = ({ children, chatbotState }) => {
    return (
        <div className="flex h-screen bg-neutral-950 text-white overflow-hidden font-sans">
            {/* Left Panel: Mobile Chat Container */}
            <div className="flex-1 flex items-center justify-center p-8 bg-neutral-900/50 relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-900/20 via-neutral-950 to-neutral-950 -z-10" />

                {/* Mobile Device Frame */}
                <div className="w-[380px] h-[800px] max-h-[90vh] bg-black border-8 border-neutral-800 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative ring-1 ring-white/10">
                    {/* Dynamic Island / Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-black rounded-b-2xl z-50 flex items-center justify-center">
                        <div className="w-16 h-1 bg-neutral-800 rounded-full" />
                    </div>

                    {/* Chat Content */}
                    <div className="flex-1 flex flex-col pt-8 bg-neutral-900 h-full">
                        {children}
                    </div>
                </div>
            </div>

            {/* Right Panel: Visualization (Full Height, No Scroll) */}
            <div className="w-[500px] border-l border-neutral-800 bg-neutral-950 p-8 hidden xl:flex flex-col shadow-2xl z-20 relative">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        System Architecture
                    </h2>
                    <p className="text-sm text-neutral-400 mt-2">
                        Live data flow visualization.
                    </p>
                </div>

                <div className="flex-1 flex flex-col justify-center h-full overflow-hidden">
                    <ArchitectureFlow status={chatbotState.status} />
                </div>
            </div>
        </div>
    );
};

export default Layout;
