import { ThemeContextProvider } from './ThemeContext';
import { SidebarContextProvider } from './SidebarContext';
import { ModalContextProvider } from './ModalContext';
import { ToastContextProvider } from './ToastContext';
import { QuizContextProvider } from './QuizContext';

const AppContextProviders = ({ children }) => {
  return (
    <ThemeContextProvider>
      <SidebarContextProvider>
        <QuizContextProvider>
          <ModalContextProvider>
            <ToastContextProvider>
              {children}
            </ToastContextProvider>
          </ModalContextProvider>
        </QuizContextProvider>
      </SidebarContextProvider>
    </ThemeContextProvider>
  );
};

export default AppContextProviders;