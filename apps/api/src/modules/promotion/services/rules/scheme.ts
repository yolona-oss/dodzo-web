export interface PromotionRule {
    condition: string
    value: string
}

export interface PromotionRuleSchema {
    type: string
    rules: PromotionRule[]
}
