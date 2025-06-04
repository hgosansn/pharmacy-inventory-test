import { StrategyFactory } from "./drugUpdateStrategies.js";

export function Drug(name, expiresIn, benefit) {
  return {
    name,
    expiresIn,
    benefit,
  };
}

export class Pharmacy {
  constructor(drugs = []) {
    this.drugs = drugs;
  }
  updateBenefitValue() {
    this.drugs = this.drugs.map((drug) => {
      const strategy = StrategyFactory.getStrategy(drug);
      return strategy.update(drug);
    });
    return this.drugs;
  }
}
