import { useDispatch, useSelector, useStore } from 'react-redux';
import type { AppDispatch, AppStore, RootState } from './store';

// Mentor Note:
// We pre-type the Redux hooks here and export them. 
// This means we don't have to import `RootState` and `AppDispatch` into every single component 
// that uses Redux, which keeps our code DRY (Don't Repeat Yourself) and guarantees type safety.

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
