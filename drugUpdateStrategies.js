const MAX_BENEFIT = 50;
const limitBenefit = (benefit) => Math.max(0, Math.min(MAX_BENEFIT, benefit));
const decrementExpiresIn = (expiresIn) => expiresIn - 1;

export class DrugUpdateStrategy {
  update(drug) {
    throw new Error(`${drug.name} update method must be implemented!`);
  }
}

export class DefaultDrugStrategy extends DrugUpdateStrategy {
  update(drug) {
    const expiresIn = decrementExpiresIn(drug.expiresIn);
    let benefit = drug.benefit;
    if (benefit > 0) {
      benefit -= 1;
    }
    if (expiresIn < 0) {
      benefit -= 1;
    }
    return { ...drug, expiresIn, benefit: limitBenefit(benefit) };
  }
}

export class HerbalTeaStrategy extends DrugUpdateStrategy {
  update(drug) {
    const expiresIn = decrementExpiresIn(drug.expiresIn);
    let benefit = drug.benefit + 1;
    if (expiresIn < 0) {
      benefit += 1;
    }
    return { ...drug, expiresIn, benefit: limitBenefit(benefit) };
  }
}

export class FervexStrategy extends DrugUpdateStrategy {
  update(drug) {
    const expiresIn = decrementExpiresIn(drug.expiresIn);
    let benefit = drug.benefit + 1;
    if (drug.expiresIn < 11) {
      benefit += 1;
    }
    if (drug.expiresIn < 6) {
      benefit += 1;
    }
    if (expiresIn < 0) {
      benefit = 0;
    }
    return { ...drug, expiresIn, benefit: limitBenefit(benefit) };
  }
}

export class MagicPillStrategy extends DrugUpdateStrategy {
  update(drug) {
    // Magic Pill does not change.
    return { ...drug };
  }
}

export class DafalganStrategy extends DrugUpdateStrategy {
  update(drug) {
    const expiresIn = decrementExpiresIn(drug.expiresIn);
    let benefit = drug.benefit;
    if (benefit > 0) {
      benefit -= 2;
    }
    if (expiresIn < 0) {
      benefit -= 2;
    }
    return { ...drug, expiresIn, benefit: limitBenefit(benefit) };
  }
}

export class StrategyFactory {
  static getStrategy(drug) {
    switch (drug.name) {
      case "Herbal Tea":
        return new HerbalTeaStrategy();
      case "Fervex":
        return new FervexStrategy();
      case "Magic Pill":
        return new MagicPillStrategy();
      case "Dafalgan":
        return new DafalganStrategy();
      default:
        return new DefaultDrugStrategy();
    }
  }
}
