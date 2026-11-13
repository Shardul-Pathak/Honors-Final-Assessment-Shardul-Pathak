import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export interface LeaderboardItem {
  rank: number;
  studentProfileId: string;
  userId: string;
  fullName: string;
  email: string;
  rollNumber?: string;
  gradeLevel?: string;
  totalPoints: number;
  lastPointsAwardedAt?: string;
}

export interface LeaderboardState {
  students: LeaderboardItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  myRank: LeaderboardItem | null;
  isLoading: boolean;
  isRefreshing: boolean;
  isAwarding: boolean;
  awardSuccessMessage: string | null;
  error: string | null;
}

const initialState: LeaderboardState = {
  students: [],
  page: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
  myRank: null,
  isLoading: false,
  isRefreshing: false,
  isAwarding: false,
  awardSuccessMessage: null,
  error: null,
};

export const fetchLeaderboardThunk = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async ({ page = 0, size = 10 }: { page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/leaderboard?page=${page}&size=${size}&sortBy=totalPoints&direction=desc`);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to load leaderboard';
      return rejectWithValue(message);
    }
  }
);

export const fetchMyRankThunk = createAsyncThunk(
  'leaderboard/fetchMyRank',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/leaderboard/my-rank');
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to load student rank';
      return rejectWithValue(message);
    }
  }
);

export const awardPointsThunk = createAsyncThunk(
  'leaderboard/awardPoints',
  async (
    payload: { studentProfileId: string; points: number; reason: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/points/award', payload);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to award points';
      return rejectWithValue(message);
    }
  }
);

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    clearAwardMessage: (state) => {
      state.awardSuccessMessage = null;
    },
    // Optimistic point update to immediately reorder UI
    optimisticPointAward: (
      state,
      action: PayloadAction<{ studentProfileId: string; points: number }>
    ) => {
      const { studentProfileId, points } = action.payload;
      const index = state.students.findIndex((s) => s.studentProfileId === studentProfileId);
      if (index !== -1) {
        state.students[index].totalPoints += points;
        // Deterministic descending sort
        state.students.sort((a, b) => b.totalPoints - a.totalPoints);
        // Recalculate ranks on current page
        const startingRank = state.page * state.size + 1;
        state.students.forEach((item, idx) => {
          item.rank = startingRank + idx;
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Leaderboard
      .addCase(fetchLeaderboardThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboardThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.students = action.payload.content || [];
        state.page = action.payload.pageNumber || 0;
        state.size = action.payload.pageSize || 10;
        state.totalElements = action.payload.totalElements || 0;
        state.totalPages = action.payload.totalPages || 0;
      })
      .addCase(fetchLeaderboardThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // My Rank
      .addCase(fetchMyRankThunk.fulfilled, (state, action) => {
        state.myRank = action.payload;
      })
      // Award Points
      .addCase(awardPointsThunk.pending, (state) => {
        state.isAwarding = true;
        state.awardSuccessMessage = null;
      })
      .addCase(awardPointsThunk.fulfilled, (state, action) => {
        state.isAwarding = false;
        state.awardSuccessMessage = `Awarded ${action.payload.awardedPoints} points to ${action.payload.studentName}!`;

        const student = state.students.find(
          (s) => s.studentProfileId === action.payload.studentProfileId
        );
        if (student) {
          student.totalPoints = action.payload.newTotalPoints;
          state.students.sort((a, b) => b.totalPoints - a.totalPoints);
          const startingRank = state.page * state.size + 1;
          state.students.forEach((item, idx) => {
            item.rank = startingRank + idx;
          });
        }
      })
      .addCase(awardPointsThunk.rejected, (state, action) => {
        state.isAwarding = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAwardMessage, optimisticPointAward } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
