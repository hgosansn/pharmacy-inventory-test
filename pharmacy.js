import { StrategyFactory } from "./drugUpdateStrategies.js";

export function Drug(name, expiresIn, benefit) {
  return {
    name,
    expiresIn,
    benefit,
  };
}

export class Pharmacy {
  updateStrategies = {
    update: (drug) => {
      throw new Error(
        `${drug.name}: No strategy set. Call setConfigs() first.`,
      );
    },
  };

  constructor(drugs = []) {
    this.drugs = drugs;
  }
  /**
   * Updates the benefit value of each drug based on the configured strategies.
   * @returns {Array} - Updated array of drugs with modified benefit values.
   */
  updateBenefitValue() {
    this.drugs = this.drugs.map((drug) => {
      return this.updateStrategies.update(drug);
    });
    return this.drugs;
  }

  /**
   * Sets the configuration for drug update strategies.
   * @param {Object} configs - Configuration object containing drug update rules.
   */
  setConfigs(configs) {
    this.configs = configs;
    this.updateStrategies = StrategyFactory.getStrategies(configs);
  }
}
