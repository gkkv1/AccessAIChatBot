import React from "react";
import { motion } from "framer-motion";
import { FaUser, FaServer, FaBrain, FaCheckCircle, FaCode } from "react-icons/fa";

interface ArchitectureFlowProps {
    status: "idle" | "formatted" | "tokenizing" | "sending" | "processing" | "receiving";
}

const ArchitectureFlow: React.FC<ArchitectureFlowProps> = ({ status }) => {
    // Helper to determine node state based on overall status
    const getNodeState = (step: string) => {
        if (status === 'idle') return 'idle';

        switch (step) {
            case 'user':
                return 'active';
            case 'tokenizer':
                if (['tokenizing', 'sending', 'processing', 'receiving'].includes(status)) return status === 'tokenizing' ? 'processing' : 'active';
                return 'idle';
            case 'server':
                if (['sending', 'processing', 'receiving'].includes(status)) return status === 'sending' ? 'processing' : 'active';
                return 'idle';
            case 'ai':
                if (['processing', 'receiving'].includes(status)) return status === 'processing' ? 'processing' : 'active';
                return 'idle';
            case 'response':
                if (status === 'receiving') return 'success';
                return 'idle';
            default: return 'idle';
        }
    };

    return (
        <div className="flex flex-col items-center justify-between h-full py-4 relative">
            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-neutral-800" />

            {/* Node 1: User Input */}
            <div className="flex-1 w-full flex items-center">
                <FlowStep
                    icon={<FaUser size={24} />}
                    title="User Input"
                    desc="Text captured"
                    state={getNodeState('user')}
                    isActive={status !== 'idle'}
                />
            </div>

            <div className="h-8 w-0.5 bg-neutral-800 relative overflow-hidden shrink-0">
                <ConnectionLine isActive={['tokenizing', 'sending', 'processing', 'receiving'].includes(status)} />
            </div>

            {/* Node 2: Tokenization */}
            <div className="flex-1 w-full flex items-center">
                <FlowStep
                    icon={<FaCode size={24} />}
                    title="Tokenization"
                    desc="Splitting text into vectors"
                    state={getNodeState('tokenizer')}
                    isActive={['tokenizing', 'sending', 'processing', 'receiving'].includes(status)}
                    isPulse={status === 'tokenizing'}
                />
            </div>

            <div className="h-8 w-0.5 bg-neutral-800 relative overflow-hidden shrink-0">
                <ConnectionLine isActive={['sending', 'processing', 'receiving'].includes(status)} />
            </div>

            {/* Node 3: API Gateway */}
            <div className="flex-1 w-full flex items-center">
                <FlowStep
                    icon={<FaServer size={24} />}
                    title="API Gateway"
                    desc="Secure HTTPS Transport"
                    state={getNodeState('server')}
                    isActive={['sending', 'processing', 'receiving'].includes(status)}
                    isPulse={status === 'sending'}
                />
            </div>

            <div className="h-8 w-0.5 bg-neutral-800 relative overflow-hidden shrink-0">
                <ConnectionLine isActive={['processing', 'receiving'].includes(status)} color="#A78BFA" />
            </div>

            {/* Node 4: Gemini AI */}
            <div className="flex-1 w-full flex items-center">
                <FlowStep
                    icon={<FaBrain size={32} />}
                    title="Gemini Inference"
                    desc="1.5M Context Window"
                    state={getNodeState('ai')}
                    isActive={['processing', 'receiving'].includes(status)}
                    isPulse={status === 'processing'}
                />
            </div>

            <div className="h-8 w-0.5 bg-neutral-800 relative overflow-hidden shrink-0">
                <ConnectionLine isActive={status === 'receiving'} color="#34D399" />
            </div>

            {/* Node 5: Response */}
            <div className="flex-1 w-full flex items-center">
                <FlowStep
                    icon={<FaCheckCircle size={24} />}
                    title="Decoding & Render"
                    desc="Markdown to HTML"
                    state={getNodeState('response')}
                    isActive={status === 'receiving'}
                    isPulse={status === 'receiving'}
                />
            </div>
        </div>
    );
};

const FlowStep = ({ icon, title, desc, state, isActive, isPulse }: any) => {
    return (
        <motion.div
            className={`relative z-10 flex items-center gap-4 bg-neutral-900 border ${isActive ? (state === 'processing' ? 'border-purple-500 shadow-[0_0_15px_rgba(167,139,250,0.4)]' : 'border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]') : 'border-neutral-800'} p-4 rounded-xl w-full transition-all duration-300 transform ${isActive ? 'translate-x-2' : ''}`}
            animate={isPulse ? { scale: [1, 1.05, 1], borderColor: ["#A78BFA", "#C4B5FD", "#A78BFA"] } : {}}
            transition={isPulse ? { duration: 1.5, repeat: Infinity } : {}}
        >
            <div className={`p-3 rounded-lg ${isActive ? 'bg-blue-500/10 text-blue-400' : 'bg-neutral-800 text-neutral-500'}`}>
                {icon}
            </div>
            <div>
                <h3 className={`font-medium ${isActive ? 'text-white' : 'text-neutral-500'}`}>{title}</h3>
                <p className="text-xs text-neutral-500">{isActive ? (isPulse ? "Processing..." : "Completed") : desc}</p>
            </div>

            {isActive && (
                <motion.div
                    className={`absolute right-4 w-3 h-3 rounded-full ${state === 'success' ? 'bg-green-500' : (state === 'processing' ? 'bg-purple-500' : 'bg-blue-500')}`}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                />
            )}
        </motion.div>
    );
};

const ConnectionLine = ({ isActive, color = "#60A5FA" }: any) => {
    return (
        <div className="h-full w-0.5 bg-neutral-800 relative overflow-hidden">
            {isActive && (
                <motion.div
                    className="absolute top-0 w-full bg-gradient-to-b from-transparent via-current to-transparent"
                    style={{ backgroundColor: color, height: "50%" }}
                    initial={{ top: "-100%" }}
                    animate={{ top: "100%" }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
            )}
        </div>
    )
}

export default ArchitectureFlow;
