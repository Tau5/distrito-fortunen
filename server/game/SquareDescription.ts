interface SquareDescriptionValues {
    label: string,
    value: number
}


interface SquareDescription {
    /**
     * title: title of the square
     */
    title: string,
    /**
     * rank: Rank of the square from 1 to 3, if 0, no rank is displayed
     */
    rank: number
    /**
     * baseText: Full description, used for square that are not buildings
     */
    baseText: string,
    /**
     * values: Label/Value pairs that display a value (Like Shop Value, Price, etc.)
     */
    values: SquareDescriptionValues[],

}