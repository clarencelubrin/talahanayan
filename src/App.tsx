import { Outlet } from 'react-router';
import { useInitDataAsync } from 'shared/api/api-route';
import { useToast } from 'features/pop-ups/hooks/toast/useToast';
import { Toast } from 'features/pop-ups/components/toast/toast';
import { ToastType, ToastVariantType } from './features/pop-ups/types/toast/toast-types';
import { ColumnDrawer } from 'src/features/pop-ups/components/drawer/column-drawer';
import { useDrawer, useDrawerType } from 'src/features/pop-ups/hooks/drawer/useDrawer';
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { AuthProvider } from './shared/api/api-auth';
import { getPage } from './shared/components/Route/route-listener';
import 'src/App.css'
import { Loading } from './shared/components/Loading/loading';

type AppContextType = {
  addToast: (message: string | undefined, type: ToastVariantType) => void;
  toast: ToastType | undefined;
  drawer: useDrawerType | undefined;
  openDrawer: ({is_visible, column}: useDrawerType) => void;
  closeDrawer: () => void;
}
export const AppContext = createContext<AppContextType>({
  addToast: () => {}, 
  toast: undefined,
  drawer: undefined,
  openDrawer: () => {},
  closeDrawer: () => {}
});



function App() {
  const { toast, addToast, setIsVisible } = useToast();
  const { drawer, openDrawer, closeDrawer } = useDrawer();
  const [isLoading, setIsLoading] = useState(false);
  const initDataAsync = useInitDataAsync()
  const navigate = useNavigate();

  // Initialize data
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      const success = await initDataAsync();
      let page = getPage();
      if (page === "/") page = '';
      if (success) navigate(page || "/home");
      setIsLoading(false);
    };
    initData();
  }, []);


  if(isLoading)
    return (<Loading />)

  return (
      <AppContext.Provider value={{ addToast, toast, drawer, openDrawer, closeDrawer }}>
        <AuthProvider>
        <Outlet />
        {/* Pop-up overlays */}
        <div className="fixed bottom-0 right-0 p-4 gap-4 flex flex-col z-50">
          <Toast type={toast.type} is_visible={toast.is_visible} setIsVisible={setIsVisible}>
            {toast.message}
          </Toast>
          {drawer &&
          <ColumnDrawer is_visible={drawer.is_visible} column={drawer.column} column_location={drawer.column_location} closeDrawer={closeDrawer} />}
        </div>
        </AuthProvider>
      </AppContext.Provider>
  )
}

export default App
