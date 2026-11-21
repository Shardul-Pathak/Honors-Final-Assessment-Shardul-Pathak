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

export interface PointTransactionItem {
  id: string;
  pointsDelta: number;
  reason: string;
  awardedByName: string;
  studentName?: string;
  studentRollNumber?: string;
  studentProfileId?: string;
  createdAt: string;
}

export interface OverviewStats {
  totalStudents: number;
  totalPointsDistributed: number;
  topScore: number;
  avgScore: number;
}

export interface UserItem {
  id: string;
  fullName: string;
  email: string;
  role: 'STUDENT' | 'TEACHER';
  studentProfileId?: string;
  rollNumber?: string;
  gradeLevel?: string;
  totalPoints?: number;
  phoneNumber?: string;
  status: string;
  createdAt?: string;
}

export interface LeaderboardState {
  students: LeaderboardItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  myRank: LeaderboardItem | null;
  recentTransactions: PointTransactionItem[];
  myHistory: PointTransactionItem[];
  overviewStats: OverviewStats | null;
  usersList: UserItem[];
  usersLoading: boolean;
  selectedDepartment: string;
  selectedTerm: string;
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
  recentTransactions: [],
  myHistory: [],
  overviewStats: null,
  usersList: [],
  usersLoading: false,
  selectedDepartment: 'All',
  selectedTerm: 'Fall 2026',
  isLoading: false,
  isRefreshing: false,
  isAwarding: false,
  awardSuccessMessage: null,
  error: null,
};

export const fetchLeaderboardThunk = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async (
    params: { page?: number; size?: number; department?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      const page = params.page ?? 0;
      const size = params.size ?? 10;
      let url = `/leaderboard?page=${page}&size=${size}&sortBy=totalPoints&direction=desc`;
      if (params.department && params.department !== 'All') {
        url += `&department=${encodeURIComponent(params.department)}`;
      }
      const response = await api.get(url);
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

export const fetchRecentTransactionsThunk = createAsyncThunk(
  'leaderboard/fetchRecentTransactions',
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const response = await api.get(`/points/recent?limit=${limit}`);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to load recent activity';
      return rejectWithValue(message);
    }
  }
);

export const fetchMyHistoryThunk = createAsyncThunk(
  'leaderboard/fetchMyHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/points/my-history');
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to load points history';
      return rejectWithValue(message);
    }
  }
);

export const fetchOverviewStatsThunk = createAsyncThunk(
  'leaderboard/fetchOverviewStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/points/stats');
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to load overview stats';
      return rejectWithValue(message);
    }
  }
);

export const fetchUsersThunk = createAsyncThunk(
  'leaderboard/fetchUsers',
  async (params: { query?: string; role?: string } | void, { rejectWithValue }) => {
    try {
      const p = params || {};
      let url = '/users';
      const searchParams = new URLSearchParams();
      if (p.query) searchParams.append('query', p.query);
      if (p.role && p.role !== 'ALL') searchParams.append('role', p.role);
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;

      const response = await api.get(url);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to load users list';
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
    setSelectedDepartment: (state, action: PayloadAction<string>) => {
      state.selectedDepartment = action.payload;
    },
    setSelectedTerm: (state, action: PayloadAction<string>) => {
      state.selectedTerm = action.payload;
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
        state.students.sort((a, b) => b.totalPoints - a.totalPoints);
        const startingRank = state.page * state.size + 1;
        state.students.forEach((item, idx) => {
          item.rank = startingRank + idx;
        });
      }
      // Also update in users list if present
      const uIndex = state.usersList.findIndex((u) => u.studentProfileId === studentProfileId);
      if (uIndex !== -1 && state.usersList[uIndex].totalPoints !== undefined) {
        state.usersList[uIndex].totalPoints! += points;
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
      })
      // Recent Transactions
      .addCase(fetchRecentTransactionsThunk.fulfilled, (state, action) => {
        state.recentTransactions = action.payload;
      })
      // My History
      .addCase(fetchMyHistoryThunk.fulfilled, (state, action) => {
        state.myHistory = action.payload;
      })
      // Overview Stats
      .addCase(fetchOverviewStatsThunk.fulfilled, (state, action) => {
        state.overviewStats = action.payload;
      })
      // Users List
      .addCase(fetchUsersThunk.pending, (state) => {
        state.usersLoading = true;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.usersList = action.payload;
      })
      .addCase(fetchUsersThunk.rejected, (state) => {
        state.usersLoading = false;
      });
  },
});

export const {
  clearAwardMessage,
  optimisticPointAward,
  setSelectedDepartment,
  setSelectedTerm,
} = leaderboardSlice.actions;

export default leaderboardSlice.reducer;
