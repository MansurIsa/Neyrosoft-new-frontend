import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Locale } from "@/i18n/config";
import { apiGet, apiPost } from "@/lib/api";
import type {
  CalculatorConfig,
  Estimate,
  PriceRequestPayload,
} from "@/lib/types";

export interface CalculatorSelection {
  projectType: number | null;
  features: number[];
  designLevel: number | null;
  timeline: number | null;
  pageCount: number;
  languageCount: number;
}

interface CalculatorState {
  config: CalculatorConfig | null;
  configStatus: "idle" | "loading" | "ready" | "failed";
  selection: CalculatorSelection;
  estimate: Estimate | null;
  estimateStatus: "idle" | "loading" | "ready" | "failed";
  step: number;
  submitStatus: "idle" | "sending" | "sent" | "failed";
}

export const TOTAL_STEPS = 4;

const emptySelection: CalculatorSelection = {
  projectType: null,
  features: [],
  designLevel: null,
  timeline: null,
  pageCount: 5,
  languageCount: 1,
};

const initialState: CalculatorState = {
  config: null,
  configStatus: "idle",
  selection: emptySelection,
  estimate: null,
  estimateStatus: "idle",
  step: 1,
  submitStatus: "idle",
};

export const loadConfig = createAsyncThunk<CalculatorConfig, Locale>(
  "calculator/loadConfig",
  async (locale, { rejectWithValue }) => {
    const data = await apiGet<CalculatorConfig>("/calculator/config/", {
      locale,
      revalidate: 0,
    });
    if (!data) return rejectWithValue("failed");
    return data;
  },
);

export const fetchEstimate = createAsyncThunk<
  Estimate,
  Locale,
  { state: { calculator: CalculatorState }; rejectValue: string }
>("calculator/estimate", async (locale, { getState, rejectWithValue }) => {
  const { selection } = getState().calculator;
  if (selection.projectType === null) return rejectWithValue("no-type");

  const { ok, data } = await apiPost<Estimate>(
    "/calculator/estimate/",
    {
      project_type: selection.projectType,
      features: selection.features,
      design_level: selection.designLevel,
      timeline: selection.timeline,
      page_count: selection.pageCount,
      language_count: selection.languageCount,
    },
    locale,
  );
  if (!ok || !data) return rejectWithValue("failed");
  return data;
});

export const submitPriceRequest = createAsyncThunk<
  true,
  {
    locale: Locale;
    contact: Pick<
      PriceRequestPayload,
      "name" | "email" | "telephone" | "company" | "note"
    >;
  },
  { state: { calculator: CalculatorState }; rejectValue: string }
>("calculator/submit", async ({ locale, contact }, { getState, rejectWithValue }) => {
  const { selection } = getState().calculator;
  const { ok } = await apiPost(
    "/price-requests/",
    {
      ...contact,
      project_type: selection.projectType,
      features: selection.features,
      design_level: selection.designLevel,
      timeline: selection.timeline,
      page_count: selection.pageCount,
      language_count: selection.languageCount,
    },
    locale,
  );
  if (!ok) return rejectWithValue("failed");
  return true;
});

const calculatorSlice = createSlice({
  name: "calculator",
  initialState,
  reducers: {
    selectProjectType(state, action: PayloadAction<number>) {
      state.selection.projectType = action.payload;
      // Add-ons are scoped to a project type, so drop any that no longer apply
      // and switch on the defaults for the new one.
      const available = (state.config?.features ?? []).filter((feature) =>
        feature.project_types.includes(action.payload),
      );
      const availableIds = new Set(available.map((feature) => feature.id));
      const kept = state.selection.features.filter((id) => availableIds.has(id));
      const defaults = available
        .filter((feature) => feature.is_default)
        .map((feature) => feature.id);
      state.selection.features = Array.from(new Set([...kept, ...defaults]));
    },
    toggleFeature(state, action: PayloadAction<number>) {
      const index = state.selection.features.indexOf(action.payload);
      if (index === -1) state.selection.features.push(action.payload);
      else state.selection.features.splice(index, 1);
    },
    setDesignLevel(state, action: PayloadAction<number>) {
      state.selection.designLevel = action.payload;
    },
    setTimeline(state, action: PayloadAction<number>) {
      state.selection.timeline = action.payload;
    },
    setPageCount(state, action: PayloadAction<number>) {
      state.selection.pageCount = Math.min(60, Math.max(1, action.payload));
    },
    setLanguageCount(state, action: PayloadAction<number>) {
      state.selection.languageCount = Math.min(6, Math.max(1, action.payload));
    },
    goToStep(state, action: PayloadAction<number>) {
      state.step = Math.min(TOTAL_STEPS, Math.max(1, action.payload));
    },
    nextStep(state) {
      state.step = Math.min(TOTAL_STEPS, state.step + 1);
    },
    previousStep(state) {
      state.step = Math.max(1, state.step - 1);
    },
    resetCalculator(state) {
      state.selection = { ...emptySelection, features: [] };
      state.estimate = null;
      state.estimateStatus = "idle";
      state.step = 1;
      state.submitStatus = "idle";
      if (state.config) {
        state.selection.designLevel = state.config.design_levels[0]?.id ?? null;
        state.selection.timeline = state.config.timelines[0]?.id ?? null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadConfig.pending, (state) => {
        state.configStatus = "loading";
      })
      .addCase(loadConfig.fulfilled, (state, action) => {
        state.config = action.payload;
        state.configStatus = "ready";
        // Sensible starting point: the first project type with its defaults on.
        const firstType = action.payload.project_types[0];
        if (firstType && state.selection.projectType === null) {
          state.selection.projectType = firstType.id;
          state.selection.features = action.payload.features
            .filter(
              (feature) =>
                feature.is_default && feature.project_types.includes(firstType.id),
            )
            .map((feature) => feature.id);
        }
        state.selection.designLevel ??=
          action.payload.design_levels[1]?.id ??
          action.payload.design_levels[0]?.id ??
          null;
        state.selection.timeline ??= action.payload.timelines[0]?.id ?? null;
      })
      .addCase(loadConfig.rejected, (state) => {
        state.configStatus = "failed";
      })
      .addCase(fetchEstimate.pending, (state) => {
        state.estimateStatus = "loading";
      })
      .addCase(fetchEstimate.fulfilled, (state, action) => {
        state.estimate = action.payload;
        state.estimateStatus = "ready";
      })
      .addCase(fetchEstimate.rejected, (state) => {
        state.estimateStatus = "failed";
      })
      .addCase(submitPriceRequest.pending, (state) => {
        state.submitStatus = "sending";
      })
      .addCase(submitPriceRequest.fulfilled, (state) => {
        state.submitStatus = "sent";
      })
      .addCase(submitPriceRequest.rejected, (state) => {
        state.submitStatus = "failed";
      });
  },
});

export const {
  selectProjectType,
  toggleFeature,
  setDesignLevel,
  setTimeline,
  setPageCount,
  setLanguageCount,
  goToStep,
  nextStep,
  previousStep,
  resetCalculator,
} = calculatorSlice.actions;

export default calculatorSlice.reducer;
