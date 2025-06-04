export class DrugUpdateStrategy {
  update(drug) {
    throw new Error(`${drug.name} update method must be implemented!`);
  }
}

export class DefaultDrugStrategy extends DrugUpdateStrategy {
  update(drug) {
    if (drug.benefit > 0) {
      drug.benefit = drug.benefit - 1;
    }
    drug.expiresIn = drug.expiresIn - 1;
    if (drug.expiresIn < 0 && drug.benefit > 0) {
      drug.benefit = drug.benefit - 1;
    }
    return drug;
  }
}

export class HerbalTeaStrategy extends DrugUpdateStrategy {
  update(drug) {
    if (drug.benefit < 50) {
      drug.benefit = drug.benefit + 1;
    }
    drug.expiresIn = drug.expiresIn - 1;
    if (drug.expiresIn < 0 && drug.benefit < 50) {
      drug.benefit = drug.benefit + 1;
    }
    return drug;
  }
}

export class FervexStrategy extends DrugUpdateStrategy {
  update(drug) {
    if (drug.benefit < 50) {
      drug.benefit = drug.benefit + 1;
      if (drug.expiresIn < 11 && drug.benefit < 50) {
        drug.benefit = drug.benefit + 1;
      }
      if (drug.expiresIn < 6 && drug.benefit < 50) {
        drug.benefit = drug.benefit + 1;
      }
    }
    drug.expiresIn = drug.expiresIn - 1;
    if (drug.expiresIn < 0) {
      drug.benefit = 0;
    }
    return drug;
  }
}

export class MagicPillStrategy extends DrugUpdateStrategy {
  update(drug) {
    // Magic Pill does not change.
    return drug;
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
      default:
        return new DefaultDrugStrategy();
    }
  }
}
