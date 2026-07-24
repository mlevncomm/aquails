import { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

type Props = { children: ReactNode };
type State = { hasError: boolean };

/**
 * Catches render errors so users never see a blank white screen.
 * Does not display stack traces or technical details.
 */
export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch() {
    // Intentionally no console logging of stacks in production UI path.
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
  };

  private handleHome = () => {
    window.location.assign('/');
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#F7FBFE] px-4">
        <div className="max-w-md w-full text-center rounded-2xl border border-[#D7E6F2] bg-white p-8 shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F4FB]">
            <AlertTriangle className="h-6 w-6 text-aq-blue" aria-hidden />
          </div>
          <h1 className="text-xl font-semibold text-aq-text">Bir sorun oluştu</h1>
          <p className="mt-2 text-sm text-aq-muted leading-relaxed">
            Sayfa beklenmedik şekilde yüklenemedi. Lütfen tekrar deneyin veya ana sayfaya dönün.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
            <button
              type="button"
              onClick={this.handleRetry}
              className="inline-flex items-center justify-center rounded-xl bg-aq-blue px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
            >
              Tekrar Dene
            </button>
            <button
              type="button"
              onClick={this.handleHome}
              className="inline-flex items-center justify-center rounded-xl border border-[#D7E6F2] bg-white px-4 py-2.5 text-sm font-medium text-aq-text hover:bg-aq-ice"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </div>
    );
  }
}
