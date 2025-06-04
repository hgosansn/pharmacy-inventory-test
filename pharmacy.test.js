import { Drug, Pharmacy } from "./pharmacy";

describe("Pharmacy", () => {
  it("should decrease the benefit and expiresIn", () => {
    expect(new Pharmacy([new Drug("test", 2, 3)]).updateBenefitValue()).toEqual(
      [new Drug("test", 1, 2)],
    );
  });

  it("should decrease benefit twice as fast after expiry date", () => {
    expect(new Pharmacy([new Drug("test", 0, 3)]).updateBenefitValue()).toEqual(
      [new Drug("test", -1, 1)],
    );
  });

  it("should not decrease benefit below 0", () => {
    expect(new Pharmacy([new Drug("test", 2, 0)]).updateBenefitValue()).toEqual(
      [new Drug("test", 1, 0)],
    );
  });

  it("should increase benefit for Herbal Tea", () => {
    expect(
      new Pharmacy([new Drug("Herbal Tea", 2, 3)]).updateBenefitValue(),
    ).toEqual([new Drug("Herbal Tea", 1, 4)]);
  });

  it("should increase benefit for Herbal Tea twice as fast after expiry date", () => {
    expect(
      new Pharmacy([new Drug("Herbal Tea", 0, 3)]).updateBenefitValue(),
    ).toEqual([new Drug("Herbal Tea", -1, 5)]);
  });

  it("should not increase benefit above 50 for Herbal Tea", () => {
    expect(
      new Pharmacy([new Drug("Herbal Tea", 2, 50)]).updateBenefitValue(),
    ).toEqual([new Drug("Herbal Tea", 1, 50)]);
  });

  it("should increase benefit for Fervex", () => {
    expect(
      new Pharmacy([new Drug("Fervex", 15, 3)]).updateBenefitValue(),
    ).toEqual([new Drug("Fervex", 14, 4)]);
  });

  it("should increase benefit for Fervex by 2 when 10 days or less left", () => {
    expect(
      new Pharmacy([new Drug("Fervex", 10, 3)]).updateBenefitValue(),
    ).toEqual([new Drug("Fervex", 9, 5)]);
  });

  it("should increase benefit for Fervex by 3 when 5 days or less left", () => {
    expect(
      new Pharmacy([new Drug("Fervex", 5, 3)]).updateBenefitValue(),
    ).toEqual([new Drug("Fervex", 4, 6)]);
  });

  it("should set benefit to 0 for Fervex after expiry date", () => {
    expect(
      new Pharmacy([new Drug("Fervex", 0, 20)]).updateBenefitValue(),
    ).toEqual([new Drug("Fervex", -1, 0)]);
  });

  it("should not increase benefit above 50 for Fervex", () => {
    expect(
      new Pharmacy([new Drug("Fervex", 5, 49)]).updateBenefitValue(),
    ).toEqual([new Drug("Fervex", 4, 50)]);
  });

  it("should not change benefit and expiresIn for Magic Pill", () => {
    expect(
      new Pharmacy([new Drug("Magic Pill", 10, 10)]).updateBenefitValue(),
    ).toEqual([new Drug("Magic Pill", 10, 10)]);
  });

  it("should handle multiple drugs correctly", () => {
    const pharmacy = new Pharmacy([
      new Drug("test", 2, 3),
      new Drug("Herbal Tea", 2, 3),
      new Drug("Fervex", 10, 10),
      new Drug("Magic Pill", 10, 10),
    ]);

    expect(pharmacy.updateBenefitValue()).toEqual([
      new Drug("test", 1, 2),
      new Drug("Herbal Tea", 1, 4),
      new Drug("Fervex", 9, 12),
      new Drug("Magic Pill", 10, 10),
    ]);
  });

  it("should increase benefit for Fervex", () => {
    expect(
      new Pharmacy([new Drug("Fervex", 15, 3)]).updateBenefitValue(),
    ).toEqual([new Drug("Fervex", 14, 4)]);
  });

  it("should increase benefit for Fervex by 2 when 10 days or less left", () => {
    expect(
      new Pharmacy([new Drug("Fervex", 10, 3)]).updateBenefitValue(),
    ).toEqual([new Drug("Fervex", 9, 5)]);
  });

  it("should increase benefit for Fervex by 3 when 5 days or less left", () => {
    expect(
      new Pharmacy([new Drug("Fervex", 5, 3)]).updateBenefitValue(),
    ).toEqual([new Drug("Fervex", 4, 6)]);
  });

  it("should set benefit to 0 for Fervex after expiry date", () => {
    expect(
      new Pharmacy([new Drug("Fervex", 0, 20)]).updateBenefitValue(),
    ).toEqual([new Drug("Fervex", -1, 0)]);
  });

  it("should not increase benefit above 50 for Fervex", () => {
    expect(
      new Pharmacy([new Drug("Fervex", 5, 49)]).updateBenefitValue(),
    ).toEqual([new Drug("Fervex", 4, 50)]);
  });

  it("should not change benefit and expiresIn for Magic Pill", () => {
    expect(
      new Pharmacy([new Drug("Magic Pill", 10, 10)]).updateBenefitValue(),
    ).toEqual([new Drug("Magic Pill", 10, 10)]);
  });

  it("should handle multiple drugs correctly", () => {
    const pharmacy = new Pharmacy([
      new Drug("test", 2, 3),
      new Drug("Herbal Tea", 2, 3),
      new Drug("Fervex", 10, 10),
      new Drug("Magic Pill", 10, 10),
    ]);

    expect(pharmacy.updateBenefitValue()).toEqual([
      new Drug("test", 1, 2),
      new Drug("Herbal Tea", 1, 4),
      new Drug("Fervex", 9, 12),
      new Drug("Magic Pill", 10, 10),
    ]);
  });

  it("should not decrease benefit below 0 for Dafalgan even when expired", () => {
    expect(
      new Pharmacy([new Drug("Dafalgan", 0, 3)]).updateBenefitValue(),
    ).toEqual([new Drug("Dafalgan", -1, 0)]);
  });

  it("should keep Dafalgan at 0 benefit when already at 0", () => {
    expect(
      new Pharmacy([new Drug("Dafalgan", 5, 0)]).updateBenefitValue(),
    ).toEqual([new Drug("Dafalgan", 4, 0)]);
  });

  it("should decrease Dafalgan's benefit correctly when benefit is odd", () => {
    expect(
      new Pharmacy([new Drug("Dafalgan", 3, 9)]).updateBenefitValue(),
    ).toEqual([new Drug("Dafalgan", 2, 7)]);
  });

  it("should handle Dafalgan over multiple days correctly", () => {
    let pharmacy = new Pharmacy([new Drug("Dafalgan", 2, 10)]);
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
