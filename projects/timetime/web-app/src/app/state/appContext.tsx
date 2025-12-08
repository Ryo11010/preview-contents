import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { Platform } from 'react-native';
import type { ReactNode } from 'react';
import { MOCK_USERS } from '../../../data/mockData';
import type { TabKey, User } from '../types';
import { isAdminRole } from '../roles';

type AppState = {
  activeTab: TabKey;
  menuVisible: boolean;
  sheetUserId: string | null;
  user: User | null;
  roleAssignments: User[];
};

type AppAction =
  | { type: 'login'; user: User }
  | { type: 'logout' }
  | { type: 'setActiveTab'; tab: TabKey }
  | { type: 'setMenuVisible'; visible: boolean }
  | { type: 'setSheetUserId'; id: string | null }
  | { type: 'updateUser'; patch: Partial<User> }
  | { type: 'updateRole'; id: string; role: string }
  | { type: 'updateMember'; id: string; patch: Partial<User> }
  | { type: 'addMember'; member: User };

const initialState: AppState = {
  activeTab: 'punch',
  menuVisible: false,
  sheetUserId: null,
  user: null,
  roleAssignments: MOCK_USERS,
};

const ensureTab = (tab: TabKey, user: User | null): TabKey => {
  if (tab === 'admin' && user && !isAdminRole(user.role)) return 'punch';
  return tab;
};

const reducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'login': {
      const nextTab = ensureTab(
        isAdminRole(action.user.role) ? 'admin' : 'punch',
        action.user,
      );
      return {
        ...state,
        user: action.user,
        activeTab: nextTab,
        menuVisible: false,
      };
    }
    case 'logout':
      return {
        ...state,
        user: null,
        activeTab: 'punch',
        menuVisible: false,
        sheetUserId: null,
      };
    case 'setActiveTab':
      return { ...state, activeTab: ensureTab(action.tab, state.user) };
    case 'setMenuVisible':
      return { ...state, menuVisible: action.visible };
    case 'setSheetUserId':
      return { ...state, sheetUserId: action.id };
    case 'updateUser':
      return state.user
        ? { ...state, user: { ...state.user, ...action.patch } }
        : state;
    case 'updateRole':
      return {
        ...state,
        roleAssignments: state.roleAssignments.map((m) =>
          m.id === action.id ? { ...m, role: action.role } : m,
        ),
      };
    case 'updateMember':
      return {
        ...state,
        roleAssignments: state.roleAssignments.map((m) =>
          m.id === action.id ? { ...m, ...action.patch } : m,
        ),
      };
    case 'addMember':
      return { ...state, roleAssignments: [...state.roleAssignments, action.member] };
    default:
      return state;
  }
};

type AppContextValue = {
  state: AppState;
  login: (user: User) => void;
  logout: () => void;
  setActiveTab: (tab: TabKey) => void;
  openMenu: () => void;
  closeMenu: () => void;
  setSheetUserId: (id: string | null) => void;
  updateUser: (patch: Partial<User>) => void;
  updateRole: (id: string, role: string) => void;
  updateMember: (id: string, patch: Partial<User>) => void;
  addMember: (payload: {
    name: string;
    email: string;
    role: string;
    currentGroup: string;
    currentSubgroup: string;
  }) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo<AppContextValue>(() => {
    return {
      state,
      login: (user) => dispatch({ type: 'login', user }),
      logout: () => dispatch({ type: 'logout' }),
      setActiveTab: (tab) => dispatch({ type: 'setActiveTab', tab }),
      openMenu: () => dispatch({ type: 'setMenuVisible', visible: true }),
      closeMenu: () => dispatch({ type: 'setMenuVisible', visible: false }),
      setSheetUserId: (id) => dispatch({ type: 'setSheetUserId', id }),
      updateUser: (patch) => dispatch({ type: 'updateUser', patch }),
      updateRole: (id, role) => dispatch({ type: 'updateRole', id, role }),
      updateMember: (id, patch) => dispatch({ type: 'updateMember', id, patch }),
      addMember: (payload) =>
        dispatch({
          type: 'addMember',
          member: {
            id: `new-${Date.now()}`,
            avatar: null,
            ...payload,
          } as User,
        }),
    };
  }, [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('AppContext is not ready');
  return ctx;
};

export const isWeb = Platform.OS === 'web';
