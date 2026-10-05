import { describe, expect, it } from "vitest";
import { translations, type Language, type TranslationKey } from "../translations";

const pageCopy: TranslationKey[] = [
  "landingWelcome",
  "landingDescription",
  "getStarted",
  "powerfulFeatures",
  "liveInsights",
  "newsTitle",
  "newsSearch",
  "generateNewsFor",
  "generatingLiveNews",
  "newsGenerating",
  "analysisTitle",
  "analysisDescription",
  "yieldCalculator",
  "plotArea",
  "variety",
  "soilType",
  "irrigationMethod",
  "seasonPlanting",
  "sugarRecoveryAnalysis",
  "costBenefitAnalysis",
  "weatherTitle",
  "weatherDescription",
  "currentWeather",
  "sevenDayForecast",
  "humidity",
  "wind",
  "precipitation",
  "location",
  "inventoryTitle",
  "inventoryDescription",
  "searchInventory",
  "addItem",
  "editItem",
  "addNewItem",
  "category",
  "itemName",
  "quantity",
  "unit",
  "status",
  "saveChanges",
  "remove",
  "iotTitle",
  "iotDescription",
  "totalSensors",
  "online",
  "warning",
  "offline",
  "activeAlerts",
  "dismiss",
  "allPlots",
  "liveUpdates",
  "keyMetrics",
  "deviceInformation",
  "noAlerts",
  "reportsTitle",
  "reportsDescription",
  "downloadReport",
  "active",
  "yieldAchievement",
  "overview",
  "seasonComparison",
];

describe("page translations", () => {
  const languages: Language[] = ["en", "kn", "hi", "ta", "te", "mr"];

  it.each(languages)("has translated page copy for %s", (language) => {
    const localized = translations[language] as Partial<Record<TranslationKey, string>>;
    for (const key of pageCopy) {
      expect(localized[key], `${language}.${key}`).toBeTruthy();
      if (language !== "en") {
        expect(localized[key], `${language}.${key} should not fall back to English`)
          .not.toBe(translations.en[key]);
      }
    }
  });
});
