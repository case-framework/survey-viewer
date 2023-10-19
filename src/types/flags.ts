
interface FlagValue {
    value: string; 
    label: string;
}

// Describe an available participant flag
export interface ParticipantFlag {
    label: string
    values: FlagValue[]
} 

export type ParticipantFlags = Record<string, ParticipantFlag>;