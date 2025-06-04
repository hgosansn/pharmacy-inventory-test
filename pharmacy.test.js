import { loadDrugUpdateConfigs } from "./drugUpdateStrategies";
import { Drug, Pharmacy } from "./pharmacy";

describe("Pharmacy", () => {
  let configs;
  beforeAll(async () => {
    configs = await loadDrugUpdateConfigs();
  });

  it("should handle multiple drugs correctly", () => {
    const pharmacy = new Pharmacy([
      new Drug("test", 2, 3),
      new Drug("Herbal Tea", 2, 3),
      new Drug("Fervex", 10, 10),
      new Drug("Magic Pill", 10, 10),
    ]);

    pharmacy.setConfigs(configs);

    expect(pharmacy.updateBenefitValue()).toEqual([
      new Drug("test", 1, 2),
      new Drug("Herbal Tea", 1, 4),
      new Drug("Fervex", 9, 12),
      new Drug("Magic Pill", 10, 10),
    ]);
  });

  describe("Default benefit strategy", () => {
    it("should decrease the benefit and expiresIn", () => {
      const pharmacy = new Pharmacy([new Drug("test", 2, 3)]);
      pharmacy.setConfigs(configs);
      expect(pharmacy.updateBenefitValue()).toEqual([new Drug("test", 1, 2)]);
    });

    it("should decrease benefit twice as fast after expiry date", () => {
      const pharmacy = new Pharmacy([new Drug("test", 0, 3)]);
      pharmacy.setConfigs(configs);
      expect(pharmacy.updateBenefitValue()).toEqual([new Drug("test", -1, 1)]);
    });

    it("should not decrease benefit below 0", () => {
      const pharmacy = new Pharmacy([new Drug("test", 2, 0)]);
      pharmacy.setConfigs(configs);
      expect(pharmacy.updateBenefitValue()).toEqual([new Drug("test", 1, 0)]);
    });
  });

  describe("Herbal Tea", () => {
    it("should increase benefit for Herbal Tea", () => {
      const pharmacy = new Pharmacy([new Drug("Herbal Tea", 2, 3)]);
      pharmacy.setConfigs(configs);
      expect(pharmacy.updateBenefitValue()).toEqual([
        new Drug("Herbal Tea", 1, 4),
      ]);
    });

    it("should increase benefit for Herbal Tea twice as fast after expiry date", () => {
      const pharmacy = new Pharmacy([new Drug("Herbal Tea", 0, 3)]);
      pharmacy.setConfigs(configs);
      expect(pharmacy.updateBenefitValue()).toEqual([
        new Drug("Herbal Tea", -1, 5),
      ]);
    });

    it("should not increase benefit above 50 for Herbal Tea", () => {
      const pharmacy = new Pharmacy([new Drug("Herbal Tea", 2, 50)]);
      pharmacy.setConfigs(configs);
      expect(pharmacy.updateBenefitValue()).toEqual([
        new Drug("Herbal Tea", 1, 50),
      ]);
    });
  });

  describe("Fervex", () => {
    it("should increase benefit for Fervex", () => {
      const pharmacy = new Pharmacy([new Drug("Fervex", 15, 3)]);
      pharmacy.setConfigs(configs);
      expect(pharmacy.updateBenefitValue()).toEqual([
        new Drug("Fervex", 14, 4),
      ]);
    });

    it("should increase benefit for Fervex by 2 when 10 days or less left", () => {
      const pharmacy = new Pharmacy([new Drug("Fervex", 10, 3)]);
      pharmacy.setConfigs(configs);
      expect(pharmacy.updateBenefitValue()).toEqual([new Drug("Fervex", 9, 5)]);
    });

    it("should increase benefit for Fervex by 3 when 5 days or less left", () => {
      const pharmacy = new Pharmacy([new Drug("Fervex", 5, 3)]);
      pharmacy.setConfigs(configs);
      expect(pharmacy.updateBenefitValue()).toEqual([new Drug("Fervex", 4, 6)]);
    });

    it("should set benefit to 0 for Fervex after expiry date", () => {
      const pharmacy = new Pharmacy([new Drug("Fervex", 0, 20)]);
      pharmacy.setConfigs(configs);
      expect(pharmacy.updateBenefitValue()).toEqual([
        new Drug("Fervex", -1, 0),
      ]);
    });

    it("should not increase benefit above 50 for Fervex", () => {
      const pharmacy = new Pharmacy([new Drug("Fervex", 5, 49)]);
      pharmacy.setConfigs(configs);
      expect(pharmacy.updateBenefitValue()).toEqual([
        new Drug("Fervex", 4, 50),
      ]);
    });
  });

  describe("Magic Pill", () => {
    it("should not change benefit and expiresIn for Magic Pill", () => {
      const pharmacy = new Pharmacy([new Drug("Magic Pill", 10, 10)]);
      pharmacy.setConfigs(configs);
      expect(pharmacy.updateBenefitValue()).toEqual([
        new Drug("Magic Pill", 10, 10),
      ]);
    });
  });

  describe("Dafalgan", () => {
    it("should not decrease benefit below 0 for Dafalgan even when expired", () => {
      const pharmacy = new Pharmacy([new Drug("Dafalgan", 0, 3)]);
      pharmacy.setConfigs(configs);
      expect(pharmacy.updateBenefitValue()).toEqual([
        new Drug("Dafalgan", -1, 0),
      ]);
    });

    it("should keep Dafalgan at 0 benefit when already at 0", () => {
      const pharmacy = new Pharmacy([new Drug("Dafalgan", 5, 0)]);
      pharmacy.setConfigs(configs);
      expect(pharmacy.updateBenefitValue()).toEqual([
        new Drug("Dafalgan", 4, 0),
      ]);
    });

    it("should decrease Dafalgan's benefit correctly when benefit is odd", () => {
      const pharmacy = new Pharmacy([new Drug("Dafalgan", 3, 9)]);
      pharmacy.setConfigs(configs);
      expect(pharmacy.updateBenefitValue()).toEqual([
        new Drug("Dafalgan", 2, 7),
      ]);
    });

    it("should handle Dafalgan over multiple days correctly", () => {
      let pharmacy = new Pharmacy([new Drug("Dafalgan", 2, 10)]);
      pharmacy.setConfigs(configs);
      // Day 1
      pharmacy.drugs = pharmacy.updateBenefitValue();
      expect(pharmacy.drugs).toEqual([new Drug("Dafalgan", 1, 8)]);
      // Day 2
      pharmacy.drugs = pharmacy.updateBenefitValue();
      expect(pharmacy.drugs).toEqual([new Drug("Dafalgan", 0, 6)]);
      // Day 3 (expired)
      pharmacy.drugs = pharmacy.updateBenefitValue();
      expect(pharmacy.drugs).toEqual([new Drug("Dafalgan", -1, 2)]);
      // Day 4 (expired)
      pharmacy.drugs = pharmacy.updateBenefitValue();
      expect(pharmacy.drugs).toEqual([new Drug("Dafalgan", -2, 0)]);
    });
  });
});
