const CONFIG_FILE_PATH = "./drugUpdateConfigs.json";
const MAX_BENEFIT = 50;

const limitBenefit = (benefit) => Math.max(0, Math.min(MAX_BENEFIT, benefit));

/**
 * Load drug update configurations from a JSON file.
 */
export async function loadDrugUpdateConfigs() {
  let defaultDrugUpdateConfigs;
  try {
    defaultDrugUpdateConfigs = await import(CONFIG_FILE_PATH, {
      assert: { type: "json" },
    }).then((m) => m.default);
  } catch {
    defaultDrugUpdateConfigs = {};
  }
  return defaultDrugUpdateConfigs;
}

/**
 * Parser/interpreter for string-based rules
 * Parses conditions like "expiresIn < 0", "benefit >= 10"
 */
class DrugStrategyParser {
  static evalCondition(condition, drug) {
    if (condition === "true") {
      return true;
    }
    const condRegex =
      /^(expiresIn|benefit)\s*(==|!=|===|!==|<=|>=|<|>)\s*(-?\d+)$/;
    const match = condition.match(condRegex);
    if (!match) {
      return false;
    }
    const [, prop, op, value] = match;
    const left = Number(drug[prop]);
    const right = Number(value);
    switch (op) {
      case "==": {
        return left == right;
      }
      case "!=": {
        return left != right;
      }
      case "<": {
        return left < right;
      }
      case ">": {
        return left > right;
      }
      case "<=": {
        return left <= right;
      }
      case ">=": {
        return left >= right;
      }
      default: {
        return false;
      }
    }
  }
}

export class ConfigBasedDrugUpdater {
  constructor(configs) {
    this.configs = configs;
  }

  updateDrug(drug) {
    const config = this.configs[drug.name] || this.configs["Default"];
    let expiresIn = drug.expiresIn + Number(config.expiresIn.change || 0);
    let benefit = drug.benefit;
    for (const rule of config.benefit) {
      if (DrugStrategyParser.evalCondition(rule.when, { ...drug, expiresIn })) {
        if (rule.set !== undefined) {
          benefit = Number(rule.set);
          break;
        } else if (rule.change !== undefined) {
          benefit += Number(rule.change);
        }
      }
    }
    return { ...drug, expiresIn, benefit: limitBenefit(benefit) };
  }
}

export class StrategyFactory {
  static getStrategies(configs) {
    const updater = new ConfigBasedDrugUpdater(configs);
    return {
      update: (drug) => updater.updateDrug(drug),
    };
  }
}
