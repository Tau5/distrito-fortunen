export interface Action {
    name: string,
    numberInput: NumberAction | null
};

export interface NumberAction {
    max:     number,
    min:     number,
    placeholder: number
};

export type ActionList = Array<Action>;